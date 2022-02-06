import { closeIcon } from "../../assets/icons";
import Moralis from 'moralis';
import NAFTADABI from "../../abi/NFTAD.json"
import './index.css';
import { Button } from 'antd';
import { ethers } from "ethers";
import React from 'react';

function BurnModal (props) {
    const { handleClose } = props;

    const clickConfirm = async () => {
        try {
            const NFTADAddress = "0x659056fC486058d2c442410776A425120749757F";
            // Moralis.start();
            // const web3Provider = await Moralis.enableWeb3();
            // // const ethers = Moralis.web3Library;
            
            // const sendOptions = {
            //     contractAddress: NFTADAddress,
            //     functionName: "mint",
            //     abi: NAFTADABI,
            //     params: {
            //       address: "0x26a4eEA2a74cd06E978552579416faF9B9b97ABF",
            //       id: 1,
            //       amount:1,
            //     },
            //   };
              
            // const transaction = await Moralis.executeFunction(sendOptions);
            // console.log(transaction.hash)
            
            // //Wait until the transaction is confirmed
            // await transaction.wait();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const NFTADContract = new ethers.Contract(NFTADAddress, NAFTADABI, signer);
            const name = await NFTADContract.name()
            console.log(name)
            const options = {
                value: ethers.utils.parseEther("0.1"),
                gasLimit: 1000000
            }
            //const tx = await NFTADContract.mint("0x26a4eEA2a74cd06E978552579416faF9B9b97ABF", 1, 1);
            const tx = await NFTADContract.mint("0x26a4eEA2a74cd06E978552579416faF9B9b97ABF", 1, 1, options);
            console.log(tx);
            await tx.wait();
          } catch (error) {
            console.error(error);
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