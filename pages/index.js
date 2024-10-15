import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PlaylistView from "@/components/PlaylistView";
import Search from "@/components/Search";
import Library from "@/components/Library";
import Artist from "@/components/Artist";
import Player from "@/components/Player";

export default function Home() {
  const [view, setView] = useState('search'); // ['search', 'library', 'playlist', 'artist']
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null);
  const [globalArtistid, setGlobalArtistId] = useState(null);
  const [globalCurrentSongId, setGlobalCurrentSongId] = useState(null);
  const [globalIsTrackPlaying, setGlobalIsTrackPlaying] = useState(false);

  return (
    <>
      <main className='flex w-full h-screen overflow-hidden bg-black'>
        <Sidebar
          view={view}
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
        />
        { view === 'playlist' && 
          <PlaylistView 
            globalPlaylistId={globalPlaylistId} 
            setGlobalCurrentSongId={setGlobalCurrentSongId} 
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
          /> 
        }
        { view === 'search' && <Search /> }
        { view === 'library' && 
          <Library 
            setView={setView}
            setGlobalPlaylistId={setGlobalPlaylistId} 
          />
        }
        { view === 'artist' && <Artist /> }
      </main>
      <div className="sticky z-20 bottom-0 w-full">
        <Player 
          globalCurrentSongId={globalCurrentSongId} 
          setGlobalCurrentSongId={setGlobalCurrentSongId} 
          globalIsTrackPlaying={globalIsTrackPlaying}
          setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
        />
      </div>
    </>
  );
}
