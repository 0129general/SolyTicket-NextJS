"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import EventCard from "@/app/components/Base/EventCard";
import { EventsApi } from "@/app/api/events";
import { usePrevious } from "@/app/base/hooks/usePrevious";
import GlobalSpinner from "@/app/components/Base/Spinner/GlobalSpinner";
import SolyDatePicker from "@/app/components/Base/SolyDatepicker";

const SolySelect = dynamic(() => import("@/app/components/Base/SolySelect"), {
  ssr: false,
});

interface EventClientProps {
  selectedFilters: GetEventsByFilterRequestModel;
  filter: EventFilterTypes;
  events: Event[];
  selectedCategoryProps: string;
  selectedCategoryTypeProps: string;
  categoryTypesProps: CategoryType[];
}

const EventClient = ({
  selectedFilters,
  filter,
  events: initialEvents,
  selectedCategoryProps,
  selectedCategoryTypeProps,
  categoryTypesProps,
}: EventClientProps) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    selectedCategoryProps
  );
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>(
    categoryTypesProps
  );
  const isFirstLoad = useRef(true);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategoryType, setSelectedCategoryType] = useState<string>(selectedCategoryTypeProps);
  const [filters, setFilters] = useState<GetEventsByFilterRequestModel>(
    selectedFilters
  );

  const previousFilters = usePrevious(filters);

  const updateURLWithFilters = (filters: GetEventsByFilterRequestModel) => {
    const queryParams = new URLSearchParams();

    if (filters.cityId) queryParams.set("cityId", filters.cityId);
    if (filters.startDate) queryParams.set("startDate", filters.startDate);
    if (filters.endDate) queryParams.set("endDate", filters.endDate);
    if (filters.categoryId) queryParams.set("categoryId", filters.categoryId);
    if (filters.categoryTypeId)
      queryParams.set("categoryTypeId", filters.categoryTypeId);
    if (filters.locationId) queryParams.set("locationId", filters.locationId);
    if (filters.organizerId)
      queryParams.set("organizerId", filters.organizerId);
    if (filters.sortBy) queryParams.set("sortBy", filters.sortBy);
    if (filters.sortOrder) queryParams.set("sortOrder", filters.sortOrder);

    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState(null, "", newUrl);
  };

  const fetchEvents = useCallback(
    async (append = false) => {
      const eventApi = new EventsApi({});
      const res = await eventApi.getEventsByFilter({
        page: filters.page,
        size: filters.size,
        cityId: filters.cityId || undefined,
        locationId: filters.locationId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        categoryTypeId: filters.categoryTypeId || undefined,
        categoryId: filters.categoryId || undefined,
        organizerId: filters.organizerId || undefined,
        sortBy: "date",
        sortOrder: filters.sortOrder || undefined,
      });
      const newEvents = res.data || [];
      if (append) {
        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      } else {
        setEvents(newEvents);
      }
      setHasMore(newEvents.length === filters.size);
      setIsFetching(false);
    },
    [filters, filter.categories]
  );

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (!isInitialLoad) {
      setIsInitialLoad(true);
      return;
    }
    fetchEvents();
  }, [filters, fetchEvents]);

  const handleScroll = useCallback(async () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !isFetching &&
      hasMore
    ) {
      setIsFetching(true);
      setFilters((prevFilters) => ({
        ...prevFilters,
        size: prevFilters.size + 20,
      }));
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    const updatedFilters = {
      ...filters,
      startDate: start ? start.toISOString() : "",
      endDate: end ? end.toISOString() : "",
      page: 1,
    };
    setFilters(updatedFilters);
    updateURLWithFilters(updatedFilters);
  };

  const handleCategoryChange = (event: string) => {
    setSelectedCategory(event);
    const tempType = filter.categories.find((item) => item.id === event);
    setCategoryTypes(tempType?.CategoryType ?? []);
    setSelectedCategoryType("");
    const updatedFilters = {
      ...filters,
      categoryId: event,
      categoryTypeId: "",
      page: 1,
    };
    setFilters(updatedFilters);
    updateURLWithFilters(updatedFilters);
  };

  const handleCategoryTypeClick = (categoryId: string, categoryTypeId: string) => {
    const tempType = filter.categories.find((item) => item.id === categoryId);
    setCategoryTypes(tempType?.CategoryType ?? []); // Update the list of category types
    setSelectedCategory(categoryId);
    setSelectedCategoryType(categoryTypeId);
    const updatedFilters = {
      ...filters,
      categoryId,
      categoryTypeId,
      page: 1,
    };
    setFilters(updatedFilters);
    updateURLWithFilters(updatedFilters);
  };

  const handleCategoryTypeClickForLinks = (categoryId: string, categoryTypeId: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryType(categoryTypeId);
    const tempType = filter.categories.find((item) => item.id === categoryId);
    setCategoryTypes(tempType?.CategoryType ?? []);
    const updatedFilters = {
      page: 1,
      size: 20,
      locationId: undefined,
      cityId: undefined,
      startDate: undefined,
      endDate: undefined,
      categoryTypeId: categoryTypeId,
      categoryId: categoryId,
      organizerId: undefined,
      sortBy: "date",
      sortOrder: "asc",
    };
    setFilters(updatedFilters);
    updateURLWithFilters(updatedFilters);
  };

  const handleOrderClick = (sortBy: string) => {
    const updatedFilters = {
      ...filters,
      sortBy,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    };
    setFilters(updatedFilters);
    updateURLWithFilters(updatedFilters);
  };

  const handleLocationClick = (locationId: string) => {
    const updatedFilters = {
      ...filters,
      locationId,
      page: 1,
    };
    setFilters(updatedFilters);
    updateURLWithFilters(updatedFilters);
  };

  const handleOrganizerClick = (organizerId: string) => {
    const updatedFilters = {
      ...filters,
      organizerId,
      page: 1,
    };
    setFilters(updatedFilters);
    updateURLWithFilters(updatedFilters);
  };

  return (
    <>
      <div className="container mx-auto px-2">
        <div className="my-10 text-center md:text-start">
          <div className="flex flex-wrap justify-center md:justify-center items-center gap-4">
            {filter?.orderTypes && (
              <SolySelect
                options={filter.orderTypes}
                onClick={handleOrderClick}
                placeholder="Sırala"
              />
            )}
            <div className="relative">
              <SolyDatePicker
                startDate={filters.startDate}
                endDate={filters.endDate}
                onDateChange={handleDateChange}
              />
            </div>
            {filter?.categories && (
              <SolySelect
                options={filter.categories}
                onClick={handleCategoryChange}
                value={filters.categoryId}
                placeholder="Kategori"
              />
            )}
            {filter.locations.length > 0 && filters.cityId ? (
              <SolySelect
                options={filter.locations
                  .filter((location) => location.cityId === filters.cityId)
                  .map((location) => ({
                    id: location.id,
                    name: location.name,
                  }))}
                value={filters.locationId}
                onClick={handleLocationClick}
                placeholder="Mekan"
              />
            ) : (
              <SolySelect
                options={filter.locations}
                value={filters.locationId}
                onClick={handleLocationClick}
                placeholder="Mekan"
              />
            )}
          </div>
          {selectedCategory !== "" && (
            <div className="flex flex-wrap justify-center md:justify-center items-center gap-4 pt-5">
              {categoryTypes?.map((item: CategoryType, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer flex items-center justify-center px-4 py-2 rounded-lg border-2 transition-all duration-200 
                    ${selectedCategoryType === item.id
                      ? "bg-[#4e43f1] text-white"
                      : "bg-white text-gray-700 hover:border-[#4e43f1]"
                    }`}
                  onClick={() => handleCategoryTypeClick(selectedCategory, item.id)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">Üzgünüz, aradığınız etkinlik bulunamadı.</h2>
            <p className="mt-4">Bulmak istediğiniz etkinliği şu kategoriler içinde de arayabilirsiniz:</p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {filter.categories.map((category) => (
                <div key={category.id} className="text-left">
                  <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                  <ul className="space-y-1">
                    {category.CategoryType.map((type) => (
                      <li key={type.id} className="text-sm">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleCategoryTypeClickForLinks(category.id, type.id)}
                        >
                          {type.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <EventCard
                key={index}
                id={event.id}
                cardImage={event.image}
                eventDateRange={event.date}
                eventTime={event.time}
                eventTitle={event.eventName}
                eventLocation={event.location.name}
                dull={false}
              />
            ))}
          </div>
        )}

        {isFetching && (
          <div className="text-center mt-4">
            <GlobalSpinner />
          </div>
        )}
      </div>
    </>
  );
};

export default EventClient;
