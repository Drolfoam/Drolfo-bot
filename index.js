require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel
    ]
});

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} est connecté !`);
});

process.on("SIGTERM", () => {
    console.log("⚠️ Railway arrête le bot");
});

client.login(process.env.TOKEN);
