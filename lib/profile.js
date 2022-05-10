import {
  Configuration,
  NamesApi,
  ReadOnlyFunctionArgsFromJSON,
  SmartContractsApi,
} from "@stacks/blockchain-api-client";
import {
  callReadOnlyFunction,
  ClarityType,
  stringAsciiCV,
  stringUtf8CV,
} from "@stacks/transactions";

import { lookupProfile } from "@stacks/auth";

const namesApi = new NamesApi(
  new Configuration({
    basePath: "https://stacks-node-api.mainnet.stacks.co",
  })
);

const DEFAULT_NAME = "Unnamed";
const DEFAULT_DESCRIPTION = "";
const DEFAULT_IMAGE = "/stacks.png";

export async function fetchProfile(name) {
  console.log("trying names api");
  const nameInfo = await namesApi.getNameInfo({
    name,
  });
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
    const res = await fetch(tokenUriCV.value.value.data);
    const data = await res.json();
    return {
      nameOwner: nameInfo.address,
      data: {
        name: data.name || DEFAULT_NAME,
        description: data.bio || DEFAULT_DESCRIPTION,
        img: data.img || DEFAULT_IMAGE,
        links: data.links || [],
      },
    };
  } else {
    console.log("trying profile");
    const data = await lookupProfile({ username: name });
    if (data) {
      console.log(data);
      const img = data?.image[0]?.contentUrl || DEFAULT_IMAGE;
      const profile = {
        nameOwner: nameInfo.address,
        data: {
          name: data.name || DEFAULT_NAME,
          description: data.description || DEFAULT_DESCRIPTION,
          img,
          links: [],
        },
      };
      console.log(profile);
      return profile;
    } else {
      console.log("failed");
      throw new Error("no profile found");
    }
  }
}
