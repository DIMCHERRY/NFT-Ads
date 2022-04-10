import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

//where the Superfluid logic takes place
const superfluidPay = async () => {
  const flowRate = BigInt(Math.floor((1 / 6 / 6 / 24 / 3) * 100000000000000)); // 0.1Maticx / month flowRate is wei/second
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const sf = await Framework.create({
    networkName: "mumbai",
    provider: provider
  });

  const token = "0x96b82b65acf7072efeb00502f45757f254c2a0d4"; // MATICx
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const address = accounts[0];
  const signer = provider.getSigner();
  const receiver = "0xaA52010Fbf7CC209f7A06353f9769aCe2F3920A3";
  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: address,
      receiver: receiver,
      flowRate: flowRate,
      superToken: token,
      // userData?: string
      overrides: {
        gasLimit: 1000000,
        gasPrice: 3e9
      }
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${receiver}
    Network: mumbai
    Super Token: Maticx
    Sender: ${address},
    Receiver: ${receiver},
    FlowRate: ${flowRate}
    `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
};

export { superfluidPay };
