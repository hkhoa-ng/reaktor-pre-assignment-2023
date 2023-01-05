import React from "react";
import { Box, Text } from "@chakra-ui/react";

function Panel({ content, caption }) {
  return (
    <Box
      bg="#2A3442"
      overflowY="auto"
      minW="100%"
      h="70%"
      sx={{
        "::-webkit-scrollbar": {
          width: "10px",
        },
        "::-webkit-scrollbar-thumb": {
          background: "gray.500",
        },
      }}
    >
      <Text
        py="5px"
        px="10px"
        color="gray.400"
        w="100%"
        bg="gray.800"
        position="sticky"
        top={0}
      >
        CLOSEST CONFIRMED DISTANCE TO THE NEST
      </Text>
      <Text
        py="5px"
        px="10px"
        color="gray.400"
        w="100%"
        bg="gray.800"
        position="sticky"
        top={0}
      >
        (in the last 10 minutes)
      </Text>
      <Text
        py="5px"
        px="10px"
        color="gray.400"
        w="100%"
        bg="gray.800"
        position="sticky"
        top={0}
      >
        {content}
      </Text>
      <Text>{caption}</Text>
    </Box>
  );
}

export default Panel;
