import React, { useState, useEffect } from "react";
import { Upload, Modal, Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { closeIcon } from "../../assets/icons";
import './index.css';
import Moralis from 'moralis';

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

    useEffect(() => {
        if (accountAddress) {
          setTopNFTs(
            topNFTKeys.map(item => ({
                key: item,
                image: `../../assets/topNFTs/${item}`,
                nftOwners: Moralis.Web3API.token.getNFTOwners({address: contractConsts[item], chain: 'matic'})
            }))
          );
        }
      }, [accountAddress]);

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
        console.log(fileList);
        getIpfs()
    };

    const getIpfs = async () => {
        // Save file input to IPFS
        if (fileList.length > 0) {
            getBase64(fileList[0].originFileObj).then(ba64 => {
                const file = new Moralis.File(fileList[0].name, { base64: ba64 })
                file.saveIPFS().then(hash => {
                    console.log("file is " + file.ipfs(), file.hash(), fileList[0].name)
                })
            })
        }


            // // Save file reference to Moralis
            // const jobApplication = new Moralis.Object('Applications')
            // jobApplication.set('name', 'Satoshi')
            // jobApplication.set('resume', file)
            // await jobApplication.save()

            // // Retrieve file
            // const query = new Moralis.Query('Applications')
            // query.equalTo('name', 'Satoshi')
            // query.find().then(function ([application]) {
            //     const ipfs = application.get('resume').ipfs()
            //     const hash = application.get('resume').hash()
            //     console.log('IPFS url', ipfs)
            //     console.log('IPFS hash', hash)
            // })
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
                                        placeholder={`0xABCDFA1DC112917c781942Cc01c68521c415e, 1
0x00192Fb10dF37c9FB26829eb2CC623cd1BF599E8, 2
0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c, 3
0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8, 4
...`}
                                        rows={10}
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
                                    <TextArea 
                                        placeholder={`0xABCDFA1DC112917c781942Cc01c68521c415e, 1
0x00192Fb10dF37c9FB26829eb2CC623cd1BF599E8, 2
0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c, 3
0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8, 4
...`}
                                        rows={10}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="CONFIRMATION DETAILS"
                                >
                                    TOTAL 0.0000（To do）
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Pay</Button>
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