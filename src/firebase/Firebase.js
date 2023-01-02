// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import "firebase/database";
import config from "./config";
import { getDatabase, ref, set, get, child } from "firebase/database";

const writePilotData = (db, id, name, email, timestamp) => {
  set(ref(db, "violatedPilots/" + id), {
    fullname: name,
    email: email,
    timestamp: timestamp,
  });
};

const getAllViolatedPilots = (db) => {
  const dbRef = ref(db);
  return get(child(dbRef, `violatedPilots/`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const violatedPilotsData = [];

        Object.entries(snapshot.val()).forEach(([id, pilotData]) => {
          const newEntry = {
            name: pilotData.fullname,
            timestamp: pilotData.timestamp,
            email: pilotData.email,
            id: id,
          };
          violatedPilotsData.push(newEntry);
        });
        return violatedPilotsData;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const initFirebase = () => {
  // Initialize Firebase
  const app = initializeApp(config);
  const myDB = getDatabase(app);

  return myDB;
};

export { initFirebase, writePilotData, getAllViolatedPilots };
