import { mainnet } from "viem/chains";
import { useReadContracts, useWriteContract } from "wagmi";
import { abi } from "./abi";
import { Address } from "viem";

const useSendToken = () => {
  const tokenContract = {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    abi: abi,
  } as const;

  const { writeContractAsync } = useWriteContract();
  const {
    data,
    isError: balanceError,
    isLoading,
  } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: "balanceOf",
        args: ["0x86Dc20e8180EA9A8eF658fc87bdF34696383B68A"], // Replace with the sender's address
        chainId: mainnet.id,
      },
      {
        ...tokenContract,
        functionName: "name",
        chainId: mainnet.id,
      },
    ],
  });

  // Fallback values for balance and token name
  const balance =
    data && data[0]?.status === "success"
      ? Number(data[0].result.toString())
      : 0;
  const tokenName =
    data && data[1]?.status === "success" ? data[1].result : "Unknown Token";

  const sendTransaction = async (amount: number, recipientAddress: string) => {
    if (balanceError) {
      throw new Error("Error fetching balance");
    }

    if (balance < amount) {
      throw new Error("Insufficient balance");
    }

    const transactionHash = await writeContractAsync({
      abi: abi,
      address: tokenContract.address,
      functionName: "transferFrom",
      args: [
        "0x86Dc20e8180EA9A8eF658fc87bdF34696383B68A", // Replace with sender's address
        recipientAddress as Address,
        BigInt(amount * 10 ** 6),
      ],
    });

    return transactionHash;
  };

  return {
    balance,
    tokenName,
    sendTransaction,
    balanceError,
    isLoading,
  };
};

export { useSendToken };
