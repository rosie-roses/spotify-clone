import React, { useEffect, useState } from 'react';
import useArtist from '@/hooks/useArtist';
import useArtistTopTracks from '@/hooks/useArtistTopTracks';
import useSpotify from '@/hooks/useSpotify';
import { Button } from '@chakra-ui/react';
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { shuffle } from 'lodash';
import { useExtractColors } from 'react-extract-colors';
import Song from './Song';
import useArtistDiscography from '@/hooks/useArtistDiscography';
import useArtistRelated from '@/hooks/useArtistRelated';

const colours = [
    'indigo', 
    'blue', 
    'green', 
    'red', 
    'yellow',
    'pink', 
    'purple'
];

const Artist = ({ globalArtistid, globalIsTrackPlaying, setGlobalIsTrackPlaying, playURI, setPlayURI, deviceId, 
    setGlobalCurrentSongId, setView, setGlobalArtistId, setGlobalAlbumId }) => {
    const { artist, loading, error } = useArtist(globalArtistid);
    const { topTracks, loadingTopTracks, errorTopTracks } = useArtistTopTracks(globalArtistid);
    const { discography, loadingDiscography, errorDiscography } = useArtistDiscography(globalArtistid);
    const { relatedArtists, loadingRelatedArtists, errorRelatedArtists } = useArtistRelated(globalArtistid);
    const [headerGradient, setHeaderGradient] = useState(colours[0]);
    const [visibleTopTracks, setVisibleTopTracks] = useState(5);
    const [visibleAlbums, setVisibleAlbums] = useState(5);
    const [visibleRelatedArtists, setVisibleRelatedArtists] = useState(5); 
    const spotifyApi = useSpotify();
    const { dominantColor } = useExtractColors(artist?.images?.[0]?.url);

    useEffect(() => {
        setVisibleTopTracks(5);
        setVisibleAlbums(5);
        setVisibleRelatedArtists(5);
    }, [globalArtistid]);

    useEffect(() => {
        if (dominantColor) {
            setHeaderGradient(`linear-gradient(to bottom, ${dominantColor}, black)`);
        } else {
            const fallbackColor = shuffle(colours).pop();
            setHeaderGradient(`linear-gradient(to bottom, ${fallbackColor}, black)`);
        }
    }, [dominantColor]);

    const handlePlayClick = async (obj) => {
        if (deviceId) {
            if (globalIsTrackPlaying && playURI === obj.uri) {
                await spotifyApi.pause().then(() => setGlobalIsTrackPlaying(false)).catch(err => console.error('Error when pausing playback:', err));
            } else if (!globalIsTrackPlaying && playURI === obj.uri) {
                await spotifyApi.play({ device_id: deviceId }).then(() => setGlobalIsTrackPlaying(true)).catch(err => console.error('Error when resuming playback:', err));
            } else {
                await spotifyApi.play({ device_id: deviceId, context_uri: obj.uri }).then(() => {
                    setGlobalIsTrackPlaying(true);
                    setPlayURI(obj.uri);
                }).catch(err => console.error('Error when playing context URI:', err));
            }
        }
    };

    const loadMoreTopTracks = () => {
        setVisibleTopTracks((prevCount) => prevCount + 5);
    };

    const loadMoreAlbums = () => {
        setVisibleAlbums((prevCount) => prevCount + 5);
    };

    const loadMoreRelatedArtists = () => {
        setVisibleRelatedArtists((prevCount) => prevCount + 5); 
    };

    function selectArtist(artist) {
        setView("artist");
        setGlobalArtistId(artist.id);
    }

    function selectAlbum(album) {
        setView("album");
        setGlobalAlbumId(album.id);
    }

    return (
        <div className='w-screen h-screen overflow-y-scroll pb-28'>
            {loading && (<p className="text-gray-400 mt-3 p-8">Loading artist...</p>)}
            {error && (<p className="text-red-400 p-8">Error fetching artist: {error.message}</p>)}
            {!loading && !error && artist && (
                <div className='bg-black pb-8'>
                    <section style={{ background: headerGradient }} className={`flex flex-col md:flex-row items-center text-left md:items-end h-70 text-white p-8`}>
                        <div className='flex-shrink-0 mb-6 md:mb-0'>
                            <img className='h-44 w-44 rounded-full' src={artist.images?.[0]?.url} alt={artist.name} />
                        </div>
                        <div className='flex flex-col ml-0 md:ml-5 flex-grow'>
                            <p className='text-sm font-bold hidden md:flex'>Artist</p>
                            <div className="flex w-full items-center">
                                <div className="flex-grow pr-4">
                                    <h1 className='text-2xl md:text-3xl lg:text-5xl font-extrabold overflow-ellipsis'>{artist?.name}</h1>
                                </div>
                                <Button  
                                    onClick={() => {handlePlayClick(artist)}} 
                                    bg={'green.400'}
                                    rounded={'full'}
                                    width={70}
                                    height={70}
                                    className="flex-shrink-0" 
                                    _hover={{ bg: 'green.400' }}
                                >
                                    {globalIsTrackPlaying && playURI === artist.uri ? ( 
                                        <IconPlayerPauseFilled color='black' />
                                    ) : ( <IconPlayerPlayFilled color='black' />)}
                                </Button>
                            </div>
                        </div>
                    </section>
                    {!loadingTopTracks && !errorTopTracks && topTracks && (
                        <div className='space-y-4 mt-5'>
                            <h2 className='text-xl text-left font-bold text-white px-8'>Popular</h2>
                            <div className='text-white px-8 flex flex-col space-y-1 pb-6'>
                                {topTracks.slice(0, visibleTopTracks).map((track, i) => (
                                    <Song 
                                        key={track.id} 
                                        serialNum={i} 
                                        track={track} 
                                        setGlobalCurrentSongId={setGlobalCurrentSongId} 
                                        setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} 
                                        setPlayURI={setPlayURI}
                                        deviceId={deviceId}
                                        globalIsTrackPlaying={globalIsTrackPlaying}
                                        playURI={playURI}
                                        setView={setView}
                                        setGlobalArtistId={setGlobalArtistId}
                                    />
                                ))}
                                {topTracks.length > visibleTopTracks && (
                                <Button 
                                    size={'sm'}
                                    onClick={() => {loadMoreTopTracks()}} 
                                    cursor={'pointer'}
                                    className="text-sm hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors duration-200"
                                    colorScheme="gray"
                                    color={'text-neutral-300'}
                                    width={24}
                                >
                                    See More
                                </Button>
                            )}
                            </div>
                            
                        </div>
                    )}
                    {loadingDiscography && (<p className="text-gray-400 mt-3 p-8">Loading artist's discography...</p>)}
                    {errorDiscography && (<p className="text-red-400 p-8">Error fetching artist's discography: {error.message}</p>)}
                    {!loadingDiscography && !errorDiscography && discography && (
                        <div className='space-y-4 mt-5'>
                            <div className="flex justify-between items-center px-8">
                                <h2 className='text-xl font-bold text-white'>Discography</h2>
                                {discography.length > visibleAlbums && (
                                    <Button 
                                        size="sm" 
                                        onClick={() => {loadMoreAlbums()}} 
                                        cursor={'pointer'}
                                        className="text-sm hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors duration-200"
                                        colorScheme="gray"
                                        color={'text-neutral-300'}
                                    >
                                        See More
                                    </Button>
                                )}
                            </div>
                            <div className="flex overflow-x-scroll no-scrollbar space-x-4 px-8 pb-6">
                                {discography.slice(0, visibleAlbums).map((album) => (
                                    <div onClick={() => {selectAlbum(album)}} key={album.id} className='cursor-pointer relative group w-48 mb-2 bg-neutral-900 hover:bg-neutral-800 rounded-md p-4'>
                                        <div onClick={() => {handlePlayClick(album)}} className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl 
                                        shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-400 top-[124px] group-hover:top-[120px] right-6'>
                                            <IconPlayerPlayFilled className='h-6 w-6 text-black' />
                                        </div>
                                        <img className='w-40 h-40 mb-4' src={album?.images[0]?.url} alt={album.name} />
                                        <div className='text-base text-white mb-1 w-40 truncate'>{album.name}</div>
                                        <p className='text-sm text-neutral-400 w-40 capitalize'>{new Date(album.release_date).getFullYear() + ' • ' + album.album_type }</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!loadingRelatedArtists && !errorRelatedArtists && relatedArtists && (
                        <div className='space-y-4 mt-5'>
                            <div className="flex justify-between items-center px-8">
                                <h2 className='text-xl font-bold text-white'>Related Artists</h2>
                                {relatedArtists.length > visibleRelatedArtists && (
                                    <Button 
                                        size="sm" 
                                        onClick={() => {loadMoreRelatedArtists()}} 
                                        cursor={'pointer'}
                                        className="text-sm hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors duration-200"
                                        colorScheme="gray"
                                    >
                                        See More
                                    </Button>
                                )}
                            </div>
                            <div className="flex overflow-x-scroll no-scrollbar px-8 gap-4">
                                {relatedArtists.slice(0, visibleRelatedArtists).map((artist) => (
                                   <div onClick={() => {selectArtist(artist)}} key={artist.id} className='cursor-pointer relative group w-48 mb-2 bg-neutral-900 hover:bg-neutral-800 rounded-md p-4'>
                                   <div onClick={() => {handlePlayClick(artist)}} className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl 
                                   shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-400 top-[138px] group-hover:top-[132px] right-6'>
                                       <IconPlayerPlayFilled className='h-6 w-6 text-black' />
                                   </div>
                                        <img className='w-40 h-40 mb-4 rounded-full' src={artist?.images[0]?.url} />
                                        <p className='text-base text-white mb-1 w-40 truncate'>{artist.name}</p>
                                        <p className='text-sm text-neutral-400 w-40'>Artist</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!loading && !error && !artist && (
                <p className="text-gray-400 mt-3">No artist found.</p>
            )}
        </div>
    )
};

export default Artist;
