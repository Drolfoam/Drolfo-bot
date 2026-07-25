const {
    EmbedBuilder
} = require("discord.js");

const {
    getVideos,
    removeVideo
} = require("./scheduledVideos");

const YOUTUBE_CHANNEL_ID = "1523787199009783858";

function startYoutubeScheduler(client) {

    console.log("📅 Système de programmation YouTube activé !");

    // Vérification toutes les 30 secondes
    setInterval(async () => {

        const videos = getVideos();

        if (videos.length === 0) {
            return;
        }

        const now = Date.now();

        for (const video of videos) {

            if (!video.publishAt) {
                continue;
            }

            const publishTime =
                new Date(video.publishAt).getTime();

            if (isNaN(publishTime)) {
                console.error(
                    `❌ Date invalide pour la vidéo ${video.id}`
                );

                continue;
            }

            // L'heure de publication n'est pas encore arrivée
            if (publishTime > now) {
                continue;
            }

            try {

                const channel =
                    await client.channels.fetch(
                        YOUTUBE_CHANNEL_ID
                    );

                if (!channel) {
                    console.error(
                        "❌ Salon YouTube introuvable."
                    );

                    continue;
                }

                const messageContent =
                    "🚨 **Nouvelle vidéo de DrolfoamYT !** 🚨\n\n" +
                    "🎥 Une nouvelle vidéo est disponible !\n\n" +
                    (
                        video.message
                            ? `💬 ${video.message}\n\n`
                            : ""
                    ) +
                    `🔗 ${video.link}`;

                await channel.send({
                    content: messageContent
                });

                console.log(
                    `✅ Vidéo programmée publiée : ${video.link}`
                );

                // Supprime la vidéo de la liste
                // après sa publication
                removeVideo(video.id);

            } catch (error) {

                console.error(
                    "❌ Erreur lors de la publication d'une vidéo programmée :",
                    error
                );

            }

        }

    }, 30000);
}

module.exports = {
    startYoutubeScheduler
};
