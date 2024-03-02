import React from "react";
import { Button, Link } from "@mui/material";

export default function Home() {
  return (
    <>
      <div className="welcome">Welcome!</div>
      <div className="player-modes">
        <Link to="mode/solo">
          <Button variant="outlined" sx={{ w: "300px" }}>
            Solo
          </Button>
        </Link>
        <Link to="/pages/Multiplayer">
          <Button variant="outlined" sx={{ w: "300px" }}>
            Multiplayer
          </Button>
        </Link>
      </div>
    </>
  );
}
