import React, { useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const LoadingBanner = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  return (
    <div className="w-full h-screen absolute top-0 left-0 bg-black/50 flex items-center justify-center">
      <PropagateLoader color="red" />
    </div>
  );
};

export default LoadingBanner;
