const TELEGRAM_API = "https://api.telegram.org";

export const sendTelegramMessage = async (chatId, text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return { skipped: true };

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram send failed:", data.description);
    }
    return data;
  } catch (error) {
    console.error("Telegram send error:", error.message);
    return { error: error.message };
  }
};
