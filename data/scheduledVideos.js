const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "data");
const dataFile = path.join(dataFolder, "scheduledVideos.json");

function ensureDataFile() {
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(
            dataFile,
            JSON.stringify({ videos: [] }, null, 2)
        );
    }
}

function getVideos() {
    ensureDataFile();

    try {
        const data = JSON.parse(
            fs.readFileSync(dataFile, "utf8")
        );

        if (!Array.isArray(data.videos)) {
            return [];
        }

        return data.videos;
    } catch (error) {
        console.error(
            "❌ Impossible de lire les vidéos programmées :",
            error
        );

        return [];
    }
}

function saveVideos(videos) {
    ensureDataFile();

    fs.writeFileSync(
        dataFile,
        JSON.stringify(
            {
                videos: videos
            },
            null,
            2
        )
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

    saveVideos(newVideos);

    return newVideos.length !== videos.length;
}

function updateVideo(id, updates) {
    const videos = getVideos();

    const index = videos.findIndex(
        video => video.id === id
    );

    if (index === -1) {
        return null;
    }

    videos[index] = {
        ...videos[index],
        ...updates
    };

    saveVideos(videos);

    return videos[index];
}

module.exports = {
    getVideos,
    saveVideos,
    addVideo,
    removeVideo,
    updateVideo
};
