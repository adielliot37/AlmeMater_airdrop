import React, { useState } from "react";
import Modal from "react-modal";
import udAbi from "../abi.json";
import {
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
  useWriteContract,
} from "wagmi";

Modal.setAppElement("#__next");

const MintModal = ({ setStatus, closeModal }) => {
  const [mintingStatus, setMintingStatus] = useState(null); 

  const [transactionDetails, setTransactionDetails] = useState(null);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const [isMinting, setIsMinting] = useState(false); // New state to track minting status

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { writeContract } = useWriteContract();

  const mintNFT = async () => {
    if (!isConnected) {
      setMintingStatus("Please connect your wallet to mint the NFT.");
      return;
    }

    // Disables the Mint button by setting isMinting to true
    setIsMinting(true);

    if (chainId?.id !== 8453) {
      setIsSwitchingNetwork(true);
      try {
        await switchChain({ chainId: 8453 });
        setIsSwitchingNetwork(false);
      } catch (error) {
        setIsSwitchingNetwork(false);
        setIsMinting(false); // Re-enable the Mint button if switching fails
        console.log("Switch Network Error:", error);
        setMintingStatus(
          <>
            Minting NFT. Please wait and dont press any button. This popup will close automatically. You can see the NFT on <a href="https://basescan.org/address/0x4b9ac7420aef7c2071e379fab1f809d935ff495c" target="_blank" rel="noopener noreferrer">Base Scan</a>.
          </>
        );
        
        return;
      }
    }

    setMintingStatus("Minting NFT. Please wait and dont press any button. This popup will close automatically. You can see the NFT on Base Scan.");

   
    try {
      await writeContract({
        address: "0x4B9ac7420AEF7C2071e379fAB1F809d935ff495c",
        abi: udAbi,
        functionName: "mintNFT",
        args: [],
      });
      setTimeout(closeModal, 15000); // Automatically close the modal after 15 seconds
    } catch (error) {
      console.error("Minting Error:", error);
      setIsMinting(false); // In case of error, ensure the user can try minting again
      setMintingStatus("Minting failed. Please try again.");
    }
   

  };

  return (
    <Modal
    isOpen={true}
    onRequestClose={closeModal}
    contentLabel="Mint NFT Modal"
    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50"
  >
    <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold mb-4">Mint the Alme Points Genesis NFT</h2>
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={closeModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p>
        You&apos;re one step closer! Mint the free Alme Points Genesis NFT to farm both $ALME and Base. This NFT on Base is your passport to our game-changing airdrop and earns you passive Alme Points for every day you hold it.
      </p>
      <div className="flex justify-between items-start mt-4 gap-8"> 
        <div>
          <p><strong>NFT Contract Address:</strong> 0x4B9ac7420AEF7C2071e379fAB1F809d935ff495c</p>
          <p><strong>Creator:</strong> Alme Mater</p>
          <p><strong>Chain:</strong> Base</p>
          <p><strong>Creator Royalty:</strong> 10%</p>
        </div>
        <div> 
          <img src="https://cloudflare-ipfs.com/ipfs/bafybeicjft73uwwzdpqkjn2bu4raggbjpqosqdv3cduebpxrd5clycmzxi/NFT2.png" alt="UD genesis" style={{ maxWidth: '200px', maxHeight: '140px' }} />
        </div>
      </div>
      {mintingStatus && <p className="text-blue-500 mb-4">{mintingStatus}</p>}

      {transactionDetails && (
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="text-lg font-bold mb-2">Transaction Details</h3>
          <p>TokenId: {transactionDetails.tokenId}</p>
          <p>Chain: {transactionDetails.chainId}</p>
          <p>Minted to: {transactionDetails.mintedToAddress}</p>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 font-bold rounded-md ${isMinting || isSwitchingNetwork ? "bg-gray-500 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-700"} transition-colors duration-300 mr-2`}
          onClick={mintNFT}
          disabled={isMinting || isSwitchingNetwork}
        >
          {isMinting ? "Minting..." : isSwitchingNetwork ? "Switching Network..." : "Mint NFT"}
        </button>
        {/* <button
          className="px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-400 transition-colors duration-300"
          onClick={closeModal}
        >
          Close
        </button> */}
      </div>
    </div>
  </Modal>
  
  );
};

export default MintModal;