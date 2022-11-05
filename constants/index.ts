
  export interface Networks {
    [key: number]: string;
  }
  export const walletConnectSupportedNetworks: Networks = {
    // Add your network rpc URL here
    5: "https://goerli.infura.io/v3/YOUR-API-KEY"
  };

  // Network chain ids
  export const supportedMetamaskNetworks = [5];

  export const LIBRARY_ADDRESS = "0xD771d3De0B4A8C55B32c88422c67aeA783f53760";