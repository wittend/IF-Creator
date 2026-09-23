import { parseArgs } from "jsr:@std/cli/parse-args";
import { ServerApp } from "./server/app.ts";
import { parseInterface } from "./core/parser.ts";
import { analyzeInterface } from "./core/diagnostics.ts";
import { compileProjectTiers, createDefaultProject } from "./core/project.ts";

const VERSION = "1.0.0";

export async function openBrowser(url: string) {
  try {
    const os = Deno.build.os;
    if (os === "linux") {
      new Deno.Command("xdg-open", { args: [url] }).spawn();
    } else if (os === "darwin") {
      new Deno.Command("open", { args: [url] }).spawn();
    } else if (os === "windows") {
      new Deno.Command("cmd", { args: ["/c", "start", url] }).spawn();
    }
  } catch (_e) {
    // Ignore error if browser cannot be launched in headless environments
  }
}

export async function main() {
  const flags = parseArgs(Deno.args, {
    string: ["port", "input", "output", "lang", "name"],
    boolean: ["help", "version", "no-open", "cli"],
    default: {
      port: "3000",
      "no-open": false,
    },
    alias: {
      p: "port",
      i: "input",
      o: "output",
      h: "help",
      v: "version",
    },
  });

  if (flags.help) {
    console.log(`
IF-Creator: Visual Harness and Multi-Tier Interface Generator (v${VERSION})

Usage:
  if-creator [options]
  if-creator --input <api-file> --output <dir> [--lang <c|cpp|python3>]

Options:
  -p, --port <port>       Port to run the visual harness web server (default: 3000)
  --no-open               Do not automatically launch web browser/viewer
  -i, --input <file>      Input low-level API definition file (CLI batch mode)
  -o, --output <dir>      Output directory for generated multi-tier interfaces
  --lang <language>       Source language: c, cpp, python3 (default: auto-detect)
  -n, --name <name>       Project / API Name
  -v, --version           Display version
  -h, --help              Display this help message
`);
    return;
  }

  if (flags.version) {
    console.log(`IF-Creator v${VERSION}`);
    return;
  }

  // CLI Batch Mode
  if (flags.input) {
    const inputPath = flags.input;
    const outputDir = flags.output || "./generated-interfaces";
    const content = await Deno.readTextFile(inputPath);
    
    let lang = flags.lang as "c" | "cpp" | "python3";
    if (!lang) {
      if (inputPath.endsWith(".py")) lang = "python3";
      else if (inputPath.endsWith(".cpp") || inputPath.endsWith(".hpp")) lang = "cpp";
      else lang = "c";
    }

    const proj = createDefaultProject();
    proj.name = flags.name || inputPath.split("/").pop()?.replace(/\.[^/.]+$/, "") || "GeneratedApi";
    proj.sourceCode = content;
    proj.sourceLanguage = lang;

    console.log(`Compiling multi-tier interfaces from: ${inputPath} (${lang})...`);
    const { diagnostics } = compileProjectTiers(proj);

    await Deno.mkdir(outputDir, { recursive: true });
    if (proj.tiers.tier1_wrapper) {
      const ext = lang === "python3" ? "py" : "hpp";
      await Deno.writeTextFile(`${outputDir}/tier1_safe_wrapper.${ext}`, proj.tiers.tier1_wrapper.code);
    }
    if (proj.tiers.tier2_openapi) {
      await Deno.writeTextFile(`${outputDir}/tier2_openapi.json`, proj.tiers.tier2_openapi.code);
    }
    if (proj.tiers.tier3_ts_client) {
      await Deno.writeTextFile(`${outputDir}/tier3_client.ts`, proj.tiers.tier3_ts_client.code);
    }
    if (proj.tiers.tier4_mcp) {
      await Deno.writeTextFile(`${outputDir}/tier4_mcp_server.ts`, proj.tiers.tier4_mcp.code);
    }
    if (proj.tiers.tier5_examples) {
      await Deno.writeTextFile(`${outputDir}/tier5_examples.ts`, proj.tiers.tier5_examples.code);
    }

    console.log(`Successfully generated all 5 interface tiers in: ${outputDir}`);
    console.log(`Diagnostics: ${diagnostics.length} findings (${diagnostics.filter((d) => d.level === "error").length} errors, ${diagnostics.filter((d) => d.level === "warning").length} warnings).`);
    return;
  }

  // Visual Harness Web Server Mode
  const port = parseInt(flags.port, 10) || 3000;
  const app = new ServerApp();
  const url = `http://localhost:${port}`;

  console.log(`
┌─────────────────────────────────────────────────────────────┐
│                   IF-Creator Visual Harness                 │
├─────────────────────────────────────────────────────────────┤
│  ⚡ Server URL:       ${url.padEnd(38)} │
│  🛡️ Multi-Tier:      C/C++/Python -> Wrapper -> REST/MCP    │
│  ✨ Status:          Running (Press Ctrl+C to exit)        │
└─────────────────────────────────────────────────────────────┘
`);

  if (!flags["no-open"]) {
    openBrowser(url);
  }

  app.listen(port);
}

if (import.meta.main) {
  await main();
}
