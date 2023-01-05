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

function ScrollTable({ headings, pilotData, caption }) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [pilotData]);

  return (
    <Box
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
                <Td color="gray.400">{time.toLocaleString()}</Td>
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
