import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ChevronRight, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface Log {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  content: string;
  timestamp: Date;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function Terminal() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<Log[]>([
    { id: '1', type: 'system', content: 'JAGSHIELDX: CEO COMMAND CENTER v6.0 ONLINE', timestamp: new Date() },
    { id: '2', type: 'system', content: 'AI WORKFORCE SYNCED. 6 EMPLOYEES READY.', timestamp: new Date() },
    { id: '3', type: 'system', content: 'MARKET TRENDS: BULLISH. READY TO SCALE.', timestamp: new Date() },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type: Log['type'], content: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      type,
      content,
      timestamp: new Date()
    }]);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    setInput('');
    addLog('input', cmd);
    setIsProcessing(true);

    try {
      if (cmd.toLowerCase().startsWith('build ')) {
        const appDesc = cmd.substring(6);
        setIsProcessing(true);
        addLog('system', `DECOMPOSING TASK: "${appDesc}"...`);
        
        try {
          const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: `Build: ${appDesc}`, description: appDesc, type: 'fullstack' })
          });
          const task = await response.json();
          
          // Find the agent's command template
          const agentsRes = await fetch('/api/agents');
          const agents = await agentsRes.json();
          const agent = agents.find((a: any) => a.name === task.assignedTo);
          const cliCmd = agent ? agent.command.replace('{prompt}', appDesc) : `unknown "${appDesc}"`;

          addLog('output', `TASK CREATED [ID: ${task.id}]. ASSIGNED TO ${task.assignedTo}.`);
          addLog('system', `EXECUTING CLI: $ ${cliCmd}`);
          addLog('system', `AGENT ${task.assignedTo} IS NOW PROCESSING...`);

          // --- REAL AI PROCESSING (FRONTEND) ---
          const aiModel = ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{
              role: 'user',
              parts: [{
                text: `
                  You are an AI Employee named ${agent.name} with the role of ${agent.role}.
                  Your personality is: ${agent.personality}.
                  
                  You have been assigned the following task:
                  Title: ${task.title}
                  Description: ${task.description}
                  
                  Please provide a professional response as if you just completed this task. 
                  Include:
                  1. A brief summary of what you did.
                  2. A snippet of the "code" or "result" you produced (make it look like real production code or technical output).
                  3. Any recommendations for the next steps.
                  
                  Keep the response concise, technical, and in character.
                `
              }]
            }]
          });

          aiModel.then(async (result) => {
            const responseText = result.text || "No response text generated.";
            
            // Update task in backend
            await fetch(`/api/tasks/${task.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'completed', result: responseText })
            });

            setIsProcessing(false);
            addLog('output', `AGENT ${task.assignedTo} COMPLETED TASK.`);
            addLog('system', `RESULT AGGREGATED TO HIVE MIND.`);
            addLog('output', `SUMMARY: ${responseText.substring(0, 200)}...`);
          }).catch(async (err) => {
            console.error("AI Processing Error:", err);
            await fetch(`/api/tasks/${task.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'failed', result: 'AI Execution Error' })
            });
            setIsProcessing(false);
            addLog('error', `AGENT ${task.assignedTo} FAILED TO EXECUTE TASK.`);
          });

        } catch (error) {
          setIsProcessing(false);
          addLog('error', 'FAILED TO CONNECT TO WORKFORCE MANAGER.');
        }
      } else if (cmd.toLowerCase() === 'marathon') {
        addLog('system', 'INITIATING SWARM MARATHON: 12 NODES PARALLEL...');
        addLog('system', 'SPAWNING WORKERS ACROSS ALL VERSIONS...');
        
        await fetch('/api/marathon', { method: 'POST' });
        
        // Simulate parallel progress logs
        for (let i = 1; i <= 12; i++) {
          setTimeout(() => {
            addLog('output', `NODE v${i}: SYNCING REPOSITORY...`);
            addLog('system', `NODE v${i}: AGENT ASSIGNED. STARTING BUILD...`);
          }, i * 200);
        }
        
        setTimeout(() => {
          addLog('output', 'MARATHON STATUS: 12/12 NODES PROCESSING.');
          addLog('system', 'HIVE MIND IS AGGREGATING RESULTS...');
        }, 3000);
      } else {
        // General Chat with Gemini
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: cmd,
        });
        
        if (!response.text) throw new Error("No response from Gemini");
        addLog('output', response.text);
      }
    } catch (error) {
      addLog('error', `COMMAND FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel flex flex-col h-[500px] overflow-hidden border-accent/20">
      <div className="bg-card px-4 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-accent" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-accent">CEO COMMAND CENTER</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-accent/50" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-2",
                log.type === 'input' && "text-white",
                log.type === 'output' && "text-accent",
                log.type === 'system' && "text-text-dim italic",
                log.type === 'error' && "text-red-500"
              )}
            >
              <span className="opacity-30 shrink-0">
                [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
              </span>
              {log.type === 'input' && <ChevronRight size={14} className="mt-1 shrink-0 text-accent" />}
              <div className="whitespace-pre-wrap break-words">{log.content}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <div className="flex items-center gap-2 text-accent animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-xs">PROCESSING...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleCommand} className="p-3 bg-card/50 border-t border-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command (e.g. build React Dashboard)..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-accent placeholder:text-text-dim/30"
          autoFocus
        />
        <button 
          type="submit"
          disabled={isProcessing || !input.trim()}
          className="p-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-50 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
