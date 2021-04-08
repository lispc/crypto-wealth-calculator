# What is this?

This is a script to calculate your crypto wealth. Both raw addresses and balances inside exchanges are supported.    
Each crypto amount and valuation in USD will be printed.  

# How to use?

First you have to create a config.js like below. You can provide crypto addresses you owned and/or exchange APIs you have.
Then run `node main.js`, the script will print each crypto amount you have and their value in USD.

```
const config = {
  addresses: {
    ETH: [
    ],
    BTC: [
    ],
  },
  exchanges: {
    huobipro: {
      apiKey: "",
      secret: "",
    },
    binance: {
      apiKey:
        "",
      secret:
        "",
    },
  },
};

module.exports = config;
```
