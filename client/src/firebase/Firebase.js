// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/database";
import { getDatabase, ref, set, get, child } from "firebase/database";

const config = require("./config.json");

const initFirebase = () => {
  // Initialize Firebase
  const app = initializeApp(config);
  const myDB = getDatabase(app);

  return myDB;
};

export { initFirebase };
