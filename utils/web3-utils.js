import {
    createPublicClient,
    http,
    parseAbi
} from "viem";
import {

    baseSepolia,base,
    mainnet
} from "viem/chains";
//TODO: @adielliot37 change to prod data
const publicClient = createPublicClient({
    chain: base,
    transport: http("https://base-mainnet.g.alchemy.com/v2/wdZKK0jRN3MLdwwl-iC584EwKJtrfE3A")
})

const publicClient1 = createPublicClient({
    chain: mainnet,
    transport: http("https://eth-mainnet.g.alchemy.com/v2/QuvsBXmbep4JiOmQQI-W0b4Kj6MY-GWm")
})

export const check_nft_ownership = async (address) => {
    const balance = await publicClient.readContract({
        address: '0x4B9ac7420AEF7C2071e379fAB1F809d935ff495c', //0x7b53e8f23d2e366d0706a863120590286AF791D8
        abi: parseAbi(['function balanceOf(address,uint256) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address, 0],
    });

    if (Number(balance) == 0) {
        return false
    }
    return true;
}

export const check_nft_ownership1 = async (address) => {
    const balance = await publicClient1.readContract({
      address: '0xF9e631014Ce1759d9B76Ce074D496c3da633BA12',
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [address],
    });
  
    return Number(balance); 
  };
  

