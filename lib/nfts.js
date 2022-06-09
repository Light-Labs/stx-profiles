import {
  callReadOnlyFunction,
  ClarityType,
  uintCV,
} from "@stacks/transactions";
import { DEFAULT_IMAGE, DEFAULT_NAME, fetchPrivate } from "./profile";

export async function fetchNFTs(address) {
  const response = await fetchPrivate(
    `https://api.stacksdata.info/nft/assets/${address}`
  );
  return await response.json();
}

export async function fetchNftImage(asset) {
  const [contractAddress, tail] = asset.split(".");
  const [contractName, space, assetName, nftId] = tail.split(":");
  console.log({ contractName, space, assetName, nftId });
  return fetchNFTImageByDetails({ contractAddress, contractName, id });
}
export async function fetchNFTImageByDetails({
  contractAddress,
  contractName,
  id,
  indexer,
}) {
  if (true || indexer === "gamma") {
    const response = await fetchPrivate(
      `https://gamma.io/api/v1/collections/${contractAddress}.${contractName}/${id}`
    );
    const metadata = await response.json();
    return {
      image: metadata.data.token_metadata.image_url,
      name: metadata.data.token_metadata.name,
    };
  } else {
    try {
      const response = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "get-token-uri",
        functionArgs: [uintCV(id)],
        senderAddress: contractAddress,
      });
      if (
        response.type === ClarityType.ResponseOk &&
        response.value.type === ClarityType.OptionalSome
      ) {
        let url = response.value.value.data;
        url = url.replace("{id}", id);
        try {
          const nftMetaDataResponse = await fetchPrivate(url);
          const nftMetaData = await nftMetaDataResponse.json();
          console.log(nftMetaData);

          return {
            image: nftMetaData.image || DEFAULT_IMAGE,
            name: nftMetaData.name || DEFAULT_NAME,
          };
        } catch (e) {
          console.log(e);
          // return default image
        }
      }
    } catch (e) {
      console.log(e);
      // return default image
    }
  }
  return { image: DEFAULT_IMAGE, name: DEFAULT_NAME };
}
