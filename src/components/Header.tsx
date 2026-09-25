import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Terminal } from 'lucide-react';

export const Header: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b-2 border-[#111111] bg-[#F4F4F0] p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-[#111111] text-white px-2 py-0.5 text-xs font-bold tracking-widest uppercase">
              REGISTER NO. 849-B
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E63946] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> 100% CLIENT-SIDE PRIVACY (WASM)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1 text-[#111111] swiss-heading uppercase">
            FILEFICX // INSTRUCTION-DRIVEN DOCUMENT & IMAGE ARCHIVER
          </h1>
          <p className="text-xs text-[#555555] font-mono mt-0.5">
            Automated official parameter parsing & precise compression for government, visa & university portals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="border-2 border-[#111111] px-3 py-1.5 bg-white flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#111111]" />
            <span className="font-bold">{timeStr || 'SYSTEM ACTIVE'}</span>
          </div>
          <div className="border-2 border-[#111111] px-3 py-1.5 bg-[#E63946] text-white font-bold tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>ENGINE: READY</span>
          </div>
        </div>
      </div>
    </header>
  );
};
