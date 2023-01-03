const express = require("express");
const app = express();

const { fetchDroneData, fetchPilotData } = require("./utils/fetchUtils");

const {
  extractDronesData,
  getSerialOfViolatedDrones,
  timestampFormat,
} = require("./utils/dataUtils");
const {
  initFirebase,
  writePilotData,
  writePilotName,
  getDatabaseOnChange,
} = require("./firebaseDB/Firebase");

// Connect to the database
const db = initFirebase();

// Timer to fetch and update every 2 seconds
const timer = setInterval(() => {
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
            writePilotName(db, `${pilot.firstName} ${pilot.lastName}`);
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
  });
}, 2000);

const stopRepeat = () => {
  clearInterval(timer);
};

app.get("/api", (req, res) => {
  res.json(getDatabaseOnChange(db));
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
