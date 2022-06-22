import { useEffect, useState } from "react";
import { fetchNFTImageByDetails } from "../lib/nfts";

export default function NFT({ nft, onSelect }) {
  const [image, setImage] = useState(null);

  const [contract, assetName] = nft.assetIdentifier.split("::");
  const [contractAddress, contractName] = contract.split(".");

  let id;
  try {
    id = parseInt(nft.value);
  } catch (e) {
    // ignore
  }

  useEffect(() => {
    if (id && !isNaN(id)) {
      fetchNFTImageByDetails({ contractAddress, contractName, id }).then(
        (imageDetails) => {
          setImage(imageDetails);
        }
      );
    }
  }, [contractAddress, contractName, id, setImage]);

  return (
    <div>
      {id && !isNaN(id) ? (
        <img
          className="cell"
          width={300}
          height={300}
          onClick={() => onSelect({ contractAddress, contractName, id })}
          src={
            image && image.image
              ? image.image.replace("ipfs://", "https://images.gamma.io/ipfs/")
              : "/stacks.png"
          }
        />
      ) : (
        <img width={300} height={300} src="/stacks.png" />
      )}
      <br />
      <p style={{ textAlign: "center" }}>
        {contractName} {id && !isNaN(id) ? `#${id}` : ""}
      </p>
      <style jsx global>
        {`
          .cell:hover {
            border-color: black;
            border-width: 2px;
            border-style: solid;
          }
        `}
      </style>
    </div>
  );
}
