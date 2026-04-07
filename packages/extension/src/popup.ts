const STORAGE_KEY = 'upstreamUrl';
const DEFAULT_URL = 'http://localhost:19824';

const statusDot = document.getElementById('status-dot') as HTMLSpanElement;
const statusText = document.getElementById('status-text') as HTMLSpanElement;
const upstreamUrlEl = document.getElementById('upstream-url') as HTMLSpanElement;
const btnReconnect = document.getElementById('btn-reconnect') as HTMLButtonElement;
const btnSettings = document.getElementById('btn-settings') as HTMLButtonElement;

async function getUpstreamUrl(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEY, (result) => {
      resolve(result[STORAGE_KEY] || DEFAULT_URL);
    });
  });
}

async function checkConnection(): Promise<boolean> {
  const url = await getUpstreamUrl();
  try {
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function updateStatus(connected: boolean): void {
  if (connected) {
    statusDot.className = 'status-dot dot-connected';
    statusText.textContent = '已连接';
    statusText.className = 'status-connected';
  } else {
    statusDot.className = 'status-dot dot-disconnected';
    statusText.textContent = '未连接';
    statusText.className = 'status-disconnected';
  }
}

async function refreshStatus(): Promise<void> {
  statusText.textContent = '检测中...';
  const url = await getUpstreamUrl();
  upstreamUrlEl.textContent = url;
  
  const connected = await checkConnection();
  updateStatus(connected);
}

// 重新连接按钮
btnReconnect.addEventListener('click', async () => {
  btnReconnect.disabled = true;
  btnReconnect.textContent = '连接中...';
  
  // 发送消息给 background 重新连接
  chrome.runtime.sendMessage({ type: 'RECONNECT' }, () => {
    setTimeout(async () => {
      await refreshStatus();
      btnReconnect.disabled = false;
      btnReconnect.textContent = '重新连接';
    }, 1000);
  });
});

// 设置按钮
btnSettings.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// 初始化
refreshStatus();
