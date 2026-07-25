const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function create() {
    const modal = new ModalBuilder()
        .setCustomId("youtube_schedule_modal")
        .setTitle("Programmer une vidéo");

    const dateInput = new TextInputBuilder()
        .setCustomId("schedule_date")
        .setLabel("Date (JJ/MM/AAAA)")
        .setPlaceholder("25/07/2026")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const timeInput = new TextInputBuilder()
        .setCustomId("schedule_time")
        .setLabel("Heure (HH:MM)")
        .setPlaceholder("20:30")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const dateRow = new ActionRowBuilder()
        .addComponents(dateInput);

    const timeRow = new ActionRowBuilder()
        .addComponents(timeInput);

    modal.addComponents(
        dateRow,
        timeRow
    );

    return modal;
}

module.exports = {
    create
};
