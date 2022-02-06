import { closeIcon } from "../../assets/icons";
import Moralis from 'moralis';
import NAFTADABI from "../../abi/NFTAD.json"
import './index.css';
import { Upload, Modal, Form, Input, Button } from 'antd';
import { ethers } from "ethers";
import React from 'react';

function BurnModal (props) {
    const { handleClose } = props;

    const clickConfirm = async () => {
        try {
            // Moralis.start();
            // const web3Provider = await Moralis.enableWeb3();
            // const ethers = Moralis.web3Library;
            // const sendOptions = {
            //     contractAddress: "0xe...56",
            //     functionName: "setMessage",
            //     abi: ABI,
            //     params: {
            //       _newMessage: "Hello Moralis",
            //     },
            //   };
              
            // const transaction = await Moralis.executeFunction(sendOptions);
            // console.log(transaction.hash)
            // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"
            
            // Wait until the transaction is confirmed
            //await transaction.wait();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const NFTADAddress = "0x659056fC486058d2c442410776A425120749757F";
            const NFTADContract = new ethers.Contract(NFTADAddress, NAFTADABI, provider);
            const name = await NFTADContract.name()
            console.log(name)
            const tx = await NFTADContract.mint("0x26a4eEA2a74cd06E978552579416faF9B9b97ABF", 1, 1);
            console.log(tx);
            await tx.wait();
          } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="App__modal App__about-modal-wrapper" data-visible={props.isModalVisible}>
            <div className="App__modal-content">
                <div className="App__modal-title">
                    <span>Gain awards</span>
                    <span className="App__modal-close" onClick={handleClose}>
                        {closeIcon}
                    </span>
                </div>
                <div className="App__modal-body">
                    <p>please input your ETH Global stake transaction hash below</p>
                    <input type="text" placeholder="input transaction hash"/>
                    <Button type="primary" htmlType="submit" onClick={clickConfirm}>confirm</Button>
                </div>
            </div>
        </div>
    );
}

export default BurnModal;