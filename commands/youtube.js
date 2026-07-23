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
        .setDescription("Gérer une publication YouTube"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Panneau YouTube")
            .setDescription(
                "Gère les publications YouTube de DrolfoBot.\n\n" +
                "Clique sur **Ajouter une vidéo** pour préparer une publication.\n" +
                "Tu pourras ensuite ajouter un message, prévisualiser et publier immédiatement ou programmer la vidéo."
            );

        const row = new ActionRowBuilder().addComponents(
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
