import { Box, Center, Text, Heading, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import axios from "axios";

function App() {
  const [getData, setGetData] = useState(true);

  const dronesAPI = "https://assignments.reaktor.com/birdnest/drones";
  const serialNumber = "SN-zdW3p9ZfiT";

  const getDroneData = () => {
    axios
      .get(dronesAPI, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPilotData = async (serialNumber) => {
    const url = `https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`;
    fetch(url, {
      method: "GET",
      mode: "no-cors",
    })
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
      });
  };

  useEffect(() => {
    getDroneData();
  }, [getData]);

  return (
    <Box w="100vw" h="100vh">
      <Center>
        <VStack>
          <Heading>Birdnest</Heading>
          <Button onClick={() => setGetData((prev) => !prev)}>
            Fetch Data
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
