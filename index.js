require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const fs = require("fs");

const {
    startYoutubeScheduler
} = require("./youtubeScheduler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// =========================
// COMMANDES
// =========================

client.commands = new Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command =
        require(`./commands/${file}`);

    if ("data" in command && "execute" in command) {

        client.commands.set(
            command.data.name,
            command
        );

    }
}

// =========================
// ÉVÉNEMENTS
// =========================

const eventFiles = fs
    .readdirSync("./events")
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {

    const event =
        require(`./events/${file}`);

    if (event.once) {

        client.once(
            event.name,
            (...args) =>
                event.execute(
                    ...args
                )
        );

    } else {

        client.on(
            event.name,
            (...args) =>
                event.execute(
                    ...args
                )
        );

    }
}

// =========================
// CONNEXION DU BOT
// =========================

client.once("ready", () => {

    console.log(
        `✅ ${client.user.tag} est connecté !`
    );

    // =========================
    // ACTIVATION DU SYSTÈME
    // DE PROGRAMMATION YOUTUBE
    // =========================

    startYoutubeScheduler(client);

});

// =========================
// CONNEXION À DISCORD
// =========================

client.login(
    process.env.TOKEN
);
