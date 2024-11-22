"use client";

import { usePathname } from "next/navigation";
import EventCard from "@/app/components/Base/EventCard";
import PageTitle from "@/app/components/Base/PageTitle";
import { EventsCardData } from "@/app/assets/data/swiperData";
import React from "react";
import Link from "next/link";
import { StaticImageData } from "next/image";

interface EventCardData {
  src: StaticImageData | string; // Update this if src is a string path or an imported image
  date: string;
  time: string;
  title: string;
  location: string;
}

const AllEvents: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      <PageTitle title="Family Events" />
      <div className="container mx-auto px-2 text-[#17161A]">
        <div className="my-10 text-center md:text-start">
          <select
            className="rounded-3xl mr-2 text-[13px] font-normal border-opacity-35"
            aria-label="Default select example"
            defaultValue=""
          >
            <option value="" disabled>
              Sort by
            </option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
          <select
            className="rounded-3xl mr-2 text-[13px] font-normal border-opacity-35"
            aria-label="Default select example"
            defaultValue=""
          >
            <option value="" disabled>
              Today
            </option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
          <button className="BlueButton rounded-3xl px-5 py-3 my-5 sm:px-16 sm:py-3 sm:m-0">
            Search
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {EventsCardData.map((cardData: EventCardData, index: number) => (
            <Link
              key={index}
              className={`link ${
                pathname === "/category/eventdetail" ? "active" : ""
              }`}
              href="/category/eventdetail"
            >
              <EventCard
                cardImage={cardData.src}
                eventDateRange={cardData.date}
                eventTime={cardData.time}
                eventTitle={cardData.title}
                eventLocation={cardData.location}
                dull={false}
                id={""}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllEvents;
