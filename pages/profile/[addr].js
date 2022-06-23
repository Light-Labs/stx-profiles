import { useConnect } from "@stacks/connect-react";
import { contractPrincipalCV, uintCV } from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
import { userSession } from "../_app";
import {
  OWNED_PROFILES_COMMISSION_CONTRACT,
  OWNED_PROFILES_CONTRACT,
} from "../../lib/nft-profile-registry";
import { fetchNFTs } from "../../lib/nfts";
import ListOfNfts from "../../components/list-of-nfts";

export default function SingleProfileEditor({ nftList }) {
  const { doContractCall } = useConnect();

  const handleLogout = () => {
    userSession.signUserOut("/");
  };

  const registerNft = async (selectedNft) => {
    if (selectedNft) {
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
    } else {
      handleLogin();
    }
  };

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div>
        <h3 style={{ textAlign: "center" }}>
          Select NFT to register as your NFT Profile
        </h3>
        <ListOfNfts nfts={nftList} onSelect={registerNft} />
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const userAddr = context.params.addr;
  const nftList = await fetchNFTs(userAddr);
  return {
    props: { nftList: nftList },
  };
}
