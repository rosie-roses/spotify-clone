import { getSession, useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Home from "@/components/Home";
import { useState } from "react";

export default function App() {
  const { data: session } = useSession();
  const [view, setView] = useState('home');

  return (
    <div className={`min-h-screen text-sm text-center sm:text-left overflow-hidden`}>
      <main>
        <div className="flex w-full">
        <Sidebar
          view={view}
          setView={setView}
        />
        {view === 'home' && <Home />}
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
