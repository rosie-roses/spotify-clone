import { getSession, useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Home from "@/components/Home";
import { useState } from "react";
import PlaylistView from "@/components/PlaylistView";
import Player from "@/components/Player";

export default function App() {
  const [view, setView] = useState('home');
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null);
  const [globalCurrentSongId, setGlobalCurrentSongId] = useState(null);
  const [globalIsTrackPlaying, setGlobalIsTrackPlaying] = useState(false);
  const [playURI, setPlayURI] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  return (
    <div className={`min-h-screen text-sm text-center sm:text-left overflow-hidden`}>
      <main>
        <div className="flex w-full">
        <Sidebar
          view={view}
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
        />
        {view === 'home' && 
        <Home
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
        />}
        {view === 'playlist' && 
        <PlaylistView
          setView={setView}
          globalPlaylistId={globalPlaylistId}
          setGlobalCurrentSongId={setGlobalCurrentSongId} 
          setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
          setPlayURI={setPlayURI}
          deviceId={deviceId}
          globalIsTrackPlaying={globalIsTrackPlaying}
          playURI={playURI}
        />}
        </div>
        <div className="fixed bottom-0 left-0 w-full z-20">
          <Player 
            globalIsTrackPlaying={globalIsTrackPlaying}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            setDeviceId={setDeviceId}
            deviceId={deviceId}
          />
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
