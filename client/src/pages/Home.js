import React from "react";
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="welcome">Welcome!</div>
      <div className="player-modes">
        <Link to="/pages/solo/Solo">
          <Button variant="outlined" sx={{ w: "300px" }}>
            Solo
          </Button>
        </Link>
        <Link to="/pages/multiplayer/Multiplayer">
          <Button variant="outlined" sx={{ w: "300px" }}>
            Multiplayer
          </Button>
        </Link>
      </div>
    </>
  );
}
