const express = require("express");
const app = express();

const { fetchDroneData, fetchPilotData } = require("./utils/fetchUtils");

const {
  extractDronesData,
  getSerialOfViolatedDrones,
  timestampFormat,
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
const TEN_MINUTE = 600000;

// Connect to the database
const db = initFirebase();

// Array to keep track of all the repeating tasks
const timers = [];

const setTimer = () => {
  console.log("Starting server... Updating data every 2 seconds");

  // Timer to fetch and update every 2 seconds
  const fetchTimer = setInterval(() => {
    fetchDroneData().then((data) => {
      console.log(
        "Fetching drones data at " + timestampFormat(data.snapshotTimestamp)
      );
      const dronesData = extractDronesData(data);
      const violatedDrones = getSerialOfViolatedDrones(dronesData);
      if (violatedDrones.length > 0) {
        // Sort the violated drones array by distance, to get the closest distance of the violated drones
        violatedDrones.sort((a, b) => a.distance - b.distance);
        violatedDrones.forEach((drone, index) => {
          try {
            fetchPilotData(drone.serialNum).then((pilot) => {
              writePilotData(
                db,
                pilot.pilotId,
                `${pilot.firstName} ${pilot.lastName}`,
                pilot.email,
                pilot.phoneNumber,
                drone.timestamp
              );
              // Updating only the closest distance of this timestamp to the database
              if (index === 0) {
                writeClosestDistance(db, drone.distance, drone.timestamp);
              }
            });
          } catch (error) {
            console.log(error);
          }
        });
      }
    });
  }, TWO_SECOND);

  // Timer to delete old pilot entries every 10 minutes (when there is no trafic to the frontend)
  const deleteTimer = setInterval(() => {
    const pilotData = getPilotDatabase(db);
    const distanceData = getDistanceDatabase(db);
    filterTenMinutes(db, pilotData);
  }, TEN_MINUTE);

  timers.push(fetchTimer, deleteTimer);
};

const stopRepeat = (timers) => {
  console.log("Stop fetching data...");
  timers.forEach((timer) => {
    clearInterval(timer);
  });
};

// Simple request to stop data fetching
app.get("/stop", (req, res) => {
  stopRepeat(timers);
  res.json(
    "You've stopped the server. To resume, go to https://khoa-ng-birdnest-backend.fly.dev/resume"
  );
});

// Simple request to resume data fetching
app.get("/resume", (req, res) => {
  setTimer();
  res.json(
    "Your server is back online! To stop it, go to https://khoa-ng-birdnest-backend.fly.dev/stop"
  );
});

// Everytime React.js frontend call the backend API:
// Get all pilot data from the database and sort them in order of latest violation timestamp
// Filter out and delete all the violation that > 10 minutes from the database
app.get("/api", (req, res) => {
  // Fetch data from backend API
  const pilotData = getPilotDatabase(db).sort((a, b) => {
    return compareTimestamp(a, b);
  });

  const distanceData = getDistanceDatabase(db);
  const closestDistance = distanceData.sort((a, b) => a.distance - b.distance);

  // Delete all the entries from more than 10 minutes ago
  filterTenMinutes(db, pilotData, distanceData);
  res.json({
    pilotData: pilotData,
    closestDistance: closestDistance[0],
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});

setTimer();
