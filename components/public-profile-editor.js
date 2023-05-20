import { openProfileUpdateRequestPopup } from "@stacks/connect";
import { Field, Form, Formik } from "formik";
import { fetchNFTImageByDetails } from "../lib/nfts";
import { createImageForProfile } from "../lib/profile";
import ListOfNFTs from "./list-of-nfts";

export const PublicProfileEditor = ({ nftList, profile, username }) => {
  const updateProfile = async (values) => {
    const fullyQualifiedNftId = values.nft;

    const newProfile = {
      "@type": "Person",
    };
    // add name only if user changed it
    if (profile?.name !== values.name) {
      newProfile.name = values.name;
    }
    if (profile?.description !== values.description) {
      newProfile.description = values.description;
    }
    if (fullyQualifiedNftId) {
      const [contract, assetName, id] = fullyQualifiedNftId.split("::");
      if (!contract || !assetName || !id) {
        throw new Error(fullyQualifiedNftId);
      }
      const [contractAddress, contractName] = contract.split(".");
      const imageData = await fetchNFTImageByDetails({
        contractAddress,
        contractName,
        id,
      });

      newProfile.image = createImageForProfile(profile, imageData.image);
    }

    openProfileUpdateRequestPopup({
      profile: newProfile,
      onFinish: (p) => {
        console.log(p);
      },
    });
  };

  return (
    <>
      <h1>{username}</h1>
      <Formik
        initialValues={{ ...profile, nft: undefined }}
        onSubmit={(values, action) => {
          updateProfile(values);
        }}
      >
        {(props) => (
          <Form>
            <h3>Your name</h3>

            <Field name="name" placeholder="Name" />
            <br />
            <Field name="description" placeholder="Bio" />
            <br />
            {nftList.length > 0 && (
              <>
                <h3>Select NFT as your public/universal profile picture</h3>
                <ListOfNFTs nfts={nftList} />
              </>
            )}
            <button type="submit">Update Profile</button>
          </Form>
        )}
      </Formik>
    </>
  );
};
