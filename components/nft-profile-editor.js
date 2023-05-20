import { useState } from "react";
import ListOfNFTs from "./list-of-nfts";

export const NftProfileEditor = ({ nftList }) => {
  const [nft, setNft] = useState();

  const registerNft = async () => {
    const selectedNft = nft;
    if (!selectedNft) {
      return;
    }
    doContractCall({
      contractAddress: OWNED_PROFILES_CONTRACT.contractAddress,
      contractName: OWNED_PROFILES_CONTRACT.contractName,
      functionName: "register",
      functionArgs: [
        contractPrincipalCV(
          selectedNft.contractAddress,
          selectedNft.contractName
        ),
        uintCV(selectedNft.id),
        contractPrincipalCV(
          OWNED_PROFILES_COMMISSION_CONTRACT.contractAddress,
          OWNED_PROFILES_COMMISSION_CONTRACT.contractName
        ),
      ],
      network: new StacksMainnet(),
      onFinish: (data) => {
        console.log(data);
      },
    });
  };

  if (nftList.length === 0) {
    return <>The address does not own any NFTs</>;
  }

  return (
    <>
      <h3>Select NFT to register as your Nft profile</h3>
      <ListOfNFTs nfts={nftList} onSelect={setNft} />
      <button onClick={registerNft}>Register NFT</button>
    </>
  );
};
