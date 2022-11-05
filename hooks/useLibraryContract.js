import ABI from "../contracts/Library.json";
import useContract from "./useContract";

export default function useLibraryContract(contractAddress) {
  return useContract(contractAddress, ABI);
}
