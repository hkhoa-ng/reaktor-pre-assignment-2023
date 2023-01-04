import React, { useState, useEffect, useContext } from "react";
import { writePilotData, writePilotName } from "../firebase/Firebase";

function DataHandler(props) {
  const DELAY_2_SECS = 2000;

  const db = props.db;

  // Get new drone data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Get new drone data at " + new Date().toLocaleTimeString());
      fetch("/api")
        .then((res) => res.json())
        .then((data) => console.log(data));
    }, DELAY_2_SECS);
    return () => clearInterval(interval);
  }, []);

  return;
}

export default DataHandler;
