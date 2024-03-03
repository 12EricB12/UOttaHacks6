import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import pizza2 from "./pizza-slice.svg"; // with import
import "./solo/Solo.css";
import writeUserData from "../firebase/Firebase";

export default function Home() {
  return (
    <>
      <div id="wrapper">
        <img src={pizza2} />
        <div className="welcome">Welcome!</div>
        <div className="player-modes">
            <Button variant="outlined" sx={{ w: "300px" }} onClick={writeUserData(5211, "Hamza", "hisra015@uottawa.ca", "Test URL")}>
              Activate Firebase
            </Button>
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
      </div>
    </>
  );
}
