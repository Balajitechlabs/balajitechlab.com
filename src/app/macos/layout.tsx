import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Balaji's MacBook Setup — MacBook Air M1 (8GB / 256GB SSD) | balajitechlabs",
  description:
    "A complete lookaround of my personal macOS developer and productivity setup on the MacBook Air M1 (8GB / 256GB SSD).",
  metadataBase: new URL("https://balajitechlab.com/macos/"),
  keywords:
    "macos, macbook, macbook air, macbook m1, apple silicon, developer setup, dotfiles, balajitechlabs, Balaji S",
  openGraph: {
    type: "article",
    title: "Balaji's MacBook Setup — MacBook Air M1 (8GB / 256GB SSD) | balajitechlabs",
    description:
      "A complete lookaround of my personal macOS developer and productivity setup on the MacBook Air M1 (8GB / 256GB SSD).",
    url: "https://balajitechlab.com/macos/",
    images: "/assets/img/articles/macos/desktop-screenshot.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@balajitechlabs",
    creator: "@balajitechlabs",
    title: "Balaji's MacBook Setup — MacBook Air M1 (8GB / 256GB SSD) | balajitechlabs",
    description:
      "A complete lookaround of my personal macOS developer and productivity setup on the MacBook Air M1 (8GB / 256GB SSD).",
    images: "/assets/img/articles/macos/desktop-screenshot.png",
  },
};

export { default } from "./page";
