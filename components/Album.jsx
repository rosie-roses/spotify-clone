import useAlbum from '@/hooks/useAlbum';
import useAlbumTracks from '@/hooks/useAlbumTracks';
import { Button } from '@chakra-ui/react';
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { shuffle } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useExtractColors } from 'react-extract-colors';
import AlbumTrack from './AlbumTrack';
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

const Album = ({ globalAlbumId, setGlobalCurrentSongId, globalIsTrackPlaying, setGlobalIsTrackPlaying, setView, setGlobalArtistId,
    playURI, setPlayURI, deviceId
 }) => {
    const { album, loading, error } = useAlbum(globalAlbumId);
    const [headerGradient, setHeaderGradient] = useState(colours[0]);
    const { dominantColor } = useExtractColors(album?.images?.[0]?.url);
    const { albumTracks, loadingAlbumTracks, errorAlbumTracks } = useAlbumTracks(globalAlbumId);
    const spotifyApi = useSpotify();

    useEffect(() => {
        if (dominantColor) {
            setHeaderGradient(`linear-gradient(to bottom, ${dominantColor}, black)`);
        } else {
            const fallbackColor = shuffle(colours).pop();
            setHeaderGradient(`linear-gradient(to bottom, ${fallbackColor}, black)`);
        }
    }, [dominantColor]);

    const handlePlayClick = async (album) => {
        if (deviceId) {
            if (globalIsTrackPlaying && playURI === album.uri) {
                await spotifyApi.pause().then(() => setGlobalIsTrackPlaying(false)).catch(err => console.error('Error when pausing playback:', err));
            } else if (!globalIsTrackPlaying && playURI === album.uri) {
                await spotifyApi.play({ device_id: deviceId }).then(() => setGlobalIsTrackPlaying(true)).catch(err => console.error('Error when resuming playback:', err));
            } else {
                await spotifyApi.play({ device_id: deviceId, context_uri: album.uri }).then(() => {
                    setGlobalIsTrackPlaying(true);
                    setPlayURI(album.uri);
                }).catch(err => console.error('Error when playing context URI:', err));
            }
        }
    };

    return (
        <div className='w-screen h-screen overflow-y-scroll'>
            {loading && (<p className="text-gray-400 mt-3 p-8">Loading album...</p>)}
            {error && (<p className="text-red-400 p-8">Error fetching album: {error.message}</p>)}
            {!loading && !error && album && (
                <div className='bg-black pb-8'>
                    <section style={{ background: headerGradient }} className={`flex flex-col md:flex-row items-center text-left md:items-end h-70 text-white p-8`}>
                        <div className='flex-shrink-0 mb-6 md:mb-0'>
                            <img className='h-44 w-44' src={album.images?.[0]?.url} alt={album.name} />
                        </div>
                        <div className='flex flex-col ml-0 md:ml-5 flex-grow'>
                            <p className='text-sm font-bold hidden md:flex capitalize'>{album.album_type}</p>
                            <div className="flex w-full items-center">
                                <div className="flex-grow pr-4">
                                    <h1 className='text-2xl md:text-3xl lg:text-5xl font-extrabold overflow-ellipsis'>{album?.name}</h1>
                                </div>
                                <Button  
                                    onClick={() => {handlePlayClick(album)}} 
                                    bg={'green.400'}
                                    rounded={'full'}
                                    width={70}
                                    height={70}
                                    className="flex-shrink-0" 
                                    _hover={{ bg: 'green.400' }}
                                >
                                    {globalIsTrackPlaying && playURI === album.uri ? ( 
                                        <IconPlayerPauseFilled color='black' />
                                    ) : ( <IconPlayerPlayFilled color='black' />)}
                                </Button>
                            </div>
                        </div>
                    </section>
                    <div className='text-white px-8 flex flex-col space-y-1 pb-5'>
                        {loadingAlbumTracks && (<p className="text-gray-400 mt-3 p-8">Loading album tracks...</p>)}
                        {errorAlbumTracks && (<p className="text-red-400 p-8">Error fetching album tracks: {error.message}</p>)}
                        {!loadingAlbumTracks && !errorAlbumTracks && albumTracks && (
                            albumTracks.items?.map((track) => (
                                <AlbumTrack
                                    trackNum={track.track_number}
                                    trackId={track.id}
                                    trackName={track.name}
                                    artists={track.artists}
                                    duration_ms={track.duration_ms}
                                    trackURI={track.uri}
                                    globalIsTrackPlaying={globalIsTrackPlaying}
                                    playURI={playURI}
                                    setView={setView}
                                    setGlobalArtistId={setGlobalArtistId}
                                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                                    setGlobalCurrentSongId={setGlobalCurrentSongId}
                                    setPlayURI={setPlayURI}
                                    deviceId={deviceId}
                                />
                            ))
                        )}
                        {!loadingAlbumTracks && !errorAlbumTracks && !albumTracks && (
                            <p className="text-gray-400 mt-3">No album tracks found.</p>
                        )}
                    </div>
                    <div className='text-neutral-400 px-8 pb-28 w-full'>
                        <div className='text-sm mb-2'>
                            {new Date(album?.release_date).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                        </div>
                        {
                            album?.copyrights?.map((copyright) => {
                                return <p className='text-xs'>{copyright.text}</p>
                            })
                        }
                    </div>
                </div>
            )}
            {!loading && !error && !album && (
                <p className="text-gray-400 mt-3">No album found.</p>
            )}
            </div>
    )
}

export default Album;