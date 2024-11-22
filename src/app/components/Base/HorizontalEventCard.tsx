import React from "react";
import Image from "next/image";

import LocalImage from "@/../../public/images/gon-freecss-from-hunter-1f.jpg";
interface EventCardProps {
  imageUrl: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  iconUrl: string;
  currency: string;
}

const HorizontalEventCard = ({
  imageUrl,
  title,
  description,
  duration,
  price,
  iconUrl,
  currency,
}: EventCardProps) => {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      {/* Event Image */}
      <div className="w-1/3">
        <Image
          src={LocalImage}
          alt={title}
          width={300}
          height={200}
          className="object-cover rounded-lg w-full h-full"
        />
      </div>

      {/* Event Content */}
      <div className="w-2/3 p-4">
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-red-500 font-semibold cursor-pointer">
          Read more...
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="text-gray-500">Duration: {duration}</div>
          <div className="text-red-500 text-lg font-bold">
            From {price} {currency}
          </div>
        </div>
      </div>

      {/* Icon */}
      <div className="p-4">
        <Image src={iconUrl} alt="icon" width={30} height={30} />
      </div>
    </div>
  );
};

export default HorizontalEventCard;
