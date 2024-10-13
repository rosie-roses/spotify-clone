import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PlaylistView from "@/components/PlaylistView";
import Search from "@/components/Search";
import Library from "@/components/Library";
import Artist from "@/components/Artist";

export default function Home() {
  const [view, setView] = useState('search'); // ['search', 'library', 'playlist', 'artist']
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null);
  const [globalArtistid, setGlobalArtistId] = useState(null);

  return (
    <>
      <main className='flex w-full h-screen overflow-hidden bg-black'>
        <Sidebar
          view={view}
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
        />
        { view === 'playlist' && <PlaylistView globalPlaylistId={globalPlaylistId} /> }
        { view === 'search' && <Search /> }
        { view === 'library' && <Library /> }
        { view === 'artist' && <Artist /> }
      </main>
      <div className="sticky z-20 bottom-0 h-24 w-full bg-red-100">Player</div>
    </>
  );
}
