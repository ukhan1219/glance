"use client";


import Image from "next/image";
import googleLogo from "public/google.png";
import discordLogo from "public/dicord.png";
import coinbaseLogo from "public/coinbase.png";
import {signIn} from "next-auth/react";

export function GoogleSignInButton() {
    const handleClick = () => {
        signIn("google");
    };

    return (
        <button onClick={handleClick} className="fira-sans-regular w-full flex items-center justify-center h-14 px-6 mt-4 text-l font-extrabold transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200">
            <Image src={googleLogo} alt="Google Logo" width={20} height={20}/>
            <span className="ml-4">Sign in with Google</span>
        </button>
    );
}
export function DiscordSignInButton() {
    const handleClick = () => {
        signIn("discord");
    };

    return (
        <button onClick={handleClick} className="fira-sans-regular w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-l transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200">
            <Image src={discordLogo} alt="Discord Logo" width={20} height={20}/>
            <span className="ml-4">Sign in with Discord</span>
        </button>
    );
}
export function CoinbaseSignInButton() {
    const handleClick = () => {
        signIn("coinbase");
    };

    return (
        <button onClick={handleClick} className="fira-sans-regular w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-l transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200">
            <Image src={coinbaseLogo} alt="Coinbase Logo" width={20} height={20}/>
            <span className="ml-4">Sign in with Coinbase</span>
        </button>
    );
}