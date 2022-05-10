import Head from "next/head";
import ProfilePage from "../components/profile-page";
import { fetchProfile } from "../lib/profile";

const BNS_NAME = /^[a-zA-Z0-9_]+$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }) {
  const { name } = params;
  console.log(name);
  try {
    const profile = await fetchProfile(name);
    console.log(profile);
    return profile ? { props: { profile } } : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export default function Name({ profile }) {
  return <ProfilePage profile={profile} />;
}
