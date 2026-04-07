<div align="center">

# ping-browser

### BadBoy Browser

**Your browser is the API. No keys. No bots. No scrapers.**

[![npm](https://img.shields.io/npm/v/ping-browser?color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/ping-browser)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · [中文](README.zh-CN.md)

</div>

---

You're already logged into Twitter, Reddit, YouTube, Zhihu, Bilibili, LinkedIn, GitHub — ping-browser lets AI agents **use that directly**.

```bash
ping-browser site twitter/search "AI agent"       # search tweets
ping-browser site zhihu/hot                        # trending on Zhihu
ping-browser site arxiv/search "transformer"       # search papers
ping-browser site eastmoney/stock "茅台"            # real-time stock quote
ping-browser site boss/search "AI engineer"        # search jobs
ping-browser site wikipedia/summary "Python"       # Wikipedia summary
ping-browser site youtube/transcript VIDEO_ID      # full transcript
ping-browser site stackoverflow/search "async"     # search SO questions
```

**103 commands across 36 platforms.** All using your real browser's login state. [Full list →](https://github.com/sipingme/bb-sites)

## The idea

The internet was built for browsers. AI agents have been trying to access it through APIs — but 99% of websites don't offer one.

ping-browser flips this: **instead of forcing websites to provide machine interfaces, let machines use the human interface directly.** The adapter runs `eval` inside your browser tab, calls `fetch()` with your cookies, or invokes the page's own webpack modules. The website thinks it's you. Because it **is** you.

| | Playwright / Selenium | Scraping libs | ping-browser |
|---|---|---|---|
| Browser | Headless, isolated | No browser | Your real Chrome |
| Login state | None, must re-login | Cookie extraction | Already there |
| Anti-bot | Detected easily | Cat-and-mouse | Invisible — it IS the user |
| Complex auth | Can't replicate | Reverse engineer | Page handles it itself |

## Quick Start

### Install

```bash
npm install -g ping-browser
```

### Use

```bash
ping-browser site update        # pull community adapters
ping-browser site recommend     # see which adapters match your browsing habits
ping-browser site zhihu/hot     # go
```

### OpenClaw (no extension needed)

If you use [OpenClaw](https://openclaw.ai), ping-browser runs directly through OpenClaw's built-in browser — no Chrome extension or daemon required:

```bash
ping-browser site reddit/hot --openclaw
ping-browser site xueqiu/hot-stock 5 --openclaw --jq '.items[] | {name, changePercent}'
```

Skill on ClawHub: [ping-browser-openclaw](https://clawhub.ai/yan5xu/ping-browser)

### Chrome Extension (standalone mode)

For use without OpenClaw (Claude Code MCP, standalone CLI):

1. Download from [Releases](https://github.com/sipingme/ping-browser/releases/latest)
2. Unzip → `chrome://extensions/` → Developer Mode → Load unpacked

### MCP (Claude Code / Cursor)

```json
{
  "mcpServers": {
    "ping-browser": {
      "command": "npx",
      "args": ["-y", "ping-browser", "--mcp"]
    }
  }
}
```

## 36 platforms, 103 commands

Community-driven via [bb-sites](https://github.com/sipingme/bb-sites). One JS file per command.

| Category | Platforms | Commands |
|----------|-----------|----------|
| **Search** | Google, Baidu, Bing, DuckDuckGo, Sogou WeChat | search |
| **Social** | Twitter/X, Reddit, Weibo, Xiaohongshu, Jike, LinkedIn, Hupu | search, feed, thread, user, notifications, hot |
| **News** | BBC, Reuters, 36kr, Toutiao, Eastmoney | headlines, search, newsflash, hot |
| **Dev** | GitHub, StackOverflow, HackerNews, CSDN, cnblogs, V2EX, Dev.to, npm, PyPI, arXiv | search, issues, repo, top, thread, package |
| **Video** | YouTube, Bilibili | search, video, transcript, popular, comments, feed |
| **Entertainment** | Douban, IMDb, Genius, Qidian | movie, search, top250 |
| **Finance** | Xueqiu, Eastmoney, Yahoo Finance | stock, hot stocks, feed, watchlist, search |
| **Jobs** | BOSS Zhipin, LinkedIn | search, detail, profile |
| **Knowledge** | Wikipedia, Zhihu, Open Library | search, summary, hot, question |
| **Shopping** | SMZDM | search deals |
| **Tools** | Youdao, GSMArena, Product Hunt, Ctrip | translate, phone specs, trending products |

## 10 minutes to add any website

```bash
ping-browser guide    # full tutorial
```

Tell your AI agent: *"turn XX website into a CLI"*. It reads the guide, reverse-engineers the API with `network --with-body`, writes the adapter, tests it, and submits a PR. All autonomously.

Three tiers of adapter complexity:

| Tier | Auth method | Example | Time |
|------|-------------|---------|------|
| **1** | Cookie (fetch directly) | Reddit, GitHub, V2EX | ~1 min |
| **2** | Bearer + CSRF token | Twitter, Zhihu | ~3 min |
| **3** | Webpack injection / Pinia store | Twitter search, Xiaohongshu | ~10 min |

We tested this: **20 AI agents ran in parallel, each independently reverse-engineered a website and produced a working adapter.** The marginal cost of adding a new website to the agent-accessible internet is approaching zero.

## What this means for AI agents

Without ping-browser, an AI agent's world is: **files + terminal + a few APIs with keys.**

With ping-browser: **files + terminal + the entire internet.**

An agent can now, in under a minute:

```bash
# Cross-platform research on any topic
ping-browser site arxiv/search "retrieval augmented generation"
ping-browser site twitter/search "RAG"
ping-browser site github search rag-framework
ping-browser site stackoverflow/search "RAG implementation"
ping-browser site zhihu/search "RAG"
ping-browser site 36kr/newsflash
```

Six platforms, six dimensions, structured JSON. Faster and broader than any human researcher.

## Also a full browser automation tool

```bash
ping-browser open https://example.com
ping-browser snapshot -i                # accessibility tree
ping-browser click @3                   # click element
ping-browser fill @5 "hello"            # fill input
ping-browser eval "document.title"      # run JS
ping-browser fetch URL --json           # authenticated fetch
ping-browser network requests --with-body --json  # capture traffic
ping-browser screenshot                 # take screenshot
```

All commands support `--json` output, `--jq <expr>` for inline filtering, and `--tab <id>` for concurrent multi-tab operations.

```bash
ping-browser site xueqiu/hot-stock 5 --jq '.items[] | {name, changePercent}'
# {"name":"云天化","changePercent":"2.08%"}
# {"name":"东芯股份","changePercent":"-7.60%"}

ping-browser site info xueqiu/stock   # view adapter args, example, domain
```

## Daemon configuration

The daemon binds to `localhost:19824` by default. You can customize the host with `--host`:

```bash
ping-browser daemon --host 127.0.0.1    # IPv4 only (fix macOS IPv6 issues)
ping-browser daemon --host 0.0.0.0      # listen on all interfaces (for Tailscale / ZeroTier remote access)
```

## Architecture

```
AI Agent (Claude Code, Codex, Cursor, etc.)
       │ CLI or MCP (stdio)
       ▼
ping-browser CLI ──HTTP──▶ Daemon ──SSE──▶ Chrome Extension
                                              │
                                              ▼ chrome.debugger (CDP)
                                         Your Real Browser
```

## License

[MIT](LICENSE)
