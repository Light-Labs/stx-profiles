import { useState, useEffect } from "react";
import { fetchNFTs } from "../lib/nfts";
import NFT from "./nft";

export default function ListOfNFTs({ userAddress, onSelect }) {
  const [nfts, setNfts] = useState(null);

  const fetchAndSetNfts = async (addr) => {
    const nftList = await fetchNFTs(addr);
    setNfts(nftList);
  };

  useEffect(() => {
    fetchAndSetNfts(userAddress);
  }, [userAddress]);

  return (
    <>
      {nfts ? (
        nfts.map((nft) => <NFT nft={nft} onSelect={onSelect} />)
      ) : (
        <div>Loading..</div>
      )}
    </>
  );
}
