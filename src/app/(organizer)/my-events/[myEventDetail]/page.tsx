"use client";
import { EventsApi } from "@/app/api/events";
import { ConfigHelper } from "@/app/base/constants";
import { ClientStorage } from "@/app/base/storage";
import { useEffect, useState } from "react";

interface EventPageProps {
  params: {
    myEventDetail: string;
  };
}

const EventDetailPage = ({ params }: EventPageProps) => {
  const userName = ClientStorage.getItem(ConfigHelper.SOLY_USERNAME);
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState<EventData | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const eventApi = new EventsApi({});
      const event = await eventApi.getEventAttendeesByCreator(
        userId,
        params.myEventDetail
      );

      if (event && event.data) {
        setEventData(event.data);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [params.myEventDetail, userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleButtonClick = () => {
    console.log("Button clicked");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
        Etkinlik Detayları
      </h1>

      {eventData && (
        <>
          {/* Grid for event info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-base md:text-lg font-semibold">Etkinlik Adı</p>
              <p className="text-gray-700 text-sm md:text-base">
                {eventData.eventInfo.eventName}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-base md:text-lg font-semibold">
                Etkinlik Tarihi
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                {formatDate(eventData.eventInfo.eventDate)}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-base md:text-lg font-semibold">
                Toplam Satılan Bilet
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                {eventData.totalSales}
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="mb-4 text-center md:text-right">
            <button
              onClick={handleButtonClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
            >
              Refresh Attendees
            </button>
          </div>

          {/* Attendee Table */}
          <div className="overflow-x-auto">
            {eventData.attendees.length > 0 ? (
              <table className="min-w-full bg-white table-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-xs sm:text-base">
                      Koltuk
                    </th>
                    <th className="py-2 px-4 border-b text-xs sm:text-base">
                      Katılımcı E-posta
                    </th>
                    <th className="py-2 px-4 border-b text-xs sm:text-base">
                      Blok
                    </th>
                    <th className="py-2 px-4 border-b text-xs sm:text-base">
                      Katılımcı Adı
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventData.attendees.map((attendee) => (
                    <tr key={attendee.attendeeId}>
                      <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                        {attendee.seat}
                      </td>
                      <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                        {attendee.attendeeEmail}
                      </td>
                      <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                        {attendee.block}
                      </td>
                      <td className="py-2 px-4 border-b text-center text-xs sm:text-base">
                        {attendee.attendeeName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">
                Katılımcı bulunmamaktadır.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EventDetailPage;
