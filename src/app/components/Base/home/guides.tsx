"use client";

import { usePathname } from "next/navigation";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { GuideData } from "../../../assets/data/swiperData";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { useSwiper } from "swiper/react";
import Image from "next/image";
import Link from "next/link";

interface GuideProps {
  categories: CategoryWithCount[];
}

const GuidesComponent: React.FC<GuideProps> = ({ categories }) => {
  const pathname = usePathname();
  const swiper = useSwiper();

  return (
    <>
      <div className="container px-5 mx-auto py-10 sm:py-16 md:py-32">
        <h6>Eğlenceyi Keşfedin!</h6>
        <h3 className="mb-6">Eğlence Rehberi</h3>

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
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
          >
            {categories?.length > 0 &&
              categories.map((category, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Link
                      className={`link ${
                        pathname === `/events?categoryId=${category.id}`
                          ? "active"
                          : ""
                      }`}
                      href={`/events?categoryId=${category.id}`}
                    >
                      <div className="container mx-auto mb-2">
                        <div
                          className={`card shadow-EventCardShadow rounded-xl text-[#17161A] bg-[#4f43f11e]`}
                        >
                          <div className="cardImage w-full h-[315px] relative">
                            <div className="absolute bottom-6 left-6">
                              <Image
                                className="mb-2"
                                src={GuideData[index].src}
                                alt=""
                              />
                              <h5>{category.categoryName}</h5>
                              <p>
                                <span className="font-bold">
                                  {category.count}
                                </span>{" "}
                                Events
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default GuidesComponent;
