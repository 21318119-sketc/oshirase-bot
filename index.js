const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers, // ← 参加・退出用に追加
  ],
});

const PREFIX = "!";

// -----------------------
// 起動メッセージ
// -----------------------
client.once("ready", () => {
  console.log(`お知らせBot起動完了: ${client.user.tag}`);
});

// -----------------------
// メッセージコマンド
// -----------------------
client.on("messageCreate", (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const command = message.content.slice(PREFIX.length).trim();

  if (command === "today") {
    const now = new Date();
    const dateStr = now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

    const anniversaries = {
      "01-01": "元日",
      "02-14": "バレンタインデー",
      "03-03": "ひな祭り",
      "04-01": "エイプリルフール",
      "05-05": "こどもの日",
      "07-07": "七夕",
      "08-15": "終戦の日",
      "09-01": "防災の日",
      "10-31": "ハロウィン",
      "12-25": "クリスマス",
    };

    const key = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;
    const specialDay = anniversaries[key] || "特に記念日はありません";

    message.channel.send(
      `📅 今日の日付: ${dateStr}\n📖 今日は「${specialDay}」です！`
    );
  }
});

// -----------------------
// 参加メッセージ
// -----------------------
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.get("参加用チャンネルID");
  if (!channel) return;

  channel.send(`🎉 ${member.user.tag} さんがサーバーに参加しました！ようこそ！`);
});

// -----------------------
// 退出メッセージ
// -----------------------
client.on("guildMemberRemove", (member) => {
  const channel = member.guild.channels.cache.get("参加用チャンネルID");
  if (!channel) return;

  channel.send(`👋 ${member.user.tag} さんがサーバーを退出しました…また来てね！`);
});

// -----------------------
// ログイン
// -----------------------
client.login(process.env.TOKEN);
