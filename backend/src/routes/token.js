const express = require('express')
const mysqlConn = require("../services/mysql")
const router = express.Router();
const multiparty = require('multiparty');
const { uploadDir } = require('../utils/constant');
const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');

router.post('/signup/:address/', async (req, res) => {
    const address = req.params.address
    const user_data = req.body.userdata
    console.log("signup for address : " + address + ", userdata: ", user_data);
    let resp = {}
    try {
        mysqlConn.insertOneUser(address, user_data);
    } catch(e) {
        console.log(e.message);
        res.status(502).json({
            errorCode: 1,
            errorMsg: e.message,
            data:resp
        })
        return;
    }
    res.status(200).json({
        errorCode: 0,
        errorMsg: 'success',
        data: resp
    })
})


router.get('/tokens/', async (req, res) => {
    var response = {}
    try {
        const id = await mysqlConn.queryLastTokenIDAsync();
        console.log(id);
        res.status(200).json({
            maxID: id
        });
        return;
        
    } catch (e) {
        console.log(e.message);
        res.status(502).json({
            errorCode: 1,
            errorMsg: e.message,
            data:[]
        })
        return;
    }
})

async function queryTokenByID(tokenID) {
    return new Promise((resolve, reject) => {
        mysqlConn.queryTokenByID(tokenID, (content, image_url) => {
            // 代表正确拿到了这个db查询结果并通过resolve返回
            resolve({
                content,
                image_url
            })
            // 如果出错了你需要把error用reject返回，像 reject(error)
        })
    })
}

router.get('/tokens/:id/', async (req, res) => {
    const tokenID = req.params.id;
    console.log("query for token id : " + tokenID);
    if (tokenID == undefined) {
        res.status(502).json({
            errorCode: 1,
            errorMsg: "token id undefined",
            data:[]
        })
    }
    var response = {}
    try {
        const dbRes = await mysqlConn.queryTokenByIDAsync(tokenID);
        console.log("dbRes: ", dbRes)
        res.status(200).json({
            description: dbRes.description,
            image: dbRes.img_ipfs_url,
            name: "NFTAD"
        });
        return;
        
    } catch (e) {
        console.log(e.message);
        res.status(502).json({
            errorCode: 1,
            errorMsg: e.message,
            data:[]
        })
        return;
    }
})

const default_description = "Ready to explore the wide world of Web3?\n Join us February 3rd - 8th for Road to Web3, one week of hacking and workshops devoted to NFTs, Gaming, Audio/Video, and all things Web3.\n ETHGlobal has teamed up with Polygon to build the ultimate online hackathon experience—all we need is you!\nWebsite: https://web3.ethglobal.com/ (Plus:If you join our hackathon, you can visit https://nftads.info/ to get rewards)";
// side : "buy" | "sell"
router.post('/tokens/', async (req, res) => {
    const { image_url, description = default_description } = req.body;
    let address = req.header("Address");
    console.log("submit token for image_url : " + image_url + " FROM Adress: ", address);
    if (image_url == undefined) {
        res.status(502).json({
            errorCode: 1,
            errorMsg: "image_url undefined",
            data:{}
        })
        return;
    }
    if (address == undefined) {
        address = '';
    }
    try {
        mysqlConn.insertOneToken(image_url, address, description);
        let id = await mysqlConn.queryTokenByIMGURLAsync(image_url);
        res.status(200).json({
            errorCode: 0,
            errorMsg: 'success',
            data: { id }
        })
    } catch(e) {
        console.log(e.message)
        res.status(502).json({
            errorCode: 1,
            errorMsg: e.message,
            data:{}
        })
        return;
    }
})

router.post('/upload', async (req, res) => {
    const form = new multiparty.Form();
    form.on('part', async function (part) {

        if (part.filename) {
            const suffix = part.filename.split('.').length >= 2 ? part.filename.split('.').pop() : ''
            const fileName = `${crypto.randomBytes(8).toString('hex')}${suffix && '.' + suffix}`;
            const writeStrem = fs.createWriteStream(path.join(uploadDir, fileName));
            part.pipe(writeStrem);
            part.on('error', (err) => {
                console.log('part error', err);
                writeStrem.destroy();
                res.status(500).json({
                    errorCode: 1,
                    errorMsg: err.message,
                    data:{}
                });
            });
            part.on('end', () => {
                res.status(200).json({ fileName });
            });
        }
    });
    form.parse(req);
});

router.get('/file/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    res.header('x-node-env', process.env.NODE_ENV);
    const filePath = path.join(uploadDir, fileName);
    if (!fs.existsSync(filePath)) {
        res.status(404).json({
            errorCode: 1,
            errorMsg: 'file not found',
            data:{}
        });
        return;
    }
    res.download(filePath);
});

module.exports = router