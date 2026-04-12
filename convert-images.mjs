import sharp from "sharp";
import { readdirSync, mkdirSync, statSync } from "fs";
import { join, extname, basename, normalize } from "path";

const INPUT_DIR = normalize("./client/public/images");

function getAllImageFiles(dir) {
  let results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results = results.concat(getAllImageFiles(fullPath));
    } else if ([".jpg", ".jpeg", ".png"].includes(extname(entry).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllImageFiles(INPUT_DIR);

for (const inputPath of files) {
  // Normalize inputPath just in case
  const normalizedInput = normalize(inputPath);
  
  // Skip files already inside a /webp/ folder
  if (normalizedInput.includes(join(INPUT_DIR, "webp"))) continue;

  // Mirror the same subfolder structure inside /webp/
  const relativePath = normalizedInput.replace(INPUT_DIR, "");
  const outputPath = join(INPUT_DIR, "webp", relativePath)
    .replace(/\.(jpg|jpeg|png)$/i, ".webp");

  const outputDir = outputPath.substring(0, Math.max(outputPath.lastIndexOf("\\"), outputPath.lastIndexOf("/")));
  mkdirSync(outputDir, { recursive: true });

  await sharp(normalizedInput)
    .webp({ quality: 80 })
    .toFile(outputPath);

  console.log(`✅ ${relativePath} → webp${relativePath.replace(/\.(jpg|jpeg|png)$/i, ".webp")}`);
}

console.log("🎉 All images converted correctly including subfolders!");
