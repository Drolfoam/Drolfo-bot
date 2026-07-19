const { ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "createTicket",

    async execute(interaction) {

        const guild = interaction.guild;
        const user = interaction.user;

        const existing = guild.channels.cache.find(
            channel => channel.name === `ticket-${user.username.toLowerCase()}`
        );

        if (existing) {
            return interaction.reply({
                content: "❌ Tu as déjà un ticket ouvert.",
                ephemeral: true
            });
        }


        const ticket = await guild.channels.create({
            name: `ticket-${user.username}`,
            type: ChannelType.GuildText,

            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages
                    ]
                }
            ]
        });


        await interaction.reply({
            content: `✅ Ton ticket a été créé : ${ticket}`,
            ephemeral: true
        });


        await ticket.send(
            `🎫 Bienvenue ${user} !\n\n` +
            "Réponds aux questions du staff pour ta demande d'esprit."
        );

    }
};
