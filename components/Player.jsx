import React, { useCallback, useEffect, useState } from 'react';
import { usePlaybackState, usePlayerDevice, useSpotifyPlayer, WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import useSpotify from '@/hooks/useSpotify';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerTrackNextFilled, IconPlayerTrackPrevFilled, IconVolume } from '@tabler/icons-react';
import { Input, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';

const Player = ({ globalIsTrackPlaying, setGlobalIsTrackPlaying, setDeviceId }) => {
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
        />
        </WebPlaybackSDK>
    );
};

const PlayerUI = ({ globalIsTrackPlaying, setGlobalIsTrackPlaying, setDeviceId }) => {
    const spotifyApi = useSpotify();
    const player = useSpotifyPlayer();
    const [isConnected, setIsConnected] = useState(false);
    const playbackState = usePlaybackState();
    const [volume, setVolume] = useState(80);

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

    const handleNextTrack = () => {
        player.nextTrack().
        then(() => setGlobalIsTrackPlaying(true))
        .catch((err) => {
            console.error('Error skipping to next track: ', err);
        });
    };

    const handlePreviousTrack = () => {
        player.previousTrack()
        .then(() => setGlobalIsTrackPlaying(true))
        .catch((err) => {
            console.error('Error going to previous track: ', err);
        });
    };

    const handleVolumeChange = (value) => {
        const newVolume = parseInt(value, 10);
        setVolume(newVolume);
        player.setVolume(newVolume / 100).catch((err) => {
            console.error('Error setting volume: ', err);
        });
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
        <div className='flex items-center justify-evenly'>
            <IconPlayerTrackPrevFilled onClick={() => { handlePreviousTrack() }} className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
            {globalIsTrackPlaying ? <IconPlayerPauseFilled onClick={() => { handlePlayPause() }} className='h-8 w-8 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' /> : 
            <IconPlayerPlayFilled onClick={() => { handlePlayPause() }} className='h-8 w-8 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />}
            <IconPlayerTrackNextFilled  onClick={() => { handleNextTrack() }} className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
        </div>
        <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
            <IconVolume className='w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100 ease-in-out' />
            <Slider 
                    aria-label="Volume slider"
                    min={0} 
                    max={100} 
                    value={volume} 
                    onChange={(val) => { handleVolumeChange(val) }}
                    colorScheme="green.400"
                    width={40}
                >
                    <SliderTrack bg="gray.700">
                        <SliderFilledTrack bg="green.400" />
                    </SliderTrack>
                    <SliderThumb boxSize={3} />
            </Slider>
        </div>
        </div>
    );
};

export default Player;