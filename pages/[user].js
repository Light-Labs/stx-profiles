import ProfilePage from "../components/profile-page";
import { fetchProfiles } from "../lib/profile";

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }) {
  const { user } = params;
  console.log(user);
  try {
    const profiles = await fetchProfiles(user);
    console.log(profiles);
    return profiles ? { props: { profiles } } : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export default function User({ profiles }) {
  return <ProfilePage profiles={profiles} />;
}
