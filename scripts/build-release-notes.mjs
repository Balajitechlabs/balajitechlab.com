import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const notesDirectory = path.join(rootDir, "content/release-notes");
const outputFile = path.join(rootDir, "src/data/releaseNotes.json");

function parseFrontmatter(fileContents) {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContents };
  }

  const rawYaml = match[1];
  const content = match[2];
  const data = {};

  for (const line of rawYaml.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    const rawVal = trimmed.slice(colonIdx + 1).trim();

    if ((rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("'") && rawVal.endsWith("'"))) {
      data[key] = rawVal.slice(1, -1);
    } else if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
      try {
        data[key] = JSON.parse(rawVal);
      } catch {
        data[key] = rawVal
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      }
    } else {
      data[key] = rawVal;
    }
  }

  return { data, content };
}

async function buildReleaseNotes() {
  if (!fs.existsSync(notesDirectory)) {
    console.error(`Notes directory not found: ${notesDirectory}`);
    process.exit(1);
  }

  const fileNames = fs.readdirSync(notesDirectory).filter((f) => f.endsWith(".md"));

  const allNotes = await Promise.all(
    fileNames.map(async (fileName) => {
      const fullPath = path.join(notesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = parseFrontmatter(fileContents);

      const processedContent = await remark()
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeStringify)
        .process(content);

      const contentHtml = processedContent.toString();

      return {
        slug: fileName.replace(/\.md$/, ""),
        ...data,
        contentHtml,
      };
    })
  );

  const sortedNotes = allNotes.sort((a, b) => {
    const timeA = a.time || "00:00:00";
    const timeB = b.time || "00:00:00";
    const dtA = new Date(`${a.date}T${timeA}Z`).getTime();
    const dtB = new Date(`${b.date}T${timeB}Z`).getTime();
    return dtB - dtA;
  });

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(sortedNotes, null, 2) + "\n", "utf8");
  console.log(`Successfully compiled ${sortedNotes.length} release notes to ${outputFile}`);
}

buildReleaseNotes().catch((err) => {
  console.error("Failed to build release notes:", err);
  process.exit(1);
});
