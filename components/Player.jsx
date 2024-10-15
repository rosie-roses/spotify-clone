import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const Player = ({ globalCurrentSongId, setGlobalCurrentSongId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) => {
  const { data: session } = useSession();
  const [ songInfo, setSongInfo ] = useState(null);

  async function getCurrentlyPlayingTrack() {
    const res = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
      headers: {
        authorization: `Bearer ${session.accessToken}`
      }
    });
    if (res.status == 204) { // This returns if you have Spotify Premium and also have Spotify running in an active device. 
      console.log('204 response from currently playing song');
      return;
    }
    const data = await res.json();
    return data;
  }

  async function fetchSongInfo(trackId) {
    if (trackId) {
      const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          authorization: `Bearer ${session.accessToken}`
        }
      });
      const data = await res.json();
      setSongInfo(data);
    }
  }

  async function handlePlayPause() {
    if (session && session.accessToken) {
      const data = await getCurrentlyPlayingTrack();
      if (data?.is_playing) {
        const res = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
          method: 'PUT',
          headers: {
            authorization: `Bearer ${session.accessToken}`
          }
        });
        if (res.status == 200) {
          setGlobalIsTrackPlaying(false);
        }
      } else {
        const res = await fetch(`https://api.spotify.com/v1/me/player/play`, {
          method: 'PUT',
          headers: {
              authorization: `Bearer ${session.accessToken}`
          }
        });
        if (res.status == 200) {
          setGlobalIsTrackPlaying(true);
          setGlobalCurrentSongId(data.item.id);
        }
      }
    }
  }

  useEffect(() => {
    // Fetch song details and play song
    async function getSongDetails() {
      if (session && session.accessToken) {
        if (!globalCurrentSongId) {
          // Get the current playing song from Spotify API
          const data = await getCurrentlyPlayingTrack();
          setGlobalCurrentSongId(data?.item?.id);
          if (data?.is_playing) {
            setGlobalIsTrackPlaying(true);
          }
          await fetchSongInfo(data?.item?.id);
        } else {
          // Get song info
          await fetchSongInfo(globalCurrentSongId);
        }
      }
    }
    getSongDetails();
  }, [session, globalCurrentSongId]);

  return (
    <div className='h-24 bg-neutral-900 border-t border-neutral-800 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      <div className='flex items-center space-x-4'>
        {songInfo?.album.images[0].url && <img className='hidden md:inline h-10 w-10' src={songInfo.album.images[0].url} />}
        <div>
          <p className='text-white text-sm'>{ songInfo?.name }</p>
          <p className='text-neutral-400 text-xs'>{songInfo?.artists[0]?.name}</p>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        {globalIsTrackPlaying ? <PauseCircleIcon onClick={handlePlayPause} className='h-10 w-10' /> : <PlayCircleIcon onClick={handlePlayPause} className='h-10 w-10' />}
      </div>
      <div></div>
    </div>
  )
}

export default Player;