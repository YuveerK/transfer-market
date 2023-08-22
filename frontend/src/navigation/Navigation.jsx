import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Home";
import ViewTeam from "../ViewTeam";
import TeamTransfers from "../TeamTransfers";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/view-team" element={<ViewTeam />} />
      <Route path="/transfers" element={<TeamTransfers />} />
      <Route path="/transfers" element={<TeamTransfers />} />
    </Routes>
  );
};

export default Navigation;
