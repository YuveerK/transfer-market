import React from "react";

const PlayerMobileCard = () => {
  return (
    <div className="w-full p-4 h-fit bg-[#222937]">
      <div className="w-full flex items-center border-b border-b-white pb-2">
        <img
          src="https://img.a.transfermarkt.technology/portrait/medium/122153-1687966325.jpg?lm=1"
          alt=""
          className="w-18 h-14 mr-2 rounded-md"
        />
        <div className="ml-2">
          <div className="flex items-center mt-2 mr-8 ">
            <img
              src="https://tmssl.akamaized.net/images/wappen/header/418.png?lm=1580722449"
              alt=""
              srcset=""
              className="w-10 h-10 mr-2 object-contain rounded-md"
            />
            <div>
              <p>Lionel Messi</p>
              <p>Real Madrid</p>
            </div>
          </div>
        </div>
        <p>60 Mill</p>
      </div>
    </div>
  );
};

export default PlayerMobileCard;
