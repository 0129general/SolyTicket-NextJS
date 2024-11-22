"use client";
import { AdsApi } from "@/app/api/ads";
import { EventsApi } from "@/app/api/events";
import { ConfigHelper } from "@/app/base/constants";
import { ClientStorage } from "@/app/base/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Ads = () => {
  const router = useRouter();
  const userName = ClientStorage.getItem(ConfigHelper.SOLY_USERNAME);
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);

  const [orgAds, setOrgAds] = useState<AdsResponse[]>([]);
  const [activeTab, setActiveTab] = useState<string>("pending");

  useEffect(() => {
    const fetchOrgAds = async () => {
      const api = new AdsApi({});
      const resOrgAds = await api.getAdsForOrg(userId);
      if (resOrgAds && resOrgAds.data) {
        setOrgAds(resOrgAds.data);
      }
    };
    fetchOrgAds();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSendAds = () => {
    router.push(`/ads/create-ads`);
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
        <h1 className="text-3xl font-bold mb-4">Reklamlarım</h1>
        <button className="BlueButton" onClick={() => handleSendAds()}>
          Reklam Ekle
        </button>
      </div>
      <div className="overflow-x-auto">
        {orgAds.length > 0 ? (
          <table className="min-w-full bg-white mt-20">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Etkinlik Adı</th>
                <th className="py-2 px-4 border-b">Tarih</th>
                <th className="py-2 px-4 border-b">Saat</th>
                <th className="py-2 px-4 border-b">Reklam Tipi</th>
                <th className="py-2 px-4 border-b">Statü</th>
              </tr>
            </thead>
            <tbody>
              {orgAds.map((ads) => (
                <tr key={ads.id}>
                  <td className="py-2 px-4 border-b text-center ">
                    {ads.event.eventName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {formatDate(ads.event.date)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {ads.event.time}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {ads.adType.type}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {getStatusBadge(ads.event.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">Reklamınız görünmüyor</p>
        )}
      </div>
    </div>
  );
};

export default Ads;
