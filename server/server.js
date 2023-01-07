const express = require("express");
const cors = require("cors");
const app = express();
const Promise = require("bluebird");
app.use(cors());
app.use(require("express-status-monitor")());

const { fetchDroneData, fetchPilotData } = require("./utils/fetchUtils");

const {
  extractDronesData,
  getSerialOfViolatedDrones,
  compareTimestamp,
  filterTenMinutes,
} = require("./utils/dataUtils");

const {
  initFirebase,
  writePilotData,
  getPilotDatabase,
  writeClosestDistance,
  getDistanceDatabase,
} = require("./firebaseDB/Firebase");

// Define some constants
const TWO_SECOND = 2000;

// Connect to the database
const db = initFirebase();

// Array to keep track of all the repeating tasks (intervals)
const timers = [];

/**
 * Start 2 repeating intervals:
 * - A 2-second interval to fetch and process new drones (and possibly pilot) data every 2 seconds. Then upload
 *   this data to the database
 * - A 10-minute interval to delete old entries (>10 minutes) from the database (only when there is no traffic in the frontend)
 */
const setTimer = () => {
  console.log("Starting server... Updating data every 2 seconds");
  // Timer to delete old entries > 10 minutes
  const deleteTimer = setInterval(() => {
    const pilotData = getPilotDatabase(db);
    const distanceData = getDistanceDatabase(db);
    filterTenMinutes(db, pilotData, distanceData);
    delete pilotData;
    delete distanceData;
  }, TWO_SECOND);

  // Timer to fetch and update every 2 seconds
  const fetchTimer = setInterval(() => {
    try {
      // Fetch the drone data from Reaktor's given API
      fetchDroneData().then((data) => {
        console.log(
          "Fetching drones data at " + new Date(data.snapshotTimestamp)
        );
        const dronesData = extractDronesData(data);
        // Get violated drones from the fetched drone data
        const violatedDrones = getSerialOfViolatedDrones(dronesData);
        if (violatedDrones.length > 0) {
          // Sort the violated drones array by distance, to get the closest distance of the violated drones
          violatedDrones.sort((a, b) => a.distance - b.distance);
          violatedDrones.forEach((drone, index) => {
            try {
              fetchPilotData(drone.serialNum).then((pilot) => {
                try {
                  writePilotData(
                    db,
                    pilot.pilotId,
                    `${pilot.firstName} ${pilot.lastName}`,
                    pilot.email,
                    pilot.phoneNumber,
                    drone.timestamp
                  );
                  // Updating only the closest violation distance of this timestamp to the database
                  // (in case there are multiple violation in 1 timestamp, only the one with the closest distance will be updated
                  // to the distance database)
                  if (index === 0) {
                    writeClosestDistance(db, drone.distance, drone.timestamp);
                  }
                } catch (error) {
                  console.log(
                    "Error while writing pilot data to database: ",
                    error
                  );
                  console.log("The error pilot was: " + pilot);
                }
              });
            } catch (error) {
              console.log(
                "Error while trying to fetch pilot data from Reaktor's API: " +
                  error
              );
            }
          });
        }
        delete dronesData;
        delete violatedDrones;
      });
    } catch (error) {
      console.log("Error while fetching drone data from Reaktor API: " + error);
    }
  }, TWO_SECOND);

  timers.push(fetchTimer, deleteTimer);
};

/**
 * Stop all the repeating intervals
 * @param {Array} timers - array contains all the repeating intervals
 */
const stopRepeat = (timers) => {
  console.log("Stop fetching data...");
  timers.forEach((timer) => {
    clearInterval(timer);
  });
};

/**
 * Simple request to stop data fetching. Everytime a GET request is made to this URL, the server will stop
 * the intervals and stop fetching/updating data
 */
app.get("/stop", (req, res) => {
  stopRepeat(timers);
  res.json(
    "You've stopped the server. To resume, go to https://khoa-ng-birdnest-backend.fly.dev/resume"
  );
});

/**
 * Simple request to resume data fetching. Everytime a GET request is made to this URL, the server will start
 * the intervals and resume fetching/updating data
 */
app.get("/resume", (req, res) => {
  setTimer();
  res.json(
    "Your server is back online! To stop it, go to https://khoa-ng-birdnest-backend.fly.dev/stop"
  );
});

/**
 * Handle GET request to /api make by React frontend. The frontend FETCH from the server every 2 seconds to get real-time data
 * Everytime the frontend calls the server, the server will:
 * - Fetch and process violated pilot (sort in ascending order of latest violation) and closest distance data from the database
 *   then return that to the frontend.
 * - Update and delete old entries (>10 minutes) in the database
 */
app.get("/api", (req, res) => {
  // Delete all the old entries from more than 10 minutes ago
  // filterTenMinutes(db, getPilotDatabase(db), getDistanceDatabase(db));

  // Fetch filtered pilot data and sort it in latest violation order
  const pilotData = getPilotDatabase(db).sort((a, b) => {
    return compareTimestamp(a, b);
  });

  // Fetch filtered distance data in the last 10 minutes, and find the closest distance to the nest
  const distanceData = getDistanceDatabase(db);
  const closestDistance = distanceData.sort((a, b) => a.distance - b.distance);

  // Response to the frontend with the data
  res.json({
    pilotData: pilotData,
    closestDistance: closestDistance[0],
  });

  delete distanceData;
  delete closestDistance;
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});

setTimer();
