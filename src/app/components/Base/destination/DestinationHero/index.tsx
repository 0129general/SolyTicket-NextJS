"use client";
import Image from "next/image";
import React, { useState } from "react";
import heart from "@/app/assets/svg/heart.svg";
import cameraIcon from "@/app/assets/svg/cameraIcon.svg";
import { DestinationDetails } from "../DestinationDetails";
import { useRouter } from "next/navigation";

interface DestinationHeroProps {
  eventId: string;
  image: string;
  locationImage: string;
  price: string;
  title: string;
  date: string;
  time: string;
  highlightsStrings: string[];
  otherDetailsStrings: string[];
  persons: LabelValueEntity[];
  categoryPrices: LabelValueEntity[];
}

export const DestinationHero = ({
  eventId,
  image,
  price,
  title,
  highlightsStrings,
  otherDetailsStrings,
  persons,
  categoryPrices,
  date,
  time,
  locationImage,
}: DestinationHeroProps): React.ReactElement => {
  // const [activeTab, setActiveTab] = useState("Açıklama");
  return (
    <>
      <div className="resContainer">
        <div className="flex gap-x-10 md:gap-x-24 h-12">
          <h4 className="text-4xl sm:text-5xl font-bold text-center text-primary">
            {title}
          </h4>

          {/* {["Açıklama", "rezervasyon"].map((tab, index) => {
            const active = tab === activeTab;
            return (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={`font-medium text-sm  border-b-[3px] uppercase transition-all duration-300 ${
                  active ? "border-primary" : "border-transparent"
                }`}
              >
                {tab}
              </button>
            );
          })} */}
        </div>
      </div>
      <div className="h-[70px] bg-primary sm:h-[120px]" />
      <div className="resContainer flex flex-col-reverse lg:flex-row gap-8 xl:gap-12 -mt-10 sm:-mt-20">
        <div className="flex-1">
          <DestinationImage image={image} />
          <DestinationDetails
            categoryPrices={categoryPrices}
            highlightsStrings={highlightsStrings}
            otherDetailsStrings={otherDetailsStrings}
            persons={persons}
            image={locationImage}
          />
        </div>
        <PriceCard price={price} date={date} time={time} eventId={eventId} />
      </div>
    </>
  );
};

interface DestinationImageProps {
  image: string;
}

const DestinationImage = ({ image }: DestinationImageProps) => (
  <div className="relative rounded-xl overflow-hidden w-full">
    {image ? (
      <Image
        src={image !== "" ? image : "/images/destinationHero.png"}
        alt=""
        width={650}
        height={400}
        className="w-full"
      />
    ) : (
      <div style={{ padding: "20px" }}></div>
    )}
    {/* <div className="absolute top-3 left-3 text-sm h-[39px] px-3 sm:top-5 sm:left-5 rounded-full flex gap-1.5 items-center sm:px-6 sm:h-[48px] bg-dodgerBlue sm:text-base text-white font-medium">
      <Image src={cameraIcon} alt="" width={20} height={20} />
      Kendi Başına
    </div> */}
  </div>
);

interface PriceCardProps {
  price: string;
  date: string;
  time: string;
  eventId: string;
}

const PriceCard = ({ price, date, time, eventId }: PriceCardProps) => {
  const router = useRouter();
  const handlePurchase = () => {
    router.push(`/events/payment/${eventId}`);
  };

  return (
    <div className="w-full lg:w-[428px] xl:w-[528px]">
      <div className=" rounded-xl shadow-EventCardShadow bg-white w-full">
        <div className="p-5 sm:px-9 py-7 flex gap-3 items-center">
          <p className="text-base font-medium text-primary">
            {date} - {time}
          </p>
        </div>
        <hr />
        <div className="flex justify-between items-center p-5 sm:px-9 sm:py-7">
          <div>
            <p className="text-sm font-medium">Başlangıç Fiyatı</p>
            <h4 className="text-[22px] text-primary font-bold mt-1">
              {price} ₺{" "}
              <span className="text-sm font-normal text-gray-400">/ kişi</span>
            </h4>
          </div>
          <button
            onClick={handlePurchase}
            className="h-[40px] sm:h-[60px] bg-primary rounded-[4px]  font-medium text-white text-sm sm:text-[15px] px-4 sm:px-7 md:px-12"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
};
