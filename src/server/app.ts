import { compileProjectTiers, createDefaultProject } from "../core/project.ts";
import type { ProjectState } from "../core/types.ts";
import { APP_HTML } from "../ui/app_html.ts";

export class ServerApp {
  public project: ProjectState;

  constructor(initialProject?: ProjectState) {
    this.project = initialProject || createDefaultProject();
    compileProjectTiers(this.project);
  }

  public async handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // SPA Index
      if (pathname === "/" || pathname === "/index.html") {
        return new Response(APP_HTML, {
          headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
        });
      }

      // Health
      if (pathname === "/api/health") {
        return Response.json({ status: "ok", timestamp: new Date().toISOString() }, { headers: corsHeaders });
      }

      // Get Project
      if (pathname === "/api/project" && req.method === "GET") {
        const { diagnostics } = compileProjectTiers(this.project);
        return Response.json({ ...this.project, diagnostics }, { headers: corsHeaders });
      }

      // Update / Compile Project
      if (pathname === "/api/project" && req.method === "POST") {
        const body = await req.json();
        this.project = {
          ...this.project,
          ...body,
          updatedAt: new Date().toISOString(),
        };
        const { diagnostics } = compileProjectTiers(this.project);
        return Response.json({ ...this.project, diagnostics }, { headers: corsHeaders });
      }

      // Save Project
      if (pathname === "/api/project/save" && req.method === "POST") {
        const body = await req.json();
        let filePath = (body.filePath || "if-project.json").trim();
        if (filePath.startsWith("~")) {
          const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "";
          filePath = filePath.replace(/^~/, home);
        }
        if (filePath.includes("/")) {
          const parent = filePath.substring(0, filePath.lastIndexOf("/"));
          if (parent) {
            try {
              await Deno.mkdir(parent, { recursive: true });
            } catch {
              // ignore
            }
          }
        }
        const projToSave = body.project || this.project;
        await Deno.writeTextFile(filePath, JSON.stringify(projToSave, null, 2));
        return Response.json({ success: true, message: `Project saved to ${filePath}` }, { headers: corsHeaders });
      }

      // Load Project
      if (pathname === "/api/project/load" && req.method === "POST") {
        const body = await req.json();
        let filePath = (body.filePath || "if-project.json").trim();
        if (filePath.startsWith("~")) {
          const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "";
          filePath = filePath.replace(/^~/, home);
        }
        const content = await Deno.readTextFile(filePath);
        this.project = JSON.parse(content);
        const { diagnostics } = compileProjectTiers(this.project);
        return Response.json({ ...this.project, diagnostics }, { headers: corsHeaders });
      }

