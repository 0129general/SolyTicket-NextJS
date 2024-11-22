import PageTitle from "@/app/components/Base/PageTitle";
import React from "react";

import { organizersData } from "@/app/assets/data/swiperData";
import SelectedLocation from "../../assets/svg/select_location.svg";
import Image from "next/image";
import OrganizerDetail from "@/app/components/Base/OrganizerDetail";

const organizers = () => {
  return (
    <>
      <PageTitle title="Organizers" />
      <div className="container mx-auto px-2 text-[#17161A] my-16">
        {organizersData.map((organizer, index) => {
          return (
            <OrganizerDetail
              key={index}
              organizerName={organizer.name}
              joined={organizer.joined}
              city={organizer.city}
              id={""}
            />
          );
        })}
      </div>
    </>
  );
};

export default organizers;
