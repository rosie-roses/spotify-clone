import React, { useEffect, useState } from 'react'
import useSpotify from './useSpotify';

const useArtist = (artistId) => {
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchArtist = async () => {
            if (!artistId || !spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);
                const res = await spotifyApi.getArtist(artistId);
                setArtist(res.body);
            } catch (err) {
                console.error("Error fetching artist", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtist();
    }, [artistId, spotifyApi]);

    return { artist, loading, error };
};

export default useArtist;