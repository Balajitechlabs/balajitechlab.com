export interface AppItem {
  name: string;
  category: string;
  link: string;
  description: string;
  iconUrl: string;
  price: "foss" | "free" | "paid";
  badge?: string;
  pastelColor: string;
  accentColor: string;
}

export interface AppGroup {
  title: string;
  subtitle: string;
  icon: string;
  items: AppItem[];
}

export interface BrewItem {
  name: string;
  command: string;
  category: string;
  description: string;
  icon: string;
  pastelColor: string;
  accentColor: string;
}

export const appGroups: AppGroup[] = [
  {
    title: "Core Development & AI Suite",
    subtitle: "Daily engineering tools, terminals, AI agents & mobile runtimes",
    icon: "terminal",
    items: [
      {
        name: "Ghostty",
        category: "Terminal & Shell",
        link: "https://ghostty.org",
        description:
          "Fast, native GPU-accelerated terminal emulator for macOS with tabs, split panes, and truecolor support.",
        iconUrl: "/assets/img/articles/macos/app-icons/ghostty.png",
        price: "foss",
        badge: "Terminal",
        pastelColor: "rgba(99, 102, 241, 0.15)",
        accentColor: "#6366f1",
      },
      {
        name: "Antigravity IDE",
        category: "AI Architecture",
        link: "https://antigravity.google",
        description:
          "Advanced autonomous agentic AI development environment for full-stack, Android, and Cloudflare architectural pair programming.",
        iconUrl: "/assets/img/articles/macos/app-icons/antigravity.png",
        price: "foss",
        badge: "AI IDE",
        pastelColor: "rgba(168, 85, 247, 0.15)",
        accentColor: "#a855f7",
      },
      {
        name: "Visual Studio Code",
        category: "Code Editor",
        link: "https://code.visualstudio.com",
        description:
          "Configured with TypeScript, ESLint, Tailwind CSS IntelliSense, Prettier, and lightweight multi-language extensions.",
        iconUrl: "/assets/img/articles/macos/app-icons/vscode.png",
        price: "foss",
        badge: "Editor",
        pastelColor: "rgba(59, 130, 246, 0.15)",
        accentColor: "#3b82f6",
      },
      {
        name: "Android CLI Tools",
        category: "Mobile Toolchain",
        link: "https://developer.android.com/studio/command-line",
        description:
          "Ultra-lean command-line Android toolchain (adb, bundletool, sdkmanager) avoiding heavy IDE memory overhead on 8GB RAM.",
        iconUrl: "/assets/img/articles/macos/app-icons/android.svg",
        price: "foss",
        badge: "Android",
        pastelColor: "rgba(34, 197, 94, 0.15)",
        accentColor: "#22c55e",
      },
      {
        name: "Zulu OpenJDK 21",
        category: "Java Runtime",
        link: "https://www.azul.com/downloads/?package=jdk#zulu",
        description:
          "Optimized native ARM64 Java Development Kit for fast Android Gradle builds, daemon execution, and Kotlin compiler speed.",
        iconUrl: "/assets/img/articles/macos/app-icons/zulu.svg",
        price: "foss",
        badge: "Java/JVM",
        pastelColor: "rgba(249, 115, 22, 0.15)",
        accentColor: "#f97316",
      },
    ],
  },
  {
    title: "Productivity & System Utilities",
    subtitle: "Launchers, security vaults, file staging & macOS system control",
    icon: "tune",
    items: [
      {
        name: "Raycast",
        category: "Launcher & Scripts",
        link: "https://www.raycast.com",
        description:
          "Essential Spotlight replacement with custom developer extensions, clipboard history, window management, and script commands.",
        iconUrl: "/assets/img/articles/macos/app-icons/raycast.png",
        price: "free",
        badge: "Launcher",
        pastelColor: "rgba(245, 158, 11, 0.15)",
        accentColor: "#f59e0b",
      },
      {
        name: "1Password",
        category: "Security & Vault",
        link: "https://1password.com",
        description:
          "Secure password management with integrated SSH agent, biometric GitHub commit signing, and developer CLI integration.",
        iconUrl: "/assets/img/articles/macos/app-icons/1password.png",
        price: "paid",
        badge: "Security",
        pastelColor: "rgba(14, 165, 233, 0.15)",
        accentColor: "#0ea5e9",
      },
      {
        name: "Dropover",
        category: "Drag & Drop Staging",
        link: "https://dropoverapp.com",
        description:
          "Floating shelf for dragging, dropping, and staging files, images, and snippets seamlessly across spaces and monitors.",
        iconUrl: "/assets/img/articles/macos/app-icons/dropover.png",
        price: "paid",
        badge: "Clipboard",
        pastelColor: "rgba(236, 72, 153, 0.15)",
        accentColor: "#ec4899",
      },
      {
        name: "Glance",
        category: "Quick Look Preview",
        link: "https://github.com/infiniteloopctr/glance",
        description:
          "Open-source Quick Look extension for macOS providing instant previews of code, markdown, JSON, archives, and syntax files.",
        iconUrl: "/assets/img/articles/macos/app-icons/glance.png",
        price: "foss",
        badge: "Quick Look",
        pastelColor: "rgba(6, 182, 212, 0.15)",
        accentColor: "#06b6d4",
      },
      {
        name: "OnyX",
        category: "System Maintenance",
        link: "https://www.titanium-software.fr/en/onyx.html",
        description:
          "Deep macOS system maintenance, structure verification, cache clearing, and performance optimization utility.",
        iconUrl: "/assets/img/articles/macos/app-icons/onyx.png",
        price: "free",
        badge: "Utility",
        pastelColor: "rgba(20, 184, 166, 0.15)",
        accentColor: "#14b8a6",
      },
    ],
  },
  {
    title: "Web & Testing Browsers",
    subtitle: "Spaces, vertical pinned tabs, responsive viewport testing & DevTools",
    icon: "language",
    items: [
      {
        name: "Arc Browser",
        category: "Web Browser",
        link: "https://arc.net",
        description:
          "Modern Chromium-based browser with workspaces, vertical pinned tabs, split screen, and clean keyboard-first navigation.",
        iconUrl: "/assets/img/articles/macos/app-icons/arc.png",
        price: "free",
        badge: "Browser",
        pastelColor: "rgba(139, 92, 246, 0.15)",
        accentColor: "#8b5cf6",
      },
      {
        name: "Google Chrome",
        category: "Testing & DevTools",
        link: "https://www.google.com/chrome",
        description:
          "Standard Chromium testing browser equipped with Chrome DevTools, performance profiling, and web standards debugging.",
        iconUrl: "/assets/img/articles/macos/app-icons/chrome.png",
        price: "free",
        badge: "Testing",
        pastelColor: "rgba(234, 179, 8, 0.15)",
        accentColor: "#eab308",
      },
    ],
  },
];

