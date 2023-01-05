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
  Stat,
  StatLabel,
  StatHelpText,
  StatNumber,
  Tbody,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { startServer, stopServer } from "./utils/utils";
import ScrollTable from "./components/ScrollTable";
import Console from "./components/Console";

function App() {
  const [pilotData, setPilotData] = useState([]);
  const [closestDistance, setClosestDistance] = useState({});
  const [serverIsOn, setServerIsOn] = useState(true);
  const [logMessages, setLogMessages] = useState([]);

  const addNewLogMessage = (msg) => {
    const now = new Date();
    setLogMessages((prev) => {
      const oldLogs = [...prev].filter((msg) => {
        const oldTime = new Date(msg.timestamp);
        if (Math.abs(now - oldTime) < 30000) {
          return msg;
        }
      });

      return [
        ...oldLogs,
        {
          message: msg,
          timestamp: now,
        },
      ];
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        fetch("https://khoa-ng-birdnest-backend.fly.dev/api", {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((res) => {
            const timestamp = new Date();
            addNewLogMessage(
              `Fetched new drone data from server at ${timestamp.toLocaleString()}.`
            );
            return res.json();
          })
          .then((data) => {
            try {
              setPilotData(data.pilotData);
              setClosestDistance({
                distance: data.closestDistance.distance,
                timestamp: new Date(+data.closestDistance.timestamp),
              });
            } catch (error) {
              addNewLogMessage(`Error while setting data state: ${error}.`);
              console.log("Error while setting data state: " + error);
            }
          })
          .catch((err) => {
            addNewLogMessage(
              `Error while trying to fetch data from the backend server: ${err}.`
            );
          });
      } catch (error) {
        addNewLogMessage(`Error while trying to fetch data: ${error}.`);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box w="100vw" h="100vh" bg="gray.700">
      <Center h="100%" w="100%">
        <VStack h="70%" w="100%">
          <Heading color="gray.400" maxH="20%">
            🪺 PROJECT BIRDNEST 🪺
          </Heading>

          <HStack maxH="90%" w="80%" gap="20px">
            <ScrollTable
              headings={[
                "PILOT NAME",
                "EMAIL",
                "PHONE NUMBER",
                "LATEST VIOLATION",
              ]}
              pilotData={pilotData}
              caption={
                "🚩 INFORMATION OF VIOLATED PILOTS (IN THE LAST 10 MINUTES) 🚩"
              }
            />
            <VStack h="90%" gap="10px" w="35%">
              {closestDistance.timestamp !== undefined && (
                <Stat color="gray.400" w="100%">
                  <StatLabel fontSize="1.1rem">
                    CLOSEST CONFIRMED DISTANCE TO THE NEST
                  </StatLabel>
                  <StatLabel>(in the last 10 minutes)</StatLabel>
                  <StatNumber>
                    {Math.round(closestDistance.distance * 100) / 100} meters
                  </StatNumber>
                  <StatHelpText>
                    at {closestDistance.timestamp.toLocaleString()}
                  </StatHelpText>
                </Stat>
              )}

              <Console messages={logMessages} />
              {/* <Button
                w="100%"
                colorScheme={serverIsOn ? "red" : "green"}
                onClick={() => {
                  const timestamp = new Date();
                  if (serverIsOn) {
                    stopServer();
                    setServerIsOn(false);
                    addNewLogMessage(`Paused data fetching in backend server.`);
                  } else {
                    startServer();
                    setServerIsOn(true);
                    addNewLogMessage(
                      `Resumed data fetching in backend server.`
                    );
                  }
                }}
              >
                {serverIsOn ? "Stop Server" : "Start Server"}
              </Button> */}
            </VStack>
          </HStack>
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
