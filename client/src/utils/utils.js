import { Tbody, Tr, Td } from "@chakra-ui/react";
import { nanoid } from "nanoid";

const timestampFormat = (timeString) => {
  const date = timeString.split("T")[0].split("-").reverse();
  const time = timeString.split("T")[1].split(".")[0];
  return date[0] + "/" + date[1] + "/" + date[2] + " at " + time;
};

const compareTimestamp = (a, b) => {
  const dateArrA = [
    ...a.timestamp.split("T")[0].split("-"),
    ...a.timestamp.split("T")[1].split(".")[0].split(":"),
  ];
  const dateArrB = [
    ...b.timestamp.split("T")[0].split("-"),
    ...b.timestamp.split("T")[1].split(".")[0].split(":"),
  ];
  const dateA = new Date(
    dateArrA[0],
    dateArrA[1],
    dateArrA[2],
    dateArrA[3],
    dateArrA[4],
    dateArrA[5]
  );
  const dateB = new Date(
    dateArrB[0],
    dateArrB[1],
    dateArrB[2],
    dateArrB[3],
    dateArrB[4],
    dateArrB[5]
  );
  return dateA - dateB;
};

const createPilotElements = (pilotData) => {
  const pilotElement = [];
  try {
    pilotData.forEach((pilot) => {
      pilotElement.push(
        <Tr key={nanoid()}>
          <Td>{pilot.name}</Td>
          <Td>{pilot.email}</Td>
          <Td>{pilot.phoneNum}</Td>
          <Td>{timestampFormat(pilot.timestamp)}</Td>
        </Tr>
      );
    });
  } catch (error) {
    console.log("Error while creating pilot display elements: " + error);
  }

  return <Tbody>{pilotElement}</Tbody>;
};

export { timestampFormat, compareTimestamp, createPilotElements };
