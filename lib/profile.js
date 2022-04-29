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

const namesApi = new NamesApi(
  new Configuration({
    basePath: "https://stacks-node-api.mainnet.stacks.co",
  })
);

export async function fetchProfile(name) {
  const nameInfo = await namesApi.getNameInfo({
    name,
  });
  const tokenUriCV = await callReadOnlyFunction({
    contractAddress: "SP3A6FJ92AA0MS2F57DG786TFNG8J785B3F8RSQC9",
    contractName: "owl-link",
    functionName: "get-token-uri",
    functionArgs: [stringAsciiCV(name)],
    senderAddress: "SP3A6FJ92AA0MS2F57DG786TFNG8J785B3F8RSQC9",
  });
  if (tokenUriCV.type === ClarityType.ResponseOk) {
    const res = await fetch(tokenUriCV.value.value.data);
    const data = await res.json();
    return { nameOwner: nameInfo.address, data };
  } else {
    throw new Error("owl link not found");
  }
}
