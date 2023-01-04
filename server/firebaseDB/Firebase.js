// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue, remove } = require("firebase/database");

const config = require("./firebaseConfig.json");

const initFirebase = () => {
  // Initialize Firebase
  const app = initializeApp(config);

  return getDatabase(app);
};

const writePilotData = (db, id, name, email, phoneNum, timestamp) => {
  set(ref(db, "violatedPilots/" + id), {
    fullname: name,
    email: email,
    phoneNum: phoneNum,
    timestamp: timestamp,
  });
};

const writeClosestDistance = (db, distance, timestamp) => {
  const time = new Date(timestamp);
  set(ref(db, "distances/" + time.valueOf()), {
    distance: distance,
  });
};

const deletePilot = (db, id) => {
  remove(ref(db, "violatedPilots/" + id))
    .then(() => {
      console.log("Deleted pilot " + id);
    })
    .catch((err) => {
      console.log("Error while trying to delete pilot: " + err);
    });
};

const deleteDistance = (db, timeValue) => {
  remove(ref(db, "distances/" + timeValue))
    .then(() => {
      console.log("Deleted distance " + timeValue);
    })
    .catch((err) => {
      console.log("Error while trying to delete distance: " + timeValue);
    });
};

const getPilotDatabase = (db) => {
  const pilotsRef = ref(db, "violatedPilots/");
  const violatedPilotsDb = [];
  onValue(pilotsRef, (snapshot) => {
    try {
      Object.entries(snapshot.val()).forEach(([id, pilot]) => {
        violatedPilotsDb.push({
          id: id,
          name: pilot.fullname,
          email: pilot.email,
          phoneNum: pilot.phoneNum,
          timestamp: pilot.timestamp,
        });
      });
    } catch (err) {
      console.log("Error while fetching pilot data: " + err);
    }
  });
  return violatedPilotsDb;
};

const getDistanceDatabase = (db) => {
  const distanceRef = ref(db, "distances/");
  const distanceDb = [];
  onValue(distanceRef, (snapshot) => {
    try {
      Object.entries(snapshot.val()).forEach(([time, data]) => {
        distanceDb.push({
          distance: data.distance,
          timestamp: time,
        });
      });
    } catch (err) {
      console.log("Error while fetching distance data: " + err);
    }
  });
  return distanceDb;
};

module.exports = {
  initFirebase,
  writePilotData,
  getPilotDatabase,
  deletePilot,
  writeClosestDistance,
  getDistanceDatabase,
  deleteDistance,
};
