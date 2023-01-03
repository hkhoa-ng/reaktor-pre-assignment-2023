import {
  Box,
  Center,
  Heading,
  VStack,
  Button,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
} from "@chakra-ui/react";
import { initFirebase } from "./firebase/Firebase";
import { useState, useEffect } from "react";
import { createPilotElements } from "./utils/utils";

function App() {
  const [db, setDb] = useState();
  const [update, setUpdate] = useState(true);
  const [pilotElements, setPilotElements] = useState([]);

  // Accessing the Firebase database
  useEffect(() => {
    setDb(initFirebase());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Get new drone data at " + new Date().toLocaleTimeString());
      fetch("/api")
        .then((res) => res.json())
        .then((data) => {
          setPilotElements(createPilotElements(data));
        });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box w="100vw" h="100vh">
      <Center h="100%">
        <VStack h="100%">
          <Heading>Birdnest</Heading>
          <Button
            onClick={() => {
              setUpdate((prev) => !prev);
            }}
          >
            {update ? "Pause" : "Resume"}
          </Button>
          <Heading>Violated Pilots</Heading>

          <Box overflowY="scroll" maxH="80%">
            <TableContainer>
              <Table>
                <Thead position="sticky">
                  <Tr position="sticky">
                    <Th position="sticky">Pilot Name</Th>
                    <Th position="sticky">Email</Th>
                    <Th position="sticky">Phone Number</Th>
                    <Th position="sticky">Lastest violation</Th>
                  </Tr>
                </Thead>
                {pilotElements}
              </Table>
            </TableContainer>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
