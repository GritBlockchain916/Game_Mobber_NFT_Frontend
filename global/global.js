import axios from "axios"
import io from 'socket.io-client';

// Global variables : MBC-on mobile responsive
// export const FRONTEND_URL = "http://192.168.140.55:19006";
export const FRONTEND_URL = `http://${location.host}`;
// export const FRONTEND_URL = "https://valhalla.proskillowner.com";
export const SERVER_URL = `https://${location.host}`;  // TODO: replace with your own server URL
export const socket = io(SERVER_URL);

// =========================================== WEB3 ======================================================
// --- Web3 Modal Import ---
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@web3modal/solana/chains'
import toast from "react-hot-toast";

// --- Web3Modal Connect Settings ---
export const chains = [solana, solanaTestnet, solanaDevnet]
export const projectId = 'dcf293e3b464df32cd09530f8f8bf63d';  // TODO: replace with your own projectId
export const metadata = {
  name: 'Appkit Solana Example',
  description: 'Appkit Solana Example',
  url: 'https://appkit-solana.vercel.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};
const token = localStorage.token;
export const solanaConfig = defaultSolanaConfig({
  metadata,
  chains,
  projectId,
  auth: {
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github', 'apple', 'facebook'],
    walletFeatures: true, //set to true by default
    showWallets: true //set to true by default
  }
});
// --- Web3 API ---
export const getNFTswithImage = async (wallet) => {
  return await axios(SERVER_URL + '/api/nft_images/' + wallet)
}

export const getCharacters = async () => {
  return await axios(SERVER_URL + '/api/v1/base/character')
}

// -------------Admins Router Begin----------------------
export const addNFT = async (address, character, wallet) => {
  return await axios.post(SERVER_URL + '/api/v1/admin/nft/create', 
    {
      nftMintAddress: address,
      character: character,
      wallet,
    },
    {
      headers: {
        Authorization: `bearer ${token}`,
    },
  })
}

export const updateNFTCharacter = async (id, character, wallet) => {
  return await axios.post(SERVER_URL + '/api/v1/admin/nft/update', 
    {
      nftId: id,
      character,
      wallet
    },
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
}

export const deleteNFT = async (id, wallet) => {
  return await axios.post(SERVER_URL + '/api/v1/admin/nft/delete',
    { wallet,
      nftId: id, 
    },
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
    
  )
}

export const getAdminData = async (wallet) => {
  return await axios(SERVER_URL + '/api/v1/admin/dashboard/data/' + wallet, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
}

export const setRewardRate = async (rate, wallet) => {
  return await axios.patch(SERVER_URL + '/api/v1/admin/reward/rate', 
    { rate, wallet }, 
    {
      headers: {
        Authorization: `bearer ${token}`,
      }
    });
}
// -------------Admins Router End----------------------

export const getWalletInfo = async (wallet) => {
  console.log('getWalletInfo', wallet)
  return await axios(SERVER_URL + '/api/v1/user/wallet_info/' + wallet)
}

export const getNFTOne = async (mint) => {
  console.log('getNFTOne', mint)
  return await axios(SERVER_URL + '/api/nft_one/' + mint)
}

export const getWalletSOLBalance_bn = async (conn, wallet) => {
  try {
    let balance = await conn.getBalance(new PublicKey(wallet));
    return balance;
  } catch (error) {
    // G.log(error);
  }
  return BigInt(0);
};

export const getWalletSOLBalance = async (conn, wallet) => {
  try {
    let balance = (await conn.getBalance(new PublicKey(wallet))) / LAMPORTS_PER_SOL;
    return balance;
  } catch (error) {
    // G.log(error);
  }
  return 0;
};
// =========================================== /WEB3 ======================================================

export const registerUser = async (username, password) => {
  return await axios.post(SERVER_URL + '/api/v1/auth/register', {
    username, password
  })
}

export const loginUser = async (username, wallet) => {
  return await axios.post(SERVER_URL + '/api/v1/auth/login', {
    username, wallet
  })
}

export const loginWithWallet = async (wallet) => {
  return await axios.post(SERVER_URL + '/api/v1/auth/loginWithWallet', {
    wallet
  })
}

export const loginWithAddr = async (wallet) => {
  return await axios.post(SERVER_URL + '/api/v1/auth/loginWithAddr', {
    username, wallet
  })
}

export const getScoreList = async (sortBy, limit, page) => {
  return await axios.get(SERVER_URL + '/api/v1/user/score/list?sortBy=' + sortBy + '&limit=' + limit + "&page=" + page, token && {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
}

export const getRate = async (sortBy, limit, page) => {
  return await axios.get(SERVER_URL + '/api/v1/base/reward/rate?mode=PVE');
}

export const setScoreTwitterMsg = async (msg, wallet) => {
  return await axios.patch(SERVER_URL + '/api/v1/admin/social/update', 
    { msg, wallet}, 
    {
      headers: {
        Authorization: `bearer ${token}`,
      }
    });
}
// ------

export const getTwitterMsg = async () => {
  console.log("getTwitterMsg-------------------");
  return await axios.get(SERVER_URL + '/api/v1/base/social/get');
}

export const getUserInfo = async (token) => {
  return await axios.get(SERVER_URL + '/api/v1/user/info', {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
}

export const getDepositAddress = async () => {
  return await axios.get(SERVER_URL + '/api/v1/base/deposit/address', {
  });
}

export const updateScore = async (score, wallet, token) => {
  return await axios.post(SERVER_URL + '/api/v1/user/score/update', { score, wallet }, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
}

export const claimToken = async (score, wallet, mode, token) => {
  console.log("claim Token mode =", mode);
  console.log("score =", score);
  return await axios.post(SERVER_URL + '/api/v1/user/token/claim', { score, wallet,mode }, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
}


export const setMyNFT = async (nft_colletcion) => {
  if(!token) {
    toast.error("Please log in");
    return;
  }
  return await axios.patch(SERVER_URL + '/api/v1/user/nft/update/' + nft_colletcion, {}, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
}

