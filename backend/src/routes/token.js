const express = require('express')
const mysqlConn = require("../services/mysql")
const router = express.Router();


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
            description: dbRes.token_content,
            image: dbRes.img_ipfs_url
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

// side : "buy" | "sell"
router.post('/tokens/', async (req, res) => {
    const image_url = req.body.image_url;
    const address = req.header("Adress");
    console.log("submit token for image_url : " + image_url + " FROM Adress: ", address);
    if (image_url == undefined) {
        res.status(502).json({
            errorCode: 1,
            errorMsg: "image_url undefined",
            data:{}
        })
        return;
    }
    let resp = {}
    try {
        mysqlConn.insertOneToken(image_url, address);
    } catch(e) {
        console.log(e.message)
        res.status(502).json({
            errorCode: 1,
            errorMsg: e.message,
            data:{}
        })
        return;
    }
    res.status(200).json({
        errorCode: 0,
        errorMsg: 'success',
        data: resp
    })
})

module.exports = router