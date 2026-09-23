export const APP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IF-Creator - Multi-Tier Interface Visual Harness</title>
  <style>
    :root {
      --bg-primary: #121417;
      --bg-secondary: #1a1d24;
      --bg-tertiary: #232731;
      --border-color: #313746;
      --text-main: #f0f3f6;
      --text-muted: #8b949e;
      --accent: #3b82f6;
      --accent-hover: #2563eb;
      --accent-dim: #1e3a8a;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --info: #06b6d4;
      --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg-primary);
      color: var(--text-main);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    header {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 52px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 16px;
    }

    .brand-title {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .brand-badge {
      font-size: 11px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      padding: 2px 8px;
      border-radius: 12px;
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: nowrap;
    }

    button, .btn {
      background: var(--bg-tertiary);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      padding: 0;
      font-size: 16px;
      flex-shrink: 0;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    button:hover, .btn:hover {
      background: var(--border-color);
      border-color: #4b5563;
    }

    button.primary, .btn.primary {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
    }

    button.primary:hover, .btn.primary:hover {
      background: var(--accent-hover);
    }

    .nav-tabs {
      background: var(--bg-secondary);
      display: flex;
      border-bottom: 1px solid var(--border-color);
      padding: 0 10px;
      overflow-x: auto;
    }

    .tab-btn {
      padding: 10px 18px;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: 0;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
    }

    .tab-btn:hover {
      background: transparent;
      color: var(--text-main);
      border-color: transparent;
    }

    .tab-btn.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
      background: rgba(59, 130, 246, 0.05);
    }

    .app-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    .tab-pane {
      display: none;
      flex: 1;
      flex-direction: column;
      padding: 16px 20px;
      overflow-y: auto;
      height: 100%;
    }

    .tab-pane.active {
      display: flex;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 20px;
      height: 100%;
    }

    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 8px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
    }

    input[type="text"], input[type="number"], select, textarea {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-main);
      padding: 8px 12px;
      font-size: 13px;
      outline: none;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      border-color: var(--accent);
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .editor-toolbar {
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-color);
      padding: 8px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
    }

    .editor-title {
      font-weight: 600;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .code-editor {
      flex: 1;
      width: 100%;
      height: 100%;
      background: #0d1117;
      color: #e6edf3;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.5;
      padding: 14px;
      border: none;
      resize: none;
      outline: none;
      white-space: pre;
      overflow: auto;
      tab-size: 2;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
      gap: 16px;
      width: 100%;
      padding-bottom: 24px;
    }

    .example-card {
      min-height: 320px;
      height: 360px;
      display: flex;
      flex-direction: column;
    }

    /* Bottom Diagnostic Drawer */
    .diagnostics-drawer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      height: 160px;
      transition: height 0.2s ease;
      z-index: 10;
    }

    .diagnostics-drawer.collapsed {
      height: 36px;
    }

    .diagnostics-header {
      background: var(--bg-tertiary);
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid var(--border-color);
      height: 36px;
    }

    .diag-counts {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .diag-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
    }

    .diag-badge.error { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .diag-badge.warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .diag-badge.info { background: rgba(6, 182, 212, 0.2); color: #38bdf8; }

    .diag-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 12px;
      font-family: var(--font-mono);
      font-size: 12px;
    }

    .diag-item {
      padding: 6px 8px;
      border-radius: 4px;
      margin-bottom: 4px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: var(--bg-primary);
      border-left: 3px solid transparent;
    }

    .diag-item.error { border-left-color: var(--error); }
    .diag-item.warning { border-left-color: var(--warning); }
    .diag-item.info { border-left-color: var(--info); }

    .diag-msg { flex: 1; color: #d1d5db; }
    .diag-loc { color: var(--text-muted); font-size: 11px; }

    .sub-tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
    }

    .sub-tab-btn {
      padding: 5px 12px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-muted);
      font-size: 12px;
      cursor: pointer;
    }

    .sub-tab-btn.active {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }

    /* Modal / File Browser */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }

    .modal-backdrop.open {
      display: flex;
    }

    .modal-dialog {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      width: 720px;
      max-width: 92vw;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      overflow: hidden;
    }

    .modal-header {
      padding: 12px 18px;
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 14px;
    }

    .modal-body {
      padding: 14px 18px;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .modal-footer {
      padding: 12px 18px;
      background: var(--bg-tertiary);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .file-nav-bar {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .file-path-input {
      flex: 1;
      font-family: var(--font-mono);
      font-size: 12px;
      padding: 6px 10px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-main);
    }

    .file-list-container {
      flex: 1;
      min-height: 280px;
      max-height: 380px;
      overflow-y: auto;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      background: var(--bg-primary);
    }

    .file-item {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      font-size: 13px;
    }

    .file-item:hover {
      background: rgba(99, 102, 241, 0.12);
    }

    .file-item.selected {
      background: rgba(99, 102, 241, 0.28);
      outline: 1px solid var(--accent);
    }

    .file-item-icon {
      font-size: 14px;
      width: 18px;
      text-align: center;
    }

    .file-item-name {
      flex: 1;
      font-family: var(--font-mono);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #e2e8f0;
    }

    .file-item-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      font-weight: 500;
    }

    .file-item-size {
      color: var(--text-muted);
      font-size: 11px;
      min-width: 60px;
      text-align: right;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-icon">IF</div>
      <div>
        <span class="brand-title">IF-Creator</span>
        <span class="brand-badge" id="headerProjectName">EngineCoreAPI</span>
      </div>
    </div>
    <div class="header-actions">
      <button onclick="newProject()" class="icon-btn" title="✨ New / Reset Project" aria-label="New Project">✨</button>
      <button onclick="compileProject()" class="primary icon-btn" title="⚡ Generate All Tiers" aria-label="Generate All Tiers">⚡</button>
      <button onclick="openSaveBrowser()" class="icon-btn" title="💾 Save Project (Browse)" aria-label="Save Project">💾</button>
      <button onclick="openLoadBrowser()" class="icon-btn" title="📂 Load Project (Browse)" aria-label="Load Project">📂</button>
      <button onclick="openExportBrowser()" class="icon-btn" title="📦 Export All Tiers (Browse)" aria-label="Export All Tiers">📦</button>
    </div>
  </header>

  <nav class="nav-tabs">
    <button class="tab-btn active" onclick="switchTab('tab-setup', this)">⚙️ 1. Project & Low-Level API</button>
    <button class="tab-btn" onclick="switchTab('tab-tier1', this)">🛡️ 2. Tier 1: Safe Wrapper</button>
    <button class="tab-btn" onclick="switchTab('tab-tier2', this)">🌐 3. Tier 2: OpenAPI & REST</button>
    <button class="tab-btn" onclick="switchTab('tab-tier3', this)">📦 4. Tier 3: TypeScript SDK</button>
    <button class="tab-btn" onclick="switchTab('tab-tier4', this)">🤖 5. Tier 4: MCP Tool Server</button>
    <button class="tab-btn" onclick="switchTab('tab-tier5', this)">🚀 6. Tier 5: Code Examples & Agents</button>
  </nav>

  <div class="app-body">
    <!-- TAB 1: Setup -->
    <div id="tab-setup" class="tab-pane active">
      <div class="grid-2">
        <div class="card">
          <div class="card-title">📝 Project Configuration</div>
          <div class="form-group">
            <label>Project Name</label>
            <input type="text" id="projName" value="EngineCoreAPI" oninput="onFormInput()">
          </div>
          <div class="form-group">
            <label>Author / Organization</label>
            <input type="text" id="projAuthor" value="Dave" oninput="onFormInput()">
          </div>
          <div class="form-group">
            <label>Source Language</label>
            <select id="projLang" onchange="onFormInput(true)">
              <option value="c">C (Header / ABI)</option>
              <option value="cpp">C++ (Class / Namespace)</option>
              <option value="python3">Python 3 (Typed Defs)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Low-Level API File Path (Optional)</label>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="text" id="projFilePath" placeholder="/path/to/api.h" style="flex:1;" oninput="onFormInput()">
              <button type="button" class="icon-btn" onclick="openApiFileBrowser()" title="📂 Browse File System" aria-label="Browse File System">📂</button>
              <button type="button" class="icon-btn" onclick="importApiFile()" title="📥 Load File into Editor" aria-label="Load File into Editor">📥</button>
            </div>
            <input type="file" id="localFileInput" accept=".h,.hpp,.hh,.hxx,.c,.cpp,.cc,.cxx,.py,.json,.txt" style="display:none;" onchange="handleLocalFileSelect(event)">
          </div>
          <div class="form-group">
            <label>C++ / TypeScript Namespace</label>
            <input type="text" id="projNamespace" value="EngineCore" oninput="onFormInput()">
          </div>
          <div class="form-group">
            <label>REST API Prefix</label>
            <input type="text" id="projPrefix" value="/api/v1/engine" oninput="onFormInput()">
          </div>
          <div class="form-group">
            <label>Target MCP Server Name</label>
            <input type="text" id="projMcpName" value="engine-core-mcp" oninput="onFormInput()">
          </div>
        </div>

        <div class="editor-container">
          <div class="editor-toolbar">
            <span class="editor-title">📄 Low-Level API Definition (Input)</span>
            <button onclick="compileProject()" class="primary icon-btn" title="⚡ Recompile Tiers" aria-label="Recompile Tiers" style="width:28px; height:28px; font-size:13px;">⚡</button>
          </div>
          <textarea id="editorSource" class="code-editor" spellcheck="false" oninput="debounceCompile()"></textarea>
        </div>
      </div>
    </div>

    <!-- TAB 2: Tier 1 Safe Wrapper -->
    <div id="tab-tier1" class="tab-pane">
      <div class="editor-container">
        <div class="editor-toolbar">
          <span class="editor-title">🛡️ Tier 1: Modern C++20 / Safe Native Wrapper</span>
          <div style="display:flex; gap:6px;">
            <button class="icon-btn" onclick="copyEditor('editorTier1')" title="📋 Copy to Clipboard" aria-label="Copy Code" style="width:28px; height:28px; font-size:13px;">📋</button>
          </div>
        </div>
        <textarea id="editorTier1" class="code-editor" spellcheck="false"></textarea>
      </div>
    </div>

    <!-- TAB 3: Tier 2 OpenAPI -->
    <div id="tab-tier2" class="tab-pane">
      <div class="editor-container">
        <div class="editor-toolbar">
          <span class="editor-title">🌐 Tier 2: OpenAPI 3.1 & REST Gateway Specification</span>
          <div style="display:flex; gap:6px;">
            <button class="icon-btn" onclick="copyEditor('editorTier2')" title="📋 Copy to Clipboard" aria-label="Copy Code" style="width:28px; height:28px; font-size:13px;">📋</button>
          </div>
        </div>
        <textarea id="editorTier2" class="code-editor" spellcheck="false"></textarea>
      </div>
    </div>

    <!-- TAB 4: Tier 3 TypeScript SDK -->
    <div id="tab-tier3" class="tab-pane">
      <div class="editor-container">
        <div class="editor-toolbar">
          <span class="editor-title">📦 Tier 3: High-Level TypeScript / JavaScript Client SDK</span>
          <div style="display:flex; gap:6px;">
            <button class="icon-btn" onclick="copyEditor('editorTier3')" title="📋 Copy to Clipboard" aria-label="Copy Code" style="width:28px; height:28px; font-size:13px;">📋</button>
          </div>
        </div>
        <textarea id="editorTier3" class="code-editor" spellcheck="false"></textarea>
      </div>
    </div>

    <!-- TAB 5: Tier 4 MCP Server -->
    <div id="tab-tier4" class="tab-pane">
      <div class="editor-container">
        <div class="editor-toolbar">
          <span class="editor-title">🤖 Tier 4: Model Context Protocol (MCP) Tool Server</span>
          <div style="display:flex; gap:6px;">
            <button class="icon-btn" onclick="copyEditor('editorTier4')" title="📋 Copy to Clipboard" aria-label="Copy Code" style="width:28px; height:28px; font-size:13px;">📋</button>
          </div>
        </div>
        <textarea id="editorTier4" class="code-editor" spellcheck="false"></textarea>
      </div>
    </div>

    <!-- TAB 6: Examples & Agent Integration -->
    <div id="tab-tier5" class="tab-pane">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-shrink:0;">
        <span style="font-size:14px; font-weight:600; color:var(--text-main); display:flex; align-items:center; gap:8px;">
          🚀 Tier 5: Multi-Language & Autonomous Agent Examples
        </span>
        <button class="icon-btn" onclick="copyAllExamples()" title="📋 Copy All Examples Combined" aria-label="Copy All Examples" style="width:32px; height:32px; font-size:14px;">📋</button>
      </div>
      <div class="examples-grid">
        <!-- 1. C Example -->
        <div class="editor-container example-card">
          <div class="editor-toolbar">
            <span class="editor-title">📄 1. C Client Example</span>
            <div style="display:flex; gap:6px;">
              <button class="icon-btn" onclick="copyEditor('editorExampleC')" title="📋 Copy C Example" aria-label="Copy C Example" style="width:28px; height:28px; font-size:13px;">📋</button>
            </div>
          </div>
          <textarea id="editorExampleC" class="code-editor" spellcheck="false" oninput="syncExampleEdits('c')"></textarea>
        </div>

        <!-- 2. C++20 Example -->
        <div class="editor-container example-card">
          <div class="editor-toolbar">
            <span class="editor-title">🛡️ 2. C++20 Safe Wrapper Example</span>
            <div style="display:flex; gap:6px;">
              <button class="icon-btn" onclick="copyEditor('editorExampleCpp')" title="📋 Copy C++20 Example" aria-label="Copy C++20 Example" style="width:28px; height:28px; font-size:13px;">📋</button>
            </div>
          </div>
          <textarea id="editorExampleCpp" class="code-editor" spellcheck="false" oninput="syncExampleEdits('cpp')"></textarea>
        </div>

        <!-- 3. TypeScript SDK Example -->
        <div class="editor-container example-card">
          <div class="editor-toolbar">
            <span class="editor-title">📦 3. JavaScript / TypeScript Client SDK</span>
            <div style="display:flex; gap:6px;">
              <button class="icon-btn" onclick="copyEditor('editorExampleTs')" title="📋 Copy TypeScript Example" aria-label="Copy TypeScript Example" style="width:28px; height:28px; font-size:13px;">📋</button>
            </div>
          </div>
          <textarea id="editorExampleTs" class="code-editor" spellcheck="false" oninput="syncExampleEdits('ts')"></textarea>
        </div>

        <!-- 4. Anthropic Claude Example -->
        <div class="editor-container example-card">
          <div class="editor-toolbar">
            <span class="editor-title">🤖 4. Anthropic Claude (Tool Calling)</span>
            <div style="display:flex; gap:6px;">
              <button class="icon-btn" onclick="copyEditor('editorExampleClaude')" title="📋 Copy Claude Example" aria-label="Copy Claude Example" style="width:28px; height:28px; font-size:13px;">📋</button>
            </div>
          </div>
          <textarea id="editorExampleClaude" class="code-editor" spellcheck="false" oninput="syncExampleEdits('claude')"></textarea>
        </div>

        <!-- 5. Earendil-Pi Autonomous Agent Example -->
        <div class="editor-container example-card">
          <div class="editor-toolbar">
            <span class="editor-title">✨ 5. Earendil-Pi Agent Integration</span>
            <div style="display:flex; gap:6px;">
              <button class="icon-btn" onclick="copyEditor('editorExamplePi')" title="📋 Copy Earendil-Pi Example" aria-label="Copy Earendil-Pi Example" style="width:28px; height:28px; font-size:13px;">📋</button>
            </div>
          </div>
          <textarea id="editorExamplePi" class="code-editor" spellcheck="false" oninput="syncExampleEdits('pi')"></textarea>
        </div>

        <!-- 6. Nous Hermes Example -->
        <div class="editor-container example-card">
          <div class="editor-toolbar">
            <span class="editor-title">⚡ 6. Nous Hermes Function Calling Prompt</span>
            <div style="display:flex; gap:6px;">
              <button class="icon-btn" onclick="copyEditor('editorExampleNousHermes')" title="📋 Copy Nous Hermes Example" aria-label="Copy Nous Hermes Example" style="width:28px; height:28px; font-size:13px;">📋</button>
            </div>
          </div>
          <textarea id="editorExampleNousHermes" class="code-editor" spellcheck="false" oninput="syncExampleEdits('nous_hermes')"></textarea>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Diagnostics Window -->
  <div id="diagnosticsDrawer" class="diagnostics-drawer">
    <div class="diagnostics-header" onclick="toggleDiagnostics()">
      <div class="diag-counts">
        <span>🔍 Diagnostics & Validation</span>
        <span id="badgeError" class="diag-badge error">0 Errors</span>
        <span id="badgeWarn" class="diag-badge warning">0 Warnings</span>
        <span id="badgeInfo" class="diag-badge info">0 Info</span>
      </div>
      <span id="diagToggleIcon" style="font-size:11px; color:var(--text-muted);">▼ Collapse</span>
    </div>
    <div id="diagList" class="diag-list"></div>
  </div>

  <!-- Unified File Browser Modal -->
  <div id="modalFileBrowser" class="modal-backdrop" onclick="handleBackdropClick(event)">
    <div class="modal-dialog">
      <div class="modal-header">
        <span id="modalBrowserTitle">📂 Browse File</span>
        <button class="icon-btn" onclick="closeFileBrowser()" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; width:28px; height:28px; font-size:16px;" title="Close Modal">✕</button>
      </div>
      <div class="modal-body">
        <div class="file-nav-bar">
          <button type="button" class="icon-btn" onclick="navigateBrowserUp()" title="Parent Directory" aria-label="Parent Directory" style="width:32px; height:32px; font-size:13px;">⬆</button>
          <button type="button" class="icon-btn" onclick="navigateBrowserCwd()" title="Project Root Directory" aria-label="Project Root Directory" style="width:32px; height:32px; font-size:13px;">🏠</button>
          <input type="text" id="browserCurrentDirInput" class="file-path-input" placeholder="/current/directory/path" onkeydown="if(event.key==='Enter') navigateBrowserTo(this.value)">
          <button type="button" class="icon-btn" onclick="navigateBrowserTo(document.getElementById('browserCurrentDirInput').value)" title="Navigate to Path" aria-label="Go" style="width:32px; height:32px; font-size:13px;">➔</button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text-muted);">
          <span id="browserStatusText">Loading directory...</span>
          <label id="browserFilterLabel" style="display:flex; align-items:center; gap:4px; margin:0; cursor:pointer;">
            <input type="checkbox" id="browserFilterCheckbox" checked onchange="renderBrowserEntries()"> <span id="browserFilterText">Filter files</span>
          </label>
        </div>
        <div class="file-list-container" id="browserFileList"></div>
        <div style="display:flex; gap:8px; align-items:center;">
          <label id="browserSelectedLabel" style="font-size:12px; color:var(--text-muted); min-width:90px;">Selected Path:</label>
          <input type="text" id="browserSelectedPathInput" class="file-path-input" placeholder="Select or enter path" onkeydown="if(event.key==='Enter') confirmBrowserSelection()">
        </div>
      </div>
      <div class="modal-footer">
        <div>
          <button type="button" id="modalUploadBtn" onclick="document.getElementById('localFileInput').click()" title="Select a file directly from your local system">💻 Upload / Local File</button>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" onclick="closeFileBrowser()">Cancel</button>
          <button type="button" id="modalConfirmBtn" class="primary" onclick="confirmBrowserSelection()">Confirm</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toastNotification" style="position:fixed; bottom:20px; right:20px; background:#1e293b; color:#f8fafc; border:1px solid #3b82f6; border-radius:8px; padding:10px 16px; font-size:13px; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.5); display:none; align-items:center; gap:8px; transition:opacity 0.2s ease;"></div>

  <script>
    let currentProject = null;
    let compileTimer = null;
    let browseMode = 'api_file'; // 'api_file' | 'save_project' | 'load_project' | 'export_tiers'
    let browserCurrentDir = '';
    let browserParentDir = '';
    let browserEntries = [];
    let selectedBrowserPath = '';
    let toastTimer = null;

    // Last used path storage helpers
    function getLastUsedPath(mode) {
      try {
        const modeKey = 'if_last_' + mode;
        const specific = localStorage.getItem(modeKey);
        if (specific) return specific;
        return localStorage.getItem('if_last_browse_dir') || '';
      } catch {
        return '';
      }
    }

    function saveLastUsedPath(mode, fullPath, dir) {
      try {
        if (fullPath) localStorage.setItem('if_last_' + mode, fullPath);
        if (dir) localStorage.setItem('if_last_browse_dir', dir);
      } catch {
        // Fallback for storage restrictions
      }
    }

    function handleBackdropClick(event) {
      if (event && event.target && event.target.id === 'modalFileBrowser') {
        closeFileBrowser();
      }
    }

    function showToast(message, isError = false) {
      const toast = document.getElementById('toastNotification');
      toast.textContent = message;
      toast.style.borderColor = isError ? '#ef4444' : '#3b82f6';
      toast.style.color = isError ? '#f87171' : '#f8fafc';
      toast.style.display = 'flex';
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.style.display = 'none';
      }, 3500);
    }

    async function init() {
      const res = await fetch('/api/project');
      currentProject = await res.json();
      renderUI();
    }

    function renderUI() {
      if (!currentProject) return;
      const activeEl = document.activeElement;

      if (activeEl?.id !== 'projName') document.getElementById('projName').value = currentProject.name || '';
      document.getElementById('headerProjectName').textContent = currentProject.name || 'Untitled';
      if (activeEl?.id !== 'projAuthor') document.getElementById('projAuthor').value = currentProject.author || '';
      if (activeEl?.id !== 'projLang') document.getElementById('projLang').value = currentProject.sourceLanguage || 'c';
      if (activeEl?.id !== 'projFilePath') document.getElementById('projFilePath').value = currentProject.lowLevelApiPath || '';
      if (activeEl?.id !== 'projNamespace') document.getElementById('projNamespace').value = currentProject.options?.namespace || '';
      if (activeEl?.id !== 'projPrefix') document.getElementById('projPrefix').value = currentProject.options?.apiPrefix || '';
      if (activeEl?.id !== 'projMcpName') document.getElementById('projMcpName').value = currentProject.options?.targetMcpServerName || '';
      if (activeEl?.id !== 'editorSource') document.getElementById('editorSource').value = currentProject.sourceCode || '';

      if (currentProject.tiers?.tier1_wrapper) {
        if (activeEl?.id !== 'editorTier1') document.getElementById('editorTier1').value = currentProject.tiers.tier1_wrapper.code || '';
      }
      if (currentProject.tiers?.tier2_openapi) {
        if (activeEl?.id !== 'editorTier2') document.getElementById('editorTier2').value = currentProject.tiers.tier2_openapi.code || '';
      }
      if (currentProject.tiers?.tier3_ts_client) {
        if (activeEl?.id !== 'editorTier3') document.getElementById('editorTier3').value = currentProject.tiers.tier3_ts_client.code || '';
      }
      if (currentProject.tiers?.tier4_mcp) {
        if (activeEl?.id !== 'editorTier4') document.getElementById('editorTier4').value = currentProject.tiers.tier4_mcp.code || '';
      }
      if (currentProject.tiers?.tier5_examples) {
        const t5 = currentProject.tiers.tier5_examples;
        if (t5.items) {
          if (activeEl?.id !== 'editorExampleC' && document.getElementById('editorExampleC')) document.getElementById('editorExampleC').value = t5.items.c || '';
          if (activeEl?.id !== 'editorExampleCpp' && document.getElementById('editorExampleCpp')) document.getElementById('editorExampleCpp').value = t5.items.cpp || '';
          if (activeEl?.id !== 'editorExampleTs' && document.getElementById('editorExampleTs')) document.getElementById('editorExampleTs').value = t5.items.ts || '';
          if (activeEl?.id !== 'editorExampleClaude' && document.getElementById('editorExampleClaude')) document.getElementById('editorExampleClaude').value = t5.items.claude || '';
          if (activeEl?.id !== 'editorExamplePi' && document.getElementById('editorExamplePi')) document.getElementById('editorExamplePi').value = t5.items.pi || '';
          if (activeEl?.id !== 'editorExampleNousHermes' && document.getElementById('editorExampleNousHermes')) document.getElementById('editorExampleNousHermes').value = t5.items.nous_hermes || '';
        } else if (t5.code) {
          populateExamplesFromCombined(t5.code);
        }
      }

      renderDiagnostics(currentProject.diagnostics || []);
    }

    function populateExamplesFromCombined(code) {
      if (!code) return;
      const sections = code.split(/\n-{40,}\n/);
      if (sections.length >= 6) {
        let first = sections[0].trim();
        const headerEnd = first.indexOf('/* -------------------------------------------------------------------------- */');
        if (headerEnd !== -1) first = first.substring(headerEnd);

        if (document.getElementById('editorExampleC')) document.getElementById('editorExampleC').value = first.trim();
        if (document.getElementById('editorExampleCpp')) document.getElementById('editorExampleCpp').value = (sections[1] || '').trim();
        if (document.getElementById('editorExampleTs')) document.getElementById('editorExampleTs').value = (sections[2] || '').trim();
        if (document.getElementById('editorExampleClaude')) document.getElementById('editorExampleClaude').value = (sections[3] || '').trim();
        if (document.getElementById('editorExamplePi')) document.getElementById('editorExamplePi').value = (sections[4] || '').trim();
        if (document.getElementById('editorExampleNousHermes')) document.getElementById('editorExampleNousHermes').value = (sections[5] || '').trim();
      } else {
        if (document.getElementById('editorExampleC')) document.getElementById('editorExampleC').value = code;
      }
    }

    function syncExampleEdits(key) {
      if (!currentProject) return;
      if (!currentProject.tiers) currentProject.tiers = {};
      if (!currentProject.tiers.tier5_examples) {
        currentProject.tiers.tier5_examples = { code: '', language: 'typescript', diagnostics: [], items: {} };
      }
      if (!currentProject.tiers.tier5_examples.items) {
        currentProject.tiers.tier5_examples.items = {};
      }

      const c = document.getElementById('editorExampleC')?.value || '';
      const cpp = document.getElementById('editorExampleCpp')?.value || '';
      const ts = document.getElementById('editorExampleTs')?.value || '';
      const claude = document.getElementById('editorExampleClaude')?.value || '';
      const pi = document.getElementById('editorExamplePi')?.value || '';
      const nous_hermes = document.getElementById('editorExampleNousHermes')?.value || '';

      currentProject.tiers.tier5_examples.items = { c, cpp, ts, claude, pi, nous_hermes };

      const sections = [];
      sections.push("// ============================================================================");
      sections.push("// Multi-Language & High-Level Agent Integration Examples");
      sections.push("// Target Interface: " + (currentProject.name || "Interface"));
      sections.push("// ============================================================================");
      sections.push("");
      sections.push(c);
      sections.push("\n--------------------------------------------------------------------------------\n");
      sections.push(cpp);
      sections.push("\n--------------------------------------------------------------------------------\n");
      sections.push(ts);
      sections.push("\n--------------------------------------------------------------------------------\n");
      sections.push(claude);
      sections.push("\n--------------------------------------------------------------------------------\n");
      sections.push(pi);
      sections.push("\n--------------------------------------------------------------------------------\n");
      sections.push(nous_hermes);

      currentProject.tiers.tier5_examples.code = sections.join("\n");
    }

    function copyAllExamples() {
      syncExampleEdits('c');
      const code = currentProject?.tiers?.tier5_examples?.code || '';
      navigator.clipboard.writeText(code);
      showToast('📋 Copied all multi-language & agent examples!');
    }

    function renderDiagnostics(diagnostics) {
      const errors = diagnostics.filter(d => d.level === 'error');
      const warnings = diagnostics.filter(d => d.level === 'warning');
      const infos = diagnostics.filter(d => d.level === 'info');

      document.getElementById('badgeError').textContent = \`\${errors.length} Errors\`;
      document.getElementById('badgeWarn').textContent = \`\${warnings.length} Warnings\`;
      document.getElementById('badgeInfo').textContent = \`\${infos.length} Info\`;

      const list = document.getElementById('diagList');
      list.innerHTML = '';

      if (diagnostics.length === 0) {
        list.innerHTML = '<div style="color:var(--success); padding:10px;">✔ No errors or warnings found. All interface tiers compiled cleanly.</div>';
        return;
      }

      for (const d of diagnostics) {
        const item = document.createElement('div');
        item.className = \`diag-item \${d.level}\`;
        item.innerHTML = \`
          <span style="font-weight:bold; min-width:60px;">[\${d.level.toUpperCase()}]</span>
          <div class="diag-msg">
            <strong>\${d.code}:</strong> \${d.message}
            \${d.suggestion ? \`<div style="color:var(--text-muted); margin-top:2px; font-size:11px;">💡 Suggestion: \${d.suggestion}</div>\` : ''}
          </div>
          \${d.line ? \`<span class="diag-loc">Line \${d.line}</span>\` : ''}
        \`;
        list.appendChild(item);
      }
    }

    function switchTab(tabId, btnEl) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      if (btnEl) {
        btnEl.classList.add('active');
      } else {
        const found = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabId));
        if (found) found.classList.add('active');
      }
      const pane = document.getElementById(tabId);
      if (pane) pane.classList.add('active');
    }

    function toggleDiagnostics() {
      const drawer = document.getElementById('diagnosticsDrawer');
      const icon = document.getElementById('diagToggleIcon');
      drawer.classList.toggle('collapsed');
      icon.textContent = drawer.classList.contains('collapsed') ? '▲ Expand' : '▼ Collapse';
    }

    const SAMPLE_TEMPLATES = {
      c: "// Low-level C interface definition\\n#include <stdint.h>\\n\\n/**\\n * Initializes the device engine.\\n */\\nint engine_init(const char* device_name, int mode);\\n\\n/**\\n * Executes computation on input buffer.\\n */\\nint engine_compute(const double* input, int count, double* output);\\n\\n/**\\n * Retrieves engine status.\\n */\\nint engine_get_status(void);\\n\\n/**\\n * Shuts down the engine safely.\\n */\\nvoid engine_shutdown(void);\\n",
      cpp: "// Low-level C++ class and interface definition\\n#include <string>\\n#include <vector>\\n\\nclass EngineController {\\npublic:\\n    /**\\n     * Initializes engine with configuration parameters.\\n     */\\n    bool initialize(const std::string& config_file, int mode);\\n\\n    /**\\n     * Processes input data vector.\\n     */\\n    std::vector<double> processData(const std::vector<double>& input);\\n\\n    /**\\n     * Retrieves current operating state code.\\n     */\\n    int getStatusCode() const;\\n\\n    /**\\n     * Shuts down engine subsystem.\\n     */\\n    void shutdown();\\n};\\n",
      python3: "# Low-level Python 3 typed interface definition\\nfrom typing import List, Optional, Dict\\n\\ndef initialize_engine(device_name: str, mode: int = 1) -> bool:\\n    \"\"\"Initializes the device engine.\"\"\"\\n    pass\\n\\ndef process_batch(input_data: List[float], timeout_ms: int = 5000) -> List[float]:\\n    \"\"\"Executes computation on input batch data.\"\"\"\\n    pass\\n\\ndef get_engine_status() -> int:\\n    \"\"\"Retrieves current engine status code.\"\"\"\\n    pass\\n\\ndef shutdown_engine() -> None:\\n    \"\"\"Safely shuts down the engine.\"\"\"\\n    pass\\n"
    };

    function onFormInput(langChanged) {
      if (!currentProject) return;
      currentProject.name = document.getElementById('projName').value;
      document.getElementById('headerProjectName').textContent = currentProject.name || 'Untitled';
      currentProject.author = document.getElementById('projAuthor').value;
      const prevLang = currentProject.sourceLanguage;
      currentProject.sourceLanguage = document.getElementById('projLang').value;
      currentProject.lowLevelApiPath = document.getElementById('projFilePath').value;
      if (!currentProject.options) currentProject.options = {};
      currentProject.options.namespace = document.getElementById('projNamespace').value;
      currentProject.options.apiPrefix = document.getElementById('projPrefix').value;
      currentProject.options.targetMcpServerName = document.getElementById('projMcpName').value;

      if (langChanged && currentProject.sourceLanguage !== prevLang) {
        const curSource = (document.getElementById('editorSource').value || '').trim();
        const prevTpl = (SAMPLE_TEMPLATES[prevLang] || '').trim();
        if (!curSource || curSource === prevTpl) {
          const newTpl = SAMPLE_TEMPLATES[currentProject.sourceLanguage] || '';
          document.getElementById('editorSource').value = newTpl;
          currentProject.sourceCode = newTpl;
        }
      }

      debounceCompile();
    }

    function updateProjectMeta() {
      onFormInput(false);
    }

    function newProject() {
      const lang = document.getElementById('projLang')?.value || 'c';
      const sampleCode = SAMPLE_TEMPLATES[lang] || SAMPLE_TEMPLATES.c;
      currentProject = {
        id: 'proj_' + Math.random().toString(36).substring(2, 9),
        name: 'NewInterfaceAPI',
        description: 'Multi-tier interface generator',
        author: 'Developer',
        version: '1.0.0',
        sourceLanguage: lang,
        sourceCode: sampleCode,
        options: {
          namespace: 'NewInterface',
          apiPrefix: '/api/v1/interface',
          asyncInterface: true,
          generateDocstrings: true,
          targetMcpServerName: 'new-interface-mcp',
          restPort: 8080,
        },
        tiers: {},
        updatedAt: new Date().toISOString(),
      };
      renderUI();
      compileProject();
      showToast('✨ Created new project');
    }

    function debounceCompile() {
      clearTimeout(compileTimer);
      compileTimer = setTimeout(compileProject, 400);
    }

    async function compileProject() {
      if (!currentProject) return;
      currentProject.sourceCode = document.getElementById('editorSource').value;
      currentProject.name = document.getElementById('projName').value;
      currentProject.author = document.getElementById('projAuthor').value;
      currentProject.sourceLanguage = document.getElementById('projLang').value;
      currentProject.lowLevelApiPath = document.getElementById('projFilePath').value;
      if (!currentProject.options) currentProject.options = {};
      currentProject.options.namespace = document.getElementById('projNamespace').value;
      currentProject.options.apiPrefix = document.getElementById('projPrefix').value;
      currentProject.options.targetMcpServerName = document.getElementById('projMcpName').value;

      try {
        const res = await fetch('/api/project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentProject)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          showToast(errData.error || 'Compilation failed', true);
          return;
        }
        currentProject = await res.json();
        renderUI();
      } catch (err) {
        showToast('Error connecting to server: ' + err.message, true);
      }
    }

    async function openApiFileBrowser() {
      browseMode = 'api_file';
      document.getElementById('modalBrowserTitle').textContent = '📂 Browse Low-Level API File';
      document.getElementById('browserSelectedLabel').textContent = 'Selected File:';
      document.getElementById('browserFilterText').textContent = 'Filter API files (.h, .hpp, .c, .cpp, .py)';
      document.getElementById('browserFilterLabel').style.display = 'flex';
      document.getElementById('browserFilterCheckbox').checked = true;
      document.getElementById('modalUploadBtn').style.display = 'inline-flex';
      document.getElementById('modalUploadBtn').textContent = '💻 Upload / Local File';
      document.getElementById('modalConfirmBtn').textContent = '📥 Select & Load';

      const currentPath = (document.getElementById('projFilePath').value || '').trim() || getLastUsedPath('api_file');
      let startDir = '';
      if (currentPath) {
        if (currentPath.includes('/')) {
          startDir = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
        } else {
          startDir = currentPath;
        }
      }
      document.getElementById('browserSelectedPathInput').value = currentPath;
      selectedBrowserPath = currentPath;
      document.getElementById('modalFileBrowser').classList.add('open');
      await fetchDirectory(startDir);
    }

    async function openSaveBrowser() {
      browseMode = 'save_project';
      document.getElementById('modalBrowserTitle').textContent = '💾 Save Project JSON';
      document.getElementById('browserSelectedLabel').textContent = 'Save File Path:';
      document.getElementById('browserFilterText').textContent = 'Filter JSON files (.json)';
      document.getElementById('browserFilterLabel').style.display = 'flex';
      document.getElementById('browserFilterCheckbox').checked = true;
      document.getElementById('modalUploadBtn').style.display = 'none';
      document.getElementById('modalConfirmBtn').textContent = '💾 Save Project';

      let lastPath = getLastUsedPath('save_project') || 'if-project.json';
      let startDir = '';
      if (lastPath.includes('/')) {
        startDir = lastPath.substring(0, lastPath.lastIndexOf('/')) || '/';
      }
      document.getElementById('browserSelectedPathInput').value = lastPath;
      selectedBrowserPath = lastPath;
      document.getElementById('modalFileBrowser').classList.add('open');
      await fetchDirectory(startDir);
    }

    async function openLoadBrowser() {
      browseMode = 'load_project';
      document.getElementById('modalBrowserTitle').textContent = '📂 Load Project JSON';
      document.getElementById('browserSelectedLabel').textContent = 'Project File:';
      document.getElementById('browserFilterText').textContent = 'Filter JSON files (.json)';
      document.getElementById('browserFilterLabel').style.display = 'flex';
      document.getElementById('browserFilterCheckbox').checked = true;
      document.getElementById('modalUploadBtn').style.display = 'inline-flex';
      document.getElementById('modalUploadBtn').textContent = '💻 Upload JSON File';
      document.getElementById('modalConfirmBtn').textContent = '📂 Load Project';

      let lastPath = getLastUsedPath('load_project') || 'if-project.json';
      let startDir = '';
      if (lastPath.includes('/')) {
        startDir = lastPath.substring(0, lastPath.lastIndexOf('/')) || '/';
      }
      document.getElementById('browserSelectedPathInput').value = lastPath;
      selectedBrowserPath = lastPath;
      document.getElementById('modalFileBrowser').classList.add('open');
      await fetchDirectory(startDir);
    }

    async function openExportBrowser() {
      browseMode = 'export_tiers';
      document.getElementById('modalBrowserTitle').textContent = '📦 Export Generated Tiers';
      document.getElementById('browserSelectedLabel').textContent = 'Export Dir:';
      document.getElementById('browserFilterLabel').style.display = 'none';
      document.getElementById('modalUploadBtn').style.display = 'none';
      document.getElementById('modalConfirmBtn').textContent = '📦 Export Tiers';

      let lastDir = getLastUsedPath('export_tiers') || './generated-interfaces';
      let startDir = '';
      if (lastDir.startsWith('/')) {
        startDir = lastDir;
      }
      document.getElementById('browserSelectedPathInput').value = lastDir;
      selectedBrowserPath = lastDir;
      document.getElementById('modalFileBrowser').classList.add('open');
      await fetchDirectory(startDir);
    }

    function closeFileBrowser() {
      document.getElementById('modalFileBrowser').classList.remove('open');
    }

    async function navigateBrowserUp() {
      if (browserParentDir) {
        await fetchDirectory(browserParentDir);
      }
    }

    async function navigateBrowserCwd() {
      await fetchDirectory('');
    }

    async function navigateBrowserTo(dirPath) {
      await fetchDirectory(dirPath);
    }

    async function fetchDirectory(dirPath) {
      const statusText = document.getElementById('browserStatusText');
      statusText.textContent = 'Loading directory...';
      try {
        const res = await fetch(\`/api/fs/browse?dir=\${encodeURIComponent(dirPath || '')}\`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          statusText.textContent = errData.error || 'Failed to read directory';
          return;
        }
        const data = await res.json();
        browserCurrentDir = data.currentDir;
        browserParentDir = data.parentDir;
        browserEntries = data.entries || [];
        document.getElementById('browserCurrentDirInput').value = browserCurrentDir;
        statusText.textContent = \`\${browserEntries.length} items in \${browserCurrentDir}\`;
        saveLastUsedPath(browseMode, null, browserCurrentDir);
        renderBrowserEntries();
      } catch (e) {
        statusText.textContent = 'Error loading directory: ' + e.message;
      }
    }

    function renderBrowserEntries() {
      const container = document.getElementById('browserFileList');
      container.innerHTML = '';

      const filterChecked = document.getElementById('browserFilterCheckbox').checked;
      const entriesToDisplay = browserEntries.filter(entry => {
        if (entry.isDirectory) return true;
        if (!filterChecked) return true;
        if (browseMode === 'api_file') return entry.isApiFile;
        if (browseMode === 'save_project' || browseMode === 'load_project') return entry.ext === '.json';
        return true;
      });

      if (entriesToDisplay.length === 0) {
        container.innerHTML = '<div style="padding:16px; color:var(--text-muted); text-align:center;">No matching files or directories found in this folder.</div>';
        return;
      }

      for (const entry of entriesToDisplay) {
        const item = document.createElement('div');
        item.className = 'file-item';
        if (selectedBrowserPath === entry.path) {
          item.classList.add('selected');
        }

        const icon = entry.isDirectory ? '📁' : (entry.isApiFile ? '📄' : (entry.ext === '.json' ? '📦' : '📝'));
        const badge = entry.ext ? \`<span class="file-item-badge">\${entry.ext.toUpperCase().replace('.', '')}</span>\` : '';
        const sizeStr = entry.isFile && entry.size !== undefined ? formatBytes(entry.size) : '';

        item.innerHTML = \`
          <span class="file-item-icon">\${icon}</span>
          <span class="file-item-name" title="\${entry.name}">\${entry.name}</span>
          \${badge}
          <span class="file-item-size">\${sizeStr}</span>
        \`;

        item.onclick = (e) => {
          if (entry.isDirectory) {
            if (browseMode === 'export_tiers') {
              selectBrowserItem(entry.path, item);
            } else {
              fetchDirectory(entry.path);
            }
          } else {
            selectBrowserItem(entry.path, item);
          }
        };

        item.ondblclick = (e) => {
          if (entry.isDirectory) {
            fetchDirectory(entry.path);
          } else {
            selectBrowserItem(entry.path, item);
            confirmBrowserSelection();
          }
        };

        container.appendChild(item);
      }
    }

    function selectBrowserItem(itemPath, itemEl) {
      selectedBrowserPath = itemPath;
      document.getElementById('browserSelectedPathInput').value = itemPath;
      document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
      if (itemEl) itemEl.classList.add('selected');
    }

    async function confirmBrowserSelection() {
      let targetPath = (document.getElementById('browserSelectedPathInput').value || '').trim() || selectedBrowserPath;
      if (!targetPath) {
        if (browseMode === 'export_tiers') {
          targetPath = browserCurrentDir;
        } else {
          showToast('Please select or specify a valid path.', true);
          return;
        }
      }

      // If user provided a filename without directory path in save/load/export mode, resolve with current dir
      if (!targetPath.includes('/') && !targetPath.startsWith('.')) {
        targetPath = \`\${browserCurrentDir}/\${targetPath}\`;
      }

      saveLastUsedPath(browseMode, targetPath, browserCurrentDir);
      closeFileBrowser();

      if (browseMode === 'api_file') {
        document.getElementById('projFilePath').value = targetPath;
        currentProject.lowLevelApiPath = targetPath;
        await importApiFile();
      } else if (browseMode === 'save_project') {
        try {
          const res = await fetch('/api/project/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath: targetPath, project: currentProject })
          });
          const data = await res.json();
          if (res.ok) {
            showToast(data.message || 'Project saved successfully!');
          } else {
            showToast(data.error || 'Failed to save project', true);
          }
        } catch (err) {
          showToast('Error saving project: ' + err.message, true);
        }
      } else if (browseMode === 'load_project') {
        try {
          const res = await fetch('/api/project/load', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath: targetPath })
          });
          if (res.ok) {
            currentProject = await res.json();
            renderUI();
            showToast('Project loaded successfully!');
          } else {
            const errData = await res.json().catch(() => ({}));
            showToast(errData.error || 'Failed to load project file', true);
          }
        } catch (err) {
          showToast('Error loading project: ' + err.message, true);
        }
      } else if (browseMode === 'export_tiers') {
        try {
          const res = await fetch('/api/project/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ outputDir: targetPath })
          });
          const data = await res.json();
          if (res.ok) {
            showToast(data.message || 'All interface tiers exported successfully!');
          } else {
            showToast(data.error || 'Failed to export tiers', true);
          }
        } catch (err) {
          showToast('Error exporting project tiers: ' + err.message, true);
        }
      }
    }

    async function importApiFile() {
      const filePath = document.getElementById('projFilePath').value;
      if (!filePath) {
        showToast('Please enter or browse for a file path.', true);
        return;
      }
      try {
        const res = await fetch('/api/project/import-api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath })
        });
        const data = await res.json();
        if (data.sourceCode) {
          document.getElementById('editorSource').value = data.sourceCode;
          if (data.sourceLanguage) {
            document.getElementById('projLang').value = data.sourceLanguage;
          }
          compileProject();
          showToast(\`Imported \${filePath} successfully!\`);
        } else {
          showToast(data.error || 'Failed to import file', true);
        }
      } catch (err) {
        showToast('Error importing file: ' + err.message, true);
      }
    }

    function copyEditor(id) {
      const text = document.getElementById(id).value;
      navigator.clipboard.writeText(text);
      showToast('Copied code to clipboard!');
    }

    function handleLocalFileSelect(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;

        if (browseMode === 'load_project' || file.name.endsWith('.json')) {
          try {
            const parsed = JSON.parse(content);
            currentProject = parsed;
            renderUI();
            compileProject();
            showToast(\`Loaded project from \${file.name}\`);
            closeFileBrowser();
            return;
          } catch {
            // If not valid project json, fall through
          }
        }

        document.getElementById('editorSource').value = content;
        document.getElementById('projFilePath').value = file.name;
        currentProject.lowLevelApiPath = file.name;

        // Auto-detect language
        if (file.name.endsWith('.py')) {
          document.getElementById('projLang').value = 'python3';
        } else if (file.name.endsWith('.cpp') || file.name.endsWith('.hpp') || file.name.endsWith('.cc') || file.name.endsWith('.cxx')) {
          document.getElementById('projLang').value = 'cpp';
        } else if (file.name.endsWith('.h') || file.name.endsWith('.c')) {
          document.getElementById('projLang').value = 'c';
        }

        closeFileBrowser();
        compileProject();
        showToast(\`Loaded \${file.name} into editor\`);
      };
      reader.readAsText(file);
    }

    function formatBytes(bytes) {
      if (!bytes || bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    window.onload = init;
  </script>
</body>
</html>
`;
