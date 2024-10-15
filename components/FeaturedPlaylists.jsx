import { PlayIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const FeaturedPlaylists = ({ setView, setGlobalPlaylistId }) => {
    const { data: session } = useSession();
    const [ playlists, setPlaylists ] = useState([]);

    useEffect(() => {
        async function getPlaylists() {
            if (session && session.accessToken) {
                const res = await fetch('https://api.spotify.com/v1/browse/featured-playlists?' + new URLSearchParams({
                    country: 'US'
                }), {
                    headers: {
                        authorization: `Bearer ${session.accessToken}`
                    }
                });
                const data = await res.json();
                setPlaylists(data.playlists.items);
            }
        }
        getPlaylists();
    }, [session]);

    function selectPlaylist(playlist) {
      setView("playlist");
      setGlobalPlaylistId(playlist.id);
    }

  return (
    <div className='flex flex-col gap-4 px-8 h-screen overflow-y-scroll'>
        <h2 className='text-xl font-bold text-white'>Featured Playlists</h2>
        <div className='flex flex-wrap gap-6 mb-48'>
        {
            playlists.map((playlist) => {
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
  )
}

export default FeaturedPlaylists;