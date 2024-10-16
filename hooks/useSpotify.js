import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const useSpotify = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            if (session.error === 'RefreshAccessTokenError') {
                signIn();
            }
            spotifyAPI.setAccessToken(session.user.accessToken);
        }
    }, [session]);

  return spotifyAPI;
}

export default useSpotify;