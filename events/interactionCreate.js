const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

const ticketForm = require("../modals/ticketForm");
const youtubeLink = require("../modals/youtubeLink");
const youtubeSchedule = require("../modals/youtubeSchedule");
const createTicket = require("../ticketSystem/createTicket");

const {
    addVideo,
    getVideos,
    removeVideo
} = require("../scheduledVideos");

const YOUTUBE_CHANNEL_ID = "1523787199009783858";

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {

        // =========================
        // BOUTONS
        // =========================

        if (interaction.isButton()) {

            // =========================
            // TICKET : CONFIRMATION
            // =========================

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
                        {
                            label: "Normal",
                            value: "Normal"
                        },
                        {
                            label: "Or",
                            value: "Or"
                        },
                        {
                            label: "Gélifié",
                            value: "Gélifié"
                        },
                        {
                            label: "Galaxy",
                            value: "Galaxy"
                        },
                        {
                            label: "Iridescent",
                            value: "Iridescent"
                        },
                        {
                            label: "Gemme",
                            value: "Gemme"
                        },
                        {
                            label: "Cube",
                            value: "Cube"
                        },
                        {
                            label: "Quack",
                            value: "Quack"
                        }
                    ]);

                const row = new ActionRowBuilder()
                    .addComponents(menu);

                await interaction.update({
                    embeds: [embed],
                    components: [row]
                });

                return;
            }


            // =========================
            // TICKET : ANNULER
            // =========================

            if (interaction.customId === "ticket_cancel") {

                await interaction.update({
                    content: "❌ Création du ticket annulée.",
                    embeds: [],
                    components: []
                });

                return;
            }


            // =========================
            // YOUTUBE : AJOUTER UNE VIDÉO
            // =========================

            if (interaction.customId === "youtube_add") {

                await interaction.showModal(
                    youtubeLink.create()
                );

                return;
            }


            // =========================
            // YOUTUBE : FERMER
            // =========================

            if (interaction.customId === "youtube_cancel") {

                await interaction.update({
                    content: "Panneau YouTube fermé.",
                    embeds: [],
                    components: []
                });

                return;
            }


            // =========================
            // YOUTUBE : PUBLIER MAINTENANT
            // =========================

            if (interaction.customId === "youtube_publish") {

                const embed = interaction.message.embeds[0];

                if (!embed || !embed.fields) {

                    await interaction.reply({
                        content:
                            "❌ Impossible de récupérer les informations de la vidéo.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                const linkField = embed.fields.find(
                    field => field.name === "🔗 Lien"
                );

                const messageField = embed.fields.find(
                    field => field.name === "✏️ Message personnalisé"
                );

                if (!linkField) {

                    await interaction.reply({
                        content:
                            "❌ Le lien YouTube est introuvable.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                const link = linkField.value.trim();

                const customMessage =
                    messageField?.value &&
                    messageField.value !==
                        "Aucun message personnalisé."
                        ? messageField.value
                        : "";

                const youtubeChannel =
                    interaction.client.channels.cache.get(
                        YOUTUBE_CHANNEL_ID
                    );

                if (!youtubeChannel) {

                    await interaction.reply({
                        content:
                            "❌ Impossible de trouver le salon #youtube.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                const messageContent =
                    "🚨 **Nouvelle vidéo de DrolfoamYT !** 🚨\n\n" +
                    "🎥 Une nouvelle vidéo est disponible !\n\n" +
                    (customMessage
                        ? `💬 ${customMessage}\n\n`
                        : "") +
                    `🔗 ${link}`;

                try {

                    await youtubeChannel.send({
                        content: messageContent
                    });

                    await interaction.update({
                        content:
                            "✅ La vidéo a été publiée avec succès dans #youtube !",
                        embeds: [],
                        components: []
                    });

                } catch (error) {

                    console.error(
                        "❌ Erreur lors de la publication YouTube :",
                        error
                    );

                    await interaction.update({
                        content:
                            "❌ Impossible de publier la vidéo. Vérifie que Drolfo-bot a bien accès au salon #youtube.",
                        embeds: [],
                        components: []
                    });

                }

                return;
            }


            // =========================
            // YOUTUBE : PROGRAMMER
            // =========================

            if (interaction.customId === "youtube_schedule") {

                const embed = interaction.message.embeds[0];

                if (!embed || !embed.fields) {

                    await interaction.reply({
                        content:
                            "❌ Impossible de récupérer les informations de la vidéo.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                const linkField = embed.fields.find(
                    field => field.name === "🔗 Lien"
                );

                const messageField = embed.fields.find(
                    field => field.name === "✏️ Message personnalisé"
                );

                if (!linkField) {

                    await interaction.reply({
                        content:
                            "❌ Le lien YouTube est introuvable.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                const link = linkField.value.trim();

                const message =
                    messageField?.value &&
                    messageField.value !==
                        "Aucun message personnalisé."
                        ? messageField.value
                        : "";

                // On garde les informations de la vidéo
                // pour les récupérer après le formulaire
                const modal =
                    youtubeSchedule.create(
                        link,
                        message
                    );

                await interaction.showModal(modal);

                return;
            }


            // =========================
            // YOUTUBE : VIDÉOS PROGRAMMÉES
            // =========================

            if (interaction.customId === "youtube_scheduled") {

                const videos = getVideos();

                if (videos.length === 0) {

                    const embed = new EmbedBuilder()
                        .setTitle("📅 Vidéos programmées")
                        .setDescription(
                            "Aucune vidéo programmée pour le moment."
                        );

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("youtube_back")
                                .setLabel("Retour")
                                .setStyle(
                                    ButtonStyle.Secondary
                                )
                        );

                    await interaction.update({
                        embeds: [embed],
                        components: [row]
                    });

                    return;
                }

                const embed =
                    new EmbedBuilder()
                        .setTitle("📅 Vidéos programmées")
                        .setDescription(
                            "Voici les vidéos qui seront publiées automatiquement :"
                        );

                const rows = [];

                for (
                    let i = 0;
                    i < videos.length && i < 5;
                    i++
                ) {

                    const video = videos[i];

                    const date =
                        new Date(video.publishAt);

                    embed.addFields({
                        name:
                            `🎥 Vidéo ${i + 1}`,
                        value:
                            `🔗 ${video.link}\n` +
                            `📅 ${date.toLocaleString(
                                "fr-FR",
                                {
                                    dateStyle: "short",
                                    timeStyle: "short"
                                }
                            )}\n` +
                            `🆔 ${video.id}`
                    });

                    rows.push(
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(
                                        `youtube_delete_${video.id}`
                                    )
                                    .setLabel(
                                        `Annuler vidéo ${i + 1}`
                                    )
                                    .setStyle(
                                        ButtonStyle.Danger
                                    )
                            )
                    );
                }

                rows.push(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("youtube_back")
                                .setLabel("Retour")
                                .setStyle(
                                    ButtonStyle.Secondary
                                )
                        )
                );

                await interaction.update({
                    embeds: [embed],
                    components: rows
                });

                return;
            }


            // =========================
            // YOUTUBE : SUPPRIMER
            // UNE VIDÉO PROGRAMMÉE
            // =========================

            if (
                interaction.customId.startsWith(
                    "youtube_delete_"
                )
            ) {

                const id =
                    interaction.customId.replace(
                        "youtube_delete_",
                        ""
                    );

                const removed =
                    removeVideo(id);

                if (!removed) {

                    await interaction.reply({
                        content:
                            "❌ Cette vidéo programmée n'existe plus.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                await interaction.update({
                    content:
                        "✅ La vidéo programmée a été annulée.",
                    embeds: [],
                    components: []
                });

                return;
            }


            // =========================
            // YOUTUBE : RETOUR
            // =========================

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
                            .setLabel("Publier une vidéo")
                            .setStyle(
                                ButtonStyle.Primary
                            ),

                        new ButtonBuilder()
                            .setCustomId("youtube_scheduled")
                            .setLabel(
                                "Gérer les vidéos programmées"
                            )
                            .setStyle(
                                ButtonStyle.Secondary
                            ),

                        new ButtonBuilder()
                            .setCustomId("youtube_cancel")
                            .setLabel("Fermer")
                            .setStyle(
                                ButtonStyle.Danger
                            )

                    );

                await interaction.update({
                    embeds: [embed],
                    components: [row]
                });

                return;
            }

        }


        // =========================
        // MENU DE VARIANTE
        // =========================

        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === "variant_choice") {

                const variante =
                    interaction.values[0];

                const modal =
                    ticketForm.createTicketForm(
                        variante
                    );

                await interaction.showModal(modal);

                return;
            }

        }


        // =========================
        // FORMULAIRES
        // =========================

        if (interaction.isModalSubmit()) {

            // =========================
            // FORMULAIRE TICKET
            // =========================

            if (
                interaction.customId.startsWith(
                    "ticket_form_"
                )
            ) {

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


            // =========================
            // FORMULAIRE YOUTUBE
            // =========================

            if (
                interaction.customId ===
                "youtube_link_modal"
            ) {

                const link =
                    interaction.fields.getTextInputValue(
                        "youtube_link"
                    ).trim();

                let message = "";

                try {

                    message =
                        interaction.fields.getTextInputValue(
                            "youtube_message"
                        ).trim();

                } catch {

                    message = "";

                }

                const youtubeRegex =
                    /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\//i;

                if (
                    !youtubeRegex.test(link)
                ) {

                    await interaction.reply({
                        content:
                            "❌ Le lien fourni ne semble pas être un lien YouTube valide.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                const embed =
                    new EmbedBuilder()
                        .setTitle(
                            "📺 Aperçu de la publication"
                        )
                        .setDescription(
                            "Vérifie les informations avant de publier."
                        )
                        .addFields(
                            {
                                name: "🔗 Lien",
                                value: link
                            },
                            {
                                name:
                                    "✏️ Message personnalisé",
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
                    flags: MessageFlags.Ephemeral
                });

                return;
            }


            // =========================
            // FORMULAIRE PROGRAMMATION
            // =========================

            if (
                interaction.customId.startsWith(
                    "youtube_schedule_modal"
                )
            ) {

                const date =
                    interaction.fields.getTextInputValue(
                        "schedule_date"
                    ).trim();

                const time =
                    interaction.fields.getTextInputValue(
                        "schedule_time"
                    ).trim();

                // Récupération du lien et du message
                // enregistrés dans le customId
                const parts =
                    interaction.customId.split("|");

                const link =
                    decodeURIComponent(
                        parts[1] || ""
                    );

                const message =
                    decodeURIComponent(
                        parts[2] || ""
                    );

                // Vérification de la date
                const dateTime =
                    new Date(
                        `${date}T${time}:00`
                    );

                if (
                    isNaN(
                        dateTime.getTime()
                    )
                ) {

                    await interaction.reply({
                        content:
                            "❌ La date ou l'heure est invalide.\n\nUtilise par exemple : **25/07/2026** et **20:30**.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                if (
                    dateTime.getTime() <=
                    Date.now()
                ) {

                    await interaction.reply({
                        content:
                            "❌ La date programmée doit être dans le futur.",
                        flags: MessageFlags.Ephemeral
                    });

                    return;
                }

                const video = {

                    id:
                        Date.now().toString(),

                    link: link,

                    message: message,

                    publishAt:
                        dateTime.toISOString(),

                    createdAt:
                        new Date().toISOString(),

                    createdBy:
                        interaction.user.id

                };

                addVideo(video);

                await interaction.reply({
                    content:
                        "✅ **Vidéo programmée avec succès !**\n\n" +
                        `📅 Date : **${date}**\n` +
                        `🕐 Heure : **${time}**\n` +
                        `🔗 ${link}`,
                    flags: MessageFlags.Ephemeral
                });

                return;
            }

        }

    }
};
