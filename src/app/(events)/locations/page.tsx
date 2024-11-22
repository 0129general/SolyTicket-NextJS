"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import PageTitle from "@/app/components/Base/PageTitle";
import React from "react";
import { eventLocations } from "@/app/assets/data/swiperData";
import Image from "next/image";
import { HomepageApi } from "@/app/api/homepage";


const getLocations = async (): Promise<Location[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getLocationsInCities();
    return res.data || [];
  } catch (error) {
    return [];
  }
};

const location = async () => {
  // const pathname = usePathname()

  const locations = await getLocations();

  return (
    <>
      <PageTitle title="Lokasyonlar" />
      <div className="container mx-auto px-2 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {locations.map((location, index) => {
            return (
              <Link key={index} className={`link 'active`} href={`/events?locationId=${location.id}`}>
                <div className="relative" >
                  {/* <Image className="w-full" src={location.image} alt="" /> */}
                  <Image className="w-full" src={eventLocations[1].src} alt="" />
                  <h3 className="absolute bottom-8 left-8 text-white font-semibold text-[26px]">
                    {location.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default location;
