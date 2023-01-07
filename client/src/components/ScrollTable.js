import React, { useRef, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";

/**
 * React ScrollTable component that display a scrollable table, to view information of violated pilot
 * @param {Array} headings - the headings of the table
 * @param {Array} pilotData - pilot data to be displayed in the table
 * @param {String} caption - caption (in this case name) of the table
 * @returns React component that rendens the pilot data table
 */
function ScrollTable({ headings, pilotData, caption }) {
  /**
   * Simple function to always scroll the table to the bottom (latest pilot violation)
   */
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const messagesEndRef = useRef(null);
  useEffect(scrollToBottom, [pilotData]);

  return (
    <Box
      data-testid="scroll-table"
      overflowY="auto"
      maxH="90%"
      maxW="75%"
      sx={{
        "::-webkit-scrollbar": {
          width: "10px",
        },
        "::-webkit-scrollbar-thumb": {
          background: "gray.500",
        },
        "::-webkit-scrollbar-track": {
          background: "gray.800",
        },
      }}
    >
      <Table size="sm" variant={"striped"} colorScheme="blackAlpha">
        <TableCaption
          fontWeight="bold"
          color="gray.400"
          fontSize="1.1em"
          position="sticky"
          bottom={0}
          bg="gray.800"
        >
          {caption}
        </TableCaption>
        <Thead position="sticky" top={0}>
          <Tr>
            {headings.map((heading) => {
              return (
                <Th key={nanoid()} color="gray.400" bg="gray.800" py="10px">
                  {heading}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {pilotData.map(({ name, email, phoneNum, timestamp }) => {
            const time = new Date(timestamp);
            return (
              <Tr key={nanoid()}>
                <Td color="gray.400">{name}</Td>
                <Td color="gray.400">{email}</Td>
                <Td color="gray.400">{phoneNum}</Td>
                <Td color="gray.400">{time.toLocaleTimeString()}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <div ref={messagesEndRef} />
    </Box>
  );
}

export default ScrollTable;
