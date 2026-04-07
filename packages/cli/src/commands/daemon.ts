import { spawn } from "node:child_process";
import { isDaemonRunning, getDaemonPath } from "../daemon-manager.js";

export interface DaemonOptions {
  json?: boolean;
  host?: string;
  port?: number;
}

export async function statusCommand(
  options: DaemonOptions = {}
): Promise<void> {
  const running = await isDaemonRunning();

  if (options.json) {
    console.log(JSON.stringify({ running }));
  } else {
    console.log(running ? "Daemon 运行中" : "Daemon 未运行");
  }
}

export async function startCommand(
  options: DaemonOptions = {}
): Promise<void> {
  const running = await isDaemonRunning();
  
  if (running) {
    if (options.json) {
      console.log(JSON.stringify({ success: true, message: "Daemon 已在运行" }));
    } else {
      console.log("Daemon 已在运行");
    }
    return;
  }

  const daemonPath = getDaemonPath();
  const args: string[] = [];
  
  if (options.host) {
    args.push("--host", options.host);
  }
  if (options.port) {
    args.push("--port", String(options.port));
  }

  if (options.json) {
    console.log(JSON.stringify({ success: true, message: "正在启动 Daemon..." }));
  } else {
    console.log("正在启动 Daemon...");
  }

  const child = spawn("node", [daemonPath, ...args], {
    detached: true,
    stdio: "inherit",
  });

  child.unref();
}

export async function stopCommand(
  options: DaemonOptions = {}
): Promise<void> {
  if (options.json) {
    console.log(JSON.stringify({ success: false, message: "暂不支持停止 Daemon，请手动终止进程" }));
  } else {
    console.log("暂不支持停止 Daemon，请手动终止进程");
  }
}
