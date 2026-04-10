import { motion } from 'motion/react';
import { Brain, Search, Database } from 'lucide-react';

interface Knowledge {
  task: string;
  result: string;
  timestamp: string;
}

interface HiveMindProps {
  knowledge: Knowledge[];
}

export default function HiveMind({ knowledge }: HiveMindProps) {
  return (
    <div className="glass-panel p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-dim">Hive Mind Index</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-border/30 rounded border border-border">
          <Search size={10} className="text-text-dim" />
          <input 
            type="text" 
            placeholder="Search patterns..." 
            className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-24 placeholder:text-text-dim/50"
          />
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {knowledge.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-3 opacity-30 grayscale">
            <Database size={32} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Knowledge Base Empty</span>
          </div>
        ) : (
          knowledge.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="w-0.5 bg-accent/30 group-hover:bg-accent transition-colors shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-[11px] font-mono font-bold text-accent uppercase">{item.task}</h4>
                  <p className="text-[10px] font-mono text-text-dim line-clamp-2 group-hover:line-clamp-none transition-all">
                    {item.result}
                  </p>
                  <div className="text-[8px] font-mono text-text-dim/40 uppercase pt-1">
                    Pattern Sync: {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
