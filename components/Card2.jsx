import React, { useState } from "react";
import { Snippet } from "@nextui-org/snippet";
import { useAccount } from "wagmi";

const Card2 = () => {
  const { isConnected, address } = useAccount(); 
  const [showReferralLink, setShowReferralLink] = useState(false);
  const [showConnectWalletMessage, setShowConnectWalletMessage] = useState(false);

  const handleReferClick = () => {
    if (isConnected) {
      setShowReferralLink(true);
    } else {
      setShowConnectWalletMessage(true);
      setTimeout(() => {
        setShowConnectWalletMessage(false);
      }, 5000); // Message disappears after 5 seconds
    }
  };

  return (
    <>
      {showConnectWalletMessage && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-[1050]">
          Connect wallet to start referring.
        </div>
      )}
      <div className="w-[70%] mx-auto bg-white opacity-70 text-left p-4 rounded-lg shadow sm:p-8 text-white mb-[50px]">
        <h5 className="mb-1 text-[32px] font-Inter text-black">
          Refer and Earn extra Alme Points daily
        </h5>
        <p className="mb-5 mt-8 text-[16px] text-black sm:text-lg">
          Invite friends: Both you and the person you refer receive 1500 bonus Ultimate Points. These are credited soon as the person you refer joins our Discord.
        </p>
        {showReferralLink && isConnected ? (
          <Snippet variant="solid" color="primary" symbol="">
            {window.location.origin + `/?ref=${address}`}
          </Snippet>
        ) : (
          <button
            onClick={handleReferClick}
            className="bg-black hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
          >
            Refer Now
          </button>
        )}
      </div>
    </>
  );
};

export default Card2;
