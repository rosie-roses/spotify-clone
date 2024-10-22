import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div
      className={`min-h-screen text-sm text-center sm:text-left`}
    >
      Spotify Clone Application
    </div>
  );
}
