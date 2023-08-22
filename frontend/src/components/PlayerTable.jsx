import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlayerTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const headerKeyMapping = {
    Number: "number",
    Image: "image",
    Name: "name",
    Injury: "injury",
    Position: "position",
    DOB: "dateOfBirth",
    Nationality: "nationality",
    Height: "height",
    Foot: "foot",
    Joined: "joined",
    "Signed From": "signedFrom",
    "Contract End": "contractEnd",
    "Market Value": "marketValue",
    // Add other mappings as required
  };
  const [sortConfig, setSortConfig] = useState({
    key: "Name",
    direction: "ascending",
  });
  const sortedPlayers = React.useMemo(() => {
    let sortablePlayers = [...data.players];
    if (sortConfig !== null) {
      sortablePlayers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePlayers;
  }, [data.players, sortConfig]);

  // Search function
  const filteredPlayers = sortedPlayers.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (header) => {
    let key = headerKeyMapping[header];
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const viewPlayer = (playerLink) => {
    console.log(playerLink);
    navigate("/view-player", {
      state: { playerId: playerLink },
    });
  };
  return (
    <table className=" bg-white  rounded-md">
      <thead className="bg-black  text-white">
        <tr>
          {[
            "Number",
            "Image",
            "Name",
            "Injury",
            "Position",
            "DOB",
            "Nationality",
            "Height",
            "Foot",
            "Joined",
            "Signed From",
            "Contract End",
            "Market Value",
          ].map((header) => (
            <th
              key={header}
              className="py-2 px-4 text-left  w-[200px] cursor-pointer"
              onClick={() => requestSort(header)}
            >
              {header}
              {sortConfig.key === header
                ? sortConfig.direction === "ascending"
                  ? " 🔽"
                  : " 🔼"
                : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredPlayers.map((player, index) => (
          <tr
            key={index}
            className=" bg-[#17191e] hover:bg-black transition-all duration-200"
          >
            <td className="py-2 px-4 w-[200px]">{player.number}</td>
            <td className="py-2 px-4 w-[200px]">
              <img
                src={player.image}
                alt="player"
                className="w-12 h-12 rounded-full object-cover"
              />
            </td>
            <td
              className="py-2 px-4 w-[200px] text-blue-400 underline cursor-pointer hover:text-blue-600"
              onClick={() => viewPlayer(player.playerProfileLink)}
            >
              {player.name}
            </td>
            <td
              className={`py-2 px-4 w-[200px] ${
                player.injury === "Not injured" ? " text-white" : "text-red-500"
              }`}
            >
              {player.injury}
            </td>
            <td className="py-2 px-4 w-[200px]">{player.position}</td>
            <td className="py-2 px-4 w-[200px]">{player.dateOfBirth}</td>
            <td className="py-2 px-4 w-[200px]">
              <div className="flex items-center">
                <img
                  src={player.nationalityImage}
                  alt="nationality"
                  className="w-5 h-5 inline-block mr-2"
                />
                <p>{player.nationality}</p>
              </div>
            </td>
            <td className="py-2 px-4 w-[200px]">{player.height}</td>
            <td className="py-2 px-4 w-[200px]">{player.foot}</td>
            <td className="py-2 px-4 w-[200px]">{player.joined}</td>
            <td className="py-2 px-4 w-[200px]">
              <img
                src={player.signedFromImg}
                alt="team"
                className="w-5 h-5 inline-block mr-2"
              />
              {player.signedFrom}
            </td>
            <td className="py-2 px-4 w-[200px]">{player.contractEnd}</td>
            <td className="py-2 px-4 w-[200px]">{player.marketValue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlayerTable;
