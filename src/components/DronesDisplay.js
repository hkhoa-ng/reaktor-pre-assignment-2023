import React, { useState, useEffect, useContext } from "react";
import { nanoid } from "nanoid";
import { Box, Text, VStack, HStack, Heading } from "@chakra-ui/react";
import {
  fetchDroneData,
  fetchPilotData,
  fetchViolatedPilots,
} from "../utils/utils";
import { writePilotData } from "../firebase/Firebase";
import PilotContext from "../context/PilotContext";

function DronesDisplay(props) {
  const DELAY_2_SECS = 2000;

  const [dronesData, setDronesData] = useState({});
  const [pilotElement, setPilotElement] = useState([]);
  const db = props.db;

  // Using context API
  const { violatedPilots, updateViolatedPilots, setPreviousViolatedPilots } =
    useContext(PilotContext);

  const getDronePromise = () => {
    fetchDroneData().then((data) => {
      setDronesData(data);
    });
  };

  // Get new drone data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Get new drone data at " + new Date().toLocaleTimeString());
      getDronePromise();
    }, DELAY_2_SECS);
    return () => clearInterval(interval);
  }, []);

  // Fetch pilot data of drones violated the NDZ
  useEffect(() => {
    if (dronesData.drones !== undefined) {
      dronesData.drones.forEach((drone) => {
        if (drone.distance < 100) {
          fetchPilotData(drone.serialNum).then((pilot) => {
            try {
              // Update the violated pilots in the pilot context
              updateViolatedPilots({
                ...pilot,
                timestamp: drone.timestamp,
              });
              // Write the data of the violated pilot to the database
              writePilotData(
                db,
                pilot.pilotId,
                `${pilot.firstName} ${pilot.lastName}`,
                pilot.email,
                drone.timestamp
              );
            } catch (error) {
              console.log(error);
            }
          });
        }
      });
    }
  }, [dronesData]);

  // Set the elements and render the all the violated pilot names
  useEffect(() => {
    setPilotElement(
      violatedPilots.map((pilot) => {
        try {
          return (
            <HStack key={nanoid()}>
              <Text>{pilot.name}</Text>
              <Text>{pilot.email}</Text>
              <Text>{pilot.phoneNumber}</Text>
              <Text>Lastest violation: {pilot.timestamp}</Text>
            </HStack>
          );
        } catch (error) {
          console.log(error);
        }
      })
    );
  }, [violatedPilots]);

  return (
    <Box>
      <VStack>
        <Heading>Violated pilots</Heading>
        {pilotElement}
      </VStack>
    </Box>
  );
}

export default DronesDisplay;
