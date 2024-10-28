import React, { useEffect, useState } from 'react'
import useSpotify from './useSpotify';

const useArtistRelated = (artistId) => {
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [loadingRelatedArtists, setLoadingRelatedArtists] = useState(true);
    const [errorRelatedArtists, setErrorRelatedArtists] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchRelatedArtists = async () => {
            if (!artistId || !spotifyApi.getAccessToken()) return;

            try {
                setLoadingRelatedArtists(true);
                const res = await spotifyApi.getArtistRelatedArtists(artistId);
                setRelatedArtists(res.body.artists);
            } catch (err) {
                console.error("Error fetching artist's related artists", err);
                setErrorRelatedArtists(err);
            } finally {
                setLoadingRelatedArtists(false);
            }
        };

        fetchRelatedArtists();
    }, [artistId, spotifyApi]);

    return { relatedArtists, loadingRelatedArtists, errorRelatedArtists };
};

export default useArtistRelated;