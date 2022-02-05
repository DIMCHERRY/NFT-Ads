import React, { useState, useEffect } from "react";
import Moralis from 'moralis';

import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import AddIcon from "@material-ui/icons/Add";
import './index.css';
import logo from '../../assets/logo.png';
import AboutModal from '../../components/AboutModal';
import StartModal from '../../components/StartModal';
import { handleAddress } from "../../util/util";

function Main() {
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

    const handleStartModalClose = () => {
        setIsStartModalVisible(false);
    }

    return(
        <div className="App__Main">
            <header className="App__header">
                <img src={logo} className="App-logo" alt="logo" />
                <div className="App__header-menu">
                    <div className="App__header-menu-item" onClick={clickAbout}>
                        <ErrorOutlineIcon/>
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
                            <AddIcon/>
                            <span className="App__header-menu-started">connectWallet</span>
                        </div>
                    }
                    
                </div>
            </header>
            <div className="App__body">
                <div className="App__body-logo-name">
                    NFT ADS
                </div>
                <div className="App__body-description">
                    NFT Ads is an AD delivery tool for Web3.0 users.
                </div>
                <div className="App__body-start-to-drop" onClick={clickStartToDrop}>
                    Start to drop
                </div>
                <div className="App__body-advantages">
                <div className="App__body-advantages-title">
                    What are its advantages?
                </div>
                <div className="App__body-advantages-content">
                    <div>
                        Compared with other online advertisement injecting, lower price is the advantages include service fees and gas fee. 
                    </div>
                    <div>
                        Each wallet address is open and transparent for every visitors. 
                    </div>
                    <div>
                        Some people will monitor or track Whales investment orientation of NFTs. Good advertisement will become consumption as a part of your NFTs.
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
        </div>
    )
}

export default Main;