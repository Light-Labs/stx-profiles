import { useRouter } from "next/router";
import { NftProfileEditor } from "../../components/nft-profile-editor";
import { PublicProfileEditor } from "../../components/public-profile-editor";
import { UserAuth } from "../../components/user-auth";
import { fetchNFTs } from "../../lib/nfts";
import { fetchPublicProfile, fetchUsername } from "../../lib/profile";

export default function SingleProfileEditor({
  nftList,
  username,
  profile,
}) {
  const router = useRouter();

  if (router?.isFallback) {
    return <div>Loading...</div>;
  }

  const hasUsername = username !== undefined && username !== null;

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div style={{ textAlign: "center" }}>
        <UserAuth
          username={username}
          profile={profile}
          addr={router.query.addr}
        />
        {hasUsername ? (
          <PublicProfileEditor
            profile={profile}
            username={username}
            nftList={nftList}
          />
        ) : (
          <NftProfileEditor nftList={nftList} />
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const userAddr = context.params.addr;
  const [nftList, username] = await Promise.all([
    fetchNFTs(userAddr),
    fetchUsername(userAddr),
  ]);
  const profile = username ? await fetchPublicProfile(username) : null;
  return {
    props: { nftList, username, profile },
  };
}
