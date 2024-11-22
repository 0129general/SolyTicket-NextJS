"use client";

import React from "react";
import SelectedLocation from "../../assets/svg/select_location.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrganizerDetailProps {
  organizerName: string;
  joined: string;
  city: string;
  id: string;
}

const OrganizerDetail: React.FC<OrganizerDetailProps> = ({
  organizerName,
  joined,
  city,
  id,
}) => {
  const router = useRouter();
  const handleOrganizerEvent = () => {
    if (id && id !== "") {

      router.push(`/events?organizerId=${id}`);
    }
  };

  return (
    <div className="my-3">
      <div className="card shadow-defaultShadow rounded-[20px]">
        <div className="flex flex-col sm:flex-row justify-between px-7 py-5 gap-3 ">
          <div className="organizerinfo ">
            <h5 className="font-bold text-base">{organizerName}</h5>
            <div className="font-normal text-sm">{joined}</div>
            <div className="mt-1 font-normal text-sm">
              <Image src={SelectedLocation} alt="" /> {city}
            </div>
          </div>
          <div className="flex gap-3 self-center">
            <button onClick={handleOrganizerEvent} className="BlueButton">
              Diğer Etkinliklerini Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDetail;
