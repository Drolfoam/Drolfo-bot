const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Vérifie si le bot fonctionne"),

    async execute(interaction) {
        await interaction.reply("🏓 Pong ! Le bot fonctionne !");
    }
};
