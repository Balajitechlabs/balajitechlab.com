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

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

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

    if (token && chatId) {
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
          { error: "Failed to dispatch notification to Telegram." },
          { status: 502 }
        );
      }
    } else {
      console.warn(
        "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in environment variables. Logged message:",
        { name, email, platform, handle, message }
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
