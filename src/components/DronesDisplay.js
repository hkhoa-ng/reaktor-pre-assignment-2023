import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Box, Text, VStack, HStack, Heading } from "@chakra-ui/react";
import { fetchDroneData, fetchPilotData } from "../utils/utils";

function DronesDisplay() {
  const DELAY_2_SECS = 2000;

  const [dronesData, setDronesData] = useState({});
  const [dronesElement, setDronesElement] = useState([]);
  const [pilotElement, setPilotElement] = useState([]);
  const [violatedPilots, setViolatedPilots] = useState([]);

  const getDronePromise = () => {
    fetchDroneData().then((data) => {
      setDronesData(data);
      setDronesElement(
        data.drones.map((drone) => {
          return (
            <HStack key={nanoid()}>
              <Text>{drone.serialNum}</Text>
              <Text>{drone.distance}</Text>
            </HStack>
          );
        })
      );
    });
  };

  useEffect(() => {
    // Get new drone data every 2 seconds
    const interval = setInterval(() => {
      console.log("Get new drone data at " + new Date().toLocaleTimeString());
      getDronePromise();
    }, DELAY_2_SECS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      dronesData.drones.forEach((drone) => {
        // Fetch pilot data of drones violated the NDZ
        if (drone.distance < 100) {
          fetchPilotData(drone.serialNum).then((pilot) => {
            try {
              // Find if the violated pilot already in the violated array
              const i = violatedPilots.findIndex(
                (vP) => vP.id === pilot.pilotId
              );
              // If not in yet, then add new. If already in, update the timestamp
              if (i === -1) {
                setViolatedPilots([
                  ...violatedPilots,
                  {
                    id: pilot.pilotId,
                    name: `${pilot.firstName} ${pilot.lastName}`,
                    email: pilot.email,
                    phoneNum: pilot.phoneNumber,
                    timestamp: drone.timestamp,
                  },
                ]);
              } else {
                const updatedVPilot = violatedPilots.map((vP, index) => {
                  if (index === i) {
                    return {
                      ...vP,
                      timestamp: drone.timestamp,
                    };
                  }
                  return vP;
                });
                setViolatedPilots(updatedVPilot);
              }
            } catch (error) {
              console.log(error);
            }
          });
        }
      });
    } catch (error) {}
  }, [dronesData]);

  useEffect(() => {
    // Render the all the violated pilot names
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
        {/* <Box>{dronesElement}</Box> */}
        <Heading>Violated pilots</Heading>
        {pilotElement}
      </VStack>
    </Box>
  );
}

export default DronesDisplay;
