import { PlayIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const Song = ({ serialNum, track, setGlobalCurrentSongId, setGlobalIsTrackPlaying, setView, setGlobalArtistId }) => {
    const { data: session } = useSession();
    const [ playHover, setPlayHover ] = useState(false);

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

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return (
            seconds == 60 ?
                (minutes + 1) + ":00" :
                minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        );
    }

    function selectArtist(artist) {
        setView("artist");
        setGlobalArtistId(artist.id);
    }

  return (
    <div onMouseEnter={() => setPlayHover(true)} onMouseLeave={() => setPlayHover(false)} className='grid grid-cols-2 text-neutral-400 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-default'>
        <div className='flex items-center space-x-4'>
            {playHover ? <PlayIcon onClick={async () => await playSong(track)} className='h-5 w-5 text-white' /> : <p className='w-5'>{serialNum + 1}</p>}
            {track?.album?.images[0]?.url && <img className='h-10 w-10' src={track.album.images[0].url} />}
            <div>
                <div className='w-36 lg:w-64'><div className='truncate text-white text-base'>{track.name}</div></div>
                <div className='w-36'><div className='truncate'>
                    {
                        track.artists.map((artist, i) => {
                            return (
                                <>
                                    <span onClick={() => selectArtist(artist)} className='hover:underline'>{artist.name}</span>
                                    <span>{ i != track.artists.length - 1 ? ', ' : null }</span>
                                </>
                            )
                        })
                    }
                </div></div>
            </div>
        </div>
        <div className='flex items-center justify-between ml-auto md:ml-0'>
            <div className='w-40 hidden md:inline'><div className='truncate'>{track.album.name}</div></div>
            <div>{millisToMinutesAndSeconds(track.duration_ms)}</div>
        </div>
    </div>
  )
}

export default Song;