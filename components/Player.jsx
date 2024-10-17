import useSpotify from '@/hooks/useSpotify';
import { BackwardIcon, ForwardIcon, PauseCircleIcon, PlayCircleIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const Player = ({ globalCurrentSongId, setGlobalCurrentSongId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) => {
  const { data: session } = useSession();
  const [ songInfo, setSongInfo ] = useState(null);
  const [ volume, setVolume ] = useState(50);
  const spotifyAPI = useSpotify();

  async function fetchSongInfo(trackId) {
    if (trackId) {
      const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          authorization: `Bearer ${spotifyAPI.getAccessToken()}`
        }
      }).then(res => res.json());
      setSongInfo(trackInfo);
    }
  }

  async function getCurrentlyPlayingTrack() {
    if (!songInfo) {
      spotifyAPI.getMyCurrentPlayingTrack().then((data) => {
        setGlobalCurrentSongId(data.body?.item?.id);

        spotifyAPI.getMyCurrentPlaybackState().then((data) => {
          setGlobalIsTrackPlaying(data.body?.is_playing);
        });
      });
    }
  }

  async function handlePlayPause() {
    spotifyAPI.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyAPI.pause();
        setGlobalIsTrackPlaying(false);
      } else {
        spotifyAPI.play();
        setGlobalIsTrackPlaying(true);
      }
    });
  }

  useEffect(() => {
    // Fetch song details
    async function getSongDetails() {
      if (spotifyAPI.getAccessToken() && !globalCurrentSongId) {
        // Get the current playing song from Spotify API
        await getCurrentlyPlayingTrack();
        await fetchSongInfo(globalCurrentSongId);
        setVolume(50);
      } else {
        // Get song info
        await fetchSongInfo(globalCurrentSongId);
      }
    }
    getSongDetails();
  }, [globalCurrentSongId, spotifyAPI, session]);

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      <div className='flex items-center space-x-4'>
        {<img className='hidden md:inline h-10 w-10' src={songInfo?.album.images?.[0]?.url} />}
        <div>
          <p className='text-white text-sm'>{ songInfo?.name }</p>
          <p className='text-neutral-400 text-xs'>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className='flex items-center justify-evenly'>
        <BackwardIcon className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
        {globalIsTrackPlaying ? <PauseCircleIcon onClick={handlePlayPause} className='h-10 w-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' /> : 
        <PlayCircleIcon onClick={handlePlayPause} className='h-10 w-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />}
        <ForwardIcon className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
      </div>
      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
        <SpeakerWaveIcon onClick={() => volume < 100 && setVolume(volume + 10)} className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
        <input onChange={(e) => setVolume(Number(e.target.value))} className='w-14 md:w-28' type='range' value={volume} min={0} max={100} />
        <SpeakerXMarkIcon onClick={() => volume < 100 && setVolume(0)}  className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
      </div>
    </div>
  )
}

export default Player;