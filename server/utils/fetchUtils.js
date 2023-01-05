const parser = require("xml2json");

/**
 * Fetch drones data from Reaktor's API
 * @returns a Promise the contains the drones data fetched from Reaktor's API
 */
const fetchDroneData = () => {
  // I used npm cors-anywhere to ease the development process
  const dronesAPI =
    "https://khoa-nguyen-cors-anywhere.fly.dev/assignments.reaktor.com/birdnest/drones";
  // Attemp to fetch, parse the XML data to JSON, and return the Promise contains the fetched data
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
      console.log(
        "Error while fetching drones data from Reaktor's API: " + err
      );
    });
};

/**
 * Fetch violated pilot data from Reaktor's API
 * @param {String} serialNumber - serial number of the drone from the violated pilot
 * @returns a Promise that contains the data of violated pilot(s)
 */
const fetchPilotData = (serialNumber) => {
  const url = `https://khoa-nguyen-cors-anywhere.fly.dev/assignments.reaktor.com/birdnest/pilots/${serialNumber}`;
  // Attemp to fetch, parse the response to JSON, and return the pilot's data
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
      console.log(
        "Error while fetching violated pilot data from Reaktor's API: " + err
      );
    });
};

module.exports = {
  fetchDroneData,
  fetchPilotData,
};
