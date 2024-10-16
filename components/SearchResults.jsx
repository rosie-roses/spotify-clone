import { PlayIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React from 'react'

const SearchResults = ({ topPlaylist, playlists, tracks, artists, setView, setGlobalPlaylistId, setGlobalCurrentSongId, setGlobalIsTrackPlaying, setGlobalArtistId }) => {
    const { data: session } = useSession();

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return (
            seconds == 60 ?
                (minutes + 1) + ":00" :
                minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        );
    }

    async function playSong(track) {
        if (session && session.accessToken) {
            setGlobalCurrentSongId(track.id);
            setGlobalIsTrackPlaying(true);
            const res = await fetch(`https://api.spotify.com/v1/me/player/play`, {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${session.accessToken}`
                },
                body: JSON.stringify({
                    uris: [track.uri]
                })
            });
        }
    }

    function selectPlaylist(playlist) {
        setView("playlist");
        setGlobalPlaylistId(playlist.id);
    }

    function selectArtist(artist) {
        setView("artist");
        setGlobalArtistId(artist.id);
    }

  return (
    <div className='flex flex-col gap-8 px-8 h-screen overflow-y-scroll'>
        <div className='grid grid-cols-2'>
            <div className='space-y-4'>
                <h2 className='text-xl font-bold text-white'>Top Result</h2>
                <div className='h-64 pr-8'>
                    <div onClick={() => selectPlaylist(topPlaylist)} className='cursor-pointer relative group h-64 w-full bg-neutral-800 hover:bg-neutral-700 p-4 flex flex-col gap-6 rounded-md transition duration-500'>
                        <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 bottom-6 group-hover:bottom-8 right-8'>
                            <PlayIcon className='h-6 w-6 text-black' />
                        </div>
                        {topPlaylist && <>
                            <img className='h-28 w-28 rounded' src={topPlaylist.images[0].url} />
                            <p className='text-3xl font-bold text-white'><div className='truncate'>{topPlaylist.name}</div></p>
                            <p className='text-sm text-neutral-400'>By {topPlaylist.owner.display_name} <span className='rounded-full bg-neutral-900 text-white font-bold ml-4 py-1 px-4'>Playlist</span></p>
                        </>}
                    </div>
                </div>
            </div>
            <div className='space-y-4'>
                <h2 className='text-xl font-bold text-white'>Top Songs</h2>
                <div className='flex flex-col'>
                    {
                        tracks.slice(0, 4).map((track) => {
                            return <div onClick={() => playSong(track)} key={track.id} className='cursor-default w-full h-16 px-4 rounded-md flex items-center gap-4 hover:bg-neutral-700'>
                                <img className='h-10 w-10' src={track.album.images[0].url} />
                                <div>
                                    <p className='text-white'>{track.name}</p>
                                    <p className='text-sm text-neutral-400'>{track.artists[0].name}</p>
                                </div>
                                <div className='flex-grow flex items-center justify-end'>
                                    <p className='text-sm text-neutral-400'>{millisToMinutesAndSeconds(track.duration_ms)}</p>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
        <div className='space-y-4'>
            <h2 className='text-xl font-bold text-white'>Artists</h2>
            <div className='flex flex-wrap gap-4'>
                {
                    artists.slice(0, 4).map((artist) => {
                        return <div onClick={() => selectArtist(artist)} key={artist.id} className='cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4'>
                                <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl 
                shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[156px] group-hover:top-[152px] right-6'>
                                    <PlayIcon className='h-6 w-6 text-black'></PlayIcon>
                                </div>
                                <img className='w-48 h-48 mb-4 rounded-full' src={artist.images[0].url} />
                                <p className='text-base text-white mb-1 w-48'><div className='truncate'>{artist.name}</div></p>
                                <p className='text-sm text-neutral-400 mb-8 w-48'><div className='truncate'>Artist</div></p>
                            </div>
                    })
                }
            </div>
        </div>
        <div className='space-y-4 mb-48'>
            <h2 className='text-xl font-bold text-white'>Playlists</h2>
            <div className='flex flex-wrap gap-4'>
            {
                playlists.splice(0, 4).map((playlist) => {
                return <div onClick={() => selectPlaylist(playlist)} key={playlist.id} className='cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4'>
                    <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl 
                    shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[156px] group-hover:top-[152px] right-6'>
                        <PlayIcon className='h-6 w-6 text-black'></PlayIcon>
                    </div>
                    <img className='w-48 h-48 mb-4' src={playlist.images[0].url} />
                    <p className='text-base text-white mb-1 w-48'><div className='truncate'>{playlist.name}</div></p>
                    <p className='text-sm text-neutral-400 mb-8 w-48'><div className='truncate'>By {playlist.owner.display_name}</div></p>
                </div>
                })
            }
            </div>
        </div>
    </div>
  )
}

export default SearchResults;