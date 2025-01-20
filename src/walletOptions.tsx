import { useConnect } from "wagmi";

function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name === "Injected" ? null : connector.name}
    </button>
  ));
}

export { WalletOptions };
