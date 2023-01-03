// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue } = require("firebase/database");

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

const writePilotName = (db, name) => {
  set(ref(db, "violatedNames/" + name), {
    fullname: name,
  });
};

const getDatabaseOnChange = (db) => {
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
      console.log("Error while fetching data: " + err);
    }
  });
  return violatedPilotsDb;
};

module.exports = {
  initFirebase,
  writePilotData,
  writePilotName,
  getDatabaseOnChange,
};
