const { deletePilot, deleteDistance } = require("../firebaseDB/Firebase");

const TEN_MINUTE = 600000;

/**
 * Extract data from the response of Reaktor's drone API
 * @param {Array} data - array of data parsed from the XML response of Reaktor's API
 * @returns an array of process drone data - get each drone's serial number, position (X-Y), distance to the nest, and snapshot timestamp
 */
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

/**
 * Calculate distance between the drone's position and the nest (250, 250)
 * @param {Float} posX - the X position of the drone
 * @param {Float} posY - the Y position of the drone
 * @returns a float represents the distance
 */
const calculateDistance = (posX, posY) => {
  return Math.sqrt(Math.pow(posX - 250, 2) + Math.pow(posY - 250, 2));
};

/**
 * Extract serial number of possible violated drones from all the drone data fetched
 * @param {Array} dronesData - array contains all the data of the drones
 * @returns an array contains data of violated drones - serial number, distance to the nest, timestamp of violation
 */
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

/**
 * Compare the timestamp of 2 objects - use for Array.sort() function
 * @param {Object} a - object A
 * @param {Object} b - object B
 * @returns which timestamp should come first
 */
const compareTimestamp = (a, b) => {
  const dateA = new Date(a.timestamp);
  const dateB = new Date(b.timestamp);
  return dateA - dateB;
};

/**
 * Filter the pilot and distance database to remove entries that are older than 10 minutes
 * @param {Database} db - the database of this application
 * @param {Array} pilotData - array contains all the violated pilots data
 * @param {Array} distanceData - array contains all the recorded violated distance to the nest with their timestamp
 */
const filterTenMinutes = (db, pilotData, distanceData) => {
  // Get the time of filtering
  const now = new Date();
  console.log("Filtering...");
  // Filter the pilot data
  try {
    pilotData.forEach((pilot) => {
      const pilotTime = new Date(pilot.timestamp);
      const diff = Math.abs(now - pilotTime);
      // Delete pilot data from the database if its timestamp is more than 10 minutes ago
      if (diff > TEN_MINUTE) {
        deletePilot(db, pilot.id);
      }
    });
  } catch (error) {
    console.log("Error while filtering pilot data: " + error);
  }
  // Filter the distance data
  try {
    distanceData.forEach((distance) => {
      const diff = Math.abs(now - distance.timestamp);
      // Delete distance data from the database if its timestamp is more than 10 minutes ago
      if (diff > TEN_MINUTE) {
        deleteDistance(db, distance.timestamp);
      }
    });
  } catch (error) {
    console.log("Error while filtering distance data: " + error);
  }
};

module.exports = {
  extractDronesData,
  getSerialOfViolatedDrones,
  compareTimestamp,
  filterTenMinutes,
};
