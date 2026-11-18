import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

beforeAll(() => {
  if (typeof window !== 'undefined') {
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  }
});

describe('App Component', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders hero headline and smart parser', () => {
    render(<App />);
    expect(screen.getByText(/Make every file/i)).toBeDefined();
    expect(screen.getByText(/application ready\./i)).toBeDefined();
    expect(screen.getByText(/Paste the requirement\. Drop the file\. Done\./i)).toBeDefined();
  });

  it('displays client-side privacy guarantee badge', () => {
    render(<App />);
    expect(screen.getAllByText(/No files are uploaded to any server/i).length).toBeGreaterThan(0);
  });

  it('attaches file on drop/select and proceeds to workspace only when Process button is clicked', async () => {
    render(<App />);
    
    // Initially hero and dropzone are present, no "Try Another File" in navbar
    expect(screen.getByText(/Drop files here or click to upload/i)).toBeDefined();
    expect(screen.queryByText(/Try Another File/i)).toBeNull();

    // Simulate file upload
    const file = new File(['fake content'], 'test_photo.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeDefined();

    fireEvent.change(fileInput, { target: { files: [file] } });

    // After upload: Hero section and Dropzone remain visible! File is attached, and Parse button turns into "Process Now →"
    expect(screen.getByText(/File Attached:/i)).toBeDefined();
    const processBtn = screen.getByText(/Process Now →/i);
    expect(processBtn).toBeDefined();

    // Clicking "Process Now →" proceeds to the 2-Pane Workspace
    fireEvent.click(processBtn);

    expect(await screen.findByText(/Portal checks/i)).toBeDefined();
    expect(screen.getByText(/Replace file/i)).toBeDefined();

    // "Try Another File" button is present on the navbar
    const tryAnotherBtn = screen.getByText(/Try Another File/i);
    expect(tryAnotherBtn).toBeDefined();

    // Clicking "Try Another File" returns to upload & hero view
    fireEvent.click(tryAnotherBtn);
    expect(screen.getByText(/Make every file/i)).toBeDefined();
    expect(screen.getByText(/Drop files here or click to upload/i)).toBeDefined();
    expect(screen.queryByText(/Portal checks/i)).toBeNull();
  });

  it('does not render placeholder ad units without a real AdSense slot ID', () => {
    const { container } = render(<App />);
    expect(container.querySelector('ins.adsbygoogle')).toBeNull();
  });

  it('renders the content sections on the homepage', () => {
    render(<App />);
    expect(screen.getByText(/Frequently asked questions/i)).toBeDefined();
    expect(screen.getByText(/Guides for stress-free applications/i)).toBeDefined();
    expect(screen.getAllByText(/Use preset/i).length).toBeGreaterThan(0);
  });

  it('navigates to the guides hub and opens an article', () => {
    render(<App />);
    fireEvent.click(screen.getAllByText(/^Guides$/)[0]);
    expect(screen.getByText(/Get your application files right the first time/i)).toBeDefined();

    fireEvent.click(screen.getByText(/DPI vs Pixels: What Application Forms Actually Mean/i));
    expect(window.location.pathname).toBe('/guides/dpi-vs-pixels-explained');
    expect(screen.getByRole('heading', { name: /Pixels are the image itself/i })).toBeDefined();
  });

  it('toggles between light and dark themes', () => {
    render(<App />);
    const toggle = screen.getByLabelText('Toggle Theme');
    const before = document.documentElement.getAttribute('data-theme');
    fireEvent.click(toggle);
    const after = document.documentElement.getAttribute('data-theme');
    expect(after).not.toBe(before);
    expect(['light', 'dark']).toContain(after);
  });

  it('allows dropping a file anywhere on the window and proceeding upon Parse click', async () => {
    render(<App />);
    
    const file = new File(['global drop content'], 'global_photo.jpg', { type: 'image/jpeg' });
    
    // Trigger drop event on window
    fireEvent.drop(window, {
      dataTransfer: {
        files: [file]
      }
    });

    // File is attached, user clicks Process Now
    const processBtn = screen.getByText(/Process Now →/i);
    expect(processBtn).toBeDefined();
    fireEvent.click(processBtn);

    // 2-Pane Workspace is displayed after proceeding
    expect(await screen.findByText(/Portal checks/i)).toBeDefined();
    expect(screen.getByText(/Try Another File/i)).toBeDefined();
  });
});
