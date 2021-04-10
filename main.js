const config = require("./config.js");
const ccxt = require("ccxt");
const axios = require("axios");

const localCurrency = "CNY";
const minUSDTValueToDisplay = 10;

let tickers;
let localCurrencyRatio;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAddrBalance(coin, addr) {
  try {
    let prec = { BTC: 8, ETH: 18 }[coin];
    if (prec == null) {
      return 0;
    }
    let url = `https://api.blockcypher.com/v1/${coin.toLowerCase()}/main/addrs/${addr}/balance`;
    const data = (await axios.get(url)).data;
    return data.balance / Math.pow(10, prec);
  } catch (e) {
    console.log(e);
    return 0;
  }
}

async function getBalanceOfExchange(exchangeName, params) {
  const ex = new ccxt[exchangeName](params);

  tickers = await ex.fetchTickers();
  tickers["USDT/USDT"] = { last: 1 };

  const balance = await ex.fetchBalance();
  const total = balance["total"];
  let result = 0;
  for (const coin in total) {
    const amount = total[coin];
    if (amount != 0) {
      const ticker = tickers[coin + "/USDT"];
      const price = ticker ? ticker.last : 0;
      const coinBalance = amount * price;
      if (coinBalance > minUSDTValueToDisplay) {
        console.log(`${exchangeName} ${coin}: ${amount} = ${coinBalance} USDT`);
      }
      result += coinBalance;
    }
  }
  console.log(`${exchangeName} Total: ${result} USDT`);
  return result;
}

async function fetchCurrencyRatio() {
  try {
    if (localCurrency == null || localCurrency === "") {
      return;
    }
    const pair = `USD${localCurrency}`;
    const url = `https://www.freeforexapi.com/api/live?pairs=${pair}`;
    localCurrencyRatio = (await axios.get(url)).data.rates[pair].rate || 0;
    console.log("localCurrencyRatio", localCurrencyRatio);
  } catch (e) {
    console.log("fetch currency ratio failed", e);
    localCurrencyRatio = 0;
  }
}

async function main() {
  await fetchCurrencyRatio(localCurrency);
  let total = 0;
  for (const exchangeName in config.exchanges) {
    total += await getBalanceOfExchange(
      exchangeName,
      config.exchanges[exchangeName]
    );
    console.log("");
  }
  for (const coin in config.addresses) {
    for (const addr of config.addresses[coin]) {
      const amount = await getAddrBalance(coin, addr);
      const ticker = tickers[coin + "/USDT"];
      const price = ticker ? ticker.last : 0;
      const balance = amount * price;
      total += balance;
      if (balance > minUSDTValueToDisplay) {
        console.log(`wallet ${coin}: ${amount} = ${balance} USDT`);
      }
      await sleep(1000);
    }
    console.log("");
  }

  console.log(`Total: ${total} USDT`);
  if (localCurrency != "") {
    console.log(`Or: ${total * localCurrencyRatio} ${localCurrency}`);
  }
}

main();
