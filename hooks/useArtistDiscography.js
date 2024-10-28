import React, { useEffect, useState } from 'react';
import useSpotify from './useSpotify';

const useArtistDiscography = (artistId) => {
    const [discography, setDiscography] = useState([]);
    const [loadingDiscography, setLoadingDiscography] = useState(true);
    const [errorDiscography, setErrorDiscography] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchDiscography = async () => {
            if (!artistId || !spotifyApi.getAccessToken()) return;

            try {
                setLoadingDiscography(true);
                const res = await spotifyApi.getArtistAlbums(artistId);
                setDiscography(res.body.items);
            } catch (err) {
                console.error("Error fetching artist's discography", err);
                setErrorDiscography(err);
            } finally {
                setLoadingDiscography(false);
            }
        };

        fetchDiscography();
    }, [artistId, spotifyApi]);

    return { discography, loadingDiscography, errorDiscography };
};

export default useArtistDiscography;