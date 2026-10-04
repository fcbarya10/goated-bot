const mineflayer = require("mineflayer");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("AfterBellBot is online!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server running");
});

function startBot() {
  console.log("Connecting to AfterBell SMP...");

  const bot = mineflayer.createBot({
    host: "afterbell.mcsh.io",
    port: 25565,
    username: "AfterBellBot",
    auth: "offline"
  });

  bot.once("spawn", () => {
    console.log("✅ AfterBellBot joined AfterBell SMP!");

    setInterval(() => {
      if (!bot.entity) return;

      bot.setControlState("forward", true);

      setTimeout(() => {
        bot.setControlState("forward", false);
      }, 1000);
    }, 30000);
  });

  bot.on("kicked", reason => {
    console.log("Kicked:", reason);
  });

  bot.on("error", error => {
    console.log("Error:", error.message);
  });

  bot.on("end", () => {
    console.log("Disconnected. Reconnecting in 10 seconds...");

    setTimeout(() => {
      startBot();
    }, 10000);
  });
}

startBot();
