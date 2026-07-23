const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const ticketForm = require("../modals/ticketForm");
const youtubeLink = require("../modals/youtubeLink");
const createTicket = require("../ticketSystem/createTicket");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {

        // =========================
        // BOUTONS
        // =========================

        if (interaction.isButton()) {

            // -------------------------
            // TICKETS
            // -------------------------

            if (interaction.customId === "ticket_confirm") {

                const embed = new EmbedBuilder()
                    .setTitle("🌟 Choix de la variante")
                    .setDescription(
                        "Choisis la variante de l'esprit que tu souhaites :"
                    );

                const menu = new StringSelectMenuBuilder()
                    .setCustomId("variant_choice")
                    .setPlaceholder("Choisir une variante")
                    .addOptions([
                        { label: "Normal", value: "Normal" },
                        { label: "Or", value: "Or" },
                        { label: "Gélifié", value: "Gélifié" },
                        { label: "Galaxy", value: "Galaxy" },
                        { label: "Iridescent", value: "Iridescent" },
                        { label: "Gemme", value: "Gemme" },
                        { label: "Cube", value: "Cube" },
                        { label: "Quack", value: "Quack" }
                    ]);

                const row = new ActionRowBuilder()
                    .addComponents(menu);

                await interaction.update({
                    embeds: [embed],
                    components: [row]
                });

                return;
            }

            if (interaction.customId === "ticket_cancel") {

                await interaction.update({
                    content: "❌ Création du ticket annulée.",
                    embeds: [],
                    components: []
                });

                return;
            }


            // -------------------------
            // YOUTUBE
            // -------------------------

            if (interaction.customId === "youtube_add") {

                await interaction.showModal(
                    youtubeLink.create()
                );

                return;
            }


            if (interaction.customId === "youtube_cancel") {

                await interaction.update({
                    content: "Panneau YouTube fermé.",
                    embeds: [],
                    components: []
                });

                return;
            }


            if (interaction.customId === "youtube_scheduled") {

                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("📅 Vidéos programmées")
                            .setDescription(
                                "Aucune vidéo programmée pour le moment."
                            )
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("youtube_back")
                                    .setLabel("Retour")
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    ]
                });

                return;
            }


            if (interaction.customId === "youtube_back") {

                const embed = new EmbedBuilder()
                    .setTitle("📺 Panneau YouTube")
                    .setDescription(
                        "Gère les publications YouTube de DrolfoBot."
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

                await interaction.update({
                    embeds: [embed],
                    components: [row]
                });

                return;
            }


            // -------------------------
            // APERÇU YOUTUBE
            // -------------------------

            if (
                interaction.customId === "youtube_publish" ||
                interaction.customId === "youtube_schedule"
            ) {

                await interaction.reply({
                    content:
                        "Cette fonction sera activée dans la prochaine étape du système YouTube.",
                    ephemeral: true
                });

                return;
            }

        }


        // =========================
        // MENU VARIANTE
        // =========================

        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === "variant_choice") {

                const variante = interaction.values[0];

                const modal =
                    ticketForm.createTicketForm(variante);

                await interaction.showModal(modal);

                return;
            }

        }


        // =========================
        // FORMULAIRES
        // =========================

        if (interaction.isModalSubmit()) {

            // -------------------------
            // FORMULAIRE TICKET
            // -------------------------

            if (interaction.customId.startsWith("ticket_form_")) {

                const variante =
                    interaction.customId.replace(
                        "ticket_form_",
                        ""
                    );

                const esprit =
                    interaction.fields.getTextInputValue(
                        "esprit"
                    );

                const pseudo =
                    interaction.fields.getTextInputValue(
                        "pseudo_epic"
                    );

                const dispo =
                    interaction.fields.getTextInputValue(
                        "disponibilite"
                    );

                await createTicket.execute(
                    interaction,
                    {
                        variante: variante,
                        esprit: esprit,
                        pseudo: pseudo,
                        dispo: dispo
                    }
                );

                return;
            }


            // -------------------------
            // FORMULAIRE YOUTUBE
            // -------------------------

            if (
                interaction.customId ===
                "youtube_link_modal"
            ) {

                const link =
                    interaction.fields.getTextInputValue(
                        "youtube_link"
                    );

                let message = "";

                try {

                    message =
                        interaction.fields.getTextInputValue(
                            "youtube_message"
                        );

                } catch {

                    message = "";

                }


                const embed = new EmbedBuilder()
                    .setTitle("📺 Aperçu de la publication")
                    .setDescription(
                        "Vérifie les informations avant de continuer."
                    )
                    .addFields(
                        {
                            name: "🔗 Lien",
                            value: link
                        },
                        {
                            name: "✏️ Message personnalisé",
                            value:
                                message ||
                                "Aucun message personnalisé."
                        }
                    );


                const row =
                    new ActionRowBuilder()
                        .addComponents(

                            new ButtonBuilder()
                                .setCustomId(
                                    "youtube_publish"
                                )
                                .setLabel(
                                    "Publier maintenant"
                                )
                                .setStyle(
                                    ButtonStyle.Success
                                ),

                            new ButtonBuilder()
                                .setCustomId(
                                    "youtube_schedule"
                                )
                                .setLabel(
                                    "Programmer"
                                )
                                .setStyle(
                                    ButtonStyle.Primary
                                ),

                            new ButtonBuilder()
                                .setCustomId(
                                    "youtube_cancel"
                                )
                                .setLabel(
                                    "Annuler"
                                )
                                .setStyle(
                                    ButtonStyle.Danger
                                )

                        );


                await interaction.reply({
                    embeds: [embed],
                    components: [row],
                    ephemeral: true
                });

                return;
            }

        }

    }
};
