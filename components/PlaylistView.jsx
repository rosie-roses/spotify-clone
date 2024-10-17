import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { shuffle } from 'lodash';
import Song from '@/components/Song';
import useSpotify from '@/hooks/useSpotify';

const colours = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500'
];

const PlaylistView = ({ globalPlaylistId, setGlobalCurrentSongId, setGlobalIsTrackPlaying, setView, setGlobalArtistId }) => {
    const { data: session } = useSession();
    const spotifyAPI = useSpotify();
    const [ playlistData, setPlaylistData ] = useState(null);
    const [ colour, setColour ] = useState(colours[0]);
    const [ opacity, setOpacity ] = useState(0);
    const [ textOpacity, setTextOpacity ] = useState(0); 

    function changeOpacity(scrollPos) {
        const offset = 300
        const textOffset = 10
        if (scrollPos < offset) {
            const newOpacity = 1 - ((offset - scrollPos) / offset);
            setOpacity(newOpacity);
            setTextOpacity(0);
        } else {
            const delta = scrollPos - offset;
            const newTextOpacity = 1 - ((textOffset - delta) / textOffset);
            setOpacity(1);
            setTextOpacity(newTextOpacity);
        }
    }

    useEffect(() => {
        if (spotifyAPI.getAccessToken()) {
            spotifyAPI.getPlaylist(globalPlaylistId).then((data) => {
                setPlaylistData(data.body);
            }).catch((err) => {
                console.log(`Error getting playlist ${globalPlaylistId}: `, err);
            });
        }
    }, [session, spotifyAPI, globalPlaylistId]);

    useEffect(() => {
        setColour(shuffle(colours).pop());
    }, [globalPlaylistId]);

  return (
    <div className='flex-grow h-screen'>
        <header style={{opacity: opacity}} className='text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-900 p-8 flex items-center font-bold'>
            <div style={{opacity: textOpacity}} className='flex items-center'>
                {<img className='h-8 w-8 mr-6' src={playlistData?.images?.[0]?.url} />}
                <p>{playlistData?.name}</p>
            </div>
        </header>
        <div onClick={() => signOut()} className='absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full  p-1 pr-2'>
            <img className='rounded-full w-7 h-7' src={session?.user.image} alt='profile pic' />
            <p className='text-sm'>Logout</p>
            <ChevronDownIcon className='h-5 w-5' />
        </div>
        <div onScroll={(e) => changeOpacity(e.target.scrollTop)} className='relative -top-20 h-screen overflow-y-scroll bg-black'>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${colour} h-80 text-white p-8`}>
                {<img className='h-44 w-44' src={playlistData?.images?.[0]?.url} />}
                <div>
                    <p className='text-sm font-bold'>Playlist</p>
                    <h1 className='text-2xl md:text-3xl lg:text-5xl font-extrabold'>{playlistData?.name}</h1>
                </div>
            </section>
            <div className='text-white px-8 flex flex-col space-y-1 pb-28'>
                {playlistData?.tracks.items.map((track, i) => {
                    return <Song 
                        key={track.track.id} 
                        serialNum={i} 
                        track={track.track} 
                        setGlobalCurrentSongId={setGlobalCurrentSongId} 
                        setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} 
                        setView={setView}
                        setGlobalArtistId={setGlobalArtistId}
                    />
                })}
            </div>
        </div>
    </div>
  )
}

export default PlaylistView;