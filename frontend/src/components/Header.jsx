import React from "react";
import { AiOutlineDoubleRight } from "react-icons/ai";

const Header = ({ data }) => {
  return (
    <div className="flex flex-col w-full  rounded-md md:flex-row justify-between  mb-6">
      <div className="bg-gray-900 w-full lg:w-[50%]  p-4 ">
        <div className="flex items-center  w-full">
          <div className="w-[50%] ">
            <div className="w-full flex items-center justify-center">
              <img
                src={`${data.clubImageUrl}`}
                alt="Club Image"
                className="w-20 h-20 object-cover rounded-lg "
              />
            </div>
            <h1 className="hidden text-xl bg-gray-800 h-fit p-2 rounded-md ml-4 ">
              {data.teamName}
            </h1>
            <p className="p-2 text-sm">Market Value</p>
            <h1 className="font-bold text-base bg-gray-800 rounded-md p-2">
              {data.marketValue}
            </h1>
          </div>
          <div className="bg-gray-900 w-full h-fit lg:w-fit lg:mt-0  rounded-md ">
            <div className="flex border-b border-b-white pb-2 ml-2 lg:hidden ">
              <div className="bg-white w-14 h-14 flex items-center justify-center p-2  rounded-md">
                <img
                  src={`${data.logoImage}`}
                  alt="League Logo"
                  className=" w-10 h-10 object-cover rounded-lg mb-2 md:mb-0 md:w-24 h-w-24   "
                />
              </div>
              <div className="">
                <h1 className="font-bold text-base  ml-4 rounded-md">
                  {data.leagueName}
                </h1>
                {[["League Level", data.leagueLevelName]].map(
                  ([label, value]) => (
                    <p className="text-gray-300 text-xs ml-4 " key={label}>
                      {label}:{" "}
                      <span className="font-bold text-red-500">{value}</span>
                    </p>
                  )
                )}
              </div>
            </div>
            <div className=" ">
              <div className="flex flex-col   mt-4">
                <div>
                  {[
                    ["Squad Size", data.squadSize],
                    ["Average Age", data.averageAge],
                    [
                      "Foreign Players",
                      `${data.foreigners} - ${data.percentageForeigners}`,
                    ],
                  ].map(([label, value]) => (
                    <div className="ml-4 mb-2  rounded-md md:mr-2 lg:bg-gray-800 lg:p-2 ">
                      <p className="text-xs " key={label}>
                        {label}:{" "}
                        <span className="text-red-500 font-semibold">
                          {value}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  {[
                    ["National Team players", data.nationalTeamPlayers],
                    [
                      "Stadium",
                      `${data.stadiumName} - ${data.stadiumCapacity}`,
                    ],
                    ["Current Transfer Record", data.currentTransferRecord],
                  ].map(([label, value]) => (
                    <div className="ml-4 mb-2  rounded-md md:mr-2 lg:bg-gray-800 lg:p-2 ">
                      {" "}
                      <p className="text-xs" key={label}>
                        {label}:{" "}
                        <span className="text-red-500 font-semibold">
                          {value}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap bg-gray-800 rounded-md px-2 mt-4">
          {data.badgeImages.map((image, index) => (
            <img
              src={`${image.imageUrl}`}
              className="w-8 h-8 m-2 object-contain"
            />
          ))}
          <AiOutlineDoubleRight />
        </div>
      </div>

      {/* League Info */}
      <div className="hidden bg-gray-900 w-full mt-8 lg:block lg:w-[50%] lg:mt-0 p-4  ">
        <div className="flex items-center">
          <img
            src={`${data.logoImage}`}
            alt="League Logo"
            className="w-16 h-w-16 object-cover rounded-lg mb-4 md:mb-0 md:w-24 h-w-24 bg-white p-2 "
          />
          <div>
            <h1 className="font-semibold text-2xl mb-2 bg-gray-800 ml-4 p-2 rounded-md">
              {data.leagueName}
            </h1>
          </div>
        </div>
        {[
          ["League Level", data.leagueLevelName],
          ["League Position", data.tablePosition],
          ["In League Since", data.inLeagueSinceYears],
        ].map(([label, value]) => (
          <p
            className="text-gray-300 text-sm bg-gray-800 my-4 p-2 rounded-md"
            key={label}
          >
            {label}: <span className="font-bold text-red-500">{value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default Header;
