import React, { useState, useEffect } from "react";
import { Upload, Modal, Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { closeIcon } from "../../assets/icons";
import { handleAddress } from "../../util/util";
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
    const { handleClose } = props;
    const [form] = Form.useForm();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const { TextArea } = Input;
    const accountAddress = localStorage.getItem('accountAddress');

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
    };

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