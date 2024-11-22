"use client";

import React from "react";
import { usePathname } from "next/navigation";

import CardDateIcon from "@/app/assets/svg/cardDate.svg";
import CardTimeIcon from "@/app/assets/svg/cardTime.svg";
import LocationIcon from "@/app/assets/svg/select_location.svg";
import LocalImage from "@/../../public/images/gon-freecss-from-hunter-1f.jpg";

import Image from "next/image";
import OrganizerDetail from "@/app/components/Base/OrganizerDetail";
import { EventsCardData } from "@/app/assets/data/swiperData";
import EventCard from "@/app/components/Base/EventCard";
import Link from "next/link";

const EventDetail = () => {
  const pathname = usePathname();
  const SimilarEvents = EventsCardData.slice(0, 4);
  return (
    <>
      <div className="container mx-auto px-5">
        <div className="my-16">
          <h2 className="font-bold text-[35px] md:text-[46px] w-full md:w-5/6 lg:w-4/6">
            2 for 1 Deal! Royal Canadian International Circus - Calgary
          </h2>
          <div className="flex justify-between text-[15px] md:text-[23px] font-normal my-4">
            <div className="dateTime flex self-center">
              <div className="date">
                <Image height={34} className="mr-1" alt="" src={CardDateIcon} />
                May 24 - Jun 2 2024
              </div>
              <div className="h-6 w-[0.5px] bg-[#4E43F1] mx-4 opacity-35"></div>
              <div className="time ">
                <Image height={34} className="mr-1" alt="" src={CardTimeIcon} />
                7PM MDT
              </div>
            </div>
            <div className="location">
              <Image height={34} className="mr-1" alt="" src={LocationIcon} />
              Calgary
            </div>
          </div>
          <div className="my-5">
            <Image src={LocalImage} alt="" />
          </div>
          <div className="font-semibold text-[36px] text-[#4E43F1]">
            $149 - $300
          </div>
          <div className="my-5">
            <h5 className="font-bold mb-6">
              Grief Webinar for the Loss or Death of a Pet
            </h5>
            <p className="font-semibold">
              Welcome to the webinar &quot;Grief for the Loss or Death of a
              Pet&quot;! Have you lost your furry companion and are you feeling
              a great void in your heart? This online event is the perfect place
              to find support and understanding during difficult times. <br />
              Join us as we explore together the emotions that arise when facing
              the loss of a pet. We will learn to manage grief in a healthy way
              and honor the legacy of our beloved furry friends. <br />
              You are not alone in this process. Register now and join our
              online community to share experiences, tips and virtual hugs.
              Together we can heal and fondly remember those who have left their
              mark on our lives. <br />
              We will wait for you! <br />
              American Schnauzer <br />
              Federiko Narváez - Coach, NLP, Speaker & Bachelor in Psychology
            </p>
          </div>
          <div className="mb-20">
            <h5 className="font-bold mb-6">Organizer</h5>
            <OrganizerDetail
              organizerName="Tahir"
              joined="Joined Since 2020"
              city="Lahore"
              id={""}
            />
          </div>
          <div>
            <h5 className="font-bold mb-6">Similar Events</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {SimilarEvents.map((cardData, index) => (
                <Link
                  className={`link ${
                    pathname === "/category/eventdetail" ? "active" : ""
                  }`}
                  href="/category/eventdetail"
                  key={index}
                >
                  <EventCard
                    cardImage={cardData.src}
                    eventDateRange={cardData.date}
                    eventTime={cardData.time}
                    eventTitle={cardData.title}
                    eventLocation={cardData.location}
                    id={""}
                    dull={false}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
