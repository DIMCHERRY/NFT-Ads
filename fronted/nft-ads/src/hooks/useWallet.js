import { createContext, useReducer, useEffect, useRef } from "react";
import { message } from "antd";
import Web3 from "web3";
import { handleError } from "../util/util";

export const { Provider: WalletProvider, Consumer: WalletCustomer } = createContext();

const handleDispatch = (state, action) => {
  switch (action.type) {
    case "init":
      return action.payload;
    case "address":
      return { ...state, address: Array.isArray(action.payload) ? action.payload[0] : undefined };
    case "networkVersion":
      return { ...state, networkVersion: action.payload };
    case "isMetaMask":
      return { ...state, isMetaMask: action.payload };
    default:
      throw new Error("invalid action type for WalletContext");
  }
};

export const useWallet = () => {
  const web3 = useRef(null);

  const getInitialState = () => {
    if (typeof window.ethereum !== "object") {
      message.warn("Metamask plugin is needed!");
      return {};
    }
    const myWeb3 = new Web3(window.ethereum);
    web3.current = myWeb3;
    window.myWeb3 = myWeb3;

    return {
      address: myWeb3.currentProvider.selectedAddress,
      networkVersion: myWeb3.currentProvider.networkVersion,
      isMetaMask: myWeb3.currentProvider.isMetaMask
    };
  };

  const [walletState, dispatch] = useReducer(handleDispatch, getInitialState());

  const validateMetamask = async () => {
    if (typeof window.ethereum !== "object") {
      message.warn("Metamask plugin is needed!");
      return false;
    }
    if (typeof web3.current !== "object") {
      message.warn("Metamask plugin is needed!");
      return false;
    }
    if (!web3.current.currentProvider.isMetaMask) {
      message.warn("Metamask plugin is needed!");
      return false;
    }
    if (!Boolean(web3.current.currentProvider.selectedAddress)) {
      message.warn("Metamask need login!");
      return false;
    }
    if (web3.current.currentProvider.networkVersion !== "80001") {
      message.warn("Switch network to Polygon Testnet, please!");
      return false;
    }

    return true;
  };

  const changeAddress = (address) => dispatch({ type: "address", payload: address });
  const changeNetVersion = (networkVersion) =>
    dispatch({ type: "networkVersion", payload: Number(networkVersion) });
  // const changeIsMatemask = (isMetaMask) => dispatch({ type: 'isMatemask', payload: isMetaMask });
  const disconnectMetamask = () => {
    dispatch({ type: "init", payload: {} });
    web3.current.setProvider(null);
  };
  const connectMetamask = async () => {
    if (typeof window.ethereum !== "object" || !window.ethereum.isMetaMask) {
      message.warn("Metamask plugin is needed!");
      return;
    }
    web3.current.setProvider(window.ethereum);
    window.myWeb3 = web3.current;
    const myWeb3 = web3.current;
    if (web3.current.currentProvider.networkVersion !== "80001") {
      message.warn("Switch network to Polygon Testnet, please!");
      return;
    }
    try {
      await myWeb3.eth.requestAccounts();
      const address = new Promise((resolve, reject) => {
        myWeb3.eth.getCoinbase((err, addr) => {
          if (err) {
            reject(err);
          }
          if (!addr) {
            reject("Connect to metamask has failed!");
          }
          resolve(addr);
        });
      });
      dispatch({
        type: "init",
        payload: {
          address: myWeb3.currentProvider.selectedAddress,
          networkVersion: myWeb3.currentProvider.networkVersion,
          isMetaMask: myWeb3.currentProvider.isMetaMask
        }
      });
      if (!address) {
        throw new Error("Failed to login!");
      }
      return address;
    } catch (error) {
      handleError(error, "connect metamask");
    }
  };

  useEffect(() => {
    if (!web3.current) return;
    window.cookieStore.get("token").then((token) => {
      if (!token) {
        disconnectMetamask();
      }
    });
    web3.current.currentProvider.on("accountsChanged", changeAddress);
    web3.current.currentProvider.on("chainChanged", changeNetVersion);
  }, []);

  return { walletState, validateMetamask, web3, connectMetamask, disconnectMetamask };
};
