import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");

const copyableExtensions = new Set([".css", ".html", ".js", ".txt"]);
const copyableFiles = new Set(["site.webmanifest"]);
const excludedFiles = new Set([
  "sitemap.xml",
  "sitemap-pages.xml",
  "sitemap-images.xml",
]);
const copyableDirectories = ["assets"];

const shouldCopyFile = (fileName) => {
  if (excludedFiles.has(fileName)) {
    return false;
  }

  if (copyableFiles.has(fileName)) {
    return true;
  }

  return copyableExtensions.has(path.extname(fileName));
};

await fs.rm(publicDir, { force: true, recursive: true });
await fs.mkdir(publicDir, { recursive: true });

for (const directoryName of copyableDirectories) {
  await fs.cp(path.join(root, directoryName), path.join(publicDir, directoryName), {
    force: true,
    recursive: true,
  });
}

const rootEntries = await fs.readdir(root, { withFileTypes: true });

for (const entry of rootEntries) {
  if (!entry.isFile() || !shouldCopyFile(entry.name)) {
    continue;
  }

  await fs.copyFile(path.join(root, entry.name), path.join(publicDir, entry.name));
}

console.log("Prepared public/ for Next.js build.");
