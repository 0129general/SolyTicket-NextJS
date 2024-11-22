import React from "react";

const EventCardLoader: React.FC = () => {
  return (
    <div className="container mx-auto mb-2">
      <div className="card shadow-EventCardShadow rounded-xl cursor-pointer animate-pulse">
        <div className="cardImage w-full h-[200px] bg-gray-200 rounded-t-xl"></div>
        <div className="cardContent p-5 ">
          <div className="dateTime flex font-normal text-[9px]">
            <div className="date flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-1"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-3 w-[0.5px] bg-[#4E43F1] mx-2 opacity-35"></div>
            <div className="time flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-1"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="title font-bold text-[16px] my-2">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="location flex items-center font-normal text-[12px]">
            <div className="w-4 h-4 bg-gray-200 rounded-full mr-1"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCardLoader;
