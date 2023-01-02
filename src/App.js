import { Box, Center, Heading, VStack, Button } from "@chakra-ui/react";
import DronesDisplay from "./components/DronesDisplay";
import { initFirebase } from "./firebase/Firebase";
import { useState, useEffect, useContext } from "react";
import PilotContext from "./context/PilotContext";

function App() {
  const [db, setDb] = useState();
  const [update, setUpdate] = useState(true);
  const { setPreviousViolatedPilots } = useContext(PilotContext);

  // Accessing the Firebase database
  useEffect(() => {
    setDb(initFirebase());
  }, []);

  // Get the previously violated pilots from the database
  useEffect(() => {
    if (db !== undefined) {
      setPreviousViolatedPilots(db);
    }
  }, [db]);

  return (
    <Box w="100vw" h="100vh">
      <Center>
        <VStack>
          <Heading>Birdnest</Heading>
          <Button
            onClick={() => {
              setUpdate((prev) => !prev);
            }}
          >
            Update
          </Button>
          {update && <DronesDisplay db={db} />}
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
