import {
  Box,
  Center,
  Heading,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ScrollTable from "./components/ScrollTable";
import Console from "./components/Console";
import HashLoader from "react-spinners/HashLoader";

/**
 * React App component for the whole app
 * @returns React component that rendens the application
 */
function App() {
  /**
   * I used 4 states for the main app
   * - pilotData: an array state that contains all violated pilot data to render to the table
   * - closestDistance: an object state that contains the closest confirmed distance to the nest within the last 10 minutes
   * - logMessages: an array state that contains all log messages in the last 30 seconds (to save memory)
   * - loading: a boolean state to check render the loading component initially
   */
  const [pilotData, setPilotData] = useState([]);
  const [closestDistance, setClosestDistance] = useState({});
  const [logMessages, setLogMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Set loading animation to 4 seconds (so that everything should be loaded in)
   */
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  /**
   * Update new log messages to the logMessages state
   * @param {Object} msg - a log message object that contains the timestamp and the log message
   */
  const addNewLogMessage = (msg) => {
    const now = new Date();
    setLogMessages((prev) => {
      // Filter out old log messages that are older than 30 seconds
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

  /**
   * The main 2 seconds repeat interval that fetches data from the backend
   */
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // fetch("http://localhost:8080/api", {
        fetch("https://khoa-ng-birdnest-backend.fly.dev/api", {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((res) => {
            const timestamp = new Date();
            addNewLogMessage(
              `Fetched new data from server at ${timestamp.toLocaleTimeString()}.`
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
        {loading ? (
          <HashLoader size={60} loading={loading} color="teal" />
        ) : (
          <VStack h="90%" w="100%">
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
                  <Stat
                    color="gray.400"
                    w="100%"
                    bg="gray.800"
                    py="10px"
                    px="20px"
                  >
                    <StatLabel fontSize="1.1rem">
                      Closest Confirmed Distance
                    </StatLabel>
                    <StatHelpText>(in the last 10 minutes)</StatHelpText>
                    <StatNumber>
                      {Math.round(closestDistance.distance * 100) / 100} meters
                    </StatNumber>
                    <StatHelpText>
                      (at {closestDistance.timestamp.toLocaleTimeString()})
                    </StatHelpText>
                  </Stat>
                )}

                <Console messages={logMessages} />
              </VStack>
            </HStack>
          </VStack>
        )}
      </Center>
    </Box>
  );
}

export default App;
