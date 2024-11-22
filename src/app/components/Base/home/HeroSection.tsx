"use client";
import React, { useState } from "react";
import Image from "next/image";
import CategoryImage from "@/app/assets/svg/iconamoon_category-light.svg";
import SelectLocation from "@/app//assets/svg/select_location.svg";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { GetServerSideProps, NextPage } from "next";
import { HomepageApi } from "@/app/api/homepage";

interface HeroSectionProps {
  homePageValues: HomepageValuesResponse;
  categoryItems: IdNameQuery[];
  locations: IdNameQuery[];
}

const HeroSection: NextPage<HeroSectionProps> = (props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleLocationChange = (event: any) => {
    setSelectedLocation(event.target.value);
  };
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation) params.append("cityId", selectedLocation);
    if (selectedCategory) params.append("categoryId", selectedCategory);
    const url = params.toString();
    router.push(`/events?${url}`);
  };

  return (
    <>
      <div className="HeroSection ">
        <div className="container mx-auto py-10 sm:py-16 md:py-32 ">
          <div className="HeroContent px-5 sm:px-0">
            <div className="HeroText">
              <h6 className="mb-3">BLOCKCHAIN TABANLI ETKİNLİK BİLETLEME PLATFORMU </h6>
              <h1 className="pb-16" style={{ lineHeight: "1" }}>
                Çevrenizdeki <br />{" "}
                <span className="text-[#4E43F1]">Etkinlikleri</span> Keşfedin!
              </h1>
            </div>
            <div className="HeroSelects w-auto lg:w-9/12 mb-16 bg-[#ffffff] shadow-[0_0_30px_0_rgba(78, 67, 241, 0.08)]">
              <form className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 px-5 py-5 ">
                <div className="select1 col-span-2 ">
                  <label
                    htmlFor="selectcategory border-none"
                    className="block mb-2 text-base font-bold text-black"
                  >
                    Ne
                  </label>

                  <div className="selectContainer relative">
                    <select
                      id="selectcategory"
                      className="block w-full pl-7 px-4 py-3 rounded border-none text-black"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value={""}>Etkinlik Tipi Seçiniz</option>
                      {props.categoryItems?.length > 0 &&
                        props.categoryItems.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                    <Image
                      className="mr-3 absolute top-[11px]"
                      src={CategoryImage}
                      alt=""
                    />
                  </div>
                </div>
                <div className="select2 col-span-2 ">
                  <label
                    htmlFor="selectlocation"
                    className="block mb-2 text-base font-bold text-black"
                  >
                    Nerede
                  </label>

                  <div className="selectContainer relative">
                    <select
                      id="selectlocation"
                      className="block w-full pl-7 px-4 py-3 rounded border-none text-black"
                      value={selectedLocation}
                      onChange={handleLocationChange}
                    >
                      <option value={""}>Şehir Seçiniz</option>
                      {props.locations?.length > 0 &&
                        props.locations.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                    <Image
                      className="mr-3 absolute top-[10px]"
                      src={SelectLocation}
                      alt=""
                    />
                  </div>
                </div>
                {/* <Link
                  className={`link ${
                    pathname === "/category" ? "active" : ""
                  } BlueButton col-span-2 md:col-span-1 max-h-fit justify-center self-center block sm:flex`}
                  href="/category"
                  onClick={() => console.log(props.homePageValues)}
                >
                  Ara
                </Link> */}
                {/* <button className={`BlueButton w-full `} type="submit">
                  Ara
                </button> */}
                <button
                  type="button"
                  className="BlueButton col-span-2 mt-6 md:col-span-1 max-h-fit justify-center self-center block sm:flex"
                  onClick={handleSearch}
                >
                  {" "}
                  Ara
                </button>
              </form>
            </div>
            <div className="EventsNumbers grid  grid-cols-2 sm:grid-cols-3 w-auto lg:w-5/12 gap-8">
              <div className="NumberContent">
                <h3>{props.homePageValues.upcomingEventsCount}</h3>
                <p>Yaklaşan Etkinlikler</p>
              </div>
              <div className="NumberContent">
                <h3>{props.homePageValues.ticketSoldCount}</h3>
                <p>Satılan Biletler</p>
              </div>
              <div className="NumberContent">
                <h3>{props.homePageValues.totalCustomerCount}</h3>
                <p>Mutlu Müşteri</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
