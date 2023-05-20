import { useEffect, useState } from "react";
import { fetchNFTImageByDetails } from "../lib/nfts";
import { Field, useFormikContext } from "formik";

export default function NFT({ nft, key }) {
  const [image, setImage] = useState(null);

  const { values } = useFormikContext();
  const [contract, assetName] = nft.assetIdentifier.split("::");
  const [contractAddress, contractName] = contract.split(".");
  const fullQualifiedNftId = `${nft.assetIdentifier}::${nft.value}`;

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
        <div>
          <Field
            id={`checknft-${fullQualifiedNftId}`}
            type="radio"
            name="nft"
            value={fullQualifiedNftId}
          />
          <label htmlFor={`checknft-${fullQualifiedNftId}`}>
            <img
              className="cell"
              width={300}
              height={300}
              src={
                image && image.image
                  ? image.image.replace(
                      "ipfs://",
                      "https://images.gamma.io/ipfs/"
                    )
                  : "/stacks.png"
              }
            />
          </label>
        </div>
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
