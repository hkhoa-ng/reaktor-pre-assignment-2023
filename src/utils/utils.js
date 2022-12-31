const extractDroneDataFromXML = (data) => {
  const dronesData = {};

  // Getting the capture data for timestamp and drones data
  const capture = data.childNodes[0].childNodes[3];

  // Getting the timestamp
  const timestamp = capture.getAttribute("snapshotTimestamp");
  dronesData.timestamp = timestamp;

  // Getting and processing the drones data
  dronesData.drones = [];
  const drones = capture.getElementsByTagName("drone");
  Array.from(drones).forEach((drone) => {
    const serialNum = drone.getElementsByTagName("serialNumber")[0].textContent;
    const posX = drone.getElementsByTagName("positionX")[0].textContent;
    const posY = drone.getElementsByTagName("positionY")[0].textContent;
    // Add the data into the promise to be returned
    const droneToAdd = {
      serialNum: serialNum,
      posX: posX,
      posY: posY,
      distance: calculateDistance(
        parseFloat(posX) / 1000,
        parseFloat(posY) / 1000
      ),
      timestamp: timestamp,
    };
    dronesData.drones.push(droneToAdd);
  });
  return dronesData;
};

const calculateDistance = (posX, posY) => {
  return Math.sqrt(Math.pow(posX - 250, 2) + Math.pow(posY - 250, 2));
};

// Functions for API calls
const fetchDroneData = () => {
  const dronesAPI =
    "https://mysterious-dawn-24551.herokuapp.com/assignments.reaktor.com/birdnest/drones";
  // Return a promise that contains drones data
  return fetch(dronesAPI, {
    headers: {
      Origin: "https://localhost:3000",
    },
  })
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
      const dronesData = extractDroneDataFromXML(data);
      return dronesData;
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchPilotData = (serialNumber) => {
  const url = `https://mysterious-dawn-24551.herokuapp.com/assignments.reaktor.com/birdnest/pilots/${serialNumber}`;
  return fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export { extractDroneDataFromXML, fetchDroneData, fetchPilotData };
