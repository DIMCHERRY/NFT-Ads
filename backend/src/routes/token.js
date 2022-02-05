const express = require('express')
const mysqlConn = require("../services/mysql")
const router = express.Router();


router.post('/signup/:address/', async (req, res) => {
    const address = req.params.address
    const user_data = req.body.userdata
    console.log("signup for address : " + address + ", userdata: ", userdata);
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
        mysqlConn.queryTokenByID(tokenID, (content, image_url) => {
            res.status(200).json({
                description: content,
                image: image_url
            });
        })
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