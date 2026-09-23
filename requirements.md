General:
---
1. Never use GROK AI for anything!
2. Always write unit tests.
3. Always evaluate tests, especially for GitHUB or Gitea commits and pushes.
4. Create and maintain the canonical assets for deployment to Git repositories. These include .gitignore files, README.md, LICENSE (MIT) including copyright by author, CHANGELOG.md, CodeOfConduct.md, etc.
5. Always create and maintain documentation in a form compatible with Github's readthedocs workflow using Sphinx and the 'furo' theme.
6. Always look first in the directory assets/ for underspecified assets for examination or building dosumentation.
---
Project Specific:
---
1. Create a visual harness for exploring the creation of interfaces.
2. Use Deno + Tauri + whatever web viewer is available for the platform at hand to create a tabbed single page app (SPA).
3. The first tab-page will display tools for naming and saving the current project, pointing it to the low-level API to be translated, and other significant parameters.
4. From a given C, C++,  or Python3 function-calling interface is provided, create on each tab the code for the next higher level interface.
5. Each subsequent tab page should provide an editable view of the code structure created for that step.
6. A window at the bottom of each tab should show any errors, problems, or warnings produced at that step.
7. A final page will show examples of use from appropriate languages, especially C, C++, Javascript/Typescript, and High level agents such as Pi, Claude, and Nous Hermes.
8. Create me a deno-compiled executable for my testing in dist/debian/
