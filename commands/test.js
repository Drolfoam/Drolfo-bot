const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Teste si DrolfoBot fonctionne"),

    async execute(interaction) {
        await interaction.reply("✅ DrolfoBot fonctionne !");
    }
};
