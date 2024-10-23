import { useEffect, useState } from 'react';
import useSpotify from './useSpotify';

const usePlaylistsByCategory = () => {
    const [playlistsByCategory, setPlaylistsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchPlaylistsByCategory = async () => {
            if (!spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);

                // Fetch categories
                const categoriesRes = await spotifyApi.getCategories();
                const categories = categoriesRes.body.categories.items;

                const playlists = {};

                // Fetch playlists for each category
                for (const category of categories) {
                    const playlistsRes = await spotifyApi.getPlaylistsForCategory(category.id);
                    playlists[category.id] = {
                        categoryName: category.name,
                        playlists: playlistsRes.body.playlists.items,
                    };
                }

                setPlaylistsByCategory(playlists);
            } catch (err) {
                console.error("Error fetching playlists by category", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistsByCategory();
    }, [spotifyApi]);

    return { playlistsByCategory, loading, error };
};

export default usePlaylistsByCategory;