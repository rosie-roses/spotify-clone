import React, { useEffect, useState } from 'react';
import useSpotify from './useSpotify';

const useArtistTopTracks = (artistId) => {
    const [topTracks, setTopTracks] = useState([]);
    const [loadingTopTracks, setLoadingTopTracks] = useState(true);
    const [errorTopTracks, setErrorTopTracks] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchTopTracks = async () => {
            if (!artistId || !spotifyApi.getAccessToken()) return;

            try {
                setLoadingTopTracks(true);
                const res = await spotifyApi.getArtistTopTracks(artistId, 'US');
                setTopTracks(res.body.tracks);
            } catch (err) {
                console.error("Error fetching artist's top tracks", err);
                setErrorTopTracks(err);
            } finally {
                setLoadingTopTracks(false);
            }
        };

        fetchTopTracks();
    }, [artistId, spotifyApi]);

    return { topTracks, loadingTopTracks, errorTopTracks };
};

export default useArtistTopTracks;