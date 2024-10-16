import { signIn } from 'next-auth/react';
import React from 'react';

function Login() {
  return (
    <div className='flex items-center justify-center w-full h-screen bg-black'>
        <button className='text-white px-8 py-2 rounded-full bg-green-500 font-bold' onClick={() => signIn('spotify', { callbackUrl: '/' })}>Login with Spotify</button>
    </div>
  )
}

export default Login;