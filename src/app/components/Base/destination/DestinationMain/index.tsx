import React from "react";
import { Footer } from "flowbite-react";
import { DestinationHero, TopBar, TourPreparations } from "..";
import EventCard from "../../EventCard";
import OrganizerDetail from "../../OrganizerDetail";

interface DestinationMainProps {
  topBarTitle: string;
  destinationHero: {
    eventId: string;
    title: string;
    image: string;
    locationImage: string;
    price: string;
    date: string;
    time: string;
    categoryPrices: LabelValueEntity[];
    highlightsStrings: string[];
    otherDetailsStrings: string[];
    persons: LabelValueEntity[];
  };
  tourPreparations: {
    locationInfo: {
      googleMaps: string;
      address: string;
      transportation: string;
    };
  };
  similarEvents: Event[];
  creator: {
    id: string;
    name: string;
    createdAt: string;
    location: string;
  };
}

export const DestinationMain: React.FC<DestinationMainProps> = ({
  topBarTitle,
  destinationHero,
  tourPreparations,
  similarEvents,
  creator,
}) => (
  <section className="font-montserrat">
    <TopBar title={topBarTitle} />
    <DestinationHero
      eventId={destinationHero.eventId}
      date={destinationHero.date}
      time={destinationHero.time}
      title={destinationHero.title}
      image={destinationHero.image}
      locationImage={destinationHero.locationImage}
      price={destinationHero.price}
      categoryPrices={destinationHero.categoryPrices}
      highlightsStrings={destinationHero.highlightsStrings}
      otherDetailsStrings={destinationHero.otherDetailsStrings}
      persons={destinationHero.persons}
    />
    <TourPreparations locationInfo={tourPreparations.locationInfo} />
    <Footer />
    <div className="my-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-96">
      <h5 className="font-extrabold text-[20px] sm:text-[22px] md:text-[24px] text-[#4E43F1] mb-6">
        Organizatör
      </h5>
      <OrganizerDetail
        id={creator?.id ?? ""}
        organizerName={creator?.name ?? ""}
        joined={`${creator.createdAt}'den beri üye`}
        city={creator.location}
      />
    </div>

    {similarEvents.length > 0 &&
      <div className="my-16 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-96">
        <h5 className="font-extrabold text-[20px] sm:text-[22px] md:text-[24px] text-[#4E43F1] mb-6">
          Benzer Etkinlikler
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarEvents.map((cardData, index) => (
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
    }
  </section>
);
