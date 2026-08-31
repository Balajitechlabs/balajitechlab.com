import fs from "fs";
import path from "path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

function parseFrontmatter(fileContents: string): { data: Record<string, any>; content: string } {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContents };
  }

  const rawYaml = match[1];
  const content = match[2];
  const data: Record<string, any> = {};

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

const notesDirectory = path.join(process.cwd(), "content/release-notes");

export type AppTag = "quickdash" | (string & {});

export interface ReleaseNote {
  slug: string;
  title: string;
  description: string;
  app: AppTag;
  version: string;
  date: string;
  time?: string;
  tags?: string[];
  badge?: string;
  link: string;
  contentHtml: string;
}

export async function getAllReleaseNotes(): Promise<ReleaseNote[]> {
  if (!fs.existsSync(notesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(notesDirectory).filter((f) =>
    f.endsWith(".md")
  );

  const allNotes = await Promise.all(
    fileNames.map(async (fileName) => {
      const fullPath = path.join(notesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = parseFrontmatter(fileContents);

      // Process markdown to HTML supporting raw HTML tags and GFM features
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
      } as ReleaseNote;
    })
  );

  return allNotes.sort((a, b) => {
    const timeA = a.time || "00:00:00";
    const timeB = b.time || "00:00:00";
    const dtA = new Date(`${a.date}T${timeA}Z`).getTime();
    const dtB = new Date(`${b.date}T${timeB}Z`).getTime();
    return dtB - dtA;
  });
}
