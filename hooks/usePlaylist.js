import React, { useEffect, useState } from 'react'
import useSpotify from './useSpotify';

const usePlaylist = (playlistId) => {
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchPlaylist = async () => {
            if (!playlistId || !spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);
                const res = await spotifyApi.getPlaylist(playlistId);
                setPlaylist(res.body);
            } catch (err) {
                console.error("Error fetching playlist", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId, spotifyApi]);

    return { playlist, loading, error };
};

export default usePlaylist;