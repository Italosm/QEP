#!/usr/bin/env tsx
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { loadAllLegislatures } from "../src/lib/load-data.ts";
import { aggregateData } from "../src/lib/aggregate.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "public", "data");
const imagesDir = path.join(__dirname, "..", "public", "images", "politicians");

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // console.error(`Failed to download ${url}: ${response.statusText}`);
      return;
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    // console.log(`Downloaded ${url} to ${filepath}`);
  } catch (error) {
    // console.error(`Error downloading ${url}:`, error);
  }
}

async function main() {
  await fs.mkdir(imagesDir, { recursive: true });

  const legislaturesData = await loadAllLegislatures();
  const politicians = aggregateData(legislaturesData);

  const downloadPromises = [];
  let downloadedCount = 0;
  const total = politicians.length;

  for (const politician of politicians) {
    if (politician.urlFoto) {
      const filename = `${politician.id}.jpg`;
      const filepath = path.join(imagesDir, filename);
      const promise = downloadImage(politician.urlFoto, filepath).then(() => {
        downloadedCount++;
        if (downloadedCount % 100 === 0 || downloadedCount === total) {
          const percentage = ((downloadedCount / total) * 100).toFixed(2);
          console.log(
            `Downloading images: ${percentage}% (${downloadedCount}/${total})`,
          );
        }
      });
      downloadPromises.push(promise);
    }
  }

  await Promise.all(downloadPromises);
  console.log("Done downloading images.");
}

main();