export interface BrewGroup {
  title: string;
  subtitle: string;
  icon: string;
  items: BrewItem[];
}

export const brewGroups: BrewGroup[] = [
  {
    title: "Terminal Shell & System Formulae",
    subtitle: "Fast CLI utilities, modern shell prompt & syntax enhancements",
    icon: "terminal",
    items: [
      {
        name: "Fastfetch",
        command: "brew install fastfetch",
        category: "System Info",
        description: "Neofetch alternative written in C with instant terminal execution.",
        icon: "speed",
        pastelColor: "rgba(56, 189, 248, 0.15)",
        accentColor: "#38bdf8",
      },
      {
        name: "Starship",
        command: "brew install starship",
        category: "Shell Prompt",
        description: "Ultra-customizable cross-shell prompt with Git branch status and execution times.",
        icon: "rocket_launch",
        pastelColor: "rgba(168, 85, 247, 0.15)",
        accentColor: "#a855f7",
      },
      {
        name: "Eza",
        command: "brew install eza",
        category: "File Tree",
        description: "Modern, feature-rich replacement for ls with file icons, Git status, and tree views.",
        icon: "folder_open",
        pastelColor: "rgba(34, 197, 94, 0.15)",
        accentColor: "#22c55e",
      },
      {
        name: "Bat",
        command: "brew install bat",
        category: "Syntax Viewer",
        description: "Cat clone with syntax highlighting, line numbers, and Git modification markers.",
        icon: "code",
        pastelColor: "rgba(249, 115, 22, 0.15)",
        accentColor: "#f97316",
      },
      {
        name: "Zsh Plugins",
        command: "brew install zsh-autosuggestions zsh-syntax-highlighting",
        category: "Shell UX",
        description: "Real-time command syntax highlighting and history-based autosuggestions.",
        icon: "auto_fix_high",
        pastelColor: "rgba(14, 165, 233, 0.15)",
        accentColor: "#0ea5e9",
      },
    ],
  },
  {
    title: "Developer Toolchains & Media Binaries",
    subtitle: "Package managers, Android CLI bridge & media processing",
    icon: "build",
    items: [
      {
        name: "UV",
        command: "brew install uv",
        category: "Python Manager",
        description: "Blazing fast Python package and project manager written in Rust.",
        icon: "bolt",
        pastelColor: "rgba(236, 72, 153, 0.15)",
        accentColor: "#ec4899",
      },
      {
        name: "FNM & PNPM",
        command: "brew install fnm && npm i -g pnpm",
        category: "Node.js Runtimes",
        description: "Fast Node Version Manager built in Rust paired with disk-efficient pnpm.",
        icon: "javascript",
        pastelColor: "rgba(234, 179, 8, 0.15)",
        accentColor: "#eab308",
      },
      {
        name: "scrcpy",
        command: "brew install scrcpy",
        category: "Android Bridge",
        description: "High-performance screen mirroring and physical Android device control with near-zero latency.",
        icon: "smartphone",
        pastelColor: "rgba(16, 185, 129, 0.15)",
        accentColor: "#10b981",
      },
      {
        name: "GitHub CLI",
        command: "brew install gh",
        category: "Git Workflow",
        description: "Official GitHub command-line tool for managing PRs, issues, releases, and CI status.",
        icon: "terminal",
        pastelColor: "rgba(99, 102, 241, 0.15)",
        accentColor: "#6366f1",
      },
      {
        name: "FFmpeg",
        command: "brew install ffmpeg",
        category: "Media Processing",
        description: "Complete cross-platform solution to record, convert, and stream audio and video.",
        icon: "movie",
        pastelColor: "rgba(244, 63, 94, 0.15)",
        accentColor: "#f43f5e",
      },
    ],
  },
];

export const brewPackages: BrewItem[] = brewGroups.flatMap((g) => g.items);
