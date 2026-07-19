const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {

        if (interaction.isButton()) {

            if (interaction.customId === "ticket_confirm") {

                const embed = new EmbedBuilder()
                    .setTitle("🎫 Création du ticket Esprit")
                    .setDescription(
                        "Choisis ta variante d'esprit :"
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
            }


            if (interaction.customId === "ticket_cancel") {

                await interaction.update({
                    content: "❌ Création du ticket annulée.",
                    embeds: [],
                    components: []
                });

            }

        }

    }
};
