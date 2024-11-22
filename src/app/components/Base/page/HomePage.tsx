import { HomepageApi } from "@/app/api/homepage";
import { NextPage } from "next";
import { Suspense, lazy } from "react";
import LogoFiller from "../Spinner/LogoFiller";

const HeroSection = lazy(
  () => import("@/app/components/Base/home/HeroSection")
);
const VenuesAroundYou = lazy(
  () => import("@/app/components/Base/home/venuesAroundYou")
);
const UpcommingEvents = lazy(
  () => import("@/app/components/Base/home/UpcommingEvents")
);
const Guides = lazy(() => import("@/app/components/Base/home/guides"));
const Footer = lazy(() => import("@/app/components/Base/Footer"));
const EventCardSwiper = lazy(
  () => import("@/app/components/Base/home/EventCardSwiper")
);
const MainNavbar = lazy(() => import("../MainNavbar"));

interface HomePageComponentProps {
  homePageValues: HomepageValuesResponse;
  categoryItems: IdNameQuery[];
  locations: IdNameQuery[];
  recentEvents: Event[];
  categoryForGuide: CategoryWithCount[];
  locationsForHomepage: LocationsForHomepage[];
  hotTickets: Event[];
  solyAdvice: Event[];
  newlySales: Event[];
  highlightedEvent: AdEvent[];
}

const HomePageComponent: NextPage<HomePageComponentProps> = async (
  props: HomePageComponentProps
) => {
  const overlayStyle = {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    overflow: "hidden", // Prevent scrolling
  };

  const pageStyle = {
    height: "100vh",
    overflow: "hidden", // Prevent scrolling
  };

  // const highlightedEvents: Event[] =
  //   props.highlightedEvent &&
  //   props.highlightedEvent.map((adEvent) => );
  // console.log(props.highlightedEvent)
  // console.log(highlightedEvents)
  return (
    <Suspense
      fallback={
        <div style={pageStyle}>
          <div style={overlayStyle}>
            <LogoFiller />
          </div>
          {/* <HomePageComponent
            categoryItems={props.categoryItems}
            locations={props.locations}
            homePageValues={props.homePageValues}
            recentEvents={props.recentEvents}
            categoryForGuide={props.categoryForGuide}
            locationsForHomepage={props.locationsForHomepage} hotTickets={[]} solyAdvice={[]} newlySales={[]} highlightedEvent={[]} /> */}
        </div>
        // <p>Yükleniyor</p>
      }
    >
      <MainNavbar
        // categoryItems={props.categoryItems ?? []}
        locations={props.locations ?? []}
      />
      <HeroSection
        categoryItems={props.categoryItems ?? [{ id: "", name: "" }]}
        locations={props.locations ?? []}
        homePageValues={
          props.homePageValues ?? {
            ticketSoldCount: 0,
            totalCustomerCount: 0,
            upcomingEventsCount: 0,
          }
        }
      />
      <UpcommingEvents slidesPerView={1} events={props.recentEvents ?? []} />
      <Guides categories={props.categoryForGuide ?? []} />
      <EventCardSwiper
        title={"Sıcak Biletler"}
        events={props.hotTickets ?? []}
      />
      <EventCardSwiper
        title={"Öne Çıkanlar"}
        events={props.highlightedEvent ?? []}
      />
      <EventCardSwiper
        title={"SolyTicket Öneriyor"}
        events={props.solyAdvice ?? []}
      />
      <EventCardSwiper title={"Yeni Satışta"} events={props.newlySales ?? []} />
      <VenuesAroundYou locations={props.locationsForHomepage ?? []} />
      <Footer />
    </Suspense>
  );
};

export default HomePageComponent;
