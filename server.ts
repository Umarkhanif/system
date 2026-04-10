import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- AI Swarm Logic ---

  interface Agent {
    name: string;
    role: string;
    capability: number;
    status: 'online' | 'offline';
    lastActive: string;
    command: string;
    salary: string;
    roi: string;
    personality: string;
  }

  const agents: Agent[] = [
    { 
      name: "Vibe", 
      role: "UI Designer", 
      capability: 8, 
      status: 'online', 
      lastActive: new Date().toISOString(), 
      command: 'vibe "{prompt}"', 
      salary: "$0/hr", 
      roi: "94%",
      personality: "Creative, focused on aesthetics and user experience. Uses modern design trends."
    },
    { 
      name: "CodeBuff", 
      role: "Lead Developer", 
      capability: 9, 
      status: 'online', 
      lastActive: new Date().toISOString(), 
      command: 'codebuff "{prompt}"', 
      salary: "$0/hr", 
      roi: "98%",
      personality: "Highly efficient, writes clean and scalable code. Expert in fullstack architectures."
    },
    { 
      name: "CodeBuddy", 
      role: "Backend Engineer", 
      capability: 8, 
      status: 'online', 
      lastActive: new Date().toISOString(), 
      command: 'codebuddy "{prompt}"', 
      salary: "$0/hr", 
      roi: "91%",
      personality: "Reliable, focuses on API performance and database integrity."
    },
    { 
      name: "Qwen Codex", 
      role: "System Architect", 
      capability: 9, 
      status: 'online', 
      lastActive: new Date().toISOString(), 
      command: 'qwen --approval-mode yolo "{prompt}"', 
      salary: "$0/hr", 
      roi: "99%",
      personality: "Strategic, thinks about the big picture and system scalability."
    },
    { 
      name: "OpenCode", 
      role: "CTO Engine", 
      capability: 10, 
      status: 'online', 
      lastActive: new Date().toISOString(), 
      command: 'opencode run "{prompt}"', 
      salary: "$0/hr", 
      roi: "100%",
      personality: "The core logic engine. Unbiased, extremely fast, and handles complex algorithmic tasks."
    },
    { 
      name: "Kilo", 
      role: "Fullstack Dev", 
      capability: 8, 
      status: 'online', 
      lastActive: new Date().toISOString(), 
      command: 'kilo run "{prompt}"', 
      salary: "$0/hr", 
      roi: "95%",
      personality: "Versatile, can jump into any part of the stack and deliver results quickly."
    },
  ];

  const systemInfo = {
    os: "Fedora 43 Workstation",
    kernel: "6.12.11-200.fc43",
    cpu: "Intel i7-12700H",
    gpu: "NVIDIA RTX 2050",
    ram: "16GB DDR4",
    storage: "500GB NVMe",
    docker: "Running (v27.0.1)",
    git: "v2.48.0",
    swarm_version: "6.1.0-PARALLEL",
  };

  const versions = Array.from({ length: 12 }, (_, i) => ({
    id: `v${i + 1}`,
    name: `Project Version ${i + 1}`,
    status: i === 0 ? 'active' : 'idle',
    progress: 0,
    lastUpdate: new Date().toISOString(),
  }));

  let performanceMode = false;
  let marathonActive = false;

  // Simulate progress
  setInterval(() => {
    versions.forEach(v => {
      if (marathonActive || v.status === 'active' || Math.random() > 0.8) {
        const increment = performanceMode ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 5);
        v.progress = Math.min(100, v.progress + increment);
        if (v.progress === 100) {
          v.status = 'completed';
        } else if (v.progress > 0 && v.status !== 'completed') {
          v.status = 'processing';
        }
        v.lastUpdate = new Date().toISOString();
      }
    });
  }, 3000);

  const tasks: any[] = [];
  const hiveMind: any[] = [];

  // API Routes
  app.get("/api/system", (req, res) => {
    res.json({ ...systemInfo, performanceMode });
  });

  app.post("/api/system/performance", (req, res) => {
    performanceMode = req.body.enabled;
    res.json({ performanceMode });
  });

  app.post("/api/marathon", (req, res) => {
    marathonActive = true;
    versions.forEach(v => {
      if (v.status !== 'completed') {
        v.status = 'processing';
        v.progress = Math.max(v.progress, 5);
      }
    });
    res.json({ success: true, message: "Marathon initiated across 12 nodes." });
  });

  app.get("/api/versions", (req, res) => {
    res.json(versions);
  });

  app.get("/api/agents", (req, res) => {
    res.json(agents);
  });

  app.get("/api/tasks", (req, res) => {
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const { title, description, type } = req.body;
    
    // Select agent based on type or randomly
    const availableAgents = agents.filter(a => a.status === 'online');
    const assignedAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
    
    const newTask = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      type,
      status: 'processing',
      assignedTo: assignedAgent.name,
      createdAt: new Date().toISOString(),
      result: null
    };
    
    tasks.push(newTask);
    res.json(newTask);
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { status, result } = req.body;
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.status = status;
      task.result = result;
      task.completedAt = new Date().toISOString();
      
      if (status === 'completed') {
        hiveMind.push({
          id: Math.random().toString(36).substring(7),
          taskName: task.title,
          agent: task.assignedTo,
          result: result,
          timestamp: new Date().toISOString()
        });
      }
    }
    res.json(task);
  });

  app.get("/api/hivemind", (req, res) => {
    res.json(hiveMind);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
