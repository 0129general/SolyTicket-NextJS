import React, { useEffect } from "react";

import { EventsApi } from "@/app/api/events";
import { DestinationMain } from "@/app/components/Base/destination/DestinationMain";

interface EventPageProps {
  params: {
    eventdetail: string;
  };
}

const fetchDetail = async (
  eventId: string | undefined
): Promise<Event | undefined> => {
  const eventApi = new EventsApi({});
  const res = await eventApi.getEventById(eventId as string);
  console.log(res.data)
  return res.data;
};

const fetchSimilar = async (
  eventId: string | undefined
): Promise<Event[] | undefined> => {
  const eventApi = new EventsApi({});
  const res = await eventApi.getSimilarEvents(eventId as string);

  return res.data;
};

const eventdetail = async ({ params }: EventPageProps) => {
  //   const pathname = usePathname();
  // const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);
  const event = await fetchDetail(params.eventdetail);
  const SimilarEvents = await fetchSimilar(params.eventdetail);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      {event && (
        // <EventDetailClient event={event} similarEvents={SimilarEvents ?? []} />
        <DestinationMain
          topBarTitle={event.eventName}
          destinationHero={{
            eventId: event.id,
            locationImage: `${event.location.blockImage}`,
            date: formatDate(event.date),
            time: event.time,
            title: event.eventName,
            image: `https://ipfs.io/ipfs/${event.image}`,
            price: event.priceLabel,
            categoryPrices: [
              { label: "Adult - €22", value: "1" },
              { label: "Child - €12", value: "2" },
              { label: "Student - €15", value: "3" },
            ],
            highlightsStrings: event?.highlight
              ? event.highlight.split("\n")
              : [],
            otherDetailsStrings: event?.desc ? event.desc.split("\n") : [],
            persons:
              event.numberOfPerson === "3"
                ? [
                  { label: "1 Kişi", value: "1" },
                  { label: "2 Kişi", value: "2" },
                  { label: "3 Kişi", value: "3" },
                ]
                : event.numberOfPerson === "2"
                  ? [
                    { label: "1 Kişi", value: "1" },
                    { label: "2 Kişi", value: "2" },
                  ]
                  : [{ label: "1 Kişi", value: "1" }],
          }}
          tourPreparations={{
            locationInfo: {
              googleMaps: event.location.map,
              address: event.location.address,
              transportation: event.location.transportation,
            },
          }}
          creator={{
            id: event.creatorId?.id ?? "",
            createdAt: formatDate(event.creatorId.createdAt),
            location: event.location.name,
            name: event.creatorId?.name,
          }}
          similarEvents={SimilarEvents ?? []}
        />
      )}
    </>
  );
};

export default eventdetail;
