import useSpotify from '@/hooks/useSpotify';
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive';

const AlbumTrack = ({ trackNum, trackId, trackName, artists, duration_ms, trackURI, globalIsTrackPlaying, playURI, setView, setGlobalArtistId,
    setGlobalIsTrackPlaying, setGlobalCurrentSongId, setPlayURI, deviceId
 }) => {
    const [ playHover, setPlayHover ] = useState(false);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
    const spotifyApi = useSpotify();

    function selectArtist(artist) {
        setView("artist");
        setGlobalArtistId(artist.id);
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

    const togglePlayPause = async () => {
        if (globalIsTrackPlaying && playURI === trackURI) {
            // Pause if currently playing this track
            await spotifyApi.pause({ device_id: deviceId }).then(() => {
                setGlobalIsTrackPlaying(false);
            }).catch((err) => {
                console.error('Error when pausing playback: ', err);
            });
        } else if (!globalIsTrackPlaying && playURI === trackURI) {
            // Resume if the track is paused
            await spotifyApi.play({ device_id: deviceId }).then(() => {
                setGlobalIsTrackPlaying(true);
            }).catch((err) => {
                console.error('Error when resuming playback: ', err);
            });
        } else {
            // Play this track
            await spotifyApi.play({ device_id: deviceId, uris: [trackURI] }).then(() => {
                setGlobalCurrentSongId(trackId);
                setGlobalIsTrackPlaying(true);
                setPlayURI(trackURI);
            }).catch((err) => {
                console.error('Error when playing track: ', err);
            });
        }
    }

    return (
        <div onMouseEnter={() => setPlayHover(true)} onMouseLeave={() => setPlayHover(false)} 
        onClick={async () => {
            if (isSmallScreen) {
                await togglePlayPause();
            }
        }}
        className='flex items-center text-neutral-400 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-default'>
            { !isSmallScreen ? (
                <div className='flex justify-center items-center mr-4' onClick={() => togglePlayPause()}>
                    {playHover ? (
                        globalIsTrackPlaying && playURI === trackURI ? ( 
                            <IconPlayerPauseFilled color='white' cursor={'pointer'} />
                        ) : ( <IconPlayerPlayFilled color='white' cursor={'pointer'} />)
                    ) : (
                    !isSmallScreen && <p className='w-6'>{trackNum}</p>
                    )} 
                </div>) : (
                    null
                )
            }
            <div className='flex-grow max-w-[85%] text-left'>
                <div className='text-white truncate'>{trackName}</div>
                <div className='truncate'>
                {artists.map((artist, i) => (
                    <span key={artist.id}>
                    <span onClick={() => selectArtist(artist)} className='cursor-pointer hover:underline'>
                        {artist.name}
                    </span>
                    <span>{i !== artists.length - 1 ? ', ' : null}</span>
                    </span>
                ))}
                </div>
            </div>
            <div className='ml-auto text-right'>
                {millisToMinutesAndSeconds(duration_ms)}
            </div>
        </div>
    )
};

export default AlbumTrack;