import { NotificationManager } from "react-notifications";

const doFetchLatest = async (_d = new Date()) => {
  const pDate = `${_d.getFullYear()}-${("0" + (_d.getMonth() + 1)).slice(-2)}-${("0" + _d.getDate()).slice(-2)}`;
  const res = await fetch(`${process.env.REACT_APP_EXPRESS_URI}/getLatestScores?date=${pDate}`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });
  if (res.status !== 200) { // OK
    console.error(res);
    NotificationManager.error("Error during GET '/getLatestScores'", `${res.status}: ${res.statusText}`, 4000);
    return res;
  }
  return res.json();
};

const doFetchPrize = async (_d = new Date()) => {
  const res = await fetch(`${process.env.REACT_APP_EXPRESS_URI}/getPrize`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });
  if (res.status !== 200) { // OK
    console.error(res);
    NotificationManager.error("Error during GET '/getPrize'", `${res.status}: ${res.statusText}`, 4000);
    return res;
  }
  return res.json();
};

const doPostWager = async (_ante) => {
  const res = await fetch(`${process.env.REACT_APP_EXPRESS_URI}/wager`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      ante: _ante
    })
  });
  if (res.status !== 201) { // Created
    console.error(res);
    NotificationManager.error("Error during POST '/wager'", `${res.status}: ${res.statusText}`, 4000);
    return res;
  }
  return res.json();
};

export {
  doFetchLatest,
  doFetchPrize,
  doPostWager
}
