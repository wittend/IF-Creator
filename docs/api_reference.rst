API & CLI Reference
===================

Command Line Options
--------------------

.. list-table::
   :header-rows: 1

   * - Flag
     - Type
     - Description
   * - ``-p, --port``
     - Integer
     - Port to run the visual harness HTTP server (default: 3000).
   * - ``--no-open``
     - Flag
     - Disable automatic browser launch.
   * - ``-i, --input``
     - File Path
     - Input low-level API source file for batch compilation.
   * - ``-o, --output``
     - Directory Path
     - Output directory for generated code tiers.
   * - ``--lang``
     - String
     - Source language: ``c``, ``cpp``, or ``python3``.
   * - ``-n, --name``
     - String
     - Project / interface name.
   * - ``-v, --version``
     - Flag
     - Show version number.
   * - ``-h, --help``
     - Flag
     - Show help information.

HTTP Endpoints
--------------

- ``GET /``: Visual harness Single Page Application (SPA).
- ``GET /api/project``: Retrieve active project state, AST, and compiled tiers.
- ``POST /api/project``: Update source code / options and recompile tiers.
- ``POST /api/project/save``: Save project JSON to specified file path.
- ``POST /api/project/load``: Load project JSON from specified file path.
- ``POST /api/project/import-api``: Read low-level API from disk file.
- ``GET, POST /api/fs/browse``: Browse file system directories and list header/API files for selection.
- ``POST /api/project/export``: Export all generated tiers to directory on disk.
- ``GET /api/health``: System health status check.
