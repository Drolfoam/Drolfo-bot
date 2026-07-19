const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {

        // Bouton "J'ai compris"
        if (interaction.isButton()) {

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

                await interaction.reply({
                    content:
                        `✅ Variante sélectionnée : **${variante}**\n\n` +
                        "👻 Maintenant écris l'esprit que tu souhaites.",
                    ephemeral: true
                });

                return;
            }

        }

    }
};
