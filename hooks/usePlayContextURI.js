import { usePlaybackState, usePlayerDevice } from "react-spotify-web-playback-sdk";
import useSpotify from "./useSpotify"
import { useEffect, useState } from "react";

export const usePlayContextURI = (uri) => {
    const spotifyApi = useSpotify();
    const playbackState = usePlaybackState();
    const thisDevice = usePlayerDevice();
    const myCurrentPlaybackState = useState({});

    useEffect(() => {
        spotifyApi.getMyCurrentPlaybackState().then((res) => {
            myCurrentPlaybackState(res.body);
        }).catch((err) => {
            console.error('Error getting current playback: ', err);
        });
    }, [spotifyApi]);

    console.log(myCurrentPlaybackState)
}