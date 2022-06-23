import { useConnect } from "@stacks/connect-react";
import { appDetails } from "./_app";

export default function ProfileEditor() {
  const goToSingleProfile = (userData) => {
    let addr = userData.profile.stxAddress.mainnet;
    window.location.href = `/profile/${addr}`;
  };
  const { authenticate } = useConnect();

  const handleLogin = () => {
    authenticate({
      appDetails,
      onFinish: ({ userSession }) =>
        goToSingleProfile(userSession.loadUserData()),
    });
  };

  return (
    <div style={{ paddingBottom: "30px" }}>
      <button onClick={handleLogin}>Sign-In with Stacks</button>
    </div>
  );
}
