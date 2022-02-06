import React, { useState, useEffect } from "react";
import { Upload, Modal, Form, Input, Button, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Moralis from 'moralis';
import axios from 'axios';
import { ethers } from "ethers";
import NAFTADABI from "../../abi/NFTAD.json"

import { closeIcon } from "../../assets/icons";
import AZUKI from "../../assets/topNFTs/AZUKI.png";
import BAYC from "../../assets/topNFTs/BAYC.png";
import MAYC from "../../assets/topNFTs/MAYC.png";
import CLONEX from "../../assets/topNFTs/CLONEX.png";
import CRYPTOPUNKS from "../../assets/topNFTs/CRYPTOPUNKS.png";
import HAPE from "../../assets/topNFTs/HAPE.png";
import DOODLES from "../../assets/topNFTs/DOODLES.png";
import PHB from "../../assets/topNFTs/PHB.png";
import LAND from "../../assets/topNFTs/LAND.png";
import WOW from "../../assets/topNFTs/WOW.png";

import './index.css';
import { getNFTOwners } from '../../util/util';

const contractConsts = {
    AZUKI: "0xed5af388653567af2f388e6224dc7c4b3241c544",
    BAYC: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    MAYC:"0x60e4d786628fea6478f785a6d7e704777c86a7c6",
    CLONEX: "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B",
    CRYPTOPUNKS: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    HAPE: "0x4Db1f25D3d98600140dfc18dEb7515Be5Bd293Af",
    DOODLES: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    PHB: "0x67D9417C9C3c250f61A83C7e8658daC487B56B09",
    LAND: "0x50f5474724e0Ee42D9a4e711ccFB275809Fd6d4a",
    WOW: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
};

const nftImages = {
    AZUKI,
    BAYC,
    MAYC,
    CLONEX,
    CRYPTOPUNKS,
    HAPE,
    DOODLES,
    PHB,
    LAND,
    WOW
};

const topNFTKeys = ['AZUKI', 'BAYC', 'MAYC', 'CLONEX', 'CRYPTOPUNKS', 'HAPE', 'DOODLES', 'PHB', 'LAND', 'WOW'];

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

function StartModal(props) {
    const { handleClose } = props;
    const [form] = Form.useForm();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const { TextArea } = Input;
    const accountAddress = localStorage.getItem('accountAddress');
    const [topNFTs, setTopNFTs] = useState([]);
    const [tokenId, setTokenId] = useState('');
    const [ownerPackages, setOwnerPackages] = useState([]);
    const [recipients, setRecipients] = useState([]);

    useEffect(() => {
        (async() => {
            const results = [];

            for (let item of topNFTKeys) {
                const nftOwners = await getNFTOwners(contractConsts[item]);

                results.push({
                    key: item,
                    image: nftImages[item],
                    nftOwners
                });
            }

            setTopNFTs(results);
        })();
    }, []);
    

    const handleCancel = () => {
        setPreviewVisible(false);
    };

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
        getIpfs();
    };

    const getIpfs = async () => {
        // Save file input to IPFS
        if (fileList.length > 0) {
            getBase64(fileList[0].originFileObj).then(ba64 => {
                const file = new Moralis.File(fileList[0].name, { base64: ba64 });

                file.saveIPFS().then(hash => {
                    handleUpload(file.ipfs());
                })
            })
        }
    }

    const handleUpload = (imageUrl) => {
        const uploadUrl = "https://nftads.info/api/tokens/";

        axios.post(uploadUrl, {
            "image_url": imageUrl
        })
        .then(res => {
            setTokenId(res.data.data.id);
        })
        .catch(error => error);
    }

    const OwnersPackage = (nftName, image, owners) => {
        return(
            <div className="App__owners-package" key={nftName}>
                <Checkbox value={owners.join(',')} name={nftName} onChange={handlePackageChange}/>
                <img src={image} alt={nftName} className="App__owners-package-nft-image"/>
            </div>
        )
    }

    const handlePackageChange = (e) => {
        const value = e.target.value.split(',');

        let newPackages;

        if(e.target.checked) {
            newPackages = ownerPackages.concat(value);

            setOwnerPackages(newPackages);
        } else {
            newPackages = ownerPackages.filter(item => item !== value);
            
            setOwnerPackages(newPackages);
        }
    }

    const handleTextAreaChange = (e) => {
        const guests = e.target.value.split('\n');

        setRecipients(Array.from(new Set(guests)));
    }

    const handlePay = async () => {
        const allRecipients = ownerPackages.concat(recipients);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const NFTADContract = new ethers.Contract(accountAddress, NAFTADABI, signer);
        const fees = (0.1 * allRecipients.length).toString();
        console.log(typeof fees);
        const options = {
            value: ethers.utils.parseEther(fees),
            gasLimit: 1000000
        };
        const tx = await NFTADContract.mintToMany(allRecipients, tokenId, 1, options);

        console.log(tx);
    }
    return (
        <div className="App__modal App__about-modal-wrapper" data-visible={props.isModalVisible}>
            {
                accountAddress ?
                <div className="App__modal-content">
                    <div className="App__modal-title">
                        <span>Send to many recipients</span>
                        <span className="App__modal-close" onClick={handleClose}>
                            {closeIcon}
                        </span>
                    </div>
                    <div className="App__modal-body">
                        <div className="App__modal-start-description">
                            Input any token address and then batch transfer tokens to many different recipients in a single tx.
                        </div>
                        <div className="App__modal-start-body">
                            <Form
                                form={form}
                                layout="vertical"
                            >
                                <Form.Item
                                    label="UPLOAD A PICTURE"
                                    name="upload"
                                    rules={[
                                        {
                                        required: true,
                                        },
                                    ]}
                                >
                                    <Upload
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                    <Modal
                                        visible={previewVisible}
                                        title={previewTitle}
                                        footer={null}
                                        onCancel={handleCancel}
                                    >
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </Form.Item>
                                <Form.Item
                                    label="RECIPIENTS"
                                    name="recipients"
                                    rules={[
                                        {
                                            required: true
                                        },
                                    ]}
                                >
                                    <TextArea 
                                        placeholder={`0xABCDFA1DC112917c781942Cc01c68521c415e
0x00192Fb10dF37c9FB26829eb2CC623cd1BF599E8
0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c
0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8
...`}
                                        rows={10}
                                        onChange={handleTextAreaChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="CHOOSE CROWED PACK OF THE NFT"
                                    name="pack"
                                    rules={[
                                        {
                                            required: true
                                        },
                                    ]}
                                >
                                    {
                                        topNFTs.length && (
                                            <div className="App__owners-packages">
                                                {topNFTs.map(item => OwnersPackage(item.key, item.image, item.nftOwners))}
                                            </div>
                                        )
                                    }
                                </Form.Item>
                                <Form.Item
                                    label="CONFIRMATION DETAILS"
                                >
                                    0.1Matic/Per
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" onClick={handlePay}>Pay</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
                : <div className="App__modal-content">
                    <div className="App__modal-title">
                        <span>Attention</span>
                        <span className="App__modal-close" onClick={handleClose}>
                            {closeIcon}
                        </span>
                    </div>
                    <div className="App__modal-body">
                        Please connect to the wallet first!
                    </div>
                </div>
            }
            
        </div>
    );
}

export default StartModal;