import { Tbody, Tr, Td } from "@chakra-ui/react";
import { nanoid } from "nanoid";

const compareTimestamp = (a, b) => {
  const dateA = new Date(a.timestamp);
  const dateB = new Date(b.timestamp);
  return dateA - dateB;
};

const createPilotElements = (pilotData) => {
  const pilotElement = [];
  try {
    pilotData.forEach((pilot) => {
      const timestamp = new Date(pilot.timestamp);
      pilotElement.push(
        <Tr key={nanoid()}>
          <Td>{pilot.name}</Td>
          <Td>{pilot.email}</Td>
          <Td>{pilot.phoneNum}</Td>
          <Td>{timestamp.toLocaleTimeString()}</Td>
          {/* <Td>{timestamp.toUTCString()}</Td> */}
        </Tr>
      );
    });
  } catch (error) {
    console.log("Error while creating pilot display elements: " + error);
  }

  return <Tbody>{pilotElement}</Tbody>;
};

const stopServer = () => {
  fetch("/stop")
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => {
      console.log("Error while trying to stop the server: " + err);
    });
};

const startServer = () => {
  fetch("/resume")
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => {
      console.log("Error while trying to start the server: " + err);
    });
};

export { compareTimestamp, createPilotElements, stopServer, startServer };
