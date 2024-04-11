import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useAccountEffect } from "wagmi";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const Logo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const update_referral = async (ref_add) => {
  console.log("here3", ref_add);
  const resp = await fetch(`api/user/${ref_add}`);
  const ref_data = await resp.json();
  await fetch("/api/user/update", {
    method: "POST",
    body: JSON.stringify({
      address: ref_add,
      totalRefferals: ref_data.totalRefferals + 1,
    }),
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
  });
};

const Navbar_comp = () => {
  const { isConnected, address } = useAccount();
  const [discordData, setDiscordData] = useState("");
  const [pathname, setPathname] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session } = useSession();
  useAccountEffect({
    onConnect: async (data) => {
      const res = await fetch(`/api/user/${data.address}`);
      const userData = await res.json();
      if (userData == null) {
        const body = searchParams.has("ref")
          ? JSON.stringify({
              address: data.address,
              refferedBy: searchParams.get("ref"),
            })
          : JSON.stringify({
              address: data.address,
            });
        fetch("api/user", {
          method: "POST",
          body: body,
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }).then(async()=>{
          console.log("here");
          if(searchParams.has("ref")){
            console.log("here2");
            await update_referral(String(searchParams.get("ref")))
          }
        });
      } else {
        setDiscordData(userData.discord_id);
      }
    },
    onDisconnect: () => {
      signOut();
    },
  });
  
  const update_db_discord = async () => {
    if (!isConnected || !session || discordData !== "") return;
  
    // User attempts to link Discord
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
          discord_id: session.user.name,
        }),
      });
  
      if (response.ok) {
        setDiscordData(session.user.name);
      } else {
        const data = await response.json();
        // Handle error code 11000 from MongoDB for duplicate key
        if (data.error && data.error.code === 11000) {
          // Check if the error has already been shown in the current session
          if (!sessionStorage.getItem("discordLinkErrorShown")) {
            alert("This Discord is already linked to another address.");
            sessionStorage.setItem("discordLinkErrorShown", "true"); // Prevent alert from showing again in the session
          }
        } else {
          console.log("Failed to update Discord ID. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error updating Discord ID:", error);
    }
  };
  
    
    useEffect(() => {
      if (session) update_db_discord();
    }, [session, isConnected, address, discordData]);

  return (
    <Navbar
      className="bg-[#00070e1a] text-white font-Inter z-[99] py-5"
      position="sticky"
      maxWidth="xl"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarBrand>
        <a href="https://www.ultimatedigits.com/#home" target="_blank" rel="noopener noreferrer">
          <img src="images/almebg.png" alt="Alme Mater" className="h-[30px] md:h-[40px]" />
        </a>
      </NavbarBrand>
  
      <NavbarContent className="hidden sm:flex gap-4" justify="center" >
        <NavbarItem isActive={router.pathname == "/"}>
          <Link href="/">Home</Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname == "/leaderboard"}>
          <Link href="/leaderboard">Leaderboard</Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname == "/howto"}>
          <Link href="/howto">How-To</Link>
        </NavbarItem>
      </NavbarContent>
  
      <NavbarContent justify="end">
        <NavbarItem>
          <ConnectButton chainStatus="icon" showBalance={false} showRecentTransactions={true}/>
        </NavbarItem>
        <NavbarItem>
          {isConnected ? (
            <div
              className="flex items-center justify-between space-x-2 ml-5 bg-black h-[45px] p-1 rounded-lg border border-black px-3 cursor-pointer"
              onClick={() => {
                if (discordData === "") {
                  signIn("discord");
                }
              }}
            >
              <Image
                src="https://www.cdnlogo.com/logos/d/15/discord.svg"
                width={30}
                height={30}
                alt="Discord logo"
                unoptimized={true} // Use unoptimized prop if you encounter issues with external image loading
              />
              <p>{discordData === "" ? "Link Discord" : discordData}</p>
            </div>
          ) : (
            <></>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Navbar_comp;
