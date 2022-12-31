import { Box, Center, Text, Heading, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";

import {
  extractDroneDataFromXML,
  fetchDroneData,
  fetchPilotData,
} from "./utils/utils";

const convert = require("xml-js");

function App() {
  const [getData, setGetData] = useState(true);
  const [drones, setDrones] = useState({});

  useEffect(() => {
    const dronesData = fetchDroneData();
    setDrones(dronesData);
  }, [getData]);

  return (
    <Box w="100vw" h="100vh">
      <Center>
        <VStack>
          <Heading>Birdnest</Heading>
          <Button onClick={() => setGetData((prev) => !prev)}>
            Fetch Data
          </Button>
          <Button
            onClick={() => {
              console.log(drones);
            }}
          >
            Print Drones
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
