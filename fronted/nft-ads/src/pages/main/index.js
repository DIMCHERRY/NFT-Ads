import React, { useState } from "react";
import { ExclamationCircleOutlined, PlusOutlined }  from '@ant-design/icons';

import './index.css';
import logo from '../../assets/logo.png';
import AboutModal from '../../components/AboutModal';
import StartModal from '../../components/StartModal';
import BurnModal from  '../../components/BurnModal';
import { handleAddress } from "../../util/util";
import { post } from '../../network';
import { useWallet } from "../../util/wallet";
import { message } from "antd";

function Main() {
    const [isBurnModalVisible, setIsBurnModalVisible] = useState(false);
    const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
    const [isStartModalVisible, setIsStartModalVisible] = useState(false);

    const clickAbout = () => {
        setIsAboutModalVisible(true);
    }

    const handleAboutModalClose = () => {
        setIsAboutModalVisible(false);
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

    const { walletState, web3, connectMetamask, disconnectMetamask, validateMetamask } = useWallet();
    const { address } = walletState;

    const login = async () => {
        const address = await connectMetamask();
        if (!address) {
            return;
        }
        try {
            const { nounce } = (await post('/login/nounce', { address }))?.data?.data;
            const signedNounce = await web3.current.eth.personal.sign(nounce, address);
            if (!signedNounce) {
                return;
            }
            await post('/login/token', { address, nounce, signedNounce, user_data: {} });
        } catch (error) {
            message.warn(error.message);
            console.error(error);
        }
    }

    const logout = async () => {
        disconnectMetamask();
        await window.cookieStore.delete('token');
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
                        address ?
                        <div className="App__header-menu-item" onClick={logout}>
                            <div className="App__header-menu-disconnect">
                                <span className="App__header-account-address">{handleAddress(address)}</span>
                                <span className="App__header-menu-started">DisconnectWallet</span>
                            </div>
                        </div>
                        : <div className="App__header-menu-item" onClick={login}>
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
                     an AD delivery tool for Web3 users.
                </div>
                <div className="App__body-actions">
                    <div className="App__body-start-to-drop" onClick={clickStartToDrop}>
                        Explore
                    </div>
                    <div className="App__body-burn-nft" onClick={clickToBurn}>
                        Create
                    </div>
                </div>
                <div className="App__body-advantages">
                    <div className="App__body-advantages-title">
                    NFT Ads' advantages :
                    </div>
                <div className="App__body-advantages-content">
                    <div className="create-sell-content">
                        <div className="create-sell-content-icon">
                            <i className="bi bi-shield-check"></i>
                        </div>
                         <div>
                            <h4>Lower Cost </h4>
                             <p>    
                            Compared with Web2 online advertisement injecting, lower cost is the biggest advantage of Web3 NFT ADs. Because of the clean figures, you needn't pay any unnecessary cost for advertising like in Web2 which may not bring effective results. NFT ADs' COST = Service Fee + Gas Fee.
                             </p>
                        </div>
                    </div>

                    <div className="create-sell-content">
                        <div className="create-sell-content-icon">
                            <i className="bi bi-shield-check"></i>
                        </div>
                         <div>
                            <h4>Verifiable Results</h4>
                            <p>
                            <b>Each wallet address is open and transparent for every people.</b>This is different from the operations of Web2 ADs which are in the black box by AI matching so that people may feel difficult to measure the effect of advertising.
                            </p>
                        </div>
                    </div>

                    <div className="create-sell-content">
                        <div className="create-sell-content-icon">
                            <i className="bi bi-shield-check"></i>
                        </div>
                         <div>
                            <h4>Crypto Native</h4>
                            <p>
                            <b>NFT ADs offer different collections of top NFT holders' addresses as a service. </b>You can airdrop NFT ADs directly to these addresses which are tracked by so many people. Good advertising will bring far more people to your link than the number of people you airdrop. <b>It means the ROI of your ADs may be much higher than your expectation.</b>
                            </p>
                        </div>
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
                validateMetamask={validateMetamask}
                address={address}
            />
            <BurnModal
                isModalVisible={isBurnModalVisible}
                handleClose={handleBurnModalClose}
            />
        </div>
    )
}

export default Main;