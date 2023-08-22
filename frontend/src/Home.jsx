import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiTransfer, BiSearch } from "react-icons/bi";
import LoadingBanner from "./components/LoadingBanner";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [leagueTable, setLeagueTable] = useState([]);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_LINKS_TO_SHOW = 5; // Show 5 links at a time for example

  const navigate = useNavigate();
  // useEffect(() => {
  //   getLeagueTable();
  // }, []);

  const getLeagueTable = async () => {
    try {
      const response = await axios.get(
        "http://169.1.238.73:2000/scrape-league-table"
      );
      setLeagueTable(response.data.data);
    } catch (err) {
      setError("Failed to fetch league table data");
    }
  };

  async function fetchTeams(page = 1) {
    setLoading(true);
    try {
      const response = await axios.get("http://169.1.238.73:2000/team", {
        params: {
          query: searchText,
          page: page,
        },
      });

      setTeams(response.data.clubs);
      setPaginationLinks(response.data.pagination);
      setCurrentPage(1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teams:", error.message);
    }
  }

  function handleImageError(e) {
    if (e.target.src.includes("/header/")) {
      e.target.src = e.target.src.replace("/header/", "/small/");
    }
  }

  const viewTeam = async (link) => {
    setLoading(true);
    console.log(link);
    const club = link.split("/", 9)[3];
    const teamId = link.split("/", 9)[6];
    const seasonId = new Date().getFullYear();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/view-team", {
      state: { teamId, club, seasonId },
    });
  };

  return (
    <div className="w-full h-screen bg-[#17191e] overflow-auto p-8">
      <div className="w-full flex items-center justify-center flex-wrap py-10">
        {error && <div className="text-red-500">{error}</div>}
        {leagueTable.map((team, index) => (
          <div></div>
          // <div
          //   key={index}
          //   className="w-[80px] p-2 h-[80px] m-2 bg-white rounded-full shadow-lg "
          // >
          //   {/* You can wrap the following img tag with a lazy load component if you install a library like react-lazyload */}
          //   <img
          //     src={team.logo}
          //     alt={`${team.name} logo`}
          //     className="w-full h-full object-contain"
          //     loading="lazy" // Browser-native lazy-loading
          //     onError={(e) => {
          //       e.target.onerror = null;
          //       e.target.src = "path_to_placeholder_image.jpg"; // Add a placeholder image in case the original doesn't load
          //     }}
          //   />
          // </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-center flex-col mt-10">
        <BiTransfer size={120} color="white" />
        <h1 className="text-3xl md:text-6xl mb-8 text-center">
          Transfer Market
        </h1>

        <div className="flex w-full items-center justify-center">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <BiSearch size={30} className="ml-4" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for a team to get latest transfer news..."
              className="w-[700px] p-4 focus:outline-none focus:border-red-500 bg-[#17191e]"
            />
          </div>
        </div>
        <div
          className="w-fit px-8 py-2 bg-green-500 font-bold text-white rounded-md mt-8 cursor-pointer hover:bg-green-600"
          onClick={() => fetchTeams()}
        >
          Search
        </div>
      </div>
      {loading && <LoadingBanner />}
      {teams?.length > 0 && (
        <table className="w-[1200px] h-[800px] mx-auto mt-[40px]">
          <thead>
            <tr className="text-left bg-red-500 text-white ">
              <th className="p-4">Name</th>
              <th className="p-4">League</th>
              <th className="p-4">Size of Team</th>
              <th className="p-4">Club Worth</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {teams &&
              teams?.length > 0 &&
              teams.map((team, index) => (
                <tr>
                  <td className="p-4 border-b border-b-gray-500">
                    <div className="flex items-center">
                      <img
                        src={team["Club Image"]}
                        alt={team["Club"]}
                        width="40"
                        height="40"
                        className="mr-2"
                        onError={handleImageError} // Adding the onError event handler here
                      />
                      {team.Club}
                    </div>
                  </td>
                  <td className="p-4 border-b border-b-gray-500">
                    {team.League}
                  </td>
                  <td className="p-4 border-b border-b-gray-500">
                    {team.Squad}
                  </td>
                  <td className="p-4 border-b border-b-gray-500">
                    {team["Total Market Value"]}
                  </td>
                  <td className="p-4 border-b border-b-gray-500">
                    <div
                      className="w-fit px-8 py-2 bg-green-500 font-bold text-white rounded-md  cursor-pointer hover:bg-green-600"
                      onClick={() => viewTeam(team.Link)}
                    >
                      View
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <div className="mt-4 w-full flex items-center justify-end">
        {currentPage > 1 && (
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(1, prev - PAGE_LINKS_TO_SHOW))
            }
            className="mr-2 px-3 py-1 border rounded"
          >
            &laquo; Prev
          </button>
        )}

        {Array.isArray(paginationLinks) &&
          paginationLinks
            .slice(
              (currentPage - 1) * PAGE_LINKS_TO_SHOW,
              currentPage * PAGE_LINKS_TO_SHOW
            )
            .map((link, index) => (
              <button
                key={index}
                onClick={() => {
                  fetchTeams(link.title.replace("Page ", ""));
                  setCurrentPage(
                    Math.ceil(
                      parseInt(link.title.replace("Page ", ""), 10) /
                        PAGE_LINKS_TO_SHOW
                    )
                  );
                }}
                className="mr-2 px-3 py-1 border rounded"
              >
                {link.title}
              </button>
            ))}

        {currentPage <
          Math.ceil(paginationLinks.length / PAGE_LINKS_TO_SHOW) && (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="mr-2 px-3 py-1 border rounded"
          >
            Next &raquo;
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
