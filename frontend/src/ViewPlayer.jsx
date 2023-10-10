import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ViewPlayer = () => {
  const location = useLocation();
  const playerLink = location.state.playerId;
  console.log(playerLink);
  const getPlayerInfo = async () => {
    await axios
      .get("http://169.1.238.73:2000/player", {
        params: { playerLink: playerLink },
      })
      .then((res) => {
        console.log(res.data);
      });
  };
  const getPlayerProfile = async () => {
    await axios
      .get("http://169.1.238.73:2000/players", {
        params: { playerLink: playerLink },
      })
      .then((res) => {
        console.log(res.data);
      });
  };
  useEffect(() => {
    getPlayerInfo();
    getPlayerProfile();
  }, []);

  return <div>ViewPlayer</div>;
};

export default ViewPlayer;
