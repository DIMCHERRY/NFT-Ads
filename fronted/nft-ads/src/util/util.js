const handleAddress = (address) => {
    return address.substr(0,6)+'...'+ address.substr(address.length - 6);
}

const getNFTOwners = async (address) => {
    const requestUrl = `https://deep-index.moralis.io/api/v2/nft/${address}/owners?chain=eth&format=decimal`;
    const response = await fetch(requestUrl, {
        headers: {
            "X-API-Key": "OV54NfLy1xAkIAA7gVp7KqmAjVQKcH1JCiXDuNQ0ZluSoKJGuogBgPRcc9BvlENB",
        }
    });

    const result = await response.json();
    const owners = result.result.slice(0,5).map(item => item.owner_of);

    return owners;
}


export { handleAddress, getNFTOwners };