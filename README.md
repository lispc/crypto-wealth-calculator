# What is this?

A script to calculate your crypto wealth. Coin balances of both raw addresses and exchanges are supported.  

Each crypto amount and valuation in USD will be printed.  

# How to use?

## run the script directly

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

Output

```

binance BTC: xxxxxx = xxxxxx USDT
binance ETH: xxxxxx = xxxxxx USDT
binance USDT: xxxxxx = xxxxxx USDT
binance Total: xxxxxx USDT

wallet ETH: xxxxxx = xxxxx USDT
wallet ETH: xxxxx = xxxxxxx USDT

wallet BTC: xxxxxx = xxxxxx USDT

Total: xxxxxx USDT

```

Only BTC and ETH of raw addresses are supported.

## deploy as telegram bot

First make sure that running main.js directly will print correct outputs.

Then create `.env` file like this

```
TG_USER=your_telegram_user_name
TOKEN=your_bot_token
```

then run `node telegram_bot.js`. You send 'p' to the bot, the bot will reply you with your crypto wealth.
