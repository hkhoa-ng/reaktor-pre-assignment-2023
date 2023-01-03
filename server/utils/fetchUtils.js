const parser = require("xml2json");

// 2 API fetch functions
const fetchDroneData = () => {
  const dronesAPI =
    "https://khoa-nguyen-cors-anywhere.fly.dev/assignments.reaktor.com/birdnest/drones";
  // Return a promise that contains drones data
  return fetch(dronesAPI, {
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((res) => res.text())
    .then((xmlStr) => parser.toJson(xmlStr))
    .then((jsonStr) => JSON.parse(jsonStr))
    .then((data) => {
      return data.report.capture;
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchPilotData = (serialNumber) => {
  const url = `https://khoa-nguyen-cors-anywhere.fly.dev/assignments.reaktor.com/birdnest/pilots/${serialNumber}`;
  return fetch(url, {
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => data)
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  fetchDroneData,
  fetchPilotData,
};
