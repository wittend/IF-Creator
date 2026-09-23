Requirements Specification
==========================

General Requirements
--------------------

1. **No GROK AI**: Never use Grok AI for any purpose.
2. **Automated Unit Testing**: Ensure 100% test coverage for core parsers, generators, and servers.
3. **Continuous Evaluation**: Continuously test and evaluate all components before deployment or commit.
4. **Canonical Assets**: Maintain canonical assets including ``.gitignore``, ``README.md``, ``LICENSE`` (MIT with author copyright), ``CHANGELOG.md``, and ``CodeOfConduct.md``.
5. **Sphinx & Furo Documentation**: Build documentation using Sphinx and the 'furo' theme compatible with ReadTheDocs / GitHub Pages.

Project-Specific Requirements
-----------------------------

1. **Visual Harness**: Interactive tabbed SPA for exploring the creation of multi-tier interfaces.
2. **Deno & Web Viewer**: Built on Deno with cross-platform web viewer launcher.
3. **Tab 1 - Project Setup & API Ingestion**: Tools for naming, saving, and pointing to low-level APIs (C, C++, Python 3).
4. **Multi-Tier Progression**: Generate sequentially higher-level interfaces on each tab.
5. **Editable Code Views**: Provide editable source viewers for each step.
6. **Diagnostic Windows**: Live error, problem, and warning diagnostic window at the bottom of each tab.
7. **Multi-Language & Agent Examples**: Tab showing examples for C, C++, JavaScript/TypeScript, and agents (Claude, Pi, Nous Hermes).
8. **Debian Executable**: Deno-compiled standalone executable located in ``dist/debian/if-creator``.
