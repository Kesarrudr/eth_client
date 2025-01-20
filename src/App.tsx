import { useState } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import "./App.css";
import { useSendToken } from "./sendHook.tsx";
import { WalletOptions } from "./walletOptions";

function App() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ address });
  const { balance, sendTransaction, balanceError, tokenName } = useSendToken();

  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    const addressHTML = document.getElementById("address") as HTMLInputElement;
    const amountHTML = document.getElementById("amount") as HTMLInputElement;

    if (addressHTML && amountHTML) {
      const recipient = addressHTML.value;
      const amount = Number(amountHTML.value);

      setLoading(true);
      setError(null);
      setTransactionHash(null);

      try {
        const hash = await sendTransaction(amount, recipient);
        setTransactionHash(hash);
      } catch (err: unknown) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {address == null ? <WalletOptions /> : null}

      {address ? (
        <div>
          <p>Your Address: {address}</p>
          <p>Your Balance: {balanceData?.formatted || "Loading..."}</p>
          <p>
            Token Name: {balanceError ? "Error fetching balance" : tokenName}
          </p>
          <p>Balance: {balanceError ? "Error fetching balance" : balance}</p>
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}

      <input type="text" placeholder="Recipient Address" id="address" />
      <input type="number" placeholder="Amount" id="amount" />
      <button onClick={onSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>
      {address != null ? (
        <button onClick={() => disconnect()}>Disconnect</button>
      ) : null}

      {transactionHash && (
        <div>
          <p>Transaction successful!</p>
          <p>
            Hash:{" "}
            <a
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

export default App;
