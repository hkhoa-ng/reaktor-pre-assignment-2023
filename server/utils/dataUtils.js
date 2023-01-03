const parser = require("xml2json");

const extractDronesData = (data) => {
  const dronesData = [];

  data.drone.forEach((drone) => {
    const serialNum = drone.serialNumber;
    const posX = drone.positionX;
    const posY = drone.positionY;
    // Add the data into the promise to be returned
    const droneToAdd = {
      serialNum: serialNum,
      posX: posX / 1000,
      posY: posY / 1000,
      distance: calculateDistance(
        parseFloat(posX) / 1000,
        parseFloat(posY) / 1000
      ),
      timestamp: data.snapshotTimestamp,
    };
    dronesData.push(droneToAdd);
  });

  return dronesData;
};

const calculateDistance = (posX, posY) => {
  return Math.sqrt(Math.pow(posX - 250, 2) + Math.pow(posY - 250, 2));
};

const getSerialOfViolatedDrones = (dronesData) => {
  return dronesData
    .filter((drone) => drone.distance < 100)
    .map((drone) => {
      return {
        timestamp: drone.timestamp,
        serialNum: drone.serialNum,
      };
    });
};

const timestampFormat = (timeString) => {
  const date = timeString.split("T")[0].split("-").reverse();
  const time = timeString.split("T")[1].split(".")[0];
  return date[0] + "/" + date[1] + "/" + date[2] + ", " + time;
};

const compareTimestamp = (a, b) => {
  const dateArrA = [
    ...a.timestamp.split("T")[0].split("-"),
    ...a.timestamp.split("T")[1].split(".")[0].split(":"),
  ];
  const dateArrB = [
    ...b.timestamp.split("T")[0].split("-"),
    ...b.timestamp.split("T")[1].split(".")[0].split(":"),
  ];
  const dateA = new Date(
    dateArrA[0],
    dateArrA[1],
    dateArrA[2],
    dateArrA[3],
    dateArrA[4],
    dateArrA[5]
  );
  const dateB = new Date(
    dateArrB[0],
    dateArrB[1],
    dateArrB[2],
    dateArrB[3],
    dateArrB[4],
    dateArrB[5]
  );
  return dateA - dateB;
};

module.exports = {
  extractDronesData,
  getSerialOfViolatedDrones,
  timestampFormat,
};
