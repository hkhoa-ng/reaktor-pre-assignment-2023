import {
  Box,
  Center,
  Heading,
  VStack,
  Button,
  Text,
  HStack,
  Thead,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { startServer, stopServer } from "./utils/utils";
import ScrollTable from "./components/ScrollTable";

function App() {
  const [pilotData, setPilotData] = useState([]);
  const [closestDistance, setClosestDistance] = useState({});
  const [serverIsOn, setServerIsOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Get new drone data at " + new Date().toLocaleTimeString());
      try {
        fetch("https://khoa-ng-birdnest-backend.fly.dev/api", {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            try {
              // setPilotElements(createPilotElements(data.pilotData));
              setPilotData(data.pilotData);
              setClosestDistance({
                distance: data.closestDistance.distance,
                timestamp: new Date(+data.closestDistance.timestamp),
              });
            } catch (error) {
              console.log("Error while setting data state: " + error);
            }
          });
      } catch (error) {
        console.log(
          "Error while trying to fetch data from the backend server: " + error
        );
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box w="100vw" h="100vh" bg="gray.700">
      <Center h="100%" w="100%">
        <VStack h="100%" w="90%" sss>
          <Heading color="gray.300" maxH="20%">
            PROJECT BIRDNEST
          </Heading>

          <HStack maxH="90%" maxW="100%" gap="20px">
            <ScrollTable
              headings={[
                "PILOT NAME",
                "EMAIL",
                "PHONE NUMBER",
                "LATEST VIOLATION",
              ]}
              pilotData={pilotData}
              caption={"INFORMATION OF VIOLATED PILOTS IN THE LAST 10 MINUTES"}
            />
            <VStack maxH="100%">
              {closestDistance.timestamp !== undefined && (
                <Table size="sm" variant="striped" colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th color="gray.400" bg="gray.800" p="10px">
                        Closest confirmed distance to the nest
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td color="gray.400">
                        <Text textAlign={"center"}>
                          {Math.round(closestDistance.distance * 100) / 100}{" "}
                          meters, at{" "}
                          {closestDistance.timestamp.toLocaleTimeString()}
                        </Text>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              )}
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
            </VStack>
          </HStack>
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
