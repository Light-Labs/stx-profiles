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
    <div className="container">
      {id && !isNaN(id) ? (
        <img className="cell"
          width={200}
          height={200}
          onClick={() => onSelect({ contractAddress, contractName, id })}
          src={image && image.image ? image.image.replace("ipfs://", "https://images.gamma.io/ipfs/") : "/stacks.png"}
        />
      ) : (
        <img width={200} height={200} src="/stacks.png" />
      )}
      <br />
      {contractName} #{id}
    </div>
  );
}
