const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {

    async execute(interaction, data) {

        const guild = interaction.guild;
        const user = interaction.user;


        // Vérifie si un ticket existe déjà
        const existing = guild.channels.cache.find(
            channel => channel.name === `ticket-${user.username.toLowerCase()}`
        );


        if (existing) {
            return interaction.reply({
                content: "❌ Tu as déjà un ticket ouvert.",
                ephemeral: true
            });
        }



        // Création du salon
        const ticket = await guild.channels.create({

            name: `ticket-${user.username}`,

            type: ChannelType.GuildText,


            permissionOverwrites: [

                {
                    id: guild.roles.everyone.id,

                    deny: [
                        PermissionFlagsBits.ViewChannel
                    ]
                },


                {
                    id: user.id,

                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                }

            ]

        });



        const embed = new EmbedBuilder()

            .setTitle("🎫 Nouveau ticket Esprit")

            .setDescription(

                `👤 Client : ${user}\n\n` +

                `🌟 Variante : ${data.variante}\n` +

                `👻 Esprit : ${data.esprit}\n` +

                `🎮 Pseudo Epic : ${data.pseudo}\n` +

                `🕒 Disponibilités : ${data.dispo}`

            )

            .setTimestamp();



        await ticket.send({
            content: `${user} Bienvenue dans ton ticket !`,
            embeds: [embed]
        });



        await interaction.reply({

            content: `✅ Ton ticket a été créé : ${ticket}`,

            ephemeral: true

        });

    }

};
