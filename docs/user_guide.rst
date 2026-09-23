User Guide
==========

Starting the Visual Harness
---------------------------

Launch the SPA server:

.. code-block:: bash

   deno task start

Or using the pre-compiled Debian binary:

.. code-block:: bash

   ./dist/debian/if-creator

Navigating the Tabbed Interface
-------------------------------

1. **Header Actions & Navigation**:
   - Icon-only header buttons for compact alignment: **Generate All Tiers** (⚡), **Save Project** (💾), **Load Project** (📂), and **Export Tiers** (📦).
   - Each action opens a browsable modal dialog remembering your last used directory and file paths.

2. **Tab 1: Project Setup & API Ingestion**:
   - Set project name, author, and target language.
   - Enter or browse your low-level API declarations into the code editor.
   - Use the icon-only **Browse** (📂) and **Load** (📥) buttons to navigate directories, filter C/C++/Python files, or upload local files with persistent last-used path memory.
   - Configure namespace, REST URL prefix, and MCP server options.
   - Click **Generate All Tiers** (⚡) or watch live recompilation.

3. **Tabs 2–5: Generated Code Tiers**:
   - View, edit, and validate code generated for each tier.
   - Use the icon-only **Copy** button (📋) to copy source code to your clipboard.

4. **Diagnostics Window**:
   - The expandable drawer at the bottom shows all detected errors, warnings, and suggestions.

5. **Tab 6: Examples & Agent Integration**:
   - Explore and edit ready-to-use client code and AI tool calling prompts.
   - Each example (C ABI, C++20 Wrapper, TypeScript SDK, Anthropic Claude, Earendil-Pi, and Nous Hermes) has its own dedicated, editable window with an individual icon-only **Copy** (📋) button.
   - Edit any example directly in place or copy all examples combined.

Batch CLI Mode
--------------

Generate all interface tiers from any header without opening the browser:

.. code-block:: bash

   ./dist/debian/if-creator --input my_api.h --output ./output_dir --lang c
