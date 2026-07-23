const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    create() {
        const modal = new ModalBuilder()
            .setCustomId("youtube_link_modal")
            .setTitle("Ajouter une vidéo YouTube");

        const link = new TextInputBuilder()
            .setCustomId("youtube_link")
            .setLabel("Lien de la vidéo YouTube")
            .setPlaceholder("https://www.youtube.com/watch?v=...")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const message = new TextInputBuilder()
            .setCustomId("youtube_message")
            .setLabel("Message personnalisé (facultatif)")
            .setPlaceholder("Écris ton message ou laisse vide...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(link),
            new ActionRowBuilder().addComponents(message)
        );

        return modal;
    }
};
