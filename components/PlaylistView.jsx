import usePlaylist from '@/hooks/usePlaylist';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useExtractColors } from 'react-extract-colors';
import Song from './Song';
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { Button } from '@chakra-ui/react';
import useSpotify from '@/hooks/useSpotify';

const colours = [
    'indigo',
    'blue',
    'green',
    'red',
    'yellow',
    'pink',
    'purple'
];

const PlaylistView = ({ setView, globalPlaylistId, setGlobalCurrentSongId, setGlobalIsTrackPlaying, setPlayURI, deviceId, 
    globalIsTrackPlaying, playURI, setGlobalArtistId }) => {
    const { playlist, loading, error } = usePlaylist(globalPlaylistId); 
    const [ headerGradient, setHeaderGradient ] = useState(colours[0]);
    const spotifyApi = useSpotify();

    const { dominantColor } = useExtractColors(playlist?.images?.[0]?.url);

    useEffect(() => {
        if (dominantColor) {
            setHeaderGradient(
                `linear-gradient(to bottom, ${dominantColor}, black)`
            );
        } else {
            const fallbackColor = shuffle(colours).pop();
            setHeaderGradient(`linear-gradient(to bottom, ${fallbackColor}, black)`);
        }
    }, [dominantColor]);

    const handlePlayClick = async () => {
        if (deviceId) {
            if (globalIsTrackPlaying && playURI === playlist.uri) {
                // Pause if the playlist context is already playing
                await spotifyApi.pause().then(() => {
                    setGlobalIsTrackPlaying(false);
                }).catch((err) => {
                    console.error('Error when pausing playback: ', err);
                });
            } else if (!globalIsTrackPlaying && playURI === playlist.uri) {
                // Resume if the same playlist context is paused
                await spotifyApi.play({ device_id: deviceId }).then(() => {
                    setGlobalIsTrackPlaying(true);
                }).catch((err) => {
                    console.error('Error when resuming playback: ', err);
                });
            } else {
                // Play new playlist context if it's different or stopped
                await spotifyApi.play({ device_id: deviceId, context_uri: playlist.uri }).then(() => { 
                    setGlobalIsTrackPlaying(true);
                    setPlayURI(playlist.uri);
                }).catch((err) => {
                    console.error('Error when playing context URI: ', err);
                });
            }
        }
    };

    return (
        <div className='w-screen h-screen overflow-y-scroll'>
            {loading && (<p className="text-gray-400 mt-3 p-8">Loading playlist...</p>)}
            {error && (<p className="text-red-400 p-8">Error fetching playlist: {error.message}</p>)}
            {!loading && !error && playlist && (
                <div>
                    <div className='h-screen overflow-y-scroll bg-black'>
                        <section style={{ background: headerGradient }} className={`flex flex-col md:flex-row items-center text-left md:items-end h-70 text-white p-8`}>
                            <div className='flex-shrink-0 mb-6 md:mb-0'>
                                <img className='h-44 w-44' src={playlist.images?.[0]?.url} alt={playlist.name} />
                            </div>
                            <div className='flex flex-col ml-0 md:ml-5 flex-grow'>
                                <p className='text-sm font-bold hidden md:flex'>Playlist</p>
                                <div className="flex w-full items-center">
                                    <div className="flex-grow pr-4">
                                        <h1 className='text-2xl md:text-3xl lg:text-5xl font-extrabold overflow-ellipsis'>
                                            {playlist?.name}
                                        </h1>
                                    </div>
                                    <Button  
                                        onClick={handlePlayClick} 
                                        bg={'green.500'}
                                        rounded={'full'}
                                        width={70}
                                        height={70}
                                        className="flex-shrink-0" 
                                        _hover={{ bg: 'green.500' }}
                                    >
                                        {globalIsTrackPlaying && playURI === playlist.uri ? ( 
                                            <IconPlayerPauseFilled color='black' />
                                        ) : ( <IconPlayerPlayFilled color='black' />)}
                                    </Button>
                                </div>
                            </div>
                        </section>
                        <div className='text-white px-8 flex flex-col space-y-1 pb-28'>
                            {playlist?.tracks?.items?.map((track, i) => {
                                return <Song 
                                    key={track.track?.id} 
                                    serialNum={i} 
                                    track={track.track} 
                                    setGlobalCurrentSongId={setGlobalCurrentSongId} 
                                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} 
                                    setPlayURI={setPlayURI}
                                    deviceId={deviceId}
                                    globalIsTrackPlaying={globalIsTrackPlaying}
                                    playURI={playURI}
                                    setView={setView}
                                    setGlobalArtistId={setGlobalArtistId}
                                />
                            })}
                        </div>
                    </div>
                </div>
            )}
            {!loading && !error && !playlist && (
                <p className="text-gray-400 mt-3">No playlist found.</p>
            )}
        </div>
    )
}

export default PlaylistView;