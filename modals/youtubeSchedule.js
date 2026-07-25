const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function create(link = "", message = "") {

    const safeLink =
        encodeURIComponent(link);

    const safeMessage =
        encodeURIComponent(message);

    const modal =
        new ModalBuilder()
            .setCustomId(
                `youtube_schedule_modal|${safeLink}|${safeMessage}`
            )
            .setTitle(
                "📅 Programmer la vidéo"
            );

    const dateInput =
        new TextInputBuilder()
            .setCustomId(
                "schedule_date"
            )
            .setLabel(
                "Date de publication"
            )
            .setPlaceholder(
                "Exemple : 25/07/2026"
            )
            .setStyle(
                TextInputStyle.Short
            )
            .setRequired(true)
            .setMaxLength(10);

    const timeInput =
        new TextInputBuilder()
            .setCustomId(
                "schedule_time"
            )
            .setLabel(
                "Heure de publication"
            )
            .setPlaceholder(
                "Exemple : 20:30"
            )
            .setStyle(
                TextInputStyle.Short
            )
            .setRequired(true)
            .setMaxLength(5);

    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(
                dateInput
            ),

        new ActionRowBuilder()
            .addComponents(
                timeInput
            )

    );

    return modal;
}

module.exports = {
    create
};
