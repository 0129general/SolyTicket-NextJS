"use client";

import { default as NextImage } from "next/image";
import { AdsApi } from "@/app/api/ads";
import { EventsApi } from "@/app/api/events";
import { ConfigHelper } from "@/app/base/constants";
import { ClientStorage } from "@/app/base/storage";
import SolySelect from "@/app/components/Base/SolySelect";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";

type IconType = "Highlight" | "SolyAdvice" | "Hot" | "Banner";

// SVGs for the icons
const icons: Record<IconType, JSX.Element> = {
  Highlight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-yellow-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 1.8l3.176 6.44 7.104 1.028-5.14 5.008 1.216 7.093L12 17.508 6.644 21.37l1.216-7.094-5.14-5.008 7.104-1.028L12 1.8z" />
    </svg>
  ),
  SolyAdvice: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-green-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14 0H6v10h8l4 4V6l-4-6zm-1 3l1 3-1 3H7V3h6zm-6 9v6h2v6h4v-6h2l4-4h-6v-3l-2 2v1H7z" />
    </svg>
  ),
  Hot: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-red-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C9.804 4.078 8 7.407 8 11c0 3.585 2.105 6 5 6s5-2.415 5-6c0-1.519-.653-2.916-1.807-4.193C15.26 5.082 12 2 12 2zM7.115 20.162C5.479 18.771 4.5 16.578 4.5 14c0-2.868 1.248-5.412 3.176-7.412C9.878 4.648 12 2 12 2c1.148 1.379 3.973 4.061 5.012 6.484C18.671 9.972 19.5 12.036 19.5 14c0 4.418-4.03 8-9 8-2.083 0-4.01-.793-5.385-1.838z" />
    </svg>
  ),
  Banner: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-blue-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M3 0h18v24L12 20l-9 4V0zm2 2v17l7-3.5L17 19V2H5z" />
    </svg>
  ),
};

// Fallback icon for unknown types
const fallbackIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 text-gray-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.485 2 2 6.485 2 12s4.485 10 10 10 10-4.485 10-10S17.515 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z" />
  </svg>
);

