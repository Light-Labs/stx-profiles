import { lookupProfile } from "@stacks/auth";
import { Configuration, NamesApi } from "@stacks/blockchain-api-client";
import { createFetchFn } from "@stacks/network";
import {
  ClarityType,
  callReadOnlyFunction,
  cvToString,
  standardPrincipalCV,
  stringAsciiCV,
} from "@stacks/transactions";
import { isAddress } from "./address";
import { OWNED_PROFILES_CONTRACT } from "./nft-profile-registry";
import { fetchNftImage } from "./nfts";

export const fetchPrivate = createFetchFn();

const config = new Configuration({
  basePath: "https://stacks-node-api.mainnet.stacks.co",
});
const namesApi = new NamesApi(config);

export const DEFAULT_NAME = "Unnamed";
export const DEFAULT_DESCRIPTION = "";
export const DEFAULT_IMAGE = "/stacks.png";

export async function fetchProfiles(user) {
  let name = null,
    address = null,
    profiles = null;

  if (isAddress(user)) {
    address = user;

    // use first registered name for the address
    const namesOwned = await namesApi.getNamesOwnedByAddress({
      address: user,
      blockchain: "stacks",
    });
    if (namesOwned.names.length > 0) {
      name = namesOwned.names[0];
    }
  } else {
    name = user;
  }

  console.log({ name, address });
  if (name) {
    console.log("fetch profiles by name", name);
    profiles = await fetchProfilesByName({ name, address });
    address = profiles.nameOwner;
  }

  console.log("fetch profiles by address", address);
  const nftProfile = await fetchNftProfile(address);

  return Object.assign(profiles, {
    nameOwner: address,
    nftProfile,
  });
}

export async function fetchProfilesByName({ name, address }) {
  if (!address) {
    console.log("trying names api");
    const nameInfo = await namesApi.getNameInfo({
      name,
    });
    console.log({ nameInfo });
    address = nameInfo.address;
  }

  const owlProfile = {
    nameOwner: address,
    data: await fetchOwlProfile(name),
  };

  let publicProfile = null,
    xckAppProfile = null,
    gammaAppProfile = null;

  console.log("trying profile");
  const data = await fetchPublicProfile(name);
  if (data) {
    console.log(data);
    if (data.image) {
      const img =
        (typeof data?.image === "string"
          ? data.image
          : typeof data?.image === string
          ? data?.image[0]?.contentUrl
          : DEFAULT_IMAGE) || DEFAULT_IMAGE;
      publicProfile = {
        nameOwner: address,
        data: {
          name: data.name || DEFAULT_NAME,
          description: data.description || DEFAULT_DESCRIPTION,
          img,
          links: [],
        },
      };
      console.log(publicProfile);
    }
    if (data.appsMeta["https://xck.app"]) {
      const xckData = await fetchXckAppProfile(data);
      if (xckData) {
        xckAppProfile = {
          nameOwner: address,
          data: xckData,
        };
      }
    }
    if (data.appsMeta["https://gamma.io"]) {
      gammaAppProfile = {
        nameOwner: address,
        data: await fetchGammaAppProfile(data),
      };
    }
  } else {
    console.log("no public profile");
  }

  return {
    nameOwner: address,
    publicProfile,
    owlProfile,
    xckAppProfile,
    gammaAppProfile,
  };
}

export async function fetchPublicProfile(name) {
  try {
    const profile = await lookupProfile({ username: name });
    return profile;
  } catch (e) {
    console.log("error in lookup profile", e);
    return null;
  }
}

export async function fetchNftProfile(address) {
  console.log("trying nft profile", address);
  const { contractAddress, contractName } = OWNED_PROFILES_CONTRACT;
  let userProfileCV;
  try {
    userProfileCV = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-unverified-profile",
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: OWNED_PROFILES_CONTRACT.contractAddress,
    });
  } catch (e) {
    console.log(e);
    userProfileCV = { type: ClarityType.ResponseErr };
  }
  if (userProfileCV.type === ClarityType.OptionalSome) {
    const ownableCV = userProfileCV.value.data["contract"];

    try {
      userProfileCV = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "resolve-principal-to-profile",
        functionArgs: [standardPrincipalCV(address), ownableCV],
        senderAddress: OWNED_PROFILES_CONTRACT.contractAddress,
      });
    } catch (e) {
      console.log(e);
      userProfileCV = { type: ClarityType.ResponseErr };
    }
    if (userProfileCV.type === ClarityType.ResponseOk) {
      const ownableCV = userProfileCV.value.value.data["contract"];
      const idCV = userProfileCV.value.value.data["id"];
      const { image, name } = await fetchNftImage(
        `${cvToString(ownableCV)}:::${idCV.value}`
      );

      return {
        nameOwner: address,
        data: {
          name: name,
          description: DEFAULT_DESCRIPTION,
          img: image || DEFAULT_IMAGE,
          links: [],
        },
      };
    }
  }
  return null;
}

