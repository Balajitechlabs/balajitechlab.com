import precompiledNotes from "@/data/releaseNotes.json";

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
  return (precompiledNotes as ReleaseNote[]).sort((a, b) => {
    const timeA = a.time || "00:00:00";
    const timeB = b.time || "00:00:00";
    const dtA = new Date(`${a.date}T${timeA}Z`).getTime();
    const dtB = new Date(`${b.date}T${timeB}Z`).getTime();
    return dtB - dtA;
  });
}
