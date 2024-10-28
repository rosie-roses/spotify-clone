import useSpotify from '@/hooks/useSpotify';
import { IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const Song = ({ serialNum, track, setGlobalCurrentSongId, setGlobalIsTrackPlaying, setPlayURI, deviceId, globalIsTrackPlaying, playURI }) => {
    const [ playHover, setPlayHover ] = useState(false);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
    const spotifyApi = useSpotify();

    const togglePlayPause = async () => {
        if (globalIsTrackPlaying && playURI === track.uri) {
            // Pause if currently playing this track
            await spotifyApi.pause({ device_id: deviceId }).then(() => {
                setGlobalIsTrackPlaying(false);
            }).catch((err) => {
                console.error('Error when pausing playback: ', err);
            });
        } else if (!globalIsTrackPlaying && playURI === track.uri) {
            // Resume if the track is paused
            await spotifyApi.play({ device_id: deviceId }).then(() => {
                setGlobalIsTrackPlaying(true);
            }).catch((err) => {
                console.error('Error when resuming playback: ', err);
            });
        } else {
            // Play this track
            await spotifyApi.play({ device_id: deviceId, uris: [track.uri] }).then(() => {
                setGlobalCurrentSongId(track.id);
                setGlobalIsTrackPlaying(true);
                setPlayURI(track.uri);
            }).catch((err) => {
                console.error('Error when playing track: ', err);
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

  return (
    <div onMouseEnter={() => setPlayHover(true)} onMouseLeave={() => setPlayHover(false)} 
        onClick={async () => {
            if (isSmallScreen) {
                await togglePlayPause();
            }
        }}
        className='grid grid-cols-2 text-neutral-400 text-sm py-4 px-5 hover:bg-neutral-800 rounded-lg cursor-default'>
        <div className='flex items-center space-x-4'>
            { !isSmallScreen ? (
                <div className='flex justify-center items-center mr-4' onClick={() => togglePlayPause()}>
                    {playHover ? (
                        globalIsTrackPlaying && playURI === track.uri ? ( 
                            <IconPlayerPauseFilled color='white' cursor={'pointer'} />
                        ) : ( <IconPlayerPlayFilled color='white' cursor={'pointer'} />)
                    ) : (
                    !isSmallScreen && <p className='w-6'>{serialNum + 1}</p>
                    )} 
                </div>) : (
                    null
                )
            }
            {track?.album?.images[0]?.url && <img className='h-10 w-10' src={track.album?.images?.[0]?.url} />}
            <div className='text-left'>
                <div className='text-white w-36 lg:w-64 truncate'>{track.name}</div>
                <div className='w-36 truncate'>
                    {
                        track.artists?.map((artist, i) => {
                            return (
                                <span key={artist.id}>
                                    <span className='cursor-pointer hover:underline'>{artist.name}</span>
                                    <span>{ i != track.artists.length - 1 ? ', ' : null }</span>
                                </span>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        <div className='flex items-center justify-between ml-auto md:ml-0'>
        <div className='w-40 hidden md:inline truncate cursor-pointer hover:underline'>{track.album?.name}</div>
            <div>{millisToMinutesAndSeconds(track.duration_ms)}</div>
        </div>
    </div>
  )
}

export default Song;