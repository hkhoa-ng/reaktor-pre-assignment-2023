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
  getDatabaseOnChange,
} = require("./firebaseDB/Firebase");

// Define some constants
const TWO_SECOND = 2000;
const TEN_MINUTE = 600000;

// Connect to the database
const db = initFirebase();

// Timer to fetch and update every 2 seconds
const fetchTimer = setInterval(() => {
  fetchDroneData().then((data) => {
    console.log(
      "Fetching drones data at " + timestampFormat(data.snapshotTimestamp)
    );
    const dronesData = extractDronesData(data);
    const violatedDrones = getSerialOfViolatedDrones(dronesData);
    if (violatedDrones.length > 0) {
      violatedDrones.forEach((drone) => {
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
  const pilotData = getDatabaseOnChange(db);
  filterTenMinutes(db, pilotData);
}, TEN_MINUTE);

const stopRepeat = () => {
  clearInterval(fetchTimer);
  clearInterval(deleteTimer);
};

// Everytime React.js frontend call the backend API:
// Get all pilot data from the database and sort them in order of latest violation timestamp
// Filter out and delete all the violation that > 10 minutes from the database
app.get("/api", (req, res) => {
  // Fetch data from backend API
  const pilotData = getDatabaseOnChange(db).sort((a, b) => {
    return compareTimestamp(a, b);
  });
  // Delete all the entries from more than 10 minutes ago
  filterTenMinutes(db, pilotData);
  res.json(pilotData);
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
