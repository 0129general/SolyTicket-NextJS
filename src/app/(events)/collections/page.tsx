import Link from "next/link";
import PageTitle from "@/app/components/Base/PageTitle";
import EventCard from "@/app/components/Base/EventCard";
import { CollectionApi } from "@/app/api/collection";
import { cookies } from "next/headers"; // For accessing cookies in server components

// Fetch data directly in the component
async function fetchCollection(userId: string) {
  const collectionApi = new CollectionApi({});
  try {
    console.log(userId);
    const res = await collectionApi.getCollectionsWithOwnes(userId);
    return res.data;
  } catch (err) {
    console.error("Koleksiyonlar alınamadı:", err);
    return [];
  }
}

const Collections = async () => {
  const cookieStore = cookies();
  const userId = "1e8ddc29-a3cd-49d0-8723-a6a9e166510b";

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

  const collections = await fetchCollection(userId);

  return (
    <>
      <PageTitle title="Soly Koleksiyon" />
      <div className="container mx-auto px-2 text-[#17161A] mt-10">
        {collections && collections.length > 0 ? (
          collections.map((collection: any) => (
            <div key={collection.id} className="mb-10 flex space-x-6">
              {/* Events Section */}
              <div className="flex-1">
                <div className="mb-4">
                  <h5 className="font-bold text-lg">
                    {`${collection.name} Koleksiyonu`}
                  </h5>
                  <p className="text-gray-700">
                    İndirim Oranı:{" "}
                    <span className="text-blue-500">
                      %{collection.discountPercentage}
                    </span>
                  </p>
                </div>

                {/* Main Events */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {collection.events.map((event: any, idx: number) => (
                    <Link
                      className={`link`}
                      href={`/category/eventdetail/${event.id}`}
                      key={idx}
                    >
                      <EventCard
                        cardImage={event.image}
                        eventDateRange={event.date}
                        eventTime={event.time}
                        eventTitle={event.eventName}
                        eventLocation={event.location.name}
                        dull={!event.attended}
                        id={event.id}
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Vertical Line */}
              <div className="w-[2px] bg-gray-300"></div>

              {/* Applicable Events Section */}
              <div className="w-1/4 grid content-center">
                <h6 className="font-semibold mb-2">
                  Kupon Geçerli Olan Etkinlikler
                </h6>
                <ul className="list-none pl-0">
                  {collection.applicableEvents.map(
                    (event: any, idx: number) => (
                      <li key={idx} className="my-2">
                        <Link
                          target="_blank"
                          className="text-blue-600 hover:underline"
                          href={`/events/${event.id}`}
                        >
                          {`${event.eventName} - ${new Date(
                            event.date
                          ).toLocaleDateString()} - ${event.time}`}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Henüz bir koleksiyon bulunmuyor.</p>
        )}
      </div>
    </>
  );
};

export default Collections;
