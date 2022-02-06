import { closeIcon } from "../../assets/icons";
import './index.css';
import { Button } from 'antd';
import React from 'react';

function AboutModal (props) {
    const { handleClose } = props;

    const clickConfirm = () => {
        var Web3 = require('web3');
        var web3 = new Web3(Web3.givenProvider);
        const transactionHash = '0xbd7dffcec31cd3038852e7f3e99a12bf5fa0a1ca2aa606b5a1f9d83c361ce39d';
        web3.eth.getTransaction(transactionHash, function (error, result) {
            console.log(result);
            //todo:move to contract check
            var to = result.to.toLowerCase();
            var from = result.from.toLowerCase();
            //burn nft to get award
            if(result.value === "3000000000000000" && to === "0xba17eeb3f0413b76184ba8ed73067063fba6e2eb") {
                console.log("success")
            }
        });
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

export default AboutModal;