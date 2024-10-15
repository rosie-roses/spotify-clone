import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import FeaturedPlaylists from './FeaturedPlaylists';
import SearchResults from './SearchResults';

const Search = ({ setView, setGlobalPlaylistId, setGlobalCurrentSongId, setGlobalIsTrackPlaying }) => {
  const { data: session } = useSession();
  const [ searchData, setSearchData ] = useState(null);
  const [ inputValue, setInputValue ] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  async function updateSearchResults(query) {
    const res = await fetch(`https://api.spotify.com/v1/search?` + new URLSearchParams({
      q: query,
      type: ['artist', 'playlist', 'track']
    }), {
      headers: {
        authorization: `Bearer ${session.accessToken}`
      }
    });
    const data = await res.json();
    setSearchData(data);
  }

  return (
    <div className='flex-grow h-screen'>
      <header className='text-white sticky top-0 h-20 z-10 text-4xl flex items-center px-8'>
        <MagnifyingGlassIcon className='absolute top-7 left-10 h-6 w-6 text-neutral-800' />
        <input value={inputValue} onChange={async (e) => {
          setInputValue(e.target.value);
          await updateSearchResults(e.target.value);
        }} ref={inputRef} className='rounded-full bg-white w-96 pl-12 text-neutral-900 text-base py-2 font-normal outline-0' />
      </header>
      <div className='absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full  p-1 pr-2'>
          <img className='rounded-full w-7 h-7' src={session?.user.image} alt='profile pic' />
          <p className='text-sm'>Logout</p>
          <ChevronDownIcon className='h-5 w-5' />
      </div>
      <div>
        { searchData === null ? <FeaturedPlaylists setView={setView} setGlobalPlaylistId={setGlobalPlaylistId} /> : 
        <SearchResults topPlaylist={searchData?.playlists?.items[0]} playlists={searchData?.playlists?.items} tracks={searchData?.tracks?.items} artists={searchData?.artists?.items} 
        setView={setView} setGlobalPlaylistId={setGlobalPlaylistId} setGlobalCurrentSongId={setGlobalCurrentSongId} setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} /> }
      </div>
    </div>
  )
}

export default Search;