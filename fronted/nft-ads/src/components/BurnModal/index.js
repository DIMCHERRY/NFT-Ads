import { closeIcon } from "../../assets/icons";
import './index.css';
import logo from '../../assets/logo.png';
import React from 'react';

function AboutModal (props) {
    const { handleClose } = props;

    return (
        <div className="App__modal App__about-modal-wrapper" data-visible={props.isModalVisible}>
            <div className="App__modal-content">
                <div className="App__modal-title">
                    <span>Gain benefits</span>
                    <span className="App__modal-close" onClick={handleClose}>
                        {closeIcon}
                    </span>
                </div>
                <div className="App__modal-body">
                    <p>please input your ETH Global stake transaction hash below</p>
                    <input type="text" placeholder="input transaction hash"/>
                </div>
            </div>
        </div>
    );
}

export default AboutModal;