// import fetch from 'node-fetch';


const fetch = require('node-fetch');
async function loadNames() {
    const polygonKey = "XAP64G9KV63W7FDW6V7IXGF4E1KMD7E2KK"
    const polygonTokenUrl = `https://api-testnet.polygonscan.com/api ? module = account & action = txlistinternal & startblock = 19568000 & endblock = 19569000 & page = 1 & offset = 10 & sort = asc & apikey =${polygonKey}`;
    const response = await fetch(polygonTokenUrl);
    const names = await response.json();
    console.log(names);
    // logs [{ name: 'Joker'}, { name: 'Batman' }]
}
loadNames();