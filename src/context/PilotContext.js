import { createContext, useState } from "react";
import { getDatabase, ref, child, get } from "firebase/database";
import { getAllViolatedPilots } from "../firebase/Firebase";

const PilotContext = createContext();

// For the sake of performance, this app will download the database once only at start, and using React's state to keep track of the upcoming
// violated pilots. It will only updating the data to the database every 2 seconds upon fetching new data
export const PilotProvider = ({ children }) => {
  const [violatedPilots, setViolatedPilots] = useState([]);

  // Getting previous violated pilots from the database
  const setPreviousViolatedPilots = (db) => {
    getAllViolatedPilots(db).then((data) => {
      setViolatedPilots(data);
    });
  };

  // Update new violated pilots to this context's state
  const updateViolatedPilots = (pilot) => {
    // Check if the pilot is already in the downloaded database
    const i = violatedPilots.findIndex((vP) => vP.id === pilot.pilotId);
    // If not in yet, then add new. If already in, update the timestamp
    if (i === -1) {
      setViolatedPilots([
        ...violatedPilots,
        {
          id: pilot.pilotId,
          name: `${pilot.firstName} ${pilot.lastName}`,
          email: pilot.email,
          phoneNum: pilot.phoneNumber,
          timestamp: pilot.timestamp,
        },
      ]);
    } else {
      const updatedVPilot = violatedPilots.map((vP, index) => {
        if (index === i) {
          return {
            ...vP,
            timestamp: pilot.timestamp,
          };
        }
        return vP;
      });
      setViolatedPilots(updatedVPilot);
    }
  };

  return (
    <PilotContext.Provider
      value={{
        violatedPilots,
        updateViolatedPilots,
        setPreviousViolatedPilots,
      }}
    >
      {children}
    </PilotContext.Provider>
  );
};

export default PilotContext;
