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
    // Add the data into the object
    const droneToAdd = {
      serialNum: serialNum,
      posX: posX,
      posY: posY,
    };
    dronesData.drones.push(droneToAdd);
  });
  return dronesData;
};

const fetchDroneData = () => {
  const dronesAPI =
    "https://mysterious-dawn-24551.herokuapp.com/assignments.reaktor.com/birdnest/drones";
  fetch(dronesAPI, {
    headers: {
      Origin: "https://localhost:3000",
    },
  })
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
      const dronesData = extractDroneDataFromXML(data);
      console.log(dronesData);
      return dronesData;
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchPilotData = (serialNumber) => {
  const url = `https://cors-anywhere.herokuapp.com/assignments.reaktor.com/birdnest/pilots/${serialNumber}`;
  fetch(url, {
    method: "GET",
    mode: "no-cors",
  })
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
    });
};

export { extractDroneDataFromXML, fetchDroneData, fetchPilotData };
