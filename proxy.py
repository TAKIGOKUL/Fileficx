#!/usr/bin/env python3
"""
High-Speed Anthropic SSE Streaming Proxy for Claude Code <-> Kaggle Ollama
Full support for non-streaming and Server-Sent Events (SSE) streaming.
"""
import http.server
import json
import urllib.request
import urllib.error
import sys

KAGGLE_URL = "https://diameter-trademark-cellular-routes.trycloudflare.com"

class AnthropicToOllamaHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        req_body = self.rfile.read(content_length).decode("utf-8")
        
        try:
            data = json.loads(req_body)
        except Exception:
            data = {}

        anthropic_messages = data.get("messages", [])
        system_prompt = data.get("system", "")
        max_tokens = data.get("max_tokens", 4096)
        is_streaming = data.get("stream", True) # Default to true for Claude Code

        openai_messages = []
        if system_prompt:
            if isinstance(system_prompt, list):
                sys_text = "\n".join([p.get("text", "") for p in system_prompt if isinstance(p, dict)])
            else:
                sys_text = str(system_prompt)
            openai_messages.append({"role": "system", "content": sys_text})

        for msg in anthropic_messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if isinstance(content, list):
                text_parts = []
                for part in content:
                    if isinstance(part, dict) and part.get("type") == "text":
                        text_parts.append(part.get("text", ""))
                    elif isinstance(part, str):
                        text_parts.append(part)
                content = "\n".join(text_parts)
            openai_messages.append({"role": role, "content": str(content)})

        target_endpoint = f"{KAGGLE_URL}/v1/chat/completions"

        if is_streaming:
            ollama_payload = {
                "model": "qwen2.5-coder:14b",
                "messages": openai_messages,
                "max_tokens": max_tokens,
                "stream": True
            }
            req = urllib.request.Request(
                target_endpoint,
                data=json.dumps(ollama_payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            try:
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream")
                self.send_header("Cache-Control", "no-cache")
                self.send_header("Connection", "keep-alive")
                self.end_headers()

                # 1. message_start event
                msg_start = {
                    "type": "message_start",
                    "message": {
                        "id": "msg_stream_01",
                        "type": "message",
                        "role": "assistant",
                        "content": [],
                        "model": "qwen2.5-coder:14b",
                        "stop_reason": None,
                        "stop_sequence": None,
                        "usage": {"input_tokens": 100, "output_tokens": 1}
                    }
                }
                self.wfile.write(f"event: message_start\ndata: {json.dumps(msg_start)}\n\n".encode("utf-8"))
                self.wfile.flush()

                # 2. content_block_start event
                block_start = {
                    "type": "content_block_start",
                    "index": 0,
                    "content_block": {"type": "text", "text": ""}
                }
                self.wfile.write(f"event: content_block_start\ndata: {json.dumps(block_start)}\n\n".encode("utf-8"))
                self.wfile.flush()

                # Stream tokens from Ollama
                with urllib.request.urlopen(req, timeout=180) as resp:
                    for line in resp:
                        line_str = line.decode("utf-8").strip()
                        if line_str.startswith("data: "):
                            json_str = line_str[6:].strip()
                            if json_str == "[DONE]":
                                break
                            try:
                                chunk = json.loads(json_str)
                                delta_text = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
                                if delta_text:
                                    delta_event = {
                                        "type": "content_block_delta",
                                        "index": 0,
                                        "delta": {"type": "text_delta", "text": delta_text}
                                    }
                                    self.wfile.write(f"event: content_block_delta\ndata: {json.dumps(delta_event)}\n\n".encode("utf-8"))
                                    self.wfile.flush()
                            except Exception:
                                continue

                # 3. content_block_stop event
                block_stop = {"type": "content_block_stop", "index": 0}
                self.wfile.write(f"event: content_block_stop\ndata: {json.dumps(block_stop)}\n\n".encode("utf-8"))

                # 4. message_delta & message_stop events
                msg_delta = {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": None}, "usage": {"output_tokens": 50}}
                self.wfile.write(f"event: message_delta\ndata: {json.dumps(msg_delta)}\n\n".encode("utf-8"))
                msg_stop = {"type": "message_stop"}
                self.wfile.write(f"event: message_stop\ndata: {json.dumps(msg_stop)}\n\n".encode("utf-8"))
                self.wfile.flush()

            except Exception as e:
                pass
            return

        # Non-streaming fallback
        ollama_payload = {
            "model": "qwen2.5-coder:14b",
            "messages": openai_messages,
            "max_tokens": max_tokens,
            "stream": False
        }
        req = urllib.request.Request(
            target_endpoint,
            data=json.dumps(ollama_payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                resp_json = json.loads(resp.read().decode("utf-8"))
                assistant_text = resp_json.get("choices", [{}])[0].get("message", {}).get("content", "")

                anthropic_response = {
                    "id": "msg_local_proxy_01",
                    "type": "message",
                    "role": "assistant",
                    "content": [{"type": "text", "text": assistant_text}],
                    "model": "qwen2.5-coder:14b",
                    "stop_reason": "end_turn",
                    "stop_sequence": None,
                    "usage": {"input_tokens": 100, "output_tokens": 50}
                }
                out_bytes = json.dumps(anthropic_response).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(out_bytes)))
                self.end_headers()
                self.wfile.write(out_bytes)
        except Exception as e:
            err_msg = json.dumps({"error": {"message": str(e), "type": "proxy_error"}}).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(err_msg)))
            self.end_headers()
            self.wfile.write(err_msg)

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Anthropic-Ollama SSE Streaming Bridge Online")

    def do_HEAD(self):
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4000
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), AnthropicToOllamaHandler)
    print(f"🚀 Claude Code -> Kaggle Real-Time Streaming Bridge running on http://127.0.0.1:{port}")
    server.serve_forever()
