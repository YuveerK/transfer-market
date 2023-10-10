import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingBanner from "./components/LoadingBanner";
import Header from "./components/Header";
import PlayerTable from "./components/PlayerTable";
const ViewTeam = () => {
  // State
  const location = useLocation();
  const [data, setData] = useState(location.state.teamData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [season, setSeason] = useState(
    sessionStorage.getItem("selectedSeason") || 2023
  );

  // Non State
  const navigate = useNavigate();
  // Functions
  const viewPlayer = (playerLink) => {
    navigate("/view-player", { state: playerLink });
  };

  const searchSeason = async () => {
    setLoading(true);

    await axios
      .get("http://169.1.238.73:2000/scrape-team", {
        params: {
          teamId: location.state.teamId,
          club: location.state.club,
          seasonId: season,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
    setLoading(false);
  };

  const handleSeasonChange = (e) => {
    const newSeason = e.target.value;
    setSeason(newSeason);
    sessionStorage.setItem("selectedSeason", newSeason);
  };

  useEffect(() => {
    const getTeamInfo = async () => {
      await axios
        .get("http://169.1.238.73:2000/scrape-team", {
          params: {
            teamId: location.state.teamId,
            club: location.state.club,
            seasonId: season,
          },
        })
        .then((res) => {
          setData(res.data);
          setLoading(false);
        });
    };
    getTeamInfo();
  }, []);

  return (
    <div className="w-full h-screen p-4 bg-gray-900 overflow-auto">
      {data ? (
        <div className="container mx-auto bg-gray-800 p-4 rounded-xl shadow-md overflow-auto">
          {data && <Header data={data} />}

          <div className="w-full mb-6 flex flex-wrap items-center justify-between ">
            <div className="flex flex-col w-full items-center mb-4 md:w-auto md:flex-row md:mb-0 ">
              <select
                name="seasons"
                className="w-full md:w-[200px] p-2 mb-2 md:mb-0 md:mr-4 border border-gray-500 rounded-md bg-gray-700 hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                onChange={handleSeasonChange}
                value={season}
              >
                {data &&
                  data.seasonOptions.map((season, index) => (
                    <option value={season.value} key={index}>
                      {season.season}
                    </option>
                  ))}
              </select>
              <button
                className="w-full mt-2 md:w-auto px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 shadow-lg"
                onClick={() => searchSeason()}
              >
                Search
              </button>
            </div>
            <button
              className="w-full md:w-auto px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 shadow-lg"
              onClick={() =>
                navigate("/transfers", {
                  state: {
                    data: data,
                    teamId: location.state.teamId,
                  },
                })
              }
            >
              Transfers
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search for players..."
              className="w-full p-2 border border-gray-500 bg-gray-700 rounded-md placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="hidden xl:block">
            {data && <PlayerTable data={data} />}
          </div>

          <div className="block xl:hidden space-y-4">
            {data &&
              data.players.map((player, index) => (
                <div
                  key={index}
                  className="border rounded-md p-4 bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-6 mb-4">
                    <img
                      src={player.image}
                      alt="player"
                      className="w-24 h-24 rounded-md object-cover border border-gray-700"
                    />
                    <div>
                      <h2
                        onClick={() => viewPlayer(player.playerProfileLink)}
                        className="text-lg font-medium text-blue-400 underline cursor-pointer hover:text-blue-600"
                      >
                        {player.name}
                      </h2>
                      <p className="text-gray-300 bg-gray-800 px-2 py-1 rounded-md mt-2">
                        {player.position}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-gray-300">
                    <div>
                      <div className="my-2">
                        <p className="text-sm text-gray-400">DOB:</p>
                        <p className="bg-gray-800 px-2 py-1 rounded-md">
                          {player.dateOfBirth}
                        </p>
                      </div>

                      <div className="my-2">
                        <p className="text-sm text-gray-400">Height:</p>
                        <p className="bg-gray-800 px-2 py-1 rounded-md">
                          {player.height}
                        </p>
                      </div>

                      <div className="my-2">
                        <p className="text-sm text-gray-400">Foot:</p>
                        <p className="bg-gray-800 px-2 py-1 rounded-md">
                          {player.foot}
                        </p>
                      </div>

                      <div className="my-2">
                        <p className="text-sm text-gray-400">Joined:</p>
                        <p className="bg-gray-800 px-2 py-1 rounded-md">
                          {player.joined}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="my-2">
                        <p className="text-sm text-gray-400">Nationality:</p>
                        <div className="flex items-center space-x-2 bg-gray-800 px-2 py-1 rounded-md">
                          <img
                            src={player.nationalityImage[0]}
                            alt="nationality"
                            className="w-5 h-5 object-contain "
                          />
                          <span>{player.nationality[0]}</span>
                        </div>
                      </div>

                      <div className="my-2">
                        <p className="text-sm text-gray-400">Signed From:</p>
                        <div className="flex items-center space-x-2 bg-gray-800 px-2 py-1 rounded-md">
                          <img
                            src={player.signedFromImg}
                            alt="signed-from-team"
                            className="w-5 h-5 object-contain "
                          />
                          <span>{player.signedFrom}</span>
                        </div>
                      </div>

                      <div className="my-2">
                        <p className="text-sm text-gray-400">Market Value:</p>
                        <p className="bg-gray-800 px-2 py-1 rounded-md">
                          {player.marketValue}
                        </p>
                      </div>

                      <div className="my-2">
                        <p className="text-sm text-gray-400">Injury Status:</p>
                        <p className="bg-gray-800 px-2 py-1 rounded-md">
                          {player.injury}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <LoadingBanner />
      )}
      {loading && <LoadingBanner />}
    </div>
  );
};

export default ViewTeam;
