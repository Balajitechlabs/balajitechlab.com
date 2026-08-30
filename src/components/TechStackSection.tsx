"use client";

import "@/styles/index/tech-stack.css";

interface BadgeItem {
  name: string;
  badgeUrl: string;
}

interface TechCategory {
  title: string;
  icon: string;
  color: string;
  items: BadgeItem[];
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    title: "Mobile & Android Engineering",
    icon: "devices",
    color: "#3DDC84",
    items: [
      { name: "Android", badgeUrl: "https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" },
      { name: "Android Studio", badgeUrl: "https://img.shields.io/badge/Android_Studio-3DDC84?style=for-the-badge&logo=android-studio&logoColor=white" },
      { name: "Kotlin", badgeUrl: "https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white" },
      { name: "Java", badgeUrl: "https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" },
      { name: "Flutter", badgeUrl: "https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white" },
      { name: "Dart", badgeUrl: "https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white" },
      { name: "React Native", badgeUrl: "https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" },
      { name: "Firebase", badgeUrl: "https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" },
      { name: "SQLite", badgeUrl: "https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" },
    ],
  },
  {
    title: "Frontend & Web Ecosystem",
    icon: "language",
    color: "#61DAFB",
    items: [
      { name: "TypeScript", badgeUrl: "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" },
      { name: "JavaScript", badgeUrl: "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" },
      { name: "React.js", badgeUrl: "https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" },
      { name: "Next.js", badgeUrl: "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" },
      { name: "Vue.js", badgeUrl: "https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" },
      { name: "Tailwind CSS", badgeUrl: "https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" },
      { name: "Three.js", badgeUrl: "https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" },
      { name: "HTML5", badgeUrl: "https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" },
      { name: "CSS3", badgeUrl: "https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" },
    ],
  },
  {
    title: "Backend, Cloud & Databases",
    icon: "dns",
    color: "#00F2FE",
    items: [
      { name: "Node.js", badgeUrl: "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" },
      { name: "Express.js", badgeUrl: "https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" },
      { name: "NestJS", badgeUrl: "https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" },
      { name: "Python", badgeUrl: "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" },
      { name: "FastAPI", badgeUrl: "https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" },
      { name: "GraphQL", badgeUrl: "https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" },
      { name: "PostgreSQL", badgeUrl: "https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" },
      { name: "MongoDB", badgeUrl: "https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" },
      { name: "Redis", badgeUrl: "https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" },
      { name: "Docker", badgeUrl: "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" },
      { name: "Supabase", badgeUrl: "https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" },
      { name: "Google Cloud", badgeUrl: "https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" },
    ],
  },
  {
    title: "DevOps, Architecture & Tools",
    icon: "terminal",
    color: "#FFA116",
    items: [
      { name: "Git", badgeUrl: "https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" },
      { name: "GitHub", badgeUrl: "https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" },
      { name: "GitHub Actions", badgeUrl: "https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" },
      { name: "Linux", badgeUrl: "https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black" },
      { name: "Postman", badgeUrl: "https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" },
      { name: "VS Code", badgeUrl: "https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" },
      { name: "Figma", badgeUrl: "https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" },
      { name: "Vite", badgeUrl: "https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" },
      { name: "Vercel", badgeUrl: "https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" },
    ],
  },
];

export default function TechStackSection() {
  return (
    <div className="tech-stack-container item">
      {TECH_CATEGORIES.map((cat, idx) => (
        <div key={cat.title} className="tech-group-block">
          <div className="tech-group-header">
            <span className="material-symbols-rounded tech-group-icon">
              {cat.icon}
            </span>
            <h4>{cat.title}</h4>
          </div>

          <div className="tech-badges-row">
            {cat.items.map((item) => (
              <img
                key={item.name}
                src={item.badgeUrl}
                alt={item.name}
                className="tech-shield-badge"
                loading="lazy"
              />
            ))}
          </div>

          {idx < TECH_CATEGORIES.length - 1 && <div className="tech-divider" />}
        </div>
      ))}
    </div>
  );
}
