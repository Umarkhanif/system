import { motion } from 'motion/react';
import { Layers, CheckCircle2, Loader2, Play } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Version {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing' | 'completed';
  progress: number;
  lastUpdate: string;
}

interface VersionControlProps {
  versions: Version[];
  onDeployAll: () => void;
}

export default function VersionControl({ versions, onDeployAll }: VersionControlProps) {
  return (
    <div className="glass-panel p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-dim">Version Control (12 Nodes)</h3>
        </div>
        <button 
          onClick={onDeployAll}
          className="flex items-center gap-2 px-3 py-1 bg-accent text-bg rounded text-[10px] font-mono font-bold hover:bg-accent/80 transition-colors"
        >
          <Play size={10} fill="currentColor" />
          RUN MARATHON
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {versions.map((v) => (
          <motion.div
            key={v.id}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-2 border rounded-lg bg-bg/30 flex flex-col gap-1 transition-colors",
              v.status === 'active' ? "border-accent/50 bg-accent/5" : "border-border/50"
            )}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold">{v.id}</span>
              <StatusBadge status={v.status} />
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden mt-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${v.progress}%` }}
                className="h-full bg-accent"
              />
            </div>
            <span className="text-[8px] font-mono text-text-dim/50 uppercase truncate">
              {v.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Version['status'] }) {
  switch (status) {
    case 'active': return <span className="text-[8px] text-accent font-bold animate-pulse">ACTIVE</span>;
    case 'processing': return <Loader2 size={8} className="text-blue-400 animate-spin" />;
    case 'completed': return <CheckCircle2 size={8} className="text-accent" />;
    default: return <span className="text-[8px] text-text-dim">IDLE</span>;
  }
}
