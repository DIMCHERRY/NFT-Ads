import React, { useState } from "react";
import './index.css';
import cryptoLogo from '../../assets/crypton.png';
import analysisLogo from '../../assets/analysis.png'
import lowpriceLogo from '../../assets/lowprice.png'
import StartModal from '../../components/StartModal';
import BurnModal from  '../../components/BurnModal';
import { useWallet } from "../../hooks/useWallet";

const Home = () => {
    const [isBurnModalVisible, setIsBurnModalVisible] = useState(false);
    const [isStartModalVisible, setIsStartModalVisible] = useState(false);

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

    const { walletState, validateMetamask } = useWallet();
    const { address } = walletState;

    return(
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
                            <img src={lowpriceLogo} className="App__itemInfoLogo" alt="lowpriceLogo" />
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
                            <img src={analysisLogo} className="App__itemInfoLogo" alt="analysisLogo" />
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
                            <img src={cryptoLogo} className="App__itemInfoLogo" alt="cryptoLogo" />
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

export default Home;