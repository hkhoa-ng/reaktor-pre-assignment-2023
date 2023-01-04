import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";

function UIGrid({ header, console, main }) {
  return (
    <Grid
      templateAreas={`"header header"
                      "console main"
                      "console main"`}
      gridTemplateRows={"20px 1fr 30px"}
      gridTemplateColumns={"150px 1fr"}
      h="100vh"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem pl="2" bg="orange.300" area={"header"}>
        Header
      </GridItem>
      <GridItem pl="2" bg="pink.300" area={"console"}>
        Console
      </GridItem>
      <GridItem pl="2" bg="green.300" area={"main"}>
        {main}
      </GridItem>
    </Grid>
  );
}

export default UIGrid;