export async function fetchXckAppProfile(publicProfile) {
  const dataResponse = await fetchPrivate(
    `${publicProfile.appsMeta["https://xck.app"].storage}myUserConfig.json`
  );
  if (dataResponse.status >= 400) {
    return null;
  }
  const appDataText = await dataResponse.text();
  console.log({ appDataText });
  const appData = JSON.parse(JSON.parse(appDataText));
  console.log("app data", appData.profileName);
  const profile = {
    name: appData.profileName || publicProfile.name || DEFAULT_NAME,
    description: publicProfile.description || DEFAULT_DESCRIPTION,
    img: DEFAULT_IMAGE, //"data:image/png;base64," + appData.profileAvatar,
    links: [],
  };
  console.log(profile);
  return profile;
}

export async function fetchGammaAppProfile(publicProfile) {
  const dataResponse = await fetchPrivate(
    `${publicProfile.appsMeta["https://gamma.io"].storage}app-data/profile.json`
  );
  const appData = await dataResponse.json();
  let img;
  if (appData.avatar) {
    img = await fetchNftImage(appData.avatar);
  } else {
    img = DEFAULT_IMAGE;
  }
  const profile = {
    name: appData.profileName || publicProfile.name || DEFAULT_NAME,
    description:
      appData.bio || publicProfile.description || DEFAULT_DESCRIPTION,
    img,
    links: [],
  };
  console.log(profile);
  return profile;
}

export async function fetchOwlProfile(name, address) {
  console.log("trying owl");
  let tokenUriCV;
  try {
    tokenUriCV = await callReadOnlyFunction({
      contractAddress: "SP3A6FJ92AA0MS2F57DG786TFNG8J785B3F8RSQC9",
      contractName: "owl-link",
      functionName: "get-token-uri",
      functionArgs: [stringAsciiCV(name)],
      senderAddress: "SP3A6FJ92AA0MS2F57DG786TFNG8J785B3F8RSQC9",
    });
  } catch (e) {
    console.log(e);
    tokenUriCV = { type: ClarityType.ResponseErr };
  }
  if (tokenUriCV.type === ClarityType.ResponseOk) {
    const res = await fetchPrivate(tokenUriCV.value.value.data);
    const data = await res.json();
    return {
      name: data.name || DEFAULT_NAME,
      description: data.bio || DEFAULT_DESCRIPTION,
      img: data.img || DEFAULT_IMAGE,
      links: data.links || [],
    };
  }
  return null;
}

export async function fetchUsername(userAddr) {
  if (isAddress(userAddr)) {
    // use first registered name for the address
    const namesOwned = await namesApi.getNamesOwnedByAddress({
      address: userAddr,
      blockchain: "stacks",
    });
    if (namesOwned.names.length > 0) {
      return namesOwned.names[0];
    }
  }

  return null;
}

/**
 * Creates an image string or image object array that can be
 * used for updating profile.image
 *
 * Tries to preserve the current structure and data as much as possible.
 *
 * @param {PublicPersonProfile} profile
 * @param {string} imageUrl
 * @returns string | ImageObject[]
 */
export function createImageForProfile(profile, imageUrl) {
  if (!profile) {
    return [avatarImageObject(imageUrl)];
  }
  const imageType = typeof profile.image;
  if (imageType === "string") {
    return imageUrl;
  } else if (imageType === "array") {
    const imageList = profile.image;
    imageList[0] = avatarImageObject(imageUrl);
    return imageList;
  }
}

function avatarImageObject(imageUrl) {
  return {
    "@type": "ImageObject",
    name: "avatar",
    contentUrl: imageUrl,
  };
}
