import { Cpu, Activity, Shield, Code, Zap, Database } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface AgentProps {
  name: string;
  role: string;
  capability: number;
  status: 'online' | 'offline';
  lastActive: string;
  command: string;
  salary: string;
  roi: string;
}

const roleIcons: Record<string, any> = {
  'UI Designer': Zap,
  'Lead Developer': Cpu,
  'Backend Engineer': Database,
  'System Architect': Activity,
  'CTO Engine': Code,
  'Fullstack Dev': Zap,
};

export default function AgentCard({ name, role, capability, status, lastActive, command, salary, roi }: AgentProps) {
  const Icon = roleIcons[role] || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-4 flex flex-col gap-3 relative overflow-hidden group border-accent/10 hover:border-accent/40 transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="p-2 bg-accent/10 rounded-lg text-accent">
          <Icon size={20} />
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              status === 'online' ? "bg-accent animate-pulse" : "bg-red-500"
            )} />
            <span className="text-[10px] uppercase tracking-widest text-text-dim font-mono">
              {status}
            </span>
          </div>
          <span className="text-[9px] font-mono text-accent mt-1">ROI: {roi}</span>
        </div>
      </div>

      <div>
        <h3 className="font-mono font-bold text-lg tracking-tight flex items-center gap-2">
          {name}
          <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase tracking-tighter">AI Employee</span>
        </h3>
        <p className="text-xs text-text-dim font-mono uppercase tracking-wider">{role}</p>
      </div>

      <div className="bg-bg/50 p-2 rounded border border-border/50 group-hover:bg-accent/5 transition-colors">
        <div className="flex justify-between text-[8px] font-mono text-text-dim/50 uppercase mb-1">
          <span>CLI Binary</span>
          <span>Salary: {salary}</span>
        </div>
        <code className="text-[9px] font-mono text-accent/70 break-all">
          $ {command.replace('{prompt}', '...')}
        </code>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-text-dim uppercase">
          <span>Efficiency</span>
          <span>{capability * 10}%</span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${capability * 10}%` }}
            className="h-full bg-accent"
          />
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-border/50 flex justify-between items-center">
        <span className="text-[9px] font-mono text-text-dim uppercase">Last Sync</span>
        <span className="text-[9px] font-mono text-accent">
          {new Date(lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      {/* Decorative scanline */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent/5 to-transparent h-[200%] -translate-y-full group-hover:animate-[scan_2s_linear_infinite]" />
    </motion.div>
  );
}
