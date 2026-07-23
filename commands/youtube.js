const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("youtube")
        .setDescription("Gérer les publications YouTube"),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("Panneau YouTube")
            .setDescription(
                "Bienvenue dans le panneau de gestion YouTube de DrolfoBot.\n\n" +
                "Choisis une action ci-dessous."
            );

        const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("youtube_add")
                    .setLabel("Ajouter une vidéo")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("youtube_scheduled")
                    .setLabel("Vidéos programmées")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("youtube_cancel")
                    .setLabel("Fermer")
                    .setStyle(ButtonStyle.Danger)

            );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};
