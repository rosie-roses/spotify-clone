import React, { useEffect, useState } from 'react'
import useSpotify from './useSpotify';

const useAlbum = (albumId) => {
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!albumId || !spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);
                const res = await spotifyApi.getAlbum(albumId);
                setAlbum(res.body);
            } catch (err) {
                console.error("Error fetching album", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [albumId, spotifyApi]);

    return { album, loading, error };
};

export default useAlbum;