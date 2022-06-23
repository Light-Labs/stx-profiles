import { useState, useEffect } from "react";
import { useConnect } from "@stacks/connect-react";
import { userSession, appDetails } from "../pages/_app";
import {
  OWNED_PROFILES_COMMISSION_CONTRACT,
  OWNED_PROFILES_CONTRACT,
} from "../lib/nft-profile-registry";
import {
  bufferCV,
  bufferCVFromString,
  contractPrincipalCV,
  hash160,
  uintCV,
} from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
import ListOfNfts from "./list-of-nfts";

export default function NftProfileEditor({ profile }) {
  const { sign, authenticate, doContractCall } = useConnect();
  const [stacksUser, setStacksUser] = useState(null);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setStacksUser(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setStacksUser(userSession.loadUserData());
    }
  }, [userSession]);

  const handleLogin = () => {
    authenticate({
      appDetails,
      onFinish: ({ userSession }) => setStacksUser(userSession.loadUserData()),
    });
  };

  const handleLogout = () => {
    userSession.signUserOut("/");
  };

  const registerNft = async (selectedNft) => {
    if (stacksUser && selectedNft) {
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
      {stacksUser ? null : (
        <button onClick={handleLogin}>Sign-In with Stacks</button>
      )}
      {stacksUser ? (
        <div>
          <h3 style={{ textAlign: "center" }}>
            Select NFT to register as your NFT Profile
          </h3>
          <ListOfNfts
            userAddress={stacksUser.profile.stxAddress.mainnet}
            onSelect={registerNft}
          />
        </div>
      ) : null}
      {stacksUser ? <button onClick={handleLogout}>Logout</button> : null}
    </div>
  );
}
