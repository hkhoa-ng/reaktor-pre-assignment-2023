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
  Text,
} from "@chakra-ui/react";
import { initFirebase } from "./firebase/Firebase";
import { useState, useEffect } from "react";
import { createPilotElements, startServer, stopServer } from "./utils/utils";

function App() {
  const [pilotElements, setPilotElements] = useState([]);
  const [closestDistance, setClosestDistance] = useState({});
  const [serverIsOn, setServerIsOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Get new drone data at " + new Date().toLocaleTimeString());
      fetch("/api")
        .then((res) => res.json())
        .then((data) => {
          try {
            setPilotElements(createPilotElements(data.pilotData));
            setClosestDistance({
              distance: data.closestDistance.distance,
              timestamp: new Date(+data.closestDistance.timestamp),
            });
          } catch (error) {
            console.log("Error while setting data state: " + error);
          }
        });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box w="100vw" h="100vh">
      <Center h="100%" w="100%">
        <VStack h="100%" w="90%">
          <Heading w="100%">Birdnest</Heading>
          <Button
            colorScheme={serverIsOn ? "red" : "green"}
            onClick={() => {
              if (serverIsOn) {
                stopServer();
                setServerIsOn(false);
              } else {
                startServer();
                setServerIsOn(true);
              }
            }}
          >
            {serverIsOn ? "Stop Server" : "Start Server"}
          </Button>

          <Heading>Violated Pilots</Heading>
          {closestDistance.timestamp !== undefined && (
            <Text>
              Closest distance was {closestDistance.distance} at{" "}
              {closestDistance.timestamp.toLocaleTimeString()}
            </Text>
          )}
          <Box overflowY="scroll" maxH="60%">
            <TableContainer maxW="100%">
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
