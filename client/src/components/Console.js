import React, { useRef, useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { nanoid } from "nanoid";

/**
 * React Console component that displays app's status
 * @param {Array} messages - Array contain the log objects (messages - their timestamp)
 * @returns React component that rendens the console
 */
function Console({ messages }) {
  /**
   * Simple function to always scroll the console to the bottom (latest log)
   */
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const messagesEndRef = useRef(null);
  useEffect(scrollToBottom, [messages]);

  const [currentTime, setCurrentTime] = useState(new Date());
  /**
   * Simple interval call to display the current time on the console
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  });

  /**
   * Looping through the messages array to create the log message elements to display
   */
  const logMsg = messages.map((msg) => {
    const time = new Date(msg.timestamp);
    return (
      <Text
        py="5px"
        px="10px"
        color="gray.400"
        w="100%"
        fontFamily="mono"
        key={nanoid()}
      >
        {`> ${time.toLocaleTimeString()}: ${msg.message}`}
      </Text>
    );
  });

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
        "::-webkit-scrollbar-track": {
          background: "gray.800",
        },
      }}
    >
      <Text
        py="5px"
        px="10px"
        color="gray.400"
        w="100%"
        bg="gray.800"
        fontFamily="mono"
        position="sticky"
        top={0}
      >
        logs of last 30 seconds (now {currentTime.toLocaleTimeString()})
      </Text>
      {logMsg}
      <div ref={messagesEndRef} />
    </Box>
  );
}

export default Console;
