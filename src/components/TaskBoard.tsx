import { motion } from 'motion/react';
import { CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  assignedTo: string | null;
  createdAt: string;
}

interface TaskBoardProps {
  tasks: Task[];
}

export default function TaskBoard({ tasks }: TaskBoardProps) {
  return (
    <div className="glass-panel p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-dim">Active Tasks</h3>
        <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-mono">
          {tasks.length} TOTAL
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {tasks.length === 0 ? (
          <div className="py-10 text-center text-text-dim font-mono text-xs opacity-50">
            NO ACTIVE TASKS IN QUEUE
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 border border-border/50 rounded-lg bg-bg/50 hover:border-accent/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-mono text-sm font-bold truncate pr-4">{task.title}</h4>
                <StatusIcon status={task.status} />
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent/10 flex items-center justify-center text-accent">
                    <span className="text-[8px] font-bold">{task.assignedTo?.[0] || '?'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-text-dim uppercase">
                    {task.assignedTo || 'Unassigned'}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-text-dim/50">
                  {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: Task['status'] }) {
  switch (status) {
    case 'completed': return <CheckCircle2 size={14} className="text-accent" />;
    case 'running': return <PlayCircle size={14} className="text-blue-400 animate-pulse" />;
    case 'pending': return <Clock size={14} className="text-text-dim" />;
    case 'failed': return <AlertCircle size={14} className="text-red-500" />;
  }
}
