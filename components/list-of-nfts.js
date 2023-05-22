import { useState } from "react";
import NFT from "./nft";

export default function ListOfNFTs({ nfts }) {
  const [showCount, setShowCount] = useState(6);

  const handleLoadMore = () => {
    setShowCount(Math.min(showCount + 6, nfts.length));
  };
  return (
    <div style={{ marginBottom: "50px" }}>
      {nfts ? (
        <>
          <div className="nft-list">
            {nfts.slice(0, showCount).map((nft, i) => {
              return <NFT nft={nft} key={i} />;
            })}
          </div>
          {!!(showCount < nfts.length) && (
            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={handleLoadMore}>Load More</button>
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
