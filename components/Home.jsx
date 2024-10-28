import React, { useState } from 'react';
import usePlaylistsByCategory from '@/hooks/usePlaylistsByCategory';
import { Button, Image } from '@chakra-ui/react';

const Home = ({ setView, setGlobalPlaylistId }) => {
    const { playlistsByCategory, loading, error } = usePlaylistsByCategory();
    const [visiblePlaylists, setVisiblePlaylists] = useState({});

    const loadMorePlaylists = (categoryId) => {
        setVisiblePlaylists((prev) => {
            const newVisible = { ...prev };
            const currentCount = newVisible[categoryId] || 5; // default to showing 5 playlists initially
            newVisible[categoryId] = currentCount + 5; // load 5 more playlists on "See More"
            return newVisible;
        });
    };

    return (
        <div className='w-screen h-screen overflow-y-scroll p-8 pb-20'>
            <h1 className="text-2xl text-neutral-300 font-bold mb-8 text-left">Playlists by Category</h1>

            {loading && (<p className="text-neutral-400 mt-3">Loading playlists...</p>)}
            {error && (<p className="text-red-400">Error fetching playlists: {error.message}</p>)}

            {!loading && !error && Object.keys(playlistsByCategory).length > 0 && (
                Object.values(playlistsByCategory).map((category) => {
                    const visibleCount = visiblePlaylists[category.categoryName] || 5;

                    return (
                        <div key={category.categoryName} className="mb-10">
                            <div className="flex justify-between items-center mb-2 text-neutral-300">
                                <h2 className="text-xl font-semibold">{category.categoryName}</h2>
                                {category.playlists.length > visibleCount && (
                                    <Button 
                                        size="sm" 
                                        onClick={() => loadMorePlaylists(category.categoryName)} 
                                        className="text-sm hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors duration-200"
                                        color={'text-neutral-300'}
                                    >
                                        See More
                                    </Button>
                                )}
                            </div>

                            <div className="flex overflow-x-scroll no-scrollbar space-x-4">
                                {category.playlists.slice(0, visibleCount).map((playlist, i) => (
                                    <div 
                                        key={`${playlist.id}-${i}`} 
                                        className="w-48 flex-none mt-2 mb-2 bg-neutral-900 rounded-md cursor-pointer text-neutral-300 hover:bg-neutral-800 hover:text-white p-4"
                                        onClick={() => {
                                            setView('playlist');
                                            setGlobalPlaylistId(playlist.id);
                                        }}
                                    >
                                        <Image src={playlist.images[0]?.url} alt={playlist.name} className="rounded mb-2"/>
                                        <div className="truncate">{playlist.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}

            {!loading && !error && Object.keys(playlistsByCategory).length === 0 && (
                <p className="text-neutral-400 mt-3">No playlists found.</p>
            )}
        </div>
    );
};

export default Home;
