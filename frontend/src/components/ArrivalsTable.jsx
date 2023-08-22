import React from "react";
import PlayerMobileCard from "./PlayerMobileCard";

const TableHeaders = () => (
  <thead className="border-b border-gray-700">
    <tr>
      {["Name", "Age", "From", "Fee", "Nationality", "Market Value"].map(
        (header) => (
          <th
            key={header}
            className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            {header}
          </th>
        )
      )}
    </tr>
  </thead>
);

const ArrivalsTable = ({ data }) => {
  function extractTransferAndYear(str) {
    if (!str) return "";

    const regex = /(Transfers \d{2}\/\d{2})/;
    const match = str.match(regex);

    return match ? match[1] : "";
  }
  console.log(data);
  return (
    <div className="w-full h-auto overflow-auto mt-8">
      <PlayerMobileCard />
      <div className="w-full mb-5">
        <p className="text-lg text-white font-semibold">
          {extractTransferAndYear(data?.season)}
        </p>
      </div>
      <table className="min-w-full divide-y divide-gray-700 shadow-md bg-black mb-10">
        <TableHeaders />
        <tbody className="bg-black divide-y divide-gray-700">
          {data?.arrivals?.map((arrival, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-800" : "bg-black"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex items-center w-full">
                  <img
                    src={`${arrival.player.image}`}
                    alt=""
                    className="w-18 h-14 mr-2 rounded-md"
                  />

                  <p>{arrival.player.name}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {arrival.age}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {arrival.fromClub.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {arrival.fee.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {arrival.nationality.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {arrival.marketValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full mb-5">
        <p className="text-lg text-white font-semibold">Departures</p>
      </div>
      <table className="min-w-full divide-y divide-gray-700 shadow-md bg-black">
        <TableHeaders />
        <tbody className="bg-black divide-y divide-gray-700">
          {data?.departures?.map((departure, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-800" : "bg-black"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex items-center w-full">
                  <img
                    src={`${departure.player.image}`}
                    alt=""
                    className="w-18 h-14 mr-2 rounded-md"
                  />

                  <p>{departure.player.name}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {departure.age}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {departure.toClub.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {departure.fee.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {departure.nationality.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {departure.marketValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArrivalsTable;
