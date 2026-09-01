import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, platform, handle, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    let token = process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_BOT_KEY;
    let chatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHATID;

    // Support Cloudflare Workers / Pages runtime bindings via @opennextjs/cloudflare
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const cfContext = getCloudflareContext();
      if (cfContext?.env) {
        const env = cfContext.env as Record<string, string | undefined>;
        token = env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_TOKEN || env.TELEGRAM_BOT_KEY || token;
        chatId = env.TELEGRAM_CHAT_ID || env.TELEGRAM_CHATID || chatId;
      }
    } catch {
      // Running in local Next.js node environment without Cloudflare context
    }

    if (!token || !chatId) {
      console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in environment variables.");
      return NextResponse.json(
        {
          error:
            "Telegram notification service is not configured. Please add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Cloudflare Workers / Pages Settings > Variables and Secrets.",
        },
        { status: 503 }
      );
    }

    // Platform URL generation
    let socialInfo = "None provided";
    if (handle && handle.trim()) {
      const cleanHandle = handle.trim().replace(/^@/, "");
      let url = "";
      switch (platform) {
        case "telegram":
          url = `https://t.me/${cleanHandle}`;
          break;
        case "discord":
          url = `https://discord.com/users/${cleanHandle}`;
          break;
        case "instagram":
          url = `https://instagram.com/${cleanHandle}`;
          break;
        case "x":
          url = `https://x.com/${cleanHandle}`;
          break;
        case "github":
          url = `https://github.com/${cleanHandle}`;
          break;
        case "linkedin":
          url = `https://linkedin.com/in/${cleanHandle}`;
          break;
        case "whatsapp":
          url = `https://wa.me/${cleanHandle.replace(/\+/g, "")}`;
          break;
        default:
          url = cleanHandle;
      }
      socialInfo = `<b>${platform?.toUpperCase() || "Social"}:</b> <a href="${url}">${handle}</a> (${url})`;
    }

    const now = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const telegramText =
      `🚀 <b>New Portfolio Inquiry Received!</b>\n\n` +
      `👤 <b>Name:</b> ${escapeHtml(name)}\n` +
      `📧 <b>Email:</b> ${escapeHtml(email)}\n` +
      `🌐 <b>Social:</b> ${socialInfo}\n\n` +
      `💬 <b>Message:</b>\n<i>${escapeHtml(message)}</i>\n\n` +
      `⏰ <b>Received:</b> ${now} IST`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Telegram bot API error:", errText);
      return NextResponse.json(
        { error: `Telegram API error: ${errText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
