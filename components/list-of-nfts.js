import { useState, useEffect } from "react";
import { fetchNFTs } from "../lib/nfts";
import NFT from "./nft";

export default function ListOfNFTs({ userAddress, onSelect }) {
  const [nfts, setNfts] = useState(null);
  const [showCount, setShowCount] = useState(6);

  const fetchAndSetNfts = async (addr) => {
    const nftList = await fetchNFTs(addr);
    setNfts(nftList);
  };

  useEffect(() => {
    fetchAndSetNfts(userAddress);
  }, [userAddress]);

  const handleLoadMore = () => {
    setShowCount(Math.min(showCount + 6, nfts.length));
  };

  return (
    <div style={{ marginBottom: "50px" }}>
      {nfts ? (
        <>
          <div className="nft-list">
            {nfts.slice(0, showCount).map((nft, i) => {
              return <NFT nft={nft} onSelect={onSelect} key={i} />;
            })}
          </div>
          {!!(showCount < nfts.length) && (
            <div style={{ textAlign: "center" }}>
              <button onClick={handleLoadMore}>Load More</button>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: "30px 0" }}>Loading...</div>
      )}

      <style jsx>{`
        .nft-list {
          max-width: 1200px;
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
          margin: 70px 0 20px;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
