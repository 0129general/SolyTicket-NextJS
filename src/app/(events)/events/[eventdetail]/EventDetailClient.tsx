"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import OrganizerDetail from "@/app/components/Base/OrganizerDetail";
import EventCard from "@/app/components/Base/EventCard";
import CardDateIcon from "@/app/assets/svg/cardDate.svg";
import CardTimeIcon from "@/app/assets/svg/cardTime.svg";
import LocationIcon from "@/app/assets/svg/select_location.svg";
import LocalImage from "@/../../public/images/gon-freecss-from-hunter-1f.jpg";
import LocalImage2 from "@/../../public/images/orkestra.jpg";
import LocalImage3 from "@/../../public/images/topkap.jpg";
import { useAppSelector } from "../../../../../redux/app/hooks";
import { userContextRedux } from "../../../../../redux/slices/user-context";
import { EventsApi } from "@/app/api/events";
import { CollectionApi } from "@/app/api/collection"; // Import Collection API
import { useRouter } from "next/navigation";

interface EventDetailClientProps {
  event: Event;
  similarEvents: Event[];
}

const EventDetailClient = ({
  event,
  similarEvents,
}: EventDetailClientProps) => {
  const userContext = useAppSelector(userContextRedux);
  const router = useRouter();

  useEffect(() => {
    const addViewedEvent = async () => {
      if (userContext && userContext.id && userContext.id !== "") {
        const eventApi = new EventsApi({});
        await eventApi.addViewedEvent(event.id as string, userContext.id);
      }
    };

    addViewedEvent();
  }, [event.id, userContext]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePurchase = () => {
    router.push(`/events/payment/${event.id}`);
  };

  function sendCollectionDetails(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="container mx-auto px-5">
      <div className="my-16">
        {/* Event Name */}
        <h2 className="font-bold text-[40px] md:text-[50px] text-[#4E43F1] w-full md:w-5/6 lg:w-4/6 leading-tight">
          {event.eventName}
        </h2>

        {/* Date and Location */}
        <div className="flex justify-between text-[18px] md:text-[24px] font-medium my-6">
          <div className="dateTime flex items-center text-[#6B7280]">
            <div className="date flex items-center">
              <Image height={34} className="mr-1" alt="" src={CardDateIcon} />
              {formatDate(event.date)}
            </div>
            <div className="h-6 w-[1px] bg-[#4E43F1] mx-4"></div>
            <div className="time flex items-center">
              <Image height={34} className="mr-1" alt="" src={CardTimeIcon} />
              {event.time}
            </div>
          </div>
          <div className="location flex items-center text-[#6B7280]">
            <Image height={34} className="mr-1" alt="" src={LocationIcon} />
            {event.location.name}
          </div>
        </div>

        {/* Event Image */}
        <div className="my-8 flex justify-center">
          <Image
            src={
              event.eventName ===
              "Mariinsky Orkestrası - Ankara Kültür Yolu Festivali"
                ? LocalImage2
                : event.eventName === "Topkapı Sarayı Müzesi"
                ? LocalImage3
                : LocalImage
            }
            alt=""
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>

        {/* Event Price and Purchase Button */}
        <div className="flex items-center justify-between my-8">
          <div className="font-bold text-[40px] text-[#10B981]">
            {event.eventName ===
            "Mariinsky Orkestrası - Ankara Kültür Yolu Festivali"
              ? "350₺ - 950₺"
              : "250₺"}
          </div>
          <button
            onClick={handlePurchase}
            className="BlueButton px-8 py-3 text-lg"
            style={{ marginRight: "10px" }}
          >
            Şimdi Al
          </button>
        </div>

        {/* Event Description */}
        <div className="my-10">
          <h5 className="font-extrabold text-[24px] text-[#4E43F1] mb-4">
            Etkinlik Açıklaması
          </h5>
          <p className="font-normal text-[18px] text-[#6B7280]">{event.desc}</p>
        </div>

        {/* Organizer Section */}
        <div className="my-10">
          <h5 className="font-extrabold text-[24px] text-[#4E43F1] mb-6">
            Organizatör
          </h5>
          <OrganizerDetail
            id={event.creatorId?.id ?? ""}
            organizerName={event.creatorId?.name ?? ""}
            joined={`${formatDate(event.creatorId.createdAt)}'den beri üye`}
            city={event.location.name}
          />
        </div>

        {/* Collection Section */}
        {event.collections.length > 0 && (
          <div className="my-10 w-full  p-6 bg-gray-50 rounded-lg shadow-lg ">
            <h5 className="font-extrabold text-[24px] text-[#4E43F1] mb-4">
              Dahil Olduğu Soly Koleksiyon
            </h5>
            {event.collections.length > 0 ? (
              <ul className="pl-0" style={{ listStyleType: "none" }}>
                {event.collections.map((collection) => (
                  <li key={collection.id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <div className="text-[#1F2937] font-semibold">
                        <strong>Koleksiyon Adı:</strong> {collection.name}
                      </div>
                      <div className="text-[#4E43F1] font-semibold">
                        <strong>İndirim:</strong> %
                        {collection.discountPercentage}
                      </div>
                      <div className="text-[#6B7280] font-medium">
                        <strong>Bitiş Tarihi:</strong>{" "}
                        {formatDate(collection.expireAt)}
                      </div>
                      <button
                        onClick={() => sendCollectionDetails(collection.id)}
                        className="BlueButton ml-4"
                      >
                        Detayları Gönder
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#6B7280]">Koleksiyon bulunamadı</p>
            )}
          </div>
        )}

        {/* Similar Events */}
        <div className="my-10">
          <h5 className="font-extrabold text-[24px] text-[#4E43F1] mb-6">
            Benzer Etkinlikler
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarEvents.length > 0 &&
              similarEvents.map((cardData, index) => (
                <EventCard
                  key={index}
                  id={cardData.id}
                  cardImage={cardData.image}
                  eventDateRange={cardData.date}
                  eventTime={cardData.time}
                  eventTitle={cardData.eventName}
                  eventLocation={cardData.location.name}
                  dull={false}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailClient;
