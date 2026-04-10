/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  Activity, 
  LayoutDashboard, 
  Terminal as TerminalIcon, 
  Settings, 
  Bell,
  HardDrive,
  Zap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Terminal from './components/Terminal';
import AgentCard from './components/AgentCard';
import TaskBoard from './components/TaskBoard';
import HiveMind from './components/HiveMind';
import VersionControl from './components/VersionControl';

export default function App() {
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [versions, setVersions] = useState([]);
  const [system, setSystem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, tasksRes, hiveRes, versionsRes, systemRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/tasks'),
          fetch('/api/hivemind'),
          fetch('/api/versions'),
          fetch('/api/system')
        ]);
        setAgents(await agentsRes.json());
        setTasks(await tasksRes.json());
        setKnowledge(await hiveRes.json());
        setVersions(await versionsRes.json());
        setSystem(await systemRes.json());
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-bg font-bold shadow-[0_0_15px_rgba(0,255,65,0.3)]">
              <Shield size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tighter uppercase">JagShieldX</span>
              <span className="text-[10px] text-accent font-mono tracking-[0.2em] -mt-1">Workforce Manager</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 ml-8">
            <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="CEO Dashboard" />
            <NavButton active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} icon={Cpu} label="AI Employees" />
            <NavButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={Activity} label="Operations" />
            <NavButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={Settings} label="Infrastructure" />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 mr-4">
            <button 
              onClick={async () => {
                const newState = !system?.performanceMode;
                await fetch('/api/system/performance', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ enabled: newState })
                });
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded border transition-all font-mono text-[10px] uppercase font-bold",
                system?.performanceMode 
                  ? "bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(0,255,65,0.2)]" 
                  : "bg-border/20 border-border text-text-dim"
              )}
            >
              <Zap size={10} fill={system?.performanceMode ? "currentColor" : "none"} />
              Performance Mode
            </button>
            <BusinessStat label="Total ROI" value="96.4%" trend="+2.1%" />
            <BusinessStat label="Burn Rate" value="$0.00" trend="0%" />
            <BusinessStat label="Market Cap" value="$1.2T" trend="+14%" />
          </div>
          <button className="p-2 text-text-dim hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-bg" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
        {activeTab === 'system' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SystemCard title="Operating System" icon={Shield} details={[
              { label: "OS", value: "Fedora 39 Workstation" },
              { label: "Kernel", value: "6.6.13-200.fc39" },
              { label: "Architecture", value: "x86_64" }
            ]} />
            <SystemCard title="Hardware" icon={Cpu} details={[
              { label: "CPU", value: "Intel i7-12700H" },
              { label: "GPU", value: "NVIDIA RTX 2050" },
              { label: "RAM", value: "16GB DDR4" }
            ]} />
            <SystemCard title="Environment" icon={Zap} details={[
              { label: "Docker", value: "v24.0.7" },
              { label: "Git", value: "v2.43.0" },
              { label: "Node.js", value: "v20.11.0" }
            ]} />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Terminal & Agents */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <Terminal />
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {agents.map((agent: any) => (
                  <AgentCard key={agent.name} {...agent} />
                ))}
              </div>
            </div>

            {/* Right Column: Versions, Tasks & Hive Mind */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <LiveActivity versions={versions} />
              <div className="h-[300px]">
                <VersionControl versions={versions} onDeployAll={() => {}} />
              </div>
              <div className="h-[250px]">
                <TaskBoard tasks={tasks} />
              </div>
              <div className="h-[250px]">
                <HiveMind knowledge={knowledge} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="h-8 border-t border-border bg-card/50 flex items-center justify-between px-4 text-[10px] font-mono text-text-dim uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            System Online
          </span>
          <span className="border-l border-border pl-4">Fedora 43 Workstation</span>
          <span className="border-l border-border pl-4">Kernel 6.12.11-200.fc43</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Swarm Latency: 12ms</span>
          <span>Uptime: 04:12:45</span>
        </div>
      </footer>
    </div>
  );
}

function LiveActivity({ versions }: { versions: any[] }) {
  const activeVersions = versions.filter(v => v.status === 'processing');
  
  return (
    <div className="glass-panel p-4 h-[150px] flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-2">
          <Activity size={12} className="animate-pulse" />
          Live Workforce Activity
        </h3>
        <span className="text-[9px] font-mono text-text-dim uppercase">{activeVersions.length} Nodes Active</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {activeVersions.length > 0 ? activeVersions.map(v => (
          <div key={v.id} className="flex items-center justify-between text-[9px] font-mono bg-accent/5 p-1 rounded border border-accent/10">
            <span className="text-accent">NODE_{v.id}</span>
            <span className="text-text-dim">EXECUTING BUILD...</span>
            <span className="text-accent font-bold">{v.progress}%</span>
          </div>
        )) : (
          <div className="h-full flex items-center justify-center text-[10px] font-mono text-text-dim italic">
            Waiting for marathon command...
          </div>
        )}
      </div>
    </div>
  );
}

function BusinessStat({ label, value, trend }: any) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[8px] font-mono text-text-dim uppercase leading-none">{label}</span>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-[10px] font-mono font-bold leading-none">{value}</span>
        <span className={cn(
          "text-[8px] font-mono leading-none",
          trend.startsWith('+') ? "text-accent" : "text-red-500"
        )}>{trend}</span>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all
        ${active ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-dim hover:text-white hover:bg-white/5'}
      `}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function HardwareStat({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-text-dim" />
      <div className="flex flex-col">
        <span className="text-[8px] font-mono text-text-dim uppercase leading-none">{label}</span>
        <span className="text-[10px] font-mono font-bold leading-none mt-0.5">{value}</span>
      </div>
    </div>
  );
}

function SystemCard({ title, icon: Icon, details }: any) {
  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-accent/10 rounded-lg text-accent">
          <Icon size={20} />
        </div>
        <h3 className="font-mono font-bold uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-3">
        {details.map((item: any, i: number) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-xs font-mono text-text-dim uppercase tracking-wider">{item.label}</span>
            <span className="text-xs font-mono text-accent">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

