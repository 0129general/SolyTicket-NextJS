"use client";

import { usePathname } from "next/navigation";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { EventsCardData } from "../../../assets/data/swiperData";
import EventCard from "../EventCard";
import { Swiper, SwiperSlide } from "swiper/react";
import viewAllIcon from "@/app/assets/svg/ViewAllIcon.svg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { useSwiper } from "swiper/react";
import Image from "next/image";
import Link from "next/link";

interface EventCardSwiperProps {
  events: any[];
  title: string;
}

const EventCardSwiper: React.FC<EventCardSwiperProps> = ({ events, title }) => {
  const pathname = usePathname();
  const swiper = useSwiper();

  return (
    <>
      <div className="container px-5 mx-auto py-10 sm:py-16 md:py-2">
        <div className="flex items-center justify-between">
          <div>
            <h6>Eğlenceyi Keşfedin!</h6>
            <h3 className="mb-6">{title}</h3>
          </div>
          <div className="text-end mt-4">
            <Link
              className={`link ${
                pathname === "/events" ? "active" : ""
              } bg-none text-[#4E43F1] text-[30px] font-medium`}
              href="/events"
            >
              Tümünü Gör{" "}
              <Image
                alt=""
                className="ml-3 inline-block relative top-[-2px]"
                src={viewAllIcon}
              />
            </Link>
          </div>
        </div>

        <div className="myswiper">
          <Swiper
            className="mb-3"
            breakpoints={{
              200: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              576: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1026: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={20}
            slidesPerView={4}
            navigation
            onSwiper={(swiper) => {}}
            onSlideChange={() => {}}
          >
            {events.map((event, index) => {
              return (
                <SwiperSlide className="mb-3" key={index}>
                  <EventCard
                    cardImage={event.image}
                    eventDateRange={event.date}
                    eventTime={event.time}
                    eventTitle={event.eventName}
                    eventLocation={event.location?.name}
                    id={event.id}
                    dull={false}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

// Assign a display name to the component
EventCardSwiper.displayName = "EventCardSwiper";

// Export the component with a name
export default EventCardSwiper;
