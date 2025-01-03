module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    let [type, index] = data.inside.splits;
    
    const manager = d.client.shoukaku;
    if (!manager) return d.aoiError.fnError(d, "custom", {}, `Voice manager is not defined.`);
    
    const player = d.client.queue.get(d.guild.id);
    if (!player) return d.aoiError.fnError(d, "custom", {}, `There is no player for this guild.`);

    const getResult = (res) => {
        if (!res) return null;
        const trackInfo = res;
        const requester = trackInfo?.requester;
        const pluginInfo = trackInfo?.plugininfo;
        
        const trackData = {
            title: trackInfo.title,
            artworkUrl: trackInfo.artworkUrl,
            artwork: trackInfo.artworkUrl,
            thumbnail: trackInfo.artworkUrl,
            url: trackInfo.uri,
            uri: trackInfo.uri,
            duration: d.client.music.utils.formatTime(trackInfo.length),
            author: trackInfo.author,
            sourceName: trackInfo.sourceName,
            source: trackInfo.sourceName,
            platform: trackInfo.sourceName,
            identifier: trackInfo.identifier,
            isSeekable: trackInfo.isSeekable,
            isStream: trackInfo.isStream,
            isrc: trackInfo.isrc || 'N/A',
            durationMs: trackInfo.length || 'N/A',
            queueLength: player.queue.length || 'N/A',
            albumName: pluginInfo?.albumName,
            albumUrl: pluginInfo?.albumUrl,
            previewUrl: pluginInfo?.previewUrl,
            isPreview: pluginInfo?.isPreview,
            artist: trackInfo.author,
            'artist.artworkUrl': pluginInfo?.artistArtworkUrl,
            'artist.url': pluginInfo?.artistUrl,
            'requester.username': requester.username,
            'requester.globalName': requester.globalName,
            'requester.id': requester.id,
            'requester.avatar': requester.avatar,
            'requester.banner': requester.banner,
            'requester.mention': requester.id ? `<@${requester.id}>` : null
        };

        return trackData[type];
    };
    
    if (index && !isNaN(index) && index > 0) {
        const res = player.queue[(index - 1)]?.info;
        data.result = getResult(res);
    } else {
        const res = player.current?.info;
        if (!res) return d.aoiError.fnError(d, "custom", {}, `There is no song currently playing.`);
        data.result = getResult(res);
    }

    return {
        code: d.util.setCode(data)
    };
};
