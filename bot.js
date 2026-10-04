const mineflayer = require("mineflayer");
const express = require("express");

// ==========================
// RENDER WEB SERVER
// ==========================

const app = express();

app.get("/", (req, res) => {
  res.send("AfterBellBot is online!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server running");
});

// ==========================
// MINECRAFT BOT
// ==========================

function startBot() {
  console.log("🔄 Connecting to AfterBell SMP...");

  const bot = mineflayer.createBot({
    host: "afterbell.mcsh.io",
    port: 25565,
    username: "AfterBellBot",
    auth: "offline"
  });

  let loggedIn = false;

  // ==========================
  // SERVER MESSAGES / AUTHME
  // ==========================

  bot.on("messagestr", (message) => {
    console.log("[SERVER]", message);

    const msg = message.toLowerCase();

    // AuthMe login request
    if (
      !loggedIn &&
      (
        msg.includes("/login") ||
        msg.includes("please login") ||
        msg.includes("please log in")
      )
    ) {
      if (process.env.BOT_PASSWORD) {
        console.log("🔐 Sending AuthMe login...");
        bot.chat(`/login ${process.env.BOT_PASSWORD}`);
        loggedIn = true;
      } else {
        console.log("❌ BOT_PASSWORD is missing!");
      }
    }

    // AuthMe registration request
    if (
      !loggedIn &&
      (
        msg.includes("/register") ||
        msg.includes("please register")
      )
    ) {
      if (process.env.BOT_PASSWORD) {
        console.log("📝 Registering AfterBellBot...");
        bot.chat(
          `/register ${process.env.BOT_PASSWORD} ${process.env.BOT_PASSWORD}`
        );
        loggedIn = true;
      } else {
        console.log("❌ BOT_PASSWORD is missing!");
      }
    }
  });

  // ==========================
  // WHEN BOT JOINS
  // ==========================

  bot.once("spawn", () => {
    console.log("✅ AfterBellBot joined AfterBell SMP!");

    // Give AuthMe a moment to display its login message
    setTimeout(() => {
      if (!loggedIn && process.env.BOT_PASSWORD) {
        console.log("🔐 Attempting AuthMe login...");
        bot.chat(`/login ${process.env.BOT_PASSWORD}`);
      }
    }, 3000);

    // Move every 30 seconds
    setInterval(() => {
      if (!bot.entity) return;

      bot.setControlState("forward", true);

      setTimeout(() => {
        if (bot.entity) {
          bot.setControlState("forward", false);
        }
      }, 1500);

    }, 30000);
  });

  // ==========================
  // KICKED
  // ==========================

  bot.on("kicked", (reason) => {
    console.log("❌ BOT KICKED:");
    console.log(reason);
  });

  // ==========================
  // ERRORS
  // ==========================

  bot.on("error", (error) => {
    console.log("❌ BOT ERROR:");
    console.log(error.message);
  });

  // ==========================
  // DISCONNECTED
  // ==========================

  bot.on("end", () => {
    console.log("🔴 Bot disconnected!");
    console.log("🔄 Reconnecting in 10 seconds...");

    setTimeout(() => {
      startBot();
    }, 10000);
  });
}

// ==========================
// START
// ==========================

startBot();
