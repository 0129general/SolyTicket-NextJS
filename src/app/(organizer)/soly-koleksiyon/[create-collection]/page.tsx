"use client";

import { default as NextImage } from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClientStorage } from "@/app/base/storage";
import { ConfigHelper } from "@/app/base/constants";
import { EventsApi } from "@/app/api/events";
import Select from "react-select";
import { CollectionApi } from "@/app/api/collection";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";

interface Event {
  id: string;
  eventName: string;
  date: string;
}

const CreateCollectionPage = () => {
  const [collectionName, setCollectionName] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [expireAt, setExpireAt] = useState<string>("");
  const [selectedCollectionEvents, setSelectedCollectionEvents] = useState<
    Event[]
  >([]);
  const [selectedApplicableEvents, setSelectedApplicableEvents] = useState<
    Event[]
  >([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [imageSize, setImageSize] = useState<string>("");
  const [errors, setErrors] = useState({
    image: "",
  });
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);

  useEffect(() => {
    const fetchOrgEvents = async () => {
      const api = new EventsApi({});
      const res = await api.getOrgUpcomingEvents(userId);
      if (res && res.data) {
        setEvents(res.data);
      }
    };
    fetchOrgEvents();
  }, [userId]);

  const handleCreateCollection = async () => {
    if (
      !collectionName ||
      selectedCollectionEvents.length === 0 ||
      selectedApplicableEvents.length === 0 ||
      !discountPercentage ||
      !expireAt
    ) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const api = new CollectionApi({});
      const res = await api.createCollection(
        userId,
        collectionName,
        expireAt,
        discountPercentage,
        image,
        selectedCollectionEvents.map((event) => event.id),
        selectedApplicableEvents.map((event) => event.id)
      );
      if (res && res.success) {
        Swal.fire("Başarılı!", "Koleksiyon Oluşturuldu.", "success");
        setCollectionName("");
        setDiscountPercentage(0);
        setExpireAt("");
        setSelectedCollectionEvents([]);
        setSelectedApplicableEvents([]);
        router.push("/soly-koleksiyon");
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Koleksiyon oluşturulurken bir hata meydana geldi.");
    }
  };
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]; // assuming only one file is accepted
      const reader = new FileReader();
      const splitSize = imageSize.split('x')
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          // Validate the image dimensions

          if (img.width > 650 || img.height > 450) {
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
  const formatEventOptions = (events: Event[] = []) => {
    if (!Array.isArray(events)) {
      return [];
    }

    return events.map((event) => ({
      value: event.id,
      label: `${event.eventName} - ${new Date(
        event.date
      ).toLocaleDateString()}`,
    }));
  };

  const handleCollectionEventsChange = (selectedOptions: any) => {
    setSelectedCollectionEvents(
      selectedOptions.map((option: any) => ({
        id: option.value,
        eventName: option.label,
      }))
    );
  };

  const handleApplicableEventsChange = (selectedOptions: any) => {
    setSelectedApplicableEvents(
      selectedOptions.map((option: any) => ({
        id: option.value,
        eventName: option.label,
      }))
    );
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Yeni Koleksiyon Oluştur</h1>

      <div className="flex justify-between">
        {/* Form Section (Left) */}
        <div className="bg-white p-6 rounded-md shadow-md w-1/2">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Koleksiyon Adı
            </label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Koleksiyon adını giriniz"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Katılınması Gereken Etkinlikleri Seçin
            </label>
            <Select
              isMulti
              options={formatEventOptions(events)}
              onChange={handleCollectionEventsChange}
              placeholder="Katılınması gereken etkinlikleri seçiniz"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Kuponun Geçerli Olduğu Etkinlikleri Seçin
            </label>
            <Select
              isMulti
              options={formatEventOptions(events)}
              onChange={handleApplicableEventsChange}
              placeholder="Kuponun geçerli olduğu etkinlikleri seçiniz"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              İndirim Yüzdesi
            </label>
            <input
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="İndirim yüzdesini giriniz"
              min="0"
              max="100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>


          <div className="pb-10">
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
                  Buraya Fotoğraf(650x400) Yükleyebilirsiniz...
                </p>
              )}
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleCreateCollection}
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-bold rounded-md transition ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? "Oluşturuluyor..." : "Koleksiyon Oluştur"}
          </button>
        </div>

        {/* Selected Events Section (Right) */}
        <div className="w-1/2 bg-white p-6 rounded-md shadow-md ml-8">
          <div className="mb-4">
            <h4 className="font-medium">Seçilen Koleksiyon Etkinlikleri:</h4>
            <ul className="list-disc pl-6 mt-2">
              {selectedCollectionEvents.map((event) => (
                <li key={event.id}>{event.eventName}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="font-medium">Seçilen Geçerli Etkinlikler:</h4>
            <ul className="list-disc pl-6 mt-2">
              {selectedApplicableEvents.map((event) => (
                <li key={event.id}>{event.eventName}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionPage;
