import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";

const CHAIN_IDS = {
  FANTOM_MAINNET: 250,
};

export const RARITY_CONTRACT = {
  [CHAIN_IDS.FANTOM_MAINNET]: "0xce761d788df608bd21bdd59d6f4b54b2e27f25bb",
};

export const DARK_PLANET_CONTRACT = {
  [CHAIN_IDS.FANTOM_MAINNET]: "0xF43523e83E1E526C4B1a65250f4d5Ebacf60f815",
};

export const isAddress = (value) => {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
};

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

export const getContract = (address, ABI, library, account) => {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
};
