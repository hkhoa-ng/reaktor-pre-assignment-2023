// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue, remove } = require("firebase/database");

const config = require("./firebaseConfig.json");

/**
 * Initialized the Firebase's database using Firebase's config
 * @returns reference to Firebase's database
 */
const initFirebase = () => {
  // Initialize Firebase
  const app = initializeApp(config);

  return getDatabase(app);
};

/**
 * Write the violated's pilot data to the database. Automatically update the timestamp in the database if the
 * entry of this pilot is already existed
 * @param {Database} db - Firebase's database
 * @param {String} id - ID of the violated pilot
 * @param {String} name - full name (first + last) of the violated pilot
 * @param {String} email - email of the violated pilot
 * @param {String} phoneNum - phone number of the violated pilot
 * @param {String} timestamp - timestamp of the violation
 */
const writePilotData = (db, id, name, email, phoneNum, timestamp) => {
  set(ref(db, "violatedPilots/" + id), {
    fullname: name,
    email: email,
    phoneNum: phoneNum,
    timestamp: timestamp,
  }).catch((err) => {
    console.log(
      "Error while trying to write distance data to the database: " + err
    );
  });
};

/**
 * Write the closest violated distance to the nest of each timestamp to the database
 * @param {Database} db - Firebase's database
 * @param {Float} distance - closest violated distance to the nest of this timestamp
 * @param {String} timestamp - timestamp of the violation
 */
const writeClosestDistance = (db, distance, timestamp) => {
  const time = new Date(timestamp);
  set(ref(db, "distances/" + time.valueOf()), {
    distance: distance,
  }).catch((err) => {
    console.log("Error while trying to write distance to the database: " + err);
  });
};

/**
 * Delete the pilot with the given pilot ID from the database
 * @param {Database} db - Firebase's database
 * @param {String} id - ID of the pilot to be deleted
 */
const deletePilot = (db, id) => {
  remove(ref(db, "violatedPilots/" + id))
    .then(() => {
      console.log("Deleted pilot " + id);
    })
    .catch((err) => {
      console.log("Error while trying to delete pilot: " + err);
    });
};

/**
 * Delete the distance with the given time value from the database
 * @param {Database} db - Firebase's database
 * @param {String} timeValue - time value of the timestamp of the violated distance to be deleted
 */
const deleteDistance = (db, timeValue) => {
  remove(ref(db, "distances/" + timeValue))
    .then(() => {
      console.log("Deleted distance " + timeValue);
    })
    .catch((err) => {
      console.log("Error while trying to delete distance: " + timeValue);
    });
};

/**
 * Fetch the violated pilots data (in the last 10 minutes) from Firebase's database
 * @param {Database} db
 * @returns an Array contains all violated pilots in the last 10 minutes
 */
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
      console.log(
        "Error while reading fetched pilot data from database: " + err
      );
      console.log("The pilot snapshot is: " + snapshot.val());
    }
  });
  return violatedPilotsDb;
};

/**
 * Fetched the violated distance data (in the last 10 minutes) from Firebase's database
 * @param {Database} db - Firebase's database
 * @returns an Array contains all violated distance in the last 10 minutes
 */
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
      console.log(
        "Error while reading fetched distance data from database: " + err
      );
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
