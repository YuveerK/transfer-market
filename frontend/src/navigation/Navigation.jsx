import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Home";
import ViewTeam from "../ViewTeam";
import TeamTransfers from "../TeamTransfers";
import ViewPlayer from "../ViewPlayer";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/view-team" element={<ViewTeam />} />
      <Route path="/transfers" element={<TeamTransfers />} />
      <Route path="/view-player" element={<ViewPlayer />} />
    </Routes>
  );
};

export default Navigation;
