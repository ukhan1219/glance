"use client";


import Image from "next/image";
import googleLogo from "../../../public/google.png";
import discordLogo from "../../../public/discord.png";
import {signIn} from "next-auth/react";

export function GoogleSignInButton() {
    const handleClick = () => {
        signIn("google");
    };

    return (
        <button onClick={handleClick} className="w-full flex items-center font-semibold justify-center h-14"
    )
}
