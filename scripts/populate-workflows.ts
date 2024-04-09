import { $ } from "bun";

import path from "node:path";
import fs from "node:fs/promises";

/**
 *
 * This script downloads the latest release from https://github.com/getactions/getactions (the repository
 * where all the workflows are stored) and installs it into this repository.
 *
 * This needs to be executed BEFORE you start the app.
 *
 */

const WORKFLOWS_DIR = "./workflows";
const LOGOS_DIR = "./public/logos";

const BASE_TMP_DIR = "./.tmp";
const TMP_DIR = path.join(BASE_TMP_DIR, Date.now().toString());

const cartridgeFilename = "cartridge.tar.gz"

// Cleanup
await $`rm -rf ${WORKFLOWS_DIR} ${LOGOS_DIR}`;

// Create directories
await $`mkdir -p ${WORKFLOWS_DIR}`;
await $`mkdir -p ${LOGOS_DIR}`;
await $`mkdir -p ${TMP_DIR}`;

const fullCartridgePath = path.join(TMP_DIR, cartridgeFilename)

const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
}

// Detect the latest version via the GitHub API
const release = await fetch("https://api.github.com/repos/getactions/getactions/releases/latest", {
  headers 
}).then(response => response.json())

// Download the latest release
await fetch(release.tarball_url, {
  headers
})
.then( res => res.blob() )
.then( blob => {
  return Bun.write(fullCartridgePath, blob);
});

await $`tar -xzf ${fullCartridgePath} --strip-components=1 -C ${TMP_DIR}/`;

// Get all directories from TMP_DIR, exclude all files and all directories starting with a `.`
const contents = await fs.readdir(TMP_DIR, { withFileTypes: true })

const workflows = contents.filter( dirent => dirent.isDirectory() && !dirent.name.startsWith(".") )

for (const workflow of workflows) {
  await $`mv ${path.join(TMP_DIR, workflow.name)} ${WORKFLOWS_DIR}`;
}

const logos = await fs.readdir(path.join(TMP_DIR, ".assets", "logos"), { withFileTypes: true })

for (const logo of logos) {
  await $`mv ${path.join(TMP_DIR, ".assets", "logos", logo.name)} ${LOGOS_DIR}`;
}

await $`rm -rf ${BASE_TMP_DIR}`

console.log(`Populated workflows (release: ${release.name})`)
