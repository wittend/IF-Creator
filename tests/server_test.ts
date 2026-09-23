import { assertEquals } from "jsr:@std/assert";
import { ServerApp } from "../src/server/app.ts";

Deno.test("Server - SPA Index & Health Endpoints", async () => {
  const app = new ServerApp();

  const spaRes = await app.handleRequest(new Request("http://127.0.0.1/"));
  assertEquals(spaRes.status, 200);
  const html = await spaRes.text();
  assertEquals(html.includes("IF-Creator"), true);
  assertEquals(html.includes("handleBackdropClick"), true);
  assertEquals(html.includes("modal-backdrop"), true);
  assertEquals(html.includes("editorExamplePi"), true);
  assertEquals(html.includes("onFormInput"), true);
  assertEquals(html.includes("newProject"), true);
  assertEquals(html.includes("SAMPLE_TEMPLATES"), true);

  const healthRes = await app.handleRequest(new Request("http://127.0.0.1/api/health"));
  assertEquals(healthRes.status, 200);
  const healthJson = await healthRes.json();
  assertEquals(healthJson.status, "ok");
});

Deno.test("Server - Project API & Export", async () => {
  const app = new ServerApp();

  const getRes = await app.handleRequest(new Request("http://127.0.0.1/api/project"));
  assertEquals(getRes.status, 200);
  const proj = await getRes.json();
  assertEquals(proj.name, "EngineCoreAPI");
  assertEquals(proj.tiers.tier1_wrapper !== undefined, true);

  const exportDir = await Deno.makeTempDir({ prefix: "if_test_export_" });
  const exportRes = await app.handleRequest(new Request("http://127.0.0.1/api/project/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outputDir: exportDir }),
  }));

  assertEquals(exportRes.status, 200);
  const exportJson = await exportRes.json();
  assertEquals(exportJson.success, true);

  // Verify exported files
  const stat1 = await Deno.stat(`${exportDir}/tier1_safe_wrapper.hpp`);
  const stat2 = await Deno.stat(`${exportDir}/tier2_openapi.json`);
  const stat3 = await Deno.stat(`${exportDir}/tier3_client.ts`);
  const stat4 = await Deno.stat(`${exportDir}/tier4_mcp_server.ts`);
  const stat5 = await Deno.stat(`${exportDir}/tier5_examples.ts`);

  assertEquals(stat1.isFile, true);
  assertEquals(stat2.isFile, true);
  assertEquals(stat3.isFile, true);
  assertEquals(stat4.isFile, true);
  assertEquals(stat5.isFile, true);

  // Clean up test export dir
  await Deno.remove(exportDir, { recursive: true });
});

Deno.test("Server - Project Save & Load API", async () => {
  const app = new ServerApp();
  const tempDir = await Deno.makeTempDir({ prefix: "if_test_saveload_" });
  const saveFilePath = `${tempDir}/nested/subdir/custom-project.json`;

  // Modify project
  app.project.name = "CustomSavedEngine";
  app.project.author = "TestAuthor";

  // Save Project
  const saveRes = await app.handleRequest(new Request("http://127.0.0.1/api/project/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath: saveFilePath, project: app.project }),
  }));
  assertEquals(saveRes.status, 200);
  const saveJson = await saveRes.json();
  assertEquals(saveJson.success, true);

  // Verify file was written
  const stat = await Deno.stat(saveFilePath);
  assertEquals(stat.isFile, true);

  // Load into a new server instance
  const newApp = new ServerApp();
  const loadRes = await newApp.handleRequest(new Request("http://127.0.0.1/api/project/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath: saveFilePath }),
  }));
  assertEquals(loadRes.status, 200);
  const loadedProj = await loadRes.json();
  assertEquals(loadedProj.name, "CustomSavedEngine");
  assertEquals(loadedProj.author, "TestAuthor");
  assertEquals(newApp.project.name, "CustomSavedEngine");

  // Clean up temp dir
  await Deno.remove(tempDir, { recursive: true });
});

Deno.test("Server - File System Browse API", async () => {
  const app = new ServerApp();

  // Test browsing cwd (GET)
  const browseRes = await app.handleRequest(new Request("http://127.0.0.1/api/fs/browse"));
  assertEquals(browseRes.status, 200);
  const browseData = await browseRes.json();
  assertEquals(typeof browseData.currentDir, "string");
  assertEquals(Array.isArray(browseData.entries), true);
  assertEquals(browseData.entries.length > 0, true);

  // Check that deno.json or requirements.md exists in entries
  const reqEntry = browseData.entries.find((e: any) => e.name === "requirements.md");
  assertEquals(reqEntry !== undefined, true);
  assertEquals(reqEntry.isFile, true);

  // Test browsing with temp directory containing header and python files
  const tempDir = await Deno.makeTempDir({ prefix: "if_test_browse_" });
  await Deno.writeTextFile(`${tempDir}/sensor.h`, "int read_sensor(int id);");
  await Deno.writeTextFile(`${tempDir}/driver.py`, "def compute(): pass");
  await Deno.mkdir(`${tempDir}/subfolder`);

  const browseTempRes = await app.handleRequest(new Request("http://127.0.0.1/api/fs/browse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dir: tempDir }),
  }));

  assertEquals(browseTempRes.status, 200);
  const tempBrowseData = await browseTempRes.json();
  assertEquals(tempBrowseData.entries.length, 3);

  const subfolderEntry = tempBrowseData.entries.find((e: any) => e.name === "subfolder");
  assertEquals(subfolderEntry?.isDirectory, true);

  const hEntry = tempBrowseData.entries.find((e: any) => e.name === "sensor.h");
  assertEquals(hEntry?.isFile, true);
  assertEquals(hEntry?.isApiFile, true);
  assertEquals(hEntry?.ext, ".h");

  const pyEntry = tempBrowseData.entries.find((e: any) => e.name === "driver.py");
  assertEquals(pyEntry?.isFile, true);
  assertEquals(pyEntry?.isApiFile, true);
  assertEquals(pyEntry?.ext, ".py");

  // Clean up temp dir
  await Deno.remove(tempDir, { recursive: true });
});

Deno.test("Server - Import API and Dynamic Project Update", async () => {
  const app = new ServerApp();
  const tempDir = await Deno.makeTempDir({ prefix: "if_test_import_" });
  const pyApiFile = `${tempDir}/robot_arm.py`;
  const pyCode = `
def move_joint(joint_id: int, angle: float) -> bool:
    """Moves a specific arm joint."""
    pass

def get_position() -> list:
    """Returns current arm XYZ coordinates."""
    pass
`;
  await Deno.writeTextFile(pyApiFile, pyCode);

  const importRes = await app.handleRequest(new Request("http://127.0.0.1/api/project/import-api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath: pyApiFile }),
  }));

  assertEquals(importRes.status, 200);
  const importedData = await importRes.json();
  assertEquals(importedData.sourceLanguage, "python3");
  assertEquals(importedData.project.name, "RobotArmAPI");
  assertEquals(importedData.project.options.namespace, "RobotArm");
  assertEquals(importedData.project.options.apiPrefix, "/api/v1/robot-arm");
  assertEquals(importedData.project.options.targetMcpServerName, "robot-arm-mcp");
  assertEquals(importedData.project.tiers.tier1_wrapper !== undefined, true);
  assertEquals(importedData.project.tiers.tier4_mcp !== undefined, true);

  // Clean up temp dir
  await Deno.remove(tempDir, { recursive: true });
});
