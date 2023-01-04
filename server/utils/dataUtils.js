const parser = require("xml2json");
const { deletePilot, deleteDistance } = require("../firebaseDB/Firebase");
const { ref, set, onValue } = require("firebase/database");

const TEN_MINUTE = 600000;

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
        distance: drone.distance,
      };
    });
};

const timestampFormat = (timeString) => {
  const date = timeString.split("T")[0].split("-").reverse();
  const time = timeString.split("T")[1].split(".")[0];
  return date[0] + "/" + date[1] + "/" + date[2] + ", " + time;
};

const compareTimestamp = (a, b) => {
  const dateA = new Date(a.timestamp);
  const dateB = new Date(b.timestamp);
  return dateA - dateB;
};

const filterTenMinutes = (db, pilotData, distanceData) => {
  const now = new Date();
  console.log("Filtering...");
  pilotData.forEach((pilot) => {
    const pilotTime = new Date(pilot.timestamp);
    const diff = Math.abs(now - pilotTime);
    if (diff > TEN_MINUTE) {
      deletePilot(db, pilot.id);
    }
  });
  distanceData.forEach((distance) => {
    const diff = Math.abs(now - distance.timestamp);
    if (diff > TEN_MINUTE) {
      deleteDistance(db, distance.timestamp);
    }
  });
};

module.exports = {
  extractDronesData,
  getSerialOfViolatedDrones,
  timestampFormat,
  compareTimestamp,
  filterTenMinutes,
};
