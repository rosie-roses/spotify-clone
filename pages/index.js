import Sidebar from "@/components/Sidebar";
import { getSession, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className={`min-h-screen text-sm text-center sm:text-left overflow-hidden`}>
      <main>
        <div className="flex w-full">
        <Sidebar
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
