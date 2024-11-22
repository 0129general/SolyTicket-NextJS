"use client";

import ThemeContext from "@/app/context/ThemeContext";
import React, { useContext } from "react";

interface TourPreparationsProps {
  locationInfo: LocationInfo;
}

export const TourPreparations = ({
  locationInfo,
}: TourPreparationsProps): React.ReactElement => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("SolySelect must be used within a ThemeProvider");
  }

  const { theme } = themeContext;

  return (
    <section className={`py-7 sm:py-10 mt-8 md:mt-16 bg-primary/5`}>
      <div className="resContainer">
        <p className="text-[15px] font-medium">Sizin İçin Her Detay Hazır</p>
        <h3 className="text-xl sm:text-[36px] font-semibold mt-2">
          Lokasyon Bilgileri
        </h3>

        {/* Steps card */}
        <div
          className={`my-4 sm:my-8 flex lg:items-center flex-col-reverse lg:flex-row rounded-xl overflow-hidden  lg:h-[480px] shadow-defaultShadow ${theme === "dark" ? "bg-black" : "bg-white"
            }`}
        >
          <div
            className={`pt-8 lg:pt-16 px-8 sm:px-16 max-w-[533px] w-full ${theme === "dark" ? "bg-black" : "bg-white"
              }`}
          >
            {/* First Step */}
            <div className="flex gap-6">
              {/* Line start */}
              <div className="flex flex-col items-center flex-1 grow-0">
                <span className="w-3 h-3 inline-block bg-dodgerBlue rounded-full" />
                <span className="block border-l-[3px] border-dodgerBlue h-full" />
              </div>
              {/* Line end */}

              <div className="pb-12">
                <span className="py-1 px-3 sm:py-1.5 sm:px-5 rounded-full bg-dodgerBlue text-white text-xs sm:text-sm ">
                  Varış
                </span>
                <div className="mt-4 flex flex-col gap-1.5">
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">Adres: </span>{" "}
                    {locationInfo.address}
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">Metro: </span>{" "}
                    {locationInfo.transportation}
                  </p>
                </div>
              </div>
            </div>

            {/* Second Step */}
            <div className="flex gap-6 justify-start">
              {/* Line start */}
              <div className="flex flex-col items-center flex-1 grow-0">
                <span className="w-3 h-3 inline-block bg-dodgerBlue rounded-full" />
                <span className="block border-l-[3px] border-dodgerBlue h-full" />
              </div>
              {/* Line end */}

              <div className="pb-16">
                {/* <span className="py-1 px-3 sm:py-1.5 sm:px-5 rounded-full bg-dodgerBlue text-white text-sm ">

                </span> */}
                {/* <div className="mt-4 flex flex-col gap-1.5">
                  <p className="text-sm sm:text-base">1 saat</p>
                  <p className="text-sm sm:text-base mt-4 sm:mt-6 font-medium">
                    Topkapı Sarayı Müzesi Müdürlüğü
                  </p>
                </div> */}
              </div>
            </div>
          </div>
          <div className="border-2 lg:flex-1 w-full lg:h-full lg:w-auto">
            <iframe
              src={locationInfo.googleMaps}
              width="100%"
              // height="400"
              className="h-[250px] sm:h-[360px] lg:h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
