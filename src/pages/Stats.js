import React, { useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import coinsmall from "../images/coinsmall.webp";
import { useUser } from "../context/userContext";

const Stats = () => {
  const { users, balance } = useUser(); // Get both users and balance from context
  const [showAirdropMessage, setShowAirdropMessage] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");

  // Function to format numbers
  const formatNumber = (num) => {
    if (isNaN(num) || num == null) {
      return "Invalid number";
    }
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ") + " K";
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const handleContinue = () => {
    setConversionMessage("Conversion token is incoming");
    setTimeout(() => {
      setShowConvertDialog(false);
      setConversionMessage("");
    }, 2000);
  };

  return (
    <>
      <Animate>
        <div className="w-full flex flex-col space-y-6 px-5 py-8 min-h-screen">
          {/* Header */}
          <div className="w-full flex justify-between items-center bg-[#222831] shadow-md rounded-lg p-4">
            <h2 className="text-[#9d99a9] text-xl font-semibold">Wallet Overview</h2>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <img src={coinsmall} alt="Coin Icon" className="w-8 h-8" />
              </div>
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${showAirdropMessage ? "hidden" : ""}`}
                onClick={() => {
                  setShowAirdropMessage(true); // Show dialog message
                }}
              >
                {showAirdropMessage ? "Coming soon airdrop" : "Connect"}
              </button>
            </div>
          </div>

          {/* Wallet Status Card */}
          <div className="relative bg-[#222831] shadow-lg rounded-lg p-6 flex flex-col items-center">
            {/* Username Display */}
            <p className="absolute" style={{ top: "10px", left: "10px", fontSize: "14px", color: "#fff", fontWeight: "600" }}>
              {users ? users.username : "Username not available"}
            </p>
            <h3 className="text-[#9d99a9] text-lg font-medium mt-10">Your Wallet</h3>
            <div className="mt-4 flex flex-col items-center justify-center w-full">
              <div className="mb-4 text-center w-full">
                <h4 className="text-gray-600">USDT</h4>
                <p className="text-2xl font-bold text-[#fff]">
                  {formatNumber(balance)}
                </p>
              </div>
              {/* Convert Button */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => setShowConvertDialog(true)}
              >
                Convert
              </button>
            </div>
          </div>

          {/* Convert Dialog */}
          {showConvertDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50 transition-opacity duration-300 ease-in-out">
              <div className="bg-[#222831] p-8 rounded-lg shadow-lg text-center text-[#fff] max-w-sm mx-auto transition-transform transform scale-100 duration-300 ease-in-out">
                {conversionMessage ? (
                  <p className="text-xl font-semibold mb-4">{conversionMessage}</p>
                ) : (
                  <>
                    <p className="text-lg font-semibold mb-4">Convert Your Balance</p>
                    <p className="text-2xl font-bold mb-4">{formatNumber(balance)}</p>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                      onClick={handleContinue}
                    >
                      Continue
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Popup dialog for Airdrop */}
          {showAirdropMessage && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50 transition-opacity duration-300 ease-in-out">
              <div className="bg-[#222831] p-8 rounded-lg shadow-lg text-center text-[#fff] max-w-sm mx-auto transition-transform transform scale-100 duration-300 ease-in-out">
                <p className="text-xl font-semibold mb-4">The Airdrop is on August 30</p>
                <p className="text-sm mb-4">
                  To be eligible for the airdrop, you must meet the following criteria:
                </p>
                <ul className="text-left mb-4 list-disc list-inside">
                  <li>Cubes owned: At least 50M to 100M</li>
                  <li>Your level: Diamond or Master</li>
                  <li>Invites: At least 5 Players</li>
                  <li>Completed tasks</li>
                </ul>
                <p className="text-sm mb-6">
                  Make sure you fulfill these requirements to participate in our upcoming airdrop event on August 30.
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={() => setShowAirdropMessage(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        <Outlet />
      </Animate>
    </>
  );
};

export default Stats;
