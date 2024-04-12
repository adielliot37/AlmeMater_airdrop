import React, { useState, useEffect } from 'react';

const CLIENT_ID = '1228231740750041121';
const REDIRECT_URI = 'https://alme-mater-airdrop.vercel.app/';
const SCOPE = 'identify+guilds';
const TARGET_SERVER_ID = '1214577209159716884'; // Replace with the actual server ID
const TARGET_SERVER_NAME = 'test'; // Replace with the actual server ID
const CLIENT_SECRET = '50Rl6qsA0AfV9Ch4BW4wslGBSEqqSO_Y ';

const DiscordAuth = () => {
    const [userData, setUserData] = useState(null);
    const [userGuilds, setUserGuilds] = useState([]);
    const [isUserInTargetServer, setIsUserInTargetServer] = useState(false);
  
    useEffect(() => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
  
      if (code && userData == null) {
        fetchDiscordData(code);
      }
    }, []);
  
    const fetchDiscordData = async (code) => {
      const accessToken = await getAccessToken(code);
      const {access_token} = accessToken;
      console.log(accessToken);
      const userInfo = await getUserInfo(access_token);
      const userGuildIds = await getUserGuilds(access_token);
  
      setUserData(userInfo);
      console.log(userInfo, userGuildIds);
  
      // Check if the user is in the target server
      const isInTargetServer = userGuildIds.some(guild => guild.id === TARGET_SERVER_ID);
      setIsUserInTargetServer(isInTargetServer);
  
      setUserGuilds(userGuildIds.slice(0, 10)); // Get the first 10 guilds
    };
  
    const getAccessToken = async (code) => {
      console.log(code);
        const params = new URLSearchParams()
        params.append('client_id', CLIENT_ID)
        params.append('client_secret', CLIENT_SECRET)
        params.append('grant_type', 'authorization_code')
        params.append('code', code)
        params.append('redirect_uri', REDIRECT_URI)
        params.append('scope', 'identify guilds')
    
        const resp = await fetch('https://discord.com/api/oauth2/token', {
          method: 'post',
          body: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
          }
        })
    
        return await resp.json()
    };
  
    const getUserInfo = async (accessToken) => {
      const response = await fetch('https://discord.com/api/v9/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const data = await response.json();
      return data;
    };
  
    const getUserGuilds = async (accessToken) => {
      const response = await fetch('https://discord.com/api/v9/users/@me/guilds', {
        headers: {
          Authorization:`Bearer ${accessToken}`,
        },
      });
  
      const data = await response.json();
  
      if (Array.isArray(data)) {
        // If the response is an array, return it as is
        return data;
      } else if (data && data.guilds && Array.isArray(data.guilds)) {
        // If the response has a 'guilds' property that is an array, return that
        return data.guilds;
      } else {
        // Handle other response structures or errors
        console.error('Unexpected response structure:', data);
        return [];
      }
    };
    
  
    const handleDiscordLogin = () => {
      window.location.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=identify+guilds`;
    };
  
    return (
      <div className="flex items-center align-middle">
        <header>
          <h1 className='text-3xl font-bold'>Discord User Info</h1>
          {userData === null ? (
            <button onClick={handleDiscordLogin}>Connect to Discord</button>
          ) : (
            <div>
              <img src={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`} alt="User Avatar" />
              <h2>{userData.username}</h2>
              <h3>Joined Servers:</h3>
              <ul>
                {userGuilds.map((guild) => (
                  <li key={guild.id}>{guild.name}</li>
                ))}
              </ul>
              {isUserInTargetServer ? (
                <p>You have joined the target server ({TARGET_SERVER_NAME}).</p>
              ) : (
                <p>You have not joined the target server  ({TARGET_SERVER_NAME}).</p>
              )}
            </div>
          )}
        </header>
      </div>
    );
  }

  export default DiscordAuth;
