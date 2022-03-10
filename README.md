<div align="center">
<img src="https://kinetics.dev/favicon.svg" height="96" width="96" alt="Kinetics">
<h3>Technology Management & Innovation platform</h3>
</div>

This is the monorepo repository for [Kinetics Developers](https://www.kinetics.dev/developers). It
uses [yarn workspaces](https://yarnpkg.com/features/workspaces) and [zero-install](https://yarnpkg.com/features/zero-installs) to manage all dependencies.

<div align="center" style="display: flex; gap: 8px;">
<a alt="GitLab" href="https://kinetics-au.medium.com/"><img alt="GitLab" src="https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white"/></a>
</div>

---


# File Structure

| Package                                  |         Description         |
| :--------------------------------------- | :-------------------------: |
| [examples](/packages/examples)           |          Examples           |
| [kinetics-core](/packages/kinetics-core) | Kinetics Core SDK (Node.js) |

# Contributing

To get started, running `yarn install` in the root of the project will install all of the
dependencies for you and you can simply `cd packages/<pkg>` and run the essentials scripts in each package respectively.