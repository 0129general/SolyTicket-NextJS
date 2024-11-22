"use client";
import React, { useState } from "react";
import { DestHightLights } from "./HightLights";
import { CreateTourReservation } from "../CreateTourReservation";

interface DestinationDetailsProps {
  highlightsStrings: string[];
  otherDetailsStrings: string[];
  persons: LabelValueEntity[];
  categoryPrices: LabelValueEntity[];
  image: string;
}

export const DestinationDetails = ({
  highlightsStrings,
  otherDetailsStrings,
  persons,
  categoryPrices,
  image,
}: DestinationDetailsProps): React.ReactElement => {
  const [activeTab, setActiveTab] = useState("Açıklama");

  return (
    <div className="mt-5 sm:mt-7">
      <div className="flex gap-x-10 md:gap-x-24 h-[60px] sm:h-[74px] border-b-2 border-gray-300">
        {["Açıklama"].map((tab, index) => {
          const active = tab === activeTab;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(tab)}
              className={`font-medium text-sm border-b-[3px] uppercase transition-all duration-300 ${
                active ? "border-primary" : "border-transparent"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div>
        {/* <p className="py-6 font-medium text-base">Süre:3 saat</p> */}
        <DestHightLights
          desc={otherDetailsStrings}
          highlighted={highlightsStrings}
          image={image}
        />
        <CreateTourReservation
          persons={persons}
          categoryPrices={categoryPrices}
        />
      </div>
    </div>
  );
};