      // Browse File System
      if (pathname === "/api/fs/browse" && (req.method === "GET" || req.method === "POST")) {
        let requestedDir = "";
        if (req.method === "GET") {
          requestedDir = url.searchParams.get("dir") || "";
        } else if (req.method === "POST") {
          const body = await req.json().catch(() => ({}));
          requestedDir = body.dir || "";
        }

        let targetDir = requestedDir.trim();
        if (!targetDir) {
          targetDir = Deno.cwd();
        } else if (targetDir.startsWith("~")) {
          const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "";
          targetDir = targetDir.replace(/^~/, home);
        }

        try {
          const realTarget = await Deno.realPath(targetDir);
          targetDir = realTarget;
        } catch {
          try {
            const resolved = `${Deno.cwd()}/${targetDir}`.replace(/\/+/g, "/");
            targetDir = await Deno.realPath(resolved);
          } catch (_e) {
            targetDir = Deno.cwd();
          }
        }

        try {
          const st = await Deno.stat(targetDir);
          if (st.isFile) {
            targetDir = targetDir.substring(0, targetDir.lastIndexOf("/")) || "/";
          }
        } catch {
          targetDir = Deno.cwd();
        }

        const entries: Array<{
          name: string;
          path: string;
          isDirectory: boolean;
          isFile: boolean;
          isSymlink: boolean;
          size?: number;
          ext: string;
          isApiFile: boolean;
        }> = [];

        try {
          for await (const entry of Deno.readDir(targetDir)) {
            const fullPath = `${targetDir}/${entry.name}`.replace(/\/+/g, "/");
            const extMatch = entry.name.match(/\.([0-9a-z]+)$/i);
            const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : "";
            const isApiFile = [".h", ".hpp", ".hh", ".hxx", ".c", ".cpp", ".cc", ".cxx", ".py", ".json", ".txt"].includes(ext);

            let isDir = entry.isDirectory;
            let isFile = entry.isFile;
            let size: number | undefined;

            if (entry.isSymlink) {
              try {
                const stat = await Deno.stat(fullPath);
                if (stat.isDirectory) isDir = true;
                if (stat.isFile) isFile = true;
                size = stat.size;
              } catch {
                // ignore
              }
            } else if (entry.isFile) {
              try {
                const stat = await Deno.stat(fullPath);
                size = stat.size;
              } catch {
                // ignore
              }
            }

            entries.push({
              name: entry.name,
              path: fullPath,
              isDirectory: isDir,
              isFile,
              isSymlink: entry.isSymlink,
              size,
              ext,
              isApiFile,
            });
          }
        } catch (readErr: any) {
          return Response.json({ error: `Cannot read directory ${targetDir}: ${readErr.message}` }, { status: 400, headers: corsHeaders });
        }

        entries.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
        });

        const parentDir = targetDir === "/" ? "/" : (targetDir.substring(0, targetDir.lastIndexOf("/")) || "/");

        return Response.json({
          currentDir: targetDir,
          parentDir,
          cwd: Deno.cwd(),
          entries,
        }, { headers: corsHeaders });
      }

      // Import Low-level API file
      if (pathname === "/api/project/import-api" && req.method === "POST") {
        const body = await req.json();
        let filePath = (body.filePath || "").trim();
        if (!filePath) {
          return Response.json({ error: "No filePath provided" }, { status: 400, headers: corsHeaders });
        }
        if (filePath.startsWith("~")) {
          const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "";
          filePath = filePath.replace(/^~/, home);
        }
        let content = "";
        try {
          content = await Deno.readTextFile(filePath);
        } catch (e: any) {
          try {
            const resolved = `${Deno.cwd()}/${filePath}`.replace(/\/+/g, "/");
            content = await Deno.readTextFile(resolved);
            filePath = resolved;
          } catch {
            return Response.json({ error: `Cannot read file: ${filePath} (${e.message})` }, { status: 400, headers: corsHeaders });
          }
        }

        let detectedLang: "c" | "cpp" | "python3" = "c";
        if (filePath.endsWith(".py")) detectedLang = "python3";
        else if (filePath.endsWith(".cpp") || filePath.endsWith(".hpp") || filePath.endsWith(".cc") || filePath.endsWith(".cxx") || filePath.endsWith(".hh")) detectedLang = "cpp";

        // Auto-derive project name from file
        const fileName = filePath.split("/").pop() || "";
        const baseName = fileName.replace(/\.[^/.]+$/, "");
        const cleanWords = baseName.replace(/[^a-zA-Z0-9]/g, " ").split(" ").filter(Boolean);
        const cleanName = cleanWords.map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
        const projectName = cleanName ? `${cleanName}API` : this.project.name;
        const namespaceName = cleanName || this.project.options?.namespace || "Api";
        const prefixSlug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        this.project.sourceCode = content;
        this.project.sourceLanguage = detectedLang;
        this.project.lowLevelApiPath = filePath;
        this.project.name = projectName;
        this.project.options = {
          ...this.project.options,
          namespace: namespaceName,
          apiPrefix: `/api/v1/${prefixSlug || "api"}`,
          targetMcpServerName: `${prefixSlug || "api"}-mcp`,
        };

        const { diagnostics } = compileProjectTiers(this.project);

        return Response.json({
          sourceCode: content,
          sourceLanguage: detectedLang,
          project: this.project,
          diagnostics,
        }, { headers: corsHeaders });
      }

      // Export All Generated Tiers
      if (pathname === "/api/project/export" && req.method === "POST") {
        const body = await req.json();
        const outputDir = body.outputDir || "./generated-interfaces";
        await Deno.mkdir(outputDir, { recursive: true });

        const tiers = this.project.tiers;
        if (tiers.tier1_wrapper) {
          const ext = this.project.sourceLanguage === "python3" ? "py" : "hpp";
          await Deno.writeTextFile(`${outputDir}/tier1_safe_wrapper.${ext}`, tiers.tier1_wrapper.code);
        }
        if (tiers.tier2_openapi) {
          await Deno.writeTextFile(`${outputDir}/tier2_openapi.json`, tiers.tier2_openapi.code);
        }
        if (tiers.tier3_ts_client) {
          await Deno.writeTextFile(`${outputDir}/tier3_client.ts`, tiers.tier3_ts_client.code);
        }
        if (tiers.tier4_mcp) {
          await Deno.writeTextFile(`${outputDir}/tier4_mcp_server.ts`, tiers.tier4_mcp.code);
        }
        if (tiers.tier5_examples) {
          await Deno.writeTextFile(`${outputDir}/tier5_examples.ts`, tiers.tier5_examples.code);
        }

        return Response.json({
          success: true,
          message: `Exported all 5 interface tiers to directory: ${outputDir}`,
        }, { headers: corsHeaders });
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (err: any) {
      return Response.json({ error: err.message || String(err) }, { status: 500, headers: corsHeaders });
    }
  }

  public listen(port = 3000, hostname = "127.0.0.1"): Deno.HttpServer {
    return Deno.serve({ port, hostname }, (req) => this.handleRequest(req));
  }
}
