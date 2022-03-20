import React, { useState } from "react";
import { Upload, Modal, Form, Input, Button, Checkbox, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ethers } from "ethers";
import NAFTADABI from "../../abi/NFTAD.json"

import { closeIcon } from "../../assets/icons";
import { post, HOST } from '../../network';
import useTopNFTs from '../../hooks/useTopNFTs';

import './index.css';

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
    const { handleClose, address, validateMetamask } = props;
    const [form] = Form.useForm();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const { TextArea } = Input;
    const { topNFTs } = useTopNFTs();
    const [tokenId, setTokenId] = useState('');
    const [loading, setLoading] = useState(false);

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
        getIpfs(fileList);
    };

    const getIpfs = async (fileList) => {
        // Save file input to IPFS
        if (fileList.length > 0) {
            const file = fileList[0];
            const blob =  await (await fetch(file)).blob();
            const data = new FormData();
            data.append('file', blob);
            const res = await post(
                "https://ipfs.infura.io:5001/api/v0/add?pin=false",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .catch(error => {
                    console.error('ipfs upload error:', error);
                    message.error(error.message);
                });
            handleUpload(`https://ipfs.infura.io:5001/api/v0/cat?arg=${res.data.Hash}`)
        }
    }

    const handleUpload = (imageUrl) => {
        const uploadUrl = `${HOST}/api/tokens/`;

        axios.post(uploadUrl, {
            "image_url": imageUrl
        })
        .then(res => {
            setTokenId(res.data.data.id);
            console.log(res.data.data.id);
        })
        .catch(error => {
            console.error('upload error:', error);
            message.error(error.message);
        });
    }

    const packOptions = topNFTs.map(({ key, nftOwners, image }) => {
        return {
            label: <img src={image} alt={key} className="App__owners-package-nft-image"/>,
            value: nftOwners?.join()
        }
    });

    const getAllRecipients = () => {
        const packs = form.getFieldValue('pack');
        const recs = form.getFieldValue('recipients').split('\n');
        const allRecipients = packs.join().split(',').concat(Array.from(new Set(recs))).filter(Boolean);
        return allRecipients;
    }

    const handlePay = async () => {
        if (!validateMetamask()) {
            return;
        }
        try {
            setLoading(true);
            const NFTADAddress = "0xa3c7fb7463967284996739887a7fF994372899d2";
            const allRecipients = getAllRecipients();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const NFTADContract = new ethers.Contract(NFTADAddress, NAFTADABI, signer);
            const fees = (0.001 * allRecipients.length).toString();
            const value = ethers.utils.parseEther(fees);
            const options = {
                value,
                gasLimit: 1000000
            };
            debugger
            await NFTADContract.mintToMany(allRecipients, tokenId, 1, options);

            alert('Success!');
            handleClose();
        } catch (error) {
            console.error('pay error:', error);
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App__modal App__about-modal-wrapper" data-visible={props.isModalVisible}>
            {
                address ?
                <div className="App__modal-content" style={{ overflow: 'scroll' }}>
                    <Spin spinning={loading}>
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
                                    initialValues={{ pack: [], recipients: '' }}
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
                                            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            action={`${HOST}/ipfs/upload`}
                                            listType="picture-card"
                                            beforeUpload={file => {
                                                setFileList([file]);
                                                return false;
                                            }}
                                            fileList={fileList}
                                            onPreview={handlePreview}
                                            onChange={handleChange}
                                        >
                                            {fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
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
                                            placeholder={
                                                [
                                                    '0xABCDFA1DC112917c781942Cc01c68521c415e',
                                                    '0x00192Fb10dF37c9FB26829eb2CC623cd1BF599E8',
                                                    '0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c',
                                                    '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
                                                    '...',
                                                    'use newline to split multiple addresses'
                                                ].join('\n')
                                            }
                                            rows={10}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="CHOOSE CROWED PACK OF THE NFT"
                                        name="pack"
                                    >
                                        {packOptions.length > 0 ? (
                                            <Checkbox.Group
                                                options={packOptions}
                                                className="App__owners-packages"
                                                onChange={(value) => form.setFields([{ value, name: 'pack' }])}
                                            />
                                        ) : <Spin />}
                                    </Form.Item>
                                    <Form.Item
                                        label="CONFIRMATION DETAILS"
                                        shouldUpdate={
                                            (prevValues, curValues) =>
                                                prevValues.pack !== curValues.pack
                                                || prevValues.recipients !== curValues.recipients
                                        }
                                    >
                                        {() => {
                                            const num = getAllRecipients().length;
                                            return (
                                                <div>
                                                    <div>0.001Matic/Per</div>
                                                    <div>
                                                        now you have select <span style={{ color: '#FF5733', fontWeight: 'bold' }}>{num}</span> address
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            onClick={handlePay}
                                        >
                                            Pay
                                        </Button>
                                    </Form.Item>
                                </Form>
                                <Modal
                                    visible={previewVisible}
                                    title={previewTitle}
                                    footer={null}
                                    onCancel={handleCancel}
                                >
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        </div>
                    </Spin>
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