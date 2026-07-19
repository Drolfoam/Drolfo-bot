const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ticket",

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("⚠️ Avant d'ouvrir un ticket")
            .setDescription(
                "Toute fausse demande volontaire sera sanctionnée.\n\n" +
                "❌ Esprit inexistant\n" +
                "❌ Variante non disponible\n" +
                "❌ Fausse information\n" +
                "❌ Troll ou abus de tickets\n\n" +
                "En continuant, tu acceptes le règlement des tickets."
            );

        const ok = new ButtonBuilder()
            .setCustomId("ticket_confirm")
            .setLabel("✅ J'ai compris")
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId("ticket_cancel")
            .setLabel("❌ Annuler")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(ok, cancel);

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};
