require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.GANACHE_URI));

const accountObj = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

const abi = JSON.parse(fs.readFileSync(process.env.ABI_FILE, "utf8"));
const bytecode = fs.readFileSync(process.env.BYTECODE_FILE, "utf8");
const contractObj = new web3.eth.Contract(abi);

//web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);

const contractData = contractObj
  .deploy({
    data: `0x${bytecode}`,
    arguments: [accountObj.address]
  })
  .encodeABI()
;

const waitForReceipt = (hash, cb) => {
  web3.eth.getTransactionReceipt(hash, (err, receipt) => {
    if(err) {
      console.error(err);
    }
    if(receipt) {
      if(cb) {
        cb(receipt);
      }
    } else {
      console.log("Waiting to get mined...");
      setTimeout(() => waitForReceipt(hash, cb), 1000);
    }
  });
};

web3.eth
  .estimateGas({ from: accountObj.address, data: contractData })
  .then(gas => {
    const rawTx = {
      from: accountObj.address,
      gas,
      data: contractData
    };
    web3.eth.accounts
      .signTransaction(rawTx, accountObj.privateKey)
      .then(({ rawTransaction, transactionHash }) => {
        web3.eth
          .sendSignedTransaction(rawTransaction)
          .on("receipt", () => {}/*console.log*/)
        ;
        waitForReceipt(transactionHash, result => {
          const contractAddr = result.contractAddress;
          console.log(`The contract is deployed at '${contractAddr}'`);
          contractObj.options.address = contractAddr;
          main(contractAddr);
        });
      })
    ;
  })
  .catch(err => {
    if (err.message === "Invalid JSON RPC response: \"\"") {
      console.error(`web3 error - is ganache '${process.env.GANACHE_URI}' running?`);
    } else {
      console.error(err);
    }
  })
;

const express = require("express");
const fetch = require("node-fetch");
const app = new express();
app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/getLatestScores", async (req, res) => {
  process.stdout.write(`${new Date().toLocaleString()}: ${req.method} '${req.url}' `);
  
  const resScores = await fetch(
    `${process.env.STATSAPI_URI}?expand=${process.env.STATSAPI_EXPAND}&date=${req.query.date}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    }
  );
  if (resScores.status !== 200) { // OK
    console.error(resScores);
    res.status(resScores.status).send(JSON.stringify({
      statusText: resScores.statusText,
      error: resScores.error,
      message: resScores.message,
      reason: resScores.toString()
    }));
    return;
  }
  const scores = await resScores.json();

  console.log(`returning ${scores.totalGames} games`);
  res.status(200).json({ // OK
    copyright: scores.copyright,
    games: scores.dates[0].games
  });
});

app.get("/api/getPrize", async (req, res) => {
  process.stdout.write(`${new Date().toLocaleString()}: ${req.method} '${req.url}' `);
  
  let prizeWei;
  const result = await contractObj.methods.prize().call({ from: accountObj.address });
  try {
    prizeWei = result;
  } catch(err) {
    console.error(err);
    res.status(500).json({ // Internal Server Error
      reason: err.toString()
    });
    return;
  }
  
  console.log(`returning '${web3.utils.fromWei(result, "ether")} ETH'`);
  res.status(200).json({ // OK
    prize: prizeWei
  });
});

app.post("/api/wager", async (req, res) => {
  process.stdout.write(`${new Date().toLocaleString()}: ${req.method} '${req.url}' `);
  let _anteWei;
  try {
    console.log("\nreq.body.ante:", req.body.ante);
    console.log("web3.utils.toBN(req.body.ante * 1e18):", web3.utils.toBN(req.body.ante * 1e18));
    _anteWei = web3.utils.toBN(req.body.ante * 1e18);
    console.log("_anteWei:", _anteWei);
    console.log("web3.utils.fromWei(_anteWei, 'ether'):", web3.utils.fromWei(_anteWei, "ether"));
  } catch(err) {
    console.error(err);
    res.status(400).json({ // Bad Request
      reason: err.toString()
    });
    return;
  }
  
  let newPrizeWei;
  await contractObj.methods.placeWager().send({ from: accountObj.address, value: _anteWei/* , gas: 122550 */ })
    .on("receipt", (receipt) => {
      newPrizeWei = receipt.events.PrizeIncreased.returnValues[0];
    })
  ;

  console.log(`returning new prize '${web3.utils.fromWei(newPrizeWei, "ether")} ETH'`);
  res.status(201).json({ // Created
    prize: newPrizeWei
  });
});

function main(_addr) {
  app.listen(
    process.env.PORT,
    process.env.HOSTNAME,
    () => {
      console.log(`Express running at http://${process.env.HOSTNAME}:${process.env.PORT}/`);
    }
  );

  contractObj.events
    .RinxPoolClosed( (err, ev) => {
      if(err) {
        console.error(err);
        return;
      } else {
        console.info("heard event:", ev);
      }
    })
    .on("data", ev => {
      console.info("heard data:", ev)
    })
    .on("changed", ev => {
      console.info("heard change:", ev);
    })
    .on("error", () => {}/* console.error */)
  ;
}
