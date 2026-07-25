const fs = require("fs");
const path = require("path");

const YOUTUBE_CHANNEL_ID = "1523787199009783858";
const VIDEOS_FILE = path.join(__dirname, "scheduledVideos.json");

function getVideos() {
    try {
        if (!fs.existsSync(VIDEOS_FILE)) {
            return [];
        }

        const data = fs.readFileSync(
            VIDEOS_FILE,
            "utf8"
        );

        return JSON.parse(data);
    } catch (error) {
        console.error(
            "❌ Impossible de lire scheduledVideos.json :",
            error
        );

        return [];
    }
}

function saveVideos(videos) {
    fs.writeFileSync(
        VIDEOS_FILE,
        JSON.stringify(videos, null, 2),
        "utf8"
    );
}

function addVideo(video) {
    const videos = getVideos();

    videos.push(video);

    saveVideos(videos);

    return video;
}

function removeVideo(id) {
    const videos = getVideos();

    const newVideos = videos.filter(
        video => video.id !== id
    );

    if (newVideos.length === videos.length) {
        return false;
    }

    saveVideos(newVideos);

    return true;
}

function startScheduler(client) {

    console.log(
        "📅 Système de programmation YouTube activé !"
    );

    setInterval(
        async () => {

            try {

                const videos = getVideos();

                if (videos.length === 0) {
                    return;
                }

                const now = Date.now();

                const youtubeChannel =
                    await client.channels.fetch(
                        YOUTUBE_CHANNEL_ID
                    );

                if (!youtubeChannel) {
                    console.error(
                        "❌ Salon YouTube introuvable."
                    );

                    return;
                }

                for (
                    const video of videos
                ) {

                    const publishTime =
                        new Date(
                            video.publishAt
                        ).getTime();

                    if (
                        isNaN(publishTime)
                    ) {
                        console.error(
                            "❌ Date invalide pour la vidéo :",
                            video
                        );

                        removeVideo(
                            video.id
                        );

                        continue;
                    }

                    if (
                        publishTime <= now
                    ) {

                        console.log(
                            `📺 Publication programmée : ${video.link}`
                        );

                        const message =
                            "🚨 **Nouvelle vidéo de DrolfoamYT !** 🚨\n\n" +
                            "🎥 Une nouvelle vidéo est disponible !\n\n" +
                            (
                                video.message
                                    ? `💬 ${video.message}\n\n`
                                    : ""
                            ) +
                            `🔗 ${video.link}`;

                        try {

                            await youtubeChannel.send({
                                content: message
                            });

                            console.log(
                                "✅ Vidéo programmée publiée !"
                            );

                            removeVideo(
                                video.id
                            );

                        } catch (error) {

                            console.error(
                                "❌ Erreur lors de la publication programmée :",
                                error
                            );

                        }

                    }

                }

            } catch (error) {

                console.error(
                    "❌ Erreur du système de programmation YouTube :",
                    error
                );

            }

        },

        // Vérification toutes les 30 secondes
        30 * 1000
    );
}

module.exports = {
    getVideos,
    addVideo,
    removeVideo,
    startScheduler
};
