import Image, { StaticImageData } from "next/image";
import React from "react";
import Link from "next/link"; // Import Link component

import CardDate from "../../assets/svg/cardDate.svg";
import CardTime from "../../assets/svg/cardTime.svg";
import SelectedLocation from "../../assets/svg/select_location.svg";
import LocalImage from "@/../../public/images/gon-freecss-from-hunter-1f.jpg";
import LocalImage2 from "@/../../public/images/orkestra.jpg";

import LocalImage3 from "@/../../public/images/topkap.jpg";
interface EventCardProps {
  id: string; // Add id prop
  cardImage: StaticImageData | string;
  eventDateRange: string;
  eventTime: string;
  eventTitle: string;
  eventLocation: string;
  dull: Boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  cardImage,
  eventDateRange,
  eventTime,
  eventTitle,
  eventLocation,
  dull,
}) => {
  const opacityClass = dull ? "opacity-20" : "opacity-100";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Link href={`/events/${id}`} className="container mx-auto mb-2">
      <div
        className={`card shadow-EventCardShadow rounded-xl  ${opacityClass} cursor-pointer`}
      >
        <div className="cardImage w-full h-[200px] ">
          <Image
            width={360}
            height={200}
            className="rounded-t-xl h-[-webkit-fill-available] object-cover"
            src={`https://ipfs.io/ipfs/${cardImage}`}
            alt=""
          />
        </div>
        <div className="cardContent p-5 ">
          <div className="dateTime flex font-normal text-[9px]">
            <div className="date ">
              <Image className="mr-1" alt="" src={CardDate} />
              {formatDate(eventDateRange)}
            </div>
            <div className="h-3 w-[0.5px] bg-[#4E43F1] mx-2 opacity-35"></div>
            <div className="time ">
              <Image className="mr-1" alt="" src={CardTime} />
              {eventTime}
            </div>
          </div>
          <div className="title font-bold text-[16px] my-2">{eventTitle}</div>
          <div className="location font-normal text-[12px]">
            <Image className="mr-1" alt="" src={SelectedLocation} />
            {eventLocation}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
