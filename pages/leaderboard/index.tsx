import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from '../../styles/Home.module.css'; 
import Head from "next/head";

const columns = [
    {
        key: "Rank",
        label: "Rank",
    },
    {
        key: "Address",
        label: "Address",
    },
    {
        key: "Points",
        label: "Alme Points",
    },
    {
        key: "Referral",
        label: "Total Referrals",
    },
];

type UserData = {
    address: string,
    totalPts: number,
    totalRefferals: number,
}

const Leaderboard = () => {
    const [data, setData] = useState<UserData[]>([]);
    const { isConnected, address: connectedAddress } = useAccount();
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/user');
            const newData: UserData[] = await response.json();
            newData.sort((a, b) => b.totalPts - a.totalPts);
            setData(newData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!isConnected) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 5000); // Set the message to disappear after 5 seconds
            
            return () => clearTimeout(timer);
        }
    }, [isConnected]);

    
    const connectedUserData = isConnected ? data.find(user => user.address === connectedAddress) : null;
    const userRanking = connectedUserData ? data.findIndex(user => user.address === connectedAddress) + 1 : null;


    let topData = data.slice(0, 50);
    if (isConnected && connectedUserData && userRanking !== null && !topData.find(user => user.address === connectedAddress)) {
        topData = [connectedUserData, ...topData.slice(0, 49)]; 
    }

    return (
        <div className={`${styles.main} no-border-box relative `}>
            <Head>
                <title>Alme Airdrop - Farm $ULT</title>
                <meta content="Airdrop site" name="description" />
                <link href="https://www.almemater.com/alme-maters-favicon.ico" rel="shortcut icon" />
            </Head>
            {showMessage && (
                <div className="fixed top-0 left-0 right-0 bg-white opacity-70 text-black text-center py-2 z-[1050]">
                    Connect your wallet to see your ranking.
                </div>
            )}
            <div className="relative w-[70%] overflow-x-auto no-border-box">
                <table className="w-full text-sm text-left rtl:text-right text-black bg-white opacity-70 ">
                    <caption className="px-8 pt-10 text-[36px] text-left rtl:text-right text-black bg-white opacity-70">
                        Leaderboard for <span className="font-bold">Season 1</span>
                        <p className="mb-3 mt-7 text-[10px] text-black sm:text-lg">
                            In Season 1 of the Alme Points Program, users will be airdropped 12% of $ULT&apos;s circulating supply on launch, based on accumulated Alme Points.
                        </p>
                        <hr className="mt-10 mb-5" />
                    </caption>
                    <thead className="text-[22px] bg-inherit text-black">
                        <tr>
                            {columns.map((column) => (
                                <th scope="col" className="px-8 py-3" key={column.key}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isConnected && connectedUserData && (
                            <tr className="bg-violet-400 text-white text-[18px]" key={connectedUserData.address}>
                                <td className="px-8 py-4">{userRanking}</td>
                                <td className="px-8 py-4">You</td>
                                <td className="px-8 py-4">{connectedUserData.totalPts}</td>
                                <td className="px-8 py-4">{connectedUserData.totalRefferals}</td>
                            </tr>
                        )}
                        {topData.map((row, index) => {
                            if (row.address === connectedAddress) return null; // Don't repeat the connected user
                            return (
                                <tr className="bg-inherit text-black text-[18px]" key={row.address}>
                                    <td className="px-8 py-4">{index + 1}</td>
                                    <td className="px-8 py-4">{row.address}</td>
                                    <td className="px-8 py-4">{row.totalPts}</td>
                                    <td className="px-8 py-4">{row.totalRefferals}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
