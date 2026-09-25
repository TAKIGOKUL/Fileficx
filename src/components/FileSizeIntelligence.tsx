import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../utils/imageProcessor';

interface FileSizeIntelligenceProps {
  originalSizeBytes: number;
  processedSizeBytes?: number;
  limitKB?: number;
  className?: string;
}

export const FileSizeIntelligence: React.FC<FileSizeIntelligenceProps> = ({
  originalSizeBytes,
  processedSizeBytes,
  limitKB,
  className = ''
}) => {
  const currentBytes = processedSizeBytes || originalSizeBytes;
  const hasLimit = typeof limitKB === 'number' && limitKB > 0;
  
  // Calculate percentage of limit
  const limitBytes = hasLimit ? limitKB * 1024 : 0;
  const percentOfLimit = hasLimit ? Math.round((currentBytes / limitBytes) * 100) : 0;
  
  // Determine color and status
  let statusColor = 'var(--success)';
  let statusBadge = {
    label: 'Within limit',
    icon: CheckCircle2,
    textColor: 'text-[var(--success)]',
    bgColor: 'bg-[var(--success)]/10',
    borderColor: 'border-[var(--success)]/30'
  };

  if (hasLimit) {
    if (percentOfLimit > 100) {
      statusColor = 'var(--danger)';
      statusBadge = {
        label: 'Over limit',
        icon: AlertCircle,
        textColor: 'text-[var(--danger)]',
        bgColor: 'bg-[var(--danger)]/10',
        borderColor: 'border-[var(--danger)]/30'
      };
    } else if (percentOfLimit > 85) {
      statusColor = 'var(--warning)';
      statusBadge = {
        label: 'Close to limit',
        icon: AlertTriangle,
        textColor: 'text-[var(--warning)]',
        bgColor: 'bg-[var(--warning)]/10',
        borderColor: 'border-[var(--warning)]/30'
      };
    }
  }

  const barWidth = hasLimit ? Math.min(100, percentOfLimit) : 100;

  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/80 p-4 transition-all ${className}`}>
      
      {/* Top Ledger: Before & After */}
      <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-[var(--border)] text-xs">
        <div>
          <span className="text-[var(--text-muted)] font-semibold block uppercase text-[10px] tracking-wider mb-0.5">
            [Before] Original
          </span>
          <span className="text-base font-bold text-[var(--text-primary)]">
            {formatFileSize(originalSizeBytes)}
          </span>
        </div>
        <div>
          <span className="text-[var(--text-muted)] font-semibold block uppercase text-[10px] tracking-wider mb-0.5">
            [After] Processed
          </span>
          <span className="text-base font-bold text-[var(--accent)] flex items-center gap-1">
            {processedSizeBytes ? formatFileSize(processedSizeBytes) : 'Pending...'}
            {originalSizeBytes > currentBytes && processedSizeBytes && (
              <span className="text-[11px] font-semibold text-[var(--success)] ml-1">
                (-{Math.round(((originalSizeBytes - processedSizeBytes) / originalSizeBytes) * 100)}%)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Limit & Progress Bar */}
      {hasLimit ? (
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[var(--text-muted)]">
              Limit: <strong className="text-[var(--text-primary)]">{limitKB} KB</strong>
            </span>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${statusBadge.bgColor} ${statusBadge.textColor} ${statusBadge.borderColor}`}>
              <statusBadge.icon className="w-3.5 h-3.5" />
              <span>{statusBadge.label} ({percentOfLimit}%)</span>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full h-3 rounded-full bg-[var(--border)] overflow-hidden p-0.5 relative">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${barWidth}%`,
                backgroundColor: statusColor
              }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-1 font-mono">
            <span>0 KB</span>
            <span>Target: {Math.round(limitKB * 0.9)} KB</span>
            <span>Max: {limitKB} KB</span>
          </div>
        </div>
      ) : (
        <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
          <span>Target Size: Auto Optimal Quality</span>
          <span className="font-semibold text-[var(--success)]">Ready to export</span>
        </div>
      )}

    </div>
  );
};
