import {Box, Center, Text, Heading, VStack, Button} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function App() {

  // fetch('https://assignments.reaktor.com/birdnest/drones', {
  //   method: 'GET',
  //   mode: 'no-cors',
  // })
  //   .then(res => res.text())
  //   .then(data => {
  //     const parser = new DOMParser();
  //     const xml = parser.parseFromString(data, 'application/xml')
  //     console.log(xml);
  //   })
  //   .catch(console.error);

 
  // fetch('https://catfact.ninja/fact')
  //   .then(res => res.text())
  //   .then(data => {
  //     console.log(data)
  //   });



  const [getData, setGetData] = useState(true);
  const fetchDroneData = () => {
    fetch('https://catfact.ninja/fact', {
      method: 'GET',
      mode: 'no-cors',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      });
  }

  useEffect(() => {
    fetchDroneData();
  }, [])


  return (
    <Box w="100vw" h="100vh" >
      <Center>
        <VStack>
          <Heading>Birdnest</Heading>
          <Button onClick={() => setGetData((prev) => !prev)}>Fetch Data</Button>
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
