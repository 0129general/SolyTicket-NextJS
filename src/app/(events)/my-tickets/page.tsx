import { EventsApi } from "@/app/api/events";
import HorizontalEventCard from "@/app/components/Base/HorizontalEventCard";
import PageTitle from "@/app/components/Base/PageTitle";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

async function fetchTickets(userId: string) {
  const collectionApi = new EventsApi({});
  try {
    const res = await collectionApi.getTicketsOfUser(userId);
    return res.data;
  } catch (err) {
    console.error("Koleksiyonlar alınamadı:", err);
    return [];
  }
}

const EventList = async () => {
  const cookieStore = cookies();
  const userId = "2af4aacf-b413-450f-983f-156b2b19a6b6";

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <h2 className="text-3xl font-bold text-red-600 mt-4">
          Kullanıcı kimliği bulunamadı
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Lütfen giriş yapmayı deneyin veya sayfayı yenileyin.
        </p>
        <Link href="/login">
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Giriş Yap
          </button>
        </Link>
      </div>
    );
  }

  const eventsData = await fetchTickets(userId);
  return (
    <>
      <PageTitle title="Biletlerim" />
      <div className="container w-1/2 mx-auto px-4 py-8">
        {eventsData && eventsData.length > 0 ? (
          eventsData.map((event, idx) => (
            <HorizontalEventCard
              key={idx}
              imageUrl={event.imageUrl}
              title={event.title}
              description={event.description}
              duration={event.duration}
              price={event.price}
              currency={event.currency}
              iconUrl={event.iconUrl}
            />
          ))
        ) : (
          <p className="text-center">Henüz bir biletiniz bulunmuyor.</p>
        )}
      </div>
    </>
  );
};

export default EventList;
