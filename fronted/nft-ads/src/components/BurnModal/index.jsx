import { closeIcon } from "../../assets/icons";
import NAFTADABI from "../../abi/NFTAD.json";
import "./index.css";
import { Button, Input } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import { handleError } from "../../util/util";

function BurnModal(props) {
  const { handleClose, nftTokenID } = props;
  const [twitterUrl, setTwitterUrl] = useState("");
  // const [transHash, setTransHash] = useState("");

  const clickConfirm = async () => {
    try {
      const NFTADAddress = "0xdCaEB6A15d53F6A03893a8a841213ce57a2EcB94";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const NFTADContract = new ethers.Contract(NFTADAddress, NAFTADABI, signer);
      const options = {
        gasLimit: 1000000
      };
      const tx = await NFTADContract.burn(nftTokenID, 1, options);

      alert("Success!");
      handleClose();
      await tx.wait();
    } catch (error) {
      handleError(error, "confirm burn");
    }
  };

  return (
    <div className="App__modal App__about-modal-wrapper" data-visible={props.isModalVisible}>
      <div className="App__modal-content App__burn-modal">
        <div className="App__modal-title">
          <span>Gain awards</span>
          <span className="App__modal-close" onClick={handleClose}>
            {closeIcon}
          </span>
        </div>
        <div className="App__modal-body">
          <p className="App__burn-modal-description">
            please input the twitter url your have post below
          </p>
          {/* <input
            type="text"
            className="App__burn-modal-input"
            placeholder="input transaction hash"
          /> */}
          {/* <Input
            className="App__burn-modal-input"
            value={transHash}
            onChange={setTransHash}
            placeholder="input transaction hash"
          /> */}
          <Input
            className="App__burn-modal-input"
            value={twitterUrl}
            onChange={(e) => {
              setTwitterUrl(e.target.value);
            }}
            placeholder="twitter url"
          />
          <Button
            type="primary"
            htmlType="submit"
            onClick={clickConfirm}
            className="App__burn-modal-confirm"
          >
            confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BurnModal;
