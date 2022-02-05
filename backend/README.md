##
create token 

```
curl -XPOST 127.0.0.1:5003/tokens/ -d "{\"image_url\":\"baidu.com\"}" -H "content-type: application/json; charset=UTF-8"
{"errorCode":0,"errorMsg":"success","data":{}}
```

get token
```
curl -XGET 127.0.0.1:5003/tokens/3/
```