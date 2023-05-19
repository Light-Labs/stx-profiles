import {
  openProfileUpdateRequestPopup,
  useConnect,
} from "@stacks/connect-react";
import { StacksMainnet } from "@stacks/network";
import { contractPrincipalCV, uintCV } from "@stacks/transactions";
import { useRouter } from "next/router";
import { useState } from "react";
import ListOfNfts from "../../components/list-of-nfts";
import {
  OWNED_PROFILES_COMMISSION_CONTRACT,
  OWNED_PROFILES_CONTRACT,
} from "../../lib/nft-profile-registry";
import { fetchNFTImageByDetails, fetchNFTs } from "../../lib/nfts";
import { fetchPublicProfile, fetchUsername } from "../../lib/profile";
import { userSession } from "../_app";

export default function SingleProfileEditor({ nftList, username, profile }) {
  const { router } = useRouter();
  if (router?.isFallback) {
    return <div>Loading...</div>;
  }

  const { doContractCall } = useConnect();

  const handleLogout = () => {
    userSession.signUserOut("/");
  };

  const hasUsername = username !== undefined;
  const [name, setName] = useState(profile?.name || username);
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

  const updateProfile = async () => {
    const selectedNft = nft;
    if (!selectedNft) {
      return;
    }
    const imageData = await fetchNFTImageByDetails({
      contractAddress: selectedNft.contractAddress,
      contractName: selectedNft.contractName,
      id: selectedNft.id,
    });
    console.log({ imageData });
    const newProfile = {
      "@type": "Person",
      image: imageData.image,
    };
    // add name only if user changed it
    if (profile?.name !== name) {
      newProfile.name = name;
    }

    openProfileUpdateRequestPopup({
      profile: newProfile,
      onFinish: (p) => {
        console.log(p);
      },
    });
  };

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div style={{ textAlign: "center" }}>
        {hasUsername && (
          <>
            <h1>{username}</h1>
            <h3>Your name</h3>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
            ></input>
          </>
        )}
        <h3>
          Select NFT to register as your{" "}
          {hasUsername ? "public/universal profile" : "NFT Profile"}
        </h3>
        <ListOfNfts nfts={nftList} onSelect={setNft} />
        <button onClick={hasUsername ? updateProfile : registerNft}>
          {hasUsername ? "Update Profile" : "Register NFT"}
        </button>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const userAddr = context.params.addr;
  const nftList = await fetchNFTs(userAddr);

  const username = await fetchUsername(userAddr);
  const profile = username ? await fetchPublicProfile(username) : undefined;
  return {
    props: { nftList, username, profile },
  };
}
