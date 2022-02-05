const express = require('express')
const bodyParser = require('body-parser')
const tokenRoutes = require("./src/routes/token")
const confManager = require('./src/confManager.js')

const app = express()
app.use(bodyParser.json({limit: '1mb'}))
app.use(express.json());

const baseConf = confManager.getBaseConf()
const Port = baseConf.Port
const Address = baseConf.Address

app.use("/api", tokenRoutes)

app.get('/', (_req, res) => {
    res.send('ok');
});

app.listen(Port, Address, () => {
    console.log(`nft-ads-backend app listening at http://localhost:${Port}`)
});