const CreateAds = () => {
  const userName = ClientStorage.getItem(ConfigHelper.SOLY_USERNAME);
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);
  const [selectedId, setSelectedId] = useState<string>("");
  const [ads, setAds] = useState<AdType[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageSize, setImageSize] = useState<string>("");
  const [errors, setErrors] = useState({
    image: "",
  });
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchOrgAds = async () => {
      const api = new AdsApi({});
      const resAds = await api.getTypesAdsWithPrice();
      if (resAds && resAds.data) {
        setAds(resAds.data);
      }
    };
    fetchOrgAds();
  }, [userId]);

  const handleCardClick = async (id: string) => {
    setSelectedId(id);
    const findAd = ads.find((ad) => ad.id === id)
    setImageSize(findAd?.imageSize ?? "")
    setDays([]);
    setSelectedEventId("");
    setEvents([]);
    setSelectedDates([]);
    setError(null);
    const api = new EventsApi({});
    const res = await api.getOrgUpcomingEvents(userId);
    if (res && res.data) {
      setEvents(res.data);
    }
  };

  const handleEventSelect = async (eventId: string) => {
    if (eventId === "") {
      setDays([]);
      return;
    }
    setSelectedEventId(eventId);
    const api = new AdsApi({});
    const resDays = await api.getAvaibleDatesForType(selectedId ?? "", eventId);
    if (resDays && resDays.data) {
      setDays(resDays.data);
    }
  };

  const handleDateClick = (date: string) => {
    if (selectedDates.includes(date)) {
      // Remove the date if it's already selected
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else if (selectedDates.length < 7) {
      // Add date if less than 7 selected
      setSelectedDates([...selectedDates, date]);
    } else {
      // Show an error if trying to select more than 7 dates
      setError("En fazla 7 tarih seçebilirsiniz.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  async function handleSendAds(): Promise<void> {
    const api = new AdsApi({});
    const resDays = await api.reserveDatesForEvent(
      userId,
      selectedId,
      selectedEventId,
      image,
      selectedDates
    );
    if (resDays && resDays.data) {
      Swal.fire("Başarılı!", "Reklam Oluşturuldu.", "success");
      setSelectedId("");
      setDays([]);
      setSelectedEventId("");
      setEvents([]);
      setSelectedDates([]);
      setError(null);
    }
  }
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]; // assuming only one file is accepted
      const reader = new FileReader();
      const splitSize = imageSize.split('x')
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          // Validate the image dimensions

          if (img.width < Number(splitSize[0]) || img.height < Number(splitSize[1])) {
            setErrors({
              ...errors,
              image: `Yüklemeniz gereken görsel ${imageSize} boyutunda olmalı`,
            });
          } else {
            setImage(event.target!.result as string)
            setErrors({ ...errors, image: "" }); // Clear any existing errors
          }
        };
        img.onerror = () => {
          setErrors({ ...errors, image: "Görsel boyutu çok yüksek." });
        };
        img.src = event.target!.result as string;
      };

      reader.onerror = () => {
        setErrors({ ...errors, image: "Görsel yüklemede hata." });
      };

      reader.readAsDataURL(file);
    },
    [image, setErrors]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
  });
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Reklam Seçiniz</h1>

      <div className="overflow-x-auto">
        {ads.length > 0 ? (
          <div className="flex flex-wrap gap-4 p-4">
            {ads.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col items-center justify-between bg-white shadow-lg p-6 rounded-xl w-72 h-56 border-2 ${selectedId === item.id
                  ? "border-indigo-500"
                  : "border-gray-300"
                  } cursor-pointer hover:shadow-2xl transition-all`}
                onClick={() => handleCardClick(item.id)}
              >
                {/* Icon */}
                <div className="flex items-center justify-center">
                  {icons[item.type as IconType] || fallbackIcon}
                </div>

                {/* Type */}
                <h3 className="text-xl font-bold mt-4">{item.type}</h3>

                {/* Price */}
                <p className="text-gray-600 text-lg">Fiyat: {item.price}₺</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Beklemede etkinliğiniz yok.
          </p>
        )}
      </div>

      {(events.length > 0) ? (
        <div className="mt-8 w-1/4">
          <SolySelect
            options={events.map((event) => ({
              id: event.id,
              name: event.eventName,
            }))}
            placeholder="Reklam İçin Etkinlik Seçiniz"
            value={selectedEventId}
            onClick={handleEventSelect}
          />
        </div>
      )
        : selectedId !== "" &&
        <p className="text-center text-gray-500">
          Aktif etkinliğiniz yok.
        </p>
      }


      {days.length > 0 && (
        <div className="mt-8">
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Fotoğraf
            </label>
            <div
              {...getRootProps()}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer ${errors.image && "border-red-500"
                }`}
            >
              <input {...getInputProps()} />
              {image ? (
                <div className="mt-2">
                  <NextImage
                    width={100}
                    height={100}
                    src={image}
                    alt="Selected Image"
                  />
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  Buraya Fotoğraf({imageSize}) Yükleyebilirsiniz...
                </p>
              )}
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-4">Uygun Tarihler</h2>
          <div className="flex flex-wrap gap-4">
            {days.map((dateString, index) => (
              <div
                key={index}
                className={`shadow-lg p-6 rounded-lg border border-gray-300 w-64 flex flex-col justify-between items-center cursor-pointer transition-all ${selectedDates.includes(dateString)
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-black"
                  }`}
                onClick={() => handleDateClick(dateString)}
              >
                <h3 className="text-xl font-semibold">
                  {formatDate(dateString)}
                </h3>
                <span
                  className={`mt-4 px-4 py-2 rounded-full font-semibold ${selectedDates.includes(dateString)
                    ? "bg-white text-blue-500"
                    : "bg-green-100 text-green-600"
                    }`}
                >
                  {selectedDates.includes(dateString) ? "Uygun" : "Uygun"}
                </span>
              </div>
            ))}
          </div>
          {error && (
            <div className="text-red-500 mt-4 text-lg font-semibold">
              {error}
            </div>
          )}
          <button className="BlueButton mt-5" onClick={() => handleSendAds()}>
            Rezervasyon Yap
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateAds;
