const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const ticketForm = require("../modals/ticketForm");
const createTicket = require("../ticketSystem/createTicket");


module.exports = {

    name: "interactionCreate",


    async execute(interaction) {


        // Gestion des boutons
        if (interaction.isButton()) {


            // Bouton confirmer
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



            // Bouton annuler
            if (interaction.customId === "ticket_cancel") {


                await interaction.update({

                    content: "❌ Création du ticket annulée.",

                    embeds: [],

                    components: []

                });


                return;

            }

        }




        // Choix de la variante
        if (interaction.isStringSelectMenu()) {


            if (interaction.customId === "variant_choice") {


                const variante = interaction.values[0];


                const modal = ticketForm.createTicketForm(variante);


                await interaction.showModal(modal);


                return;

            }

        }




        // Formulaire terminé
        if (interaction.isModalSubmit()) {


            if (interaction.customId.startsWith("ticket_form_")) {


                const variante = interaction.customId.replace(
                    "ticket_form_",
                    ""
                );


                const esprit = interaction.fields.getTextInputValue(
                    "esprit"
                );


                const pseudo = interaction.fields.getTextInputValue(
                    "pseudo_epic"
                );


                const dispo = interaction.fields.getTextInputValue(
                    "disponibilite"
                );



                await createTicket.execute(interaction, {

                    variante: variante,

                    esprit: esprit,

                    pseudo: pseudo,

                    dispo: dispo

                });


                return;

            }

        }

    }

};
