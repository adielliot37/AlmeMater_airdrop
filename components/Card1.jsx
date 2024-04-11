import React from "react";
import "../styles/Home.module.css";

const Card1 = () => {
  return (
    <div className="w-[70%] bg-white bg-opacity-70 text-left p-4 rounded-lg shadow sm:p-8 mb-[30px]">

      <h5 className="mb-2 text-[30px] font-bold text-black">
        Frens of Alme Mater will be <br /> airdropped 12% of $ALME&apos;s
        circulating <br />
        supply on launch based on <br />
        accumulated Alme Points.
      </h5>
      <p className="mb-2 mt-8 text-[20px] text-black sm:text-lg">
       Alme Points&apos; balances will be refreshed every 24 hours
      </p>
    </div>
  );
};

export default Card1;
