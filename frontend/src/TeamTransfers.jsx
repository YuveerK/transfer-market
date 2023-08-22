import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import axios from "axios";
import ArrivalsTable from "./components/ArrivalsTable";
import LoadingBanner from "./components/LoadingBanner";
import PlayerMobileCard from "./components/PlayerMobileCard";

const TeamTransfers = () => {
  const location = useLocation().state;
  const data = useLocation().state.data;
  const teamId = useLocation().state.teamId;
  const [filters, setFilters] = useState({
    mainPositions: [],
    positions: [],
    transferDate: [],
  });
  const [clubName, setClubName] = useState(data.teamName);
  const [clubId, setClubId] = useState(location.teamId);
  const [seasonId, setSeasonId] = useState(new Date().getFullYear());
  const [position, setPosition] = useState("");
  const [detailedPosition, setDetailedPosition] = useState("");
  const [winterSummer, setWinterSummer] = useState("");
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTransferFilters();
    getTransfers();
  }, []);

  console.log(filters);
  const getTransferFilters = async () => {
    setLoading(true);
    await axios
      .get("http://169.1.238.73:2000/scrape-transfer-filters", {
        params: {
          clubName,
          clubId,
          seasonId,
          position,
          detailedPosition,
          winterSummer,
        },
      })
      .then((res) => {
        setFilters(res.data);
        setLoading(false);
      });
  };
  const getTransfers = async () => {
    setLoading(true);
    await axios
      .get("http://169.1.238.73:2000/scrape-transfers", {
        params: {
          clubName,
          clubId,
          seasonId,
          position,
          detailedPosition,
          winterSummer,
        },
      })
      .then((res) => {
        setTransfers(res.data);
        setLoading(false);
      });
  };

  return (
    <div className="w-full min-h-screen bg-black p-6">
      <div className="container mx-auto">
        <Header data={data} />

        <div className="w-full flex items-center justify-between">
          <select
            name="main-positions"
            className="w-full md:w-[200px] p-2  md:mb-0 md:mr-8 border border-gray-300 rounded-md bg-[#17191e] hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            onChange={(e) => setSeasonId(e.target.value)}
          >
            {filters.seasons &&
              filters.seasons.map((position, index) => (
                <option value={position.value} key={index}>
                  {position.season}
                </option>
              ))}
          </select>
          <select
            name="main-positions"
            className="w-full md:w-[200px] p-2  md:mb-0 md:mr-8 border border-gray-300 rounded-md bg-[#17191e] hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            onChange={(e) => setDetailedPosition(e.target.value)}
          >
            {filters.mainPositions &&
              filters.mainPositions.map((position, index) => (
                <option value={position.value} key={index}>
                  {position.position}
                </option>
              ))}
          </select>
          <select
            name="positions"
            className="w-full md:w-[200px] p-2  md:mb-0 md:mr-8 border border-gray-300 rounded-md bg-[#17191e] hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            onChange={(e) => setPosition(e.target.value)}
          >
            {filters.positions &&
              filters.positions.map((position, index) => (
                <option value={position.value} key={index}>
                  {position.position}
                </option>
              ))}
          </select>
          <select
            name="seasons"
            className="w-full md:w-[200px] p-2  md:mb-0 md:mr-8 border border-gray-300 rounded-md bg-[#17191e] hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            onChange={(e) => setWinterSummer(e.target.value)}
          >
            {filters.transferDate &&
              filters.transferDate.map((position, index) => (
                <option value={position.value} key={index}>
                  {position.position}
                </option>
              ))}
          </select>
        </div>
        <button
          className="w-full mt-2 md:w-auto px-8 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 shadow-lg"
          onClick={() => getTransfers()}
        >
          Search
        </button>
        <ArrivalsTable data={transfers} />
      </div>
      {loading && <LoadingBanner />}
    </div>
  );
};

export default TeamTransfers;
