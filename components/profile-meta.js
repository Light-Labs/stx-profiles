import Head from "next/head";

export default function ProfileMeta({ name }) {
  return (
    <Head>
      <title>{name || "Profile"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
