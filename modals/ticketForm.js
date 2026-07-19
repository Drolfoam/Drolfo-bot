const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {

    createTicketForm(variante) {

        const modal = new ModalBuilder()
            .setCustomId(`ticket_form_${variante}`)
            .setTitle("🎫 Demande Esprit");


        const esprit = new TextInputBuilder()
            .setCustomId("esprit")
            .setLabel("Quel esprit veux-tu ?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Écris le nom de l'esprit")
            .setRequired(true);


        const pseudo = new TextInputBuilder()
            .setCustomId("pseudo_epic")
            .setLabel("Ton pseudo Epic Games")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Exemple : Joueur123")
            .setRequired(true);


        const disponibilite = new TextInputBuilder()
            .setCustomId("disponibilite")
            .setLabel("Tes disponibilités")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Exemple : mercredi après-midi")
            .setRequired(true);


        modal.addComponents(
            new ActionRowBuilder().addComponents(esprit),
            new ActionRowBuilder().addComponents(pseudo),
            new ActionRowBuilder().addComponents(disponibilite)
        );


        return modal;
    }
};
