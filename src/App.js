import {
  Box,
  Center,
  Text,
  Heading,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";

import {
  extractDroneDataFromXML,
  fetchDroneData,
  fetchPilotData,
} from "./utils/utils";

import DronesDisplay from "./components/DronesDisplay";

function App() {
  return (
    <Box w="100vw" h="100vh">
      <Center>
        <VStack>
          <Heading>Birdnest</Heading>
          <DronesDisplay />
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
