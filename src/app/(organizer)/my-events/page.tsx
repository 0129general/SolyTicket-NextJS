"use client";
import { EventsApi } from "@/app/api/events";
import { ConfigHelper } from "@/app/base/constants";
import { ClientStorage } from "@/app/base/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyEvents = () => {
  const router = useRouter();
  const userName = ClientStorage.getItem(ConfigHelper.SOLY_USERNAME);
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);

  const [pendings, setPendings] = useState<PendingEvents[]>([]);
  const [events, setEvents] = useState<EventsCreatorResponse[]>([]);
  const [activeTab, setActiveTab] = useState<string>("pending");

  useEffect(() => {
    const fetchPendings = async () => {
      const api = new EventsApi({});
      const resPending = await api.getPendingEventsOfOwner(userId);
      if (resPending && resPending.data) {
        setPendings(resPending.data);
      }
    };
    const fetchEvents = async () => {
      const api = new EventsApi({});
      const resEvents = await api.getEventsOfOwner(userId);
      if (resEvents && resEvents.data) {
        setEvents(resEvents.data);
      }
    };
    fetchEvents();
    fetchPendings();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDetailPending = (id: string) => {
    router.push(`/create-event/${id}`);
  };

  const handleDetailEvent = (id: string) => {
    router.push(`/my-events/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
        Etkinliklerim
      </h1>

      <div className="flex flex-col sm:flex-row border-b mb-4">
        <button
          className={`py-2 px-4 font-semibold w-full sm:w-auto ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Beklemedeki Etkinliklerim
        </button>
        <button
          className={`py-2 px-4 font-semibold w-full sm:w-auto ${
            activeTab === "events"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("events")}
        >
          Etkinliklerim
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="overflow-x-auto">
          {pendings.length > 0 ? (
            <table className="min-w-full bg-white table-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Etkinlik Adı
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Tarih
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Saat
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Kategori
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Kategori Tipi
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Lokasyon
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base"></th>
                </tr>
              </thead>
              <tbody>
                {pendings.map((event) => (
                  <tr key={event.id}>
                    <td className="py-2 px-4 border-b text-center">
                      <Link
                        href={`/create-event/${event.id}`}
                        className="underline cursor-pointer text-indigo-600 text-xs sm:text-base"
                      >
                        {event.eventName}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {formatDate(event.date)}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.time}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.eventCategory?.name ?? ""}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.eventCategoryType?.name ?? ""}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.location?.name ?? ""}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="BlueButton w-full sm:w-auto"
                        onClick={() => handleDetailPending(event.id)}
                      >
                        Detaya git
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">
              Beklemede etkinliğiniz yok.
            </p>
          )}
        </div>
      )}

      {activeTab === "events" && (
        <div className="overflow-x-auto">
          {events.length > 0 ? (
            <table className="min-w-full bg-white table-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Etkinlik Adı
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Tarih
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Saat
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Kategori
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Kategori Tipi
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Lokasyon
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Toplam Bilet
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base">
                    Satılan Bilet
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-base"></th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="py-2 px-4 border-b text-center">
                      <Link
                        href={`/my-events/${event.id}`}
                        className="underline cursor-pointer text-indigo-600 text-xs sm:text-base"
                      >
                        {event.eventName}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {formatDate(event.date)}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.time}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.eventCategory?.name ?? ""}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.eventCategoryType?.name ?? ""}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.location?.name ?? ""}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.totalTickets}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                      {event.soldTickets}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="BlueButton w-full sm:w-auto"
                        onClick={() => handleDetailEvent(event.id)}
                      >
                        Detaya git
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Etkinlik bulunmamakta.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
