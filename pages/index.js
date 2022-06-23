import { useEffect, useState } from "react";
import Head from "next/head";
import { userSession } from "./_app";

export default function Home() {
  const [userAddr, setUserAddr] = useState("");

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserAddr(userData.profile.stxAddress.mainnet);
      });
    } else if (userSession.isUserSignedIn()) {
      let userData = userSession.loadUserData();
      setUserAddr(userData.profile.stxAddress.mainnet);
    }
  }, [userSession]);

  return (
    <>
      <Head>
        <title>Universal NFT Profiles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="title">Welcome to Universal NFT Profiles!</h1>

      <p className="description">
        We support owl.links, public Stacks profiles, app profiles and nft
        profiles.
      </p>

      <div className="grid">
        <a
          href="https://docs.stacks.co/build-apps/references/authentication"
          className="card"
        >
          <h3>Public Stacks Profiles &rarr;</h3>
          <p>Find in-depth information about public profiles.</p>
        </a>
        <a href="/friedger.id" className="card">
          <h3>friedger &rarr;</h3>
        </a>
      </div>

      <div className="grid">
        <a href="https://owl.link" className="card">
          <h3>Owl Links &rarr;</h3>
          <p>Find in-depth information about Owl links.</p>
        </a>
        <div className="card">
          <a href="/raja.btc">
            <h3>Raja &rarr;</h3>
          </a>
          <a href="/jumpoutgirls.btc">
            <h3>jumpoutgirls &rarr;</h3>
          </a>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>App Profiles</h3>
          <p>Some apps create a public or a private profile for their users.</p>
        </div>
        <a href="/friedger.btc" className="card">
          <h3>friedger &rarr;</h3>
        </a>
      </div>

      <div className="grid">
        <a
          href="https://docs.stacks.co/build-apps/references/authentication"
          className="card"
        >
          <h3>NFT Profiles &rarr;</h3>
          <p>Use an NFT as your profile for an address.</p>
        </a>

        <a href="/SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X" className="card">
          <h3>SPN4Y...R8C3X &rarr;</h3>
        </a>
        <a href={`/profile/${userAddr}`} className="card">
          <p>A simple editor for NFT Profiles. &rarr;</p>
        </a>
      </div>
    </>
  );
}
