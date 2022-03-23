import { closeIcon } from "../../assets/icons";
import NAFTADABI from "../../abi/NFTAD.json"
import './index.css';
import { Button } from 'antd';
import { ethers } from "ethers";
import React from 'react';
import { handleError } from "../../util/util";

function BurnModal (props) {
    const { handleClose } = props;

    const clickConfirm = async () => {
        try {
            const NFTADAddress = "0x20E156f53E6F823e92FFEDA7eDf7B55188223F95";
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const NFTADContract = new ethers.Contract(NFTADAddress, NAFTADABI, signer);
            const options = {
                gasLimit: 1000000
            }
            const tx = await NFTADContract.burn(1, 1, options);

            alert('Success!');
            handleClose();
            await tx.wait();
          } catch (error) {
            handleError(error, 'confirm burn');
        }
    }

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
                    <p className="App__burn-modal-description">please input your ETH Global stake transaction hash below</p>
                    <input type="text" className="App__burn-modal-input" placeholder="input transaction hash"/>
                    <Button 
                        type="primary"
                        htmlType="submit"
                        onClick={clickConfirm}
                        className="App__burn-modal-confirm"
                    >confirm</Button>
                </div>
            </div>
        </div>
    );
}

export default BurnModal;