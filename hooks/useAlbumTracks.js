import React, { useEffect, useState } from 'react';
import useSpotify from './useSpotify';

const useAlbumTracks = (albumId) => {
    const [albumTracks, setAlbumTracks] = useState(null);
    const [loadingAlbumTracks, setLoadingAlbumTracks] = useState(true);
    const [errorAlbumTracks, setErrorAlbumTracks] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchAlbumTracks = async () => {
            if (!albumId || !spotifyApi.getAccessToken()) return;

            try {
                setLoadingAlbumTracks(true);
                const res = await spotifyApi.getAlbumTracks(albumId);
                setAlbumTracks(res.body);
            } catch (err) {
                console.error("Error fetching album tracks", err);
                setErrorAlbumTracks(err);
            } finally {
                setLoadingAlbumTracks(false);
            }
        };

        fetchAlbumTracks();
    }, [albumId, spotifyApi]);

    return { albumTracks, loadingAlbumTracks, errorAlbumTracks };
};

export default useAlbumTracks;