import React, { useCallback, useEffect, useState } from 'react';
import { usePlaybackState, useSpotifyPlayer, WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import useSpotify from '@/hooks/useSpotify';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerTrackNextFilled, IconPlayerTrackPrevFilled, IconVolume } from '@tabler/icons-react';
import { Input, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';

const Player = ({ globalIsTrackPlaying, setGlobalIsTrackPlaying, setDeviceId, deviceId }) => {
    const spotifyApi = useSpotify();

    const getOAuthToken = useCallback(callback => {
        callback(spotifyApi.getAccessToken());
    }, [spotifyApi]);

    return (
        <WebPlaybackSDK
        initialDeviceName="Spotify Clone Player"
        getOAuthToken={getOAuthToken}
        initialVolume={0.8}
        connectOnInitialized={true}
        >
        <PlayerUI 
            globalIsTrackPlaying={globalIsTrackPlaying}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            setDeviceId={setDeviceId}
            deviceId={deviceId}
        />
        </WebPlaybackSDK>
    );
};

const PlayerUI = ({ globalIsTrackPlaying, setGlobalIsTrackPlaying, setDeviceId, deviceId }) => {
    const spotifyApi = useSpotify();
    const player = useSpotifyPlayer();
    const [isConnected, setIsConnected] = useState(false);
    const playbackState = usePlaybackState();
    const [volume, setVolume] = useState(80);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (player) {
            const handleReady = async ({ device_id }) => {
                console.log('Player ready with Device ID:', device_id);
                setDeviceId(device_id);

                const success = await player.connect();
                if (success) {
                    console.log('Player connected successfully!');
                    setIsConnected(true);
                    
                    // Transfer playback to this device
                    spotifyApi.transferMyPlayback([device_id], false).then(() => {
                        console.log(`Playback transferred to device ID: ${device_id}`);
                    }).catch((err) => {
                        console.error('Error transferring playback:', err);
                    });
                }
            };

            const handleNotReady = ({ device_id }) => {
                console.log('Device ID has gone offline:', device_id);
                if (isConnected) {
                    player.disconnect();
                    setIsConnected(false);
                    console.log('Player disconnected due to device going offline.');
                }
            };

            player.addListener('ready', handleReady);
            player.addListener('not_ready', handleNotReady);

            return () => {
                player.removeListener('ready', handleReady);
                player.removeListener('not_ready', handleNotReady);
            };
        }
    }, [player]);

    useEffect(() => {
        if (playbackState) {
            setProgress(playbackState.position);
            setDuration(playbackState.duration);
        }
    }, [playbackState]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (globalIsTrackPlaying && playbackState) {
                setProgress(prev => Math.min(prev + 1000, duration));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [globalIsTrackPlaying, playbackState, duration]);

    const formatTime = ms => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

     useEffect(() => {
        if (player) {
            player.addListener('player_state_changed', (state) => {
                if (state && state.paused && state.position === 0 && state.track_window.previous_tracks.length > 0) {
                    setGlobalIsTrackPlaying(false);
                }
            });
        }
    }, [player, setGlobalIsTrackPlaying]);

    const currentTrack = playbackState?.track_window?.current_track;

    const handlePlayPause = () => {
        if (globalIsTrackPlaying) {
            player.pause()
                .then(() => setGlobalIsTrackPlaying(false))
                .catch((err) => console.error('Error pausing playback:', err));
        } else {
            player.resume()
                .then(() => setGlobalIsTrackPlaying(true))
                .catch((err) => console.error('Error resuming playback:', err));
        }
    };

    const handleNextTrack = async () => {
        try {
            await player.nextTrack();
            setGlobalIsTrackPlaying(true);
        } catch (err) {
            console.error('Error skipping to next track with player:', err);
            // Fallback to spotifyApi if player.nextTrack() fails
            try {
                await spotifyApi.skipToNext({ device_id: deviceId });
                setGlobalIsTrackPlaying(true);
            } catch (apiErr) {
                console.error('Error skipping to next track with spotifyApi:', apiErr);
            }
        }
    };

    const handlePreviousTrack = async () => {
        try {
            await player.previousTrack();
            setGlobalIsTrackPlaying(true);
        } catch (err) {
            console.error('Error going to previous track with player:', err);
            // Fallback to spotifyApi if player.previousTrack() fails
            try {
                await spotifyApi.skipToPrevious({ device_id: deviceId });
                setGlobalIsTrackPlaying(true);
            } catch (apiErr) {
                console.error('Error going to previous track with spotifyApi:', apiErr);
            }
        }
    };

    const handleSeek = value => {
        setProgress(value);
        player.seek(value).catch(err => console.error('Error seeking:', err));
    };

    const handleVolumeChange = value => {
        setVolume(value);
        player.setVolume(value / 100).catch(err => console.error('Error setting volume:', err));
    };

    if (!player) {
        return <div>Loading player...</div>;
    }

    return (
        <div className='h-24 bg-gradient-to-b from-black to-gray-900 border-t border-t-neutral-800 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            <div className='flex items-center space-x-4'>
                {currentTrack ? (
                    <div className='flex items-center ml-5 gap-1 text-left'>
                        <img className='h-10 w-10' src={currentTrack?.album?.images?.[0]?.url} alt={currentTrack.name} />
                        <div className='ml-3'>
                            <p className='text-white text-sm truncate max-w-[120px] md:max-w-xs'>{currentTrack.name}</p>
                            <div className='text-neutral-400 text-xs truncate max-w-[120px] md:max-w-xs'>
                                {currentTrack?.artists?.map((artist, i) => (
                                    <span key={`${artist.id}-${i}`}>
                                        <span className='cursor-pointer hover:underline'>{artist.name}</span>
                                        {i !== currentTrack.artists.length - 1 && ', '}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No track currently playing</p>
                )}
            </div>
            <div className='flex flex-col items-center mt-5'>
                <div className='flex items-center space-x-4'>
                    <IconPlayerTrackPrevFilled onClick={() => {handlePreviousTrack()}} className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
                    {globalIsTrackPlaying ? 
                        <IconPlayerPauseFilled onClick={() => {handlePlayPause()}} className='h-8 w-8 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' /> :
                        <IconPlayerPlayFilled onClick={() => {handlePlayPause()}} className='h-8 w-8 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
                    }
                    <IconPlayerTrackNextFilled onClick={() => {handleNextTrack()}} className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
                </div>
                <div className='flex items-center w-full mt-2'>
                    <span className='text-xs text-neutral-400 mr-3'>{formatTime(progress)}</span>
                    <Slider
                        aria-label="Track progress"
                        min={0}
                        max={duration}
                        value={progress}
                        onChange={handleSeek}
                        colorScheme="green.500"
                        width="80%"
                    >
                        <SliderTrack bg="gray.700">
                            <SliderFilledTrack bg="green.500" />
                        </SliderTrack>
                        <SliderThumb boxSize={3} />
                    </Slider>
                    <span className='text-xs text-neutral-400 ml-3'>{formatTime(duration)}</span>
                </div>
            </div>
            <div className='flex items-center space-x-3 justify-end pr-5'>
                <IconVolume className='cursor-pointer transition transform duration-100 ease-in-out' width={30} />
                <Slider 
                    aria-label="Volume slider"
                    min={0} 
                    max={100} 
                    value={volume} 
                    onChange={handleVolumeChange}
                    colorScheme="green.500"
                    width={40}
                >
                    <SliderTrack bg="gray.700">
                        <SliderFilledTrack bg="green.500" />
                    </SliderTrack>
                    <SliderThumb boxSize={3} />
                </Slider>
            </div>
        </div>
    );
};

export default Player;