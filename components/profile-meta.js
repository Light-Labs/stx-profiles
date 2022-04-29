import Head from "next/head";

export default function ProfileMeta({ profile }) {
  return (
    <Head>
      <title>{profile ? profile.data.name : "Profile"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
