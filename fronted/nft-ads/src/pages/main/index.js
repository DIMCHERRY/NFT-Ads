import React, { useState, useEffect } from "react";
import Moralis from 'moralis';
import { ExclamationCircleOutlined, PlusOutlined }  from '@ant-design/icons';

import './index.css';
import logo from '../../assets/logo.png';
import AboutModal from '../../components/AboutModal';
import StartModal from '../../components/StartModal';
import BurnModal from  '../../components/BurnModal';
import { handleAddress } from "../../util/util";

function Main() {
    const [isBurnModalVisible, setIsBurnModalVisible] = useState(false);
    const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
    const [isStartModalVisible, setIsStartModalVisible] = useState(false);
    const [accountAddress, setAccountAddress] = useState('');

    const clickAbout = () => {
        setIsAboutModalVisible(true);
    }

    const handleAboutModalClose = () => {
        setIsAboutModalVisible(false);
    }
    
    const connectWallet = async() => {
        let user = Moralis.User.current();

        console.log(user);

        if (!user) {
          user = await Moralis.authenticate();
        }

        setAccountAddress(user.attributes.accounts[0]);

        localStorage.setItem('accountAddress', user.attributes.accounts[0]);
    }

    const disconnectWallet = async() => {
        await Moralis.User.logOut();

        setAccountAddress('');

        localStorage.removeItem('accountAddress');

        console.log(accountAddress);
    }

    const clickStartToDrop = () => {
        setIsStartModalVisible(true);
    }

    const clickToBurn = () => {
        setIsBurnModalVisible(true);
    }

    const handleStartModalClose = () => {
        setIsStartModalVisible(false);
    }

    const handleBurnModalClose = () => {
        setIsBurnModalVisible(false);
    }

    return(
        <div className="App__Main">
            <header className="App__header">
                <img src={logo} className="App-logo" alt="logo" />
                <div className="App__header-menu">
                    <div className="App__header-menu-item" onClick={clickAbout}>
                        <ExclamationCircleOutlined/>
                        <span className="App__header-menu-about">About</span>
                    </div>
                    {
                        accountAddress ?
                        <div className="App__header-menu-item" onClick={disconnectWallet}>
                            <div className="App__header-menu-disconnect">
                                <span className="App__header-account-address">{handleAddress(accountAddress)}</span>
                                <span className="App__header-menu-started">DisconnectWallet</span>
                            </div>
                        </div>
                        : <div className="App__header-menu-item" onClick={connectWallet}>
                            <PlusOutlined />
                            <span className="App__header-menu-started">connectWallet</span>
                        </div>
                    }
                    
                </div>
            </header>
            <div className="App__body">
                <div className="App__body-logo-name">
                    NFT Ads
                </div>
                <div className="App__body-description">
                    NFT Ads is an AD delivery tool for Web3 users.
                </div>
                <div className="App__body-actions">
                    <div className="App__body-start-to-drop" onClick={clickStartToDrop}>
                        Airdrop Ads
                    </div>
                    <div className="App__body-burn-nft" onClick={clickToBurn}>
                        Get rewards
                    </div>
                </div>
                <div className="App__body-advantages">
                <div className="App__body-advantages-title">
                    What are its advantages?
                </div>
                <div className="App__body-advantages-content">
                    <div>
                        <span>Lower Cost</span>
                        <p>
                            Compared with Web2 online advertisement injecting, lower cost is the biggest advantage of Web3 NFT ADs. Because of the clean figures, you needn't pay any unnecessary cost for advertising like in Web2 which may not bring effective results. NFT ADs' COST = Service Fee + Gas Fee.
                        </p>
                    </div>
                    <div>
                        <span>Verifiable Results</span>
                        <p>
                            <b>Each wallet address is open and transparent for every people.</b>This is different from the operations of Web2 ADs which are in the black box by AI matching so that people may feel difficult to measure the effect of advertising.
                        </p>
                    </div>
                    <div>
                        <span>Crypto Native</span>
                        <p>
                            <b>NFT ADs offer different collections of top NFT holders' addresses as a service. </b>You can airdrop NFT ADs directly to these addresses which are tracked by so many people. Good advertising will bring far more people to your link than the number of people you airdrop. <b>It means the ROI of your ADs may be much higher than your expectation.</b>
                        </p>
                    </div>
                </div>
                </div>
            </div>
            <AboutModal 
                isModalVisible={isAboutModalVisible}
                handleClose={handleAboutModalClose}
            />
            <StartModal 
                isModalVisible={isStartModalVisible}
                handleClose={handleStartModalClose}
            />
            <BurnModal
                isModalVisible={isBurnModalVisible}
                handleClose={handleBurnModalClose}
            />
        </div>
    )
}

export default Main;