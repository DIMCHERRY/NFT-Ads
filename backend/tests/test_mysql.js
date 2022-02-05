const mysqlConn = require('../src/services/mysql')


    
;(async () => {
    console.log(await mysqlConn.testAsync());

    //mysqlConn.insertOneUser("0xabc", '{"name": "jack"}');

    // mysqlConn.queryUserByAddress("0xabc",
    //     data => {
    //         console.log(data);
    //     }
    // );

    // mysqlConn.insertOneToken("www.baidu.com", "0xabc");

    // mysqlConn.queryUserByAddress("0xabc",
    //     data => {
    //         console.log(data);
    //     }
    // );
})()
.catch(error => {
    console.error(error)
    process.exit(1)
})
