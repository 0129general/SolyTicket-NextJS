// app/page.tsx

import React from "react";
import { HomepageApi } from "@/app/api/homepage";
import HomePageComponent from "@/app/components/Base/page/HomePage";
import { ApiResponse } from "./base/models/common-models";
import { getServiceUrl } from "./base/proxy/serviceRouter";

interface HomePageProps {
  homePageValues: HomepageValuesResponse;
  categoryItems: IdNameQuery[];
  locations: IdNameQuery[];
  recentEvents: Event[];
  categoryForGuide: CategoryWithCount[];
  locationsForHomepage: LocationsForHomepage[];
}

const getHomePageValues = async (): Promise<HomepageValuesResponse> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getHomePageValues();
    return (
      res.data || {
        ticketSoldCount: 0,
        totalCustomerCount: 0,
        upcomingEventsCount: 0,
      }
    );
  } catch (error) {
    return {
      ticketSoldCount: 0,
      totalCustomerCount: 0,
      upcomingEventsCount: 0,
    };
  }
};

async function getHomePageValuesV2(): Promise<
  ApiResponse<HomepageValuesResponse>
> {
  try {
    const baseUrl = getServiceUrl();
    const url = "homepage/get-homepage-values"
    const serviceUrl = `${baseUrl}${url}`;
    const res = await fetch(serviceUrl);
    const data = await res.json()
    return data as ApiResponse<HomepageValuesResponse>;
  } catch (err) {
    return {
      success: false,
      date: new Date()
    }
  }
}

const getRecentEvents = async (): Promise<Event[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getRecentEvents();
    return res.data || [];
  } catch (error) {
    return [];
  }
};
const getHotTickets = async (): Promise<Event[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getHotTickets();
    return res.data || [];
  } catch (error) {
    return [];
  }
};
const getSolyAdvice = async (): Promise<Event[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getSolyAdvice();
    return res.data || [];
  } catch (error) {
    return [];
  }
};
const getNewlySales = async (): Promise<Event[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getNewlySales();
    return res.data || [];
  } catch (error) {
    return [];
  }
};
const gethighlightedEvent = async (): Promise<AdEvent[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.gethighlightedEvent();
    return res.data || [];
  } catch (error) {
    return [];
  }
};

const getCategoryWithCount = async (): Promise<CategoryWithCount[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getCategoryWithCount();
    return res.data || [];
  } catch (error) {
    return [];
  }
};

const getCategoryItems = async (): Promise<IdNameQuery[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getCategoryItems();
    return res.data || [];
  } catch (error) {
    return [];
  }
};

const getLocations = async (): Promise<IdNameQuery[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getLocations();
    return res.data || [];
  } catch (error) {
    return [];
  }
};

const getLocationsForHomepage = async (): Promise<LocationsForHomepage[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getLocationsForHomepage();
    return res.data || [];
  } catch (error) {
    return [];
  }
};

function delay(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchCache = "default-no-store";
export default async function HomePage() {
  const homePageValues = await getHomePageValuesV2();
  const categoryItems = await getCategoryItems();
  const locations = await getLocations();
  const recentEvents = await getRecentEvents();
  const hotTickets = await getHotTickets();
  const solyAdvice = await getSolyAdvice();
  const newlySales = await getNewlySales();
  const highlightedEvent = await gethighlightedEvent();
  const categoryForGuide = await getCategoryWithCount();
  const locationsForHomepage = await getLocationsForHomepage();

  return (
    <HomePageComponent
      categoryItems={categoryItems}
      locations={locations}
      homePageValues={homePageValues.data || {
        ticketSoldCount: 0,
        totalCustomerCount: 0,
        upcomingEventsCount: 0,
      }}
      recentEvents={recentEvents}
      hotTickets={hotTickets}
      solyAdvice={solyAdvice}
      newlySales={newlySales}
      highlightedEvent={highlightedEvent}
      categoryForGuide={categoryForGuide}
      locationsForHomepage={locationsForHomepage}
    />
  );
};
