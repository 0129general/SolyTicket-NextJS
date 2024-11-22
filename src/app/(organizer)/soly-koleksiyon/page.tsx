"use client";

import { CollectionApi } from "@/app/api/collection";
import { ConfigHelper } from "@/app/base/constants";
import { ClientStorage } from "@/app/base/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SolyKoleksiyon = () => {
  const router = useRouter();
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);

  const [orgCollection, setOrgCollection] = useState<CollectionResponse[]>([]);
  const [activeTab, setActiveTab] = useState<string>("pending");

  useEffect(() => {
    const fetchOrgCollection = async () => {
      const api = new CollectionApi({});
      const res = await api.getCollectionForOrg(userId);
      if (res && res.data) {
        setOrgCollection(res.data);
      }
    };
    fetchOrgCollection();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSendAds = () => {
    router.push(`/soly-koleksiyon/create-collection`);
  };

  const getStatusBadge = (dateString: string) => {
    const currentDate = new Date();
    const eventDate = new Date(dateString);

    if (eventDate < currentDate) {
      return (
        <span className="inline-block bg-red-500 text-white px-2 py-1 rounded">
          Tamamlandı
        </span>
      );
    } else if (
      eventDate.toDateString() === currentDate.toDateString() &&
      currentDate.getHours() < 24
    ) {
      return (
        <span className="inline-block bg-green-500 text-white px-2 py-1 rounded">
          Aktif
        </span>
      );
    } else {
      return (
        <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded">
          Beklemede
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Koleksiyonlarım</h1>
        <button className="BlueButton" onClick={() => handleSendAds()}>
          Koleksiyon Ekle
        </button>
      </div>
      <div className="overflow-x-auto">
        {orgCollection.length > 0 ? (
          <table className="min-w-full bg-white mt-20">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Koleksiyon Adı</th>
                <th className="py-2 px-4 border-b">Tarih</th>
                <th className="py-2 px-4 border-b">İndirim Yüzdesi</th>
                <th className="py-2 px-4 border-b">Etkinlikler</th>
                <th className="py-2 px-4 border-b">Statü</th>
              </tr>
            </thead>
            <tbody>
              {orgCollection.map((collection) => (
                <tr key={collection.id}>
                  <td className="py-2 px-4 border-b text-center ">
                    {collection.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {formatDate(collection.expireAt)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {collection.discountPercentage}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex flex-col">
                      {/* Display Collection Events */}
                      <div>
                        <strong>Koleksiyon Etkinlikleri:</strong>
                        <ul className="pl-5" style={{ listStyleType: "none" }}>
                          {collection.events.length > 0 ? (
                            collection.events.map((event) => (
                              <li key={event.id}>{event.eventName}</li>
                            ))
                          ) : (
                            <li>Koleksiyon Etkinliği Bulunmuyor</li>
                          )}
                        </ul>
                      </div>
                      {/* Display Applicable Events */}
                      <div className="mt-4">
                        <strong>Kupon Geçerli Etkinlikler:</strong>
                        <ul className="pl-5" style={{ listStyleType: "none" }}>
                          {collection.applicableEvents.length > 0 ? (
                            collection.applicableEvents.map((event) => (
                              <li key={event.id}>{event.eventName}</li>
                            ))
                          ) : (
                            <li>Kupon Geçerli Etkinlik Bulunmuyor</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {getStatusBadge(collection.expireAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Koleksiyonunuz Bulunmuyor
          </p>
        )}
      </div>
    </div>
  );
};

export default SolyKoleksiyon;
