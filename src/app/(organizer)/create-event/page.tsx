"use client";
import React, { useEffect, useState, useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { default as NextImage } from "next/image";

import CardDateIcon from "@/app/assets/svg/cardDate.svg";
import CardTimeIcon from "@/app/assets/svg/cardTime.svg";
import LocationIcon from "@/app/assets/svg/select_location.svg";
import LocalImage from "@/../../public/images/gon-freecss-from-hunter-1f.jpg";
import OrganizerDetail from "@/app/components/Base/OrganizerDetail";
import { HomepageApi } from "@/app/api/homepage";
import SolySelect from "@/app/components/Base/SolySelect";
import LogoFiller from "@/app/components/Base/Spinner/LogoFiller";
import { ClientStorage } from "@/app/base/storage";
import { ConfigHelper } from "@/app/base/constants";
import { AuthApi } from "@/app/api/authentication";
import { EventsApi } from "@/app/api/events";
import { DestinationMain } from "@/app/components/Base/destination";
import { SeatsBlock } from "@/app/components/Base/seatmap";
import { SeatType } from "@/app/assets/data/seats";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { uploadToPinata } from "@/app/utilities/web3Storage";

const CreateEvent = () => {
  const userName = ClientStorage.getItem(ConfigHelper.SOLY_USERNAME);
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);
  const [formValues, setFormValues] = useState({
    date: "",
    eventName: "",
    image: "",
    locationId: "",
    time: "",
    userId: userId,
    categoryId: "",
    numberOfPerson: "",
    eventCategoryTypeId: "",
    ticketPriceEntity: [
      {
        name: "",
        block: "",
        price: "",
        seats: [],
        allSeats: true,
      },
    ],
  });
  const [ticketPriceEntities, setTicketPriceEntities] = useState<
    TicketPriceEntity[]
  >([]);
  const [currentEntity, setCurrentEntity] = useState<TicketPriceEntity>({
    name: "",
    block: "",
    seats: [],
    allSeats: true,
    price: "",
  });

  const [errors, setErrors] = useState({
    date: "",
    eventName: "",
    image: "",
    locationId: "",
    time: "",
    categoryId: "",
    eventCategoryTypeId: "",
    ticketPriceEntity: "",
    numberOfPerson: "",
  });

  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedlocations, setSelectedLocations] = useState<string>("");
  const [location, setLocation] = useState<Location>();
  const [userCreated, setUserCreated] = useState<string>("");
  const [categories, setCategories] = useState<IdNameQuery[]>([]);
  const [blockSeats, setBlockSeats] = useState<any>([]);
  const [seats, setSeats] = useState<SeatType[][]>([]);
  const [blockNames, setBlockNames] = useState<IdNameQuery[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatType[]>([]);
  const [types, setTypes] = useState<IdNameQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [desc, setDesc] = useState<string[]>([]);
  const personOptions = [
    { name: "1 Kişi", id: "1" },
    { name: "2 Kişi", id: "2" },
    { name: "3 Kişi", id: "3" },
  ];

  const handleCurrentEntityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCurrentEntity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveCurrentEntity = () => {
    if (currentEntity.name && currentEntity.block && currentEntity.price) {
      console.log(currentEntity);
      setTicketPriceEntities((prev) => [...prev, currentEntity]);
      resetCurrentEntity();
    } else {
      // Handle validation error
      alert("Kategoride eksik alanları doldurunuz.");
    }
  };

  const resetCurrentEntity = () => {
    setCurrentEntity({
      name: "",
      block: "",
      price: "",
      allSeats: true,
      seats: [],
    });
  };

  const handleBlockChange = (value: string) => {
    setCurrentEntity((prev) => ({
      ...prev,
      block: value,
    }));
    const block = blockSeats.find((item: any) => item.id === value);
    if (block && block.seats) {
      // Deep clone the seats array to ensure it is recognized as a new reference
      setSeats(JSON.parse(JSON.stringify(block.seats)));
    } else {
      setSeats([]); // Set to an empty array if no seats are found
    }
  };

  const handleSeatsChange = (value: string) => {
    setCurrentEntity((prev) => ({
      ...prev,
      seats: value.split(","), // Assuming value is a comma-separated string of seat IDs
    }));
  };

  const addDesc = () => {
    // Here, explicitly assert the type if TypeScript fails to infer
    const newDesc = [...desc, ""] as string[];
    setDesc(newDesc);
  };

  const removeDesc = (index: number) => {
    const updatedDesc = desc.filter((_, idx) => idx !== index);
    setDesc(updatedDesc);
  };

  const addHighlight = () => {
    // Here, explicitly assert the type if TypeScript fails to infer
    const newHighlights = [...highlights, ""] as string[];
    setHighlights(newHighlights);
  };

  const removeHighlight = (index: number) => {
    const updatedHighlights = highlights.filter((_, idx) => idx !== index);
    setHighlights(updatedHighlights);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]; // assuming only one file is accepted
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          // Validate the image dimensions
          if (img.width > 650 || img.height > 400) {
            setErrors({
              ...errors,
              image: "Yüklemeniz gereken görsel 650x400 boyutunda olmalı",
            });
          } else {
            setFormValues((prev) => ({
              ...prev,
              image: event.target!.result as string,
            }));
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
    [setFormValues, setErrors]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { ...errors };

    if (!formValues.eventName) {
      newErrors.eventName = "Etkinlik adı gerekli";
      valid = false;
    }
    if (!formValues.date) {
      newErrors.date = "Tarih gerekli";
      valid = false;
    }
    if (!formValues.time) {
      newErrors.time = "Saat gerekli";
      valid = false;
    }
    // if (!formValues.desc) {
    //   newErrors.desc = "Açıklama gerekli";
    //   valid = false;
    // }
    if (!formValues.image) {
      newErrors.image = "Fotoğraf gerekli";
      valid = false;
    }
    if (!formValues.locationId) {
      newErrors.locationId = "Lokasyon gerekli";
      valid = false;
    }
    if (!formValues.categoryId) {
      newErrors.categoryId = "Kategori gerekli";
      valid = false;
    }
    if (!formValues.eventCategoryTypeId) {
      newErrors.eventCategoryTypeId = "Kategori tipi gerekli";
      valid = false;
    }
    if (!formValues.ticketPriceEntity) {
      newErrors.ticketPriceEntity = "Bilet fiyatı gerekli";
      valid = false;
    }

    setErrors(newErrors);

    try {
      setLoading(true);
      const ipfsImg = await uploadToPinata(
        Buffer.from(formValues.image.split(",")[1], "base64"),
        formValues.eventName + " " + formatDate(formValues.date)
      );
      console.log("Uploaded to IPFS:", ipfsImg);

      const eventApi = new EventsApi({});
      const res = await eventApi.createPendingEvent(
        new Date(formValues.date),
        desc,
        highlights,
        formValues.numberOfPerson === "" ? "1" : formValues.numberOfPerson,
        formValues.eventName,
        ipfsImg ?? "",
        formValues.locationId,
        formValues.time,
        formValues.userId,
        formValues.categoryId,
        formValues.eventCategoryTypeId,
        ticketPriceEntities
      );
      if (res) {
        setLoading(false);
        Swal.fire("Başarılı!", "Etkinlik Başarılı Oluşturuldu.", "success");

        router.push("/my-events");
        console.log("Event created successfully");
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to create event", error);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const api = new HomepageApi({});
      const resLocation = await api.getLocationsForCreate();
      if (resLocation && resLocation.data) {
        setLocations(resLocation.data);
      }
    };

    const fetchCategories = async () => {
      const api = new HomepageApi({});
      const resCategory = await api.getCategoryItems();
      if (resCategory && resCategory.data) {
        setCategories(resCategory.data);
      }
    };
    const getOrgInfo = async () => {
      const api = new AuthApi({});
      const userInfo = await api.getUserInfo(userId);
      if (userInfo) {
        setUserCreated(userInfo.createdAt);
      }
    };

    fetchCategories();
    fetchLocations();
    getOrgInfo();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleLocations = async (location: string) => {
    if (location !== "") {
      await fetchBlocks(location);
    }

    setFormValues({ ...formValues, locationId: location });
    const tempLoc = locations.find((item) => item.id === location);
    setLocation(tempLoc);
    setSelectedLocations(tempLoc && tempLoc.name ? tempLoc.name : "");
    setErrors({ ...errors, locationId: "" });
  };

  const fetchBlocks = async (locationId: string) => {
    setLoading(true);
    const api = new HomepageApi({});
    const res = await api.getBlocks(locationId);
    if (res && res.data) {
      const blockOptions = res.data?.map((block) => ({
        id: block.id,
        name: block.name,
      }));
      setBlockNames(blockOptions);
      setBlockSeats(res.data);
    }
    setLoading(false);
  };

  const handleCategories = (category: string) => {
    setFormValues({ ...formValues, categoryId: category });
    fetchTypes(category);
    setErrors({ ...errors, categoryId: "" });
  };

  const fetchTypes = async (categoryId: string) => {
    setLoading(true);
    const api = new HomepageApi({});
    const resTypes = await api.getCategoryTypes(categoryId);
    if (resTypes && resTypes.data) {
      setTypes(resTypes.data);
    }
    setLoading(false);
  };

  const handleTypes = (type: string) => {
    setFormValues({ ...formValues, eventCategoryTypeId: type });
    setErrors({ ...errors, eventCategoryTypeId: "" });
  };

  const handleNumberOfPersonsChange = (selectedValue: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      numberOfPersons: selectedValue,
    }));
  };

  const handleTicketPriceEntityChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedTicketPriceEntities = formValues.ticketPriceEntity.map(
      (entity, i) => (i === index ? { ...entity, [name]: value } : entity)
    );
    setFormValues({
      ...formValues,
      ticketPriceEntity: updatedTicketPriceEntities,
    });
    setErrors({ ...errors, ticketPriceEntity: "" });
  };

  const addTicketPriceEntity = () => {
    setFormValues({
      ...formValues,
      ticketPriceEntity: [
        ...formValues.ticketPriceEntity,
        { name: "", block: "", price: "", allSeats: true, seats: [] },
      ],
    });
  };

  const handleAllSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setCurrentEntity((prev) => ({
      ...prev,
      allSeats: checked,
      seats: checked ? [] : prev.seats, // Reset seats if all seats are selected
    }));
  };

  const handleSelectionChange = (selectedSeats: SeatType[]) => {
    const selectedSeatIds = selectedSeats.map((seat) => ({
      id: seat.id,
      status: "available",
    }));
    console.log(selectedSeatIds);
    setSelectedSeat(selectedSeats);
    setCurrentEntity((prev) => ({
      ...prev,
      seats: selectedSeatIds as any,
    }));
  };

  const removeTicketPriceEntity = (index: number) => {
    const updatedTicketPriceEntities = ticketPriceEntities.filter(
      (_, i) => i !== index
    );
    setTicketPriceEntities(updatedTicketPriceEntities);
  };

  const getMinAndMaxPrices = () => {
    if (formValues.ticketPriceEntity.length === 0) {
      return { minPrice: 0, maxPrice: 0 };
    }
    if (
      formValues.ticketPriceEntity.length === 1 &&
      formValues.ticketPriceEntity[0].price === ""
    ) {
      return { minPrice: 0, maxPrice: 0 };
    }
    const prices = formValues.ticketPriceEntity
      .map((entity) => parseFloat(entity.price))
      .filter((price) => !isNaN(price) && price >= 0);

    if (prices.length === 0) {
      return { minPrice: 0, maxPrice: 0 };
    }

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  };

  const { minPrice, maxPrice } = getMinAndMaxPrices();
  const findNameById = (id: any, array: any[]) => {
    const item = array.find((item) => item.id === id);
    return item ? item.name : "Unknown"; // Returns "Unknown" if no match is found
  };

  const findSeatById = (id: any, array: any[]) => {
    const item = array.find((item) => item.id === id);
    return item ? item.title : "Unknown"; // Returns "Unknown" if no match is found
  };

  return (
    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 p-6">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LogoFiller />
        </div>
      )}
      <div className="flex-1 m-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700"
            >
              Etkinlik Adı
            </label>
            <input
              type="text"
              name="eventName"
              value={formValues.eventName}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.eventName && "border-red-500"
                }`}
            />
            {errors.eventName && (
              <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Tarih
            </label>
            <input
              type="date"
              name="date"
              value={formValues.date}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.date && "border-red-500"
                }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Saat
            </label>
            <input
              type="time"
              name="time"
              value={formValues.time}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.time && "border-red-500"
                }`}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="highligt"
              className="block text-sm font-medium text-gray-700"
            >
              Öne Çıkanlar
            </label>
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2 w-full">
                <textarea
                  name="highlight"
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...highlights];
                    newHighlights[index] = e.target.value;
                    setHighlights(newHighlights);
                  }}
                  className={`flex-1 mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm `}
                />
                <div
                  className="flex items-center justify-center bg-red-500 rounded-full h-10 w-10 cursor-pointer hover:bg-red-700"
                  onClick={() => removeHighlight(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 12H4"
                    />
                  </svg>
                </div>
              </div>
            ))}
            <button
              onClick={addHighlight}
              className="inline-flex justify-center py-2 px-4 m-4 border border-transparent shadow-sm text-sm font-medium rounded-md border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
            >
              Öne Çıkanlar Ekle
            </button>
          </div>
          <div>
            <label
              htmlFor="desc"
              className="block text-sm font-medium text-gray-700"
            >
              Açıklama
            </label>
            {desc.map((des, index) => (
              <div key={index} className="flex items-center space-x-2 w-full">
                <textarea
                  name="desc"
                  value={des}
                  onChange={(e) => {
                    const newDesc = [...desc];
                    newDesc[index] = e.target.value;
                    setDesc(newDesc);
                  }}
                  className={`flex-1 mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm `}
                />
                <div
                  className="flex items-center justify-center bg-red-500 rounded-full h-10 w-10 cursor-pointer hover:bg-red-700"
                  onClick={() => removeDesc(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 12H4"
                    />
                  </svg>
                </div>
              </div>
            ))}
            <button
              onClick={addDesc}
              className="inline-flex justify-center py-2 px-4 m-4 border border-transparent shadow-sm text-sm font-medium rounded-md border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
            >
              Açıklama Ekle
            </button>
          </div>
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
              {formValues.image ? (
                <div className="mt-2">
                  <NextImage
                    width={100}
                    height={100}
                    src={formValues.image}
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

          <div>
            <label
              htmlFor="locationId"
              className="block text-sm font-medium text-gray-700"
            >
              Lokasyon
            </label>
            <SolySelect
              options={locations}
              onClick={handleLocations}
              value={formValues.locationId ?? ""}
              placeholder="Sırala"
            // className={errors.locationId && 'border-red-500'}
            />
            {errors.locationId && (
              <p className="text-red-500 text-sm mt-1">{errors.locationId}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700"
            >
              Kategori
            </label>
            <SolySelect
              options={categories}
              onClick={handleCategories}
              value={formValues.categoryId ?? ""}
              placeholder="Sırala"
            // className={errors.categoryId && 'border-red-500'}
            />
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="eventCategoryTypeId"
              className="block text-sm font-medium text-gray-700"
            >
              Kategori Tipi
            </label>
            <SolySelect
              options={types}
              onClick={handleTypes}
              value={formValues.eventCategoryTypeId ?? ""}
              placeholder="Sırala"
            // className={errors.eventCategoryTypeId && 'border-red-500'}
            />
            {errors.eventCategoryTypeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.eventCategoryTypeId}
              </p>
            )}
          </div>
          <div className="my-4">
            <label
              htmlFor="numberOfPersons"
              className="block text-sm font-medium text-gray-700"
            >
              Bir hesap kaç bilet alabilir?
            </label>
            <SolySelect
              options={personOptions}
              onClick={handleNumberOfPersonsChange}
              value={formValues.numberOfPerson ?? ""}
              placeholder="Kişi Sayısı"
            />
            {errors.numberOfPerson && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numberOfPerson}
              </p>
            )}
          </div>

          <div>
            <div className="p-5 flex space-x-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentEntity.name}
                  onChange={handleCurrentEntityChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Blok
                </label>
                <SolySelect
                  options={blockNames}
                  onClick={handleBlockChange}
                  value={currentEntity.block}
                  placeholder="Blok Seçiniz"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Fiyat
                </label>
                <input
                  type="text"
                  name="price"
                  value={currentEntity.price}
                  onChange={handleCurrentEntityChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="p-5">
                <label className="block text-sm font-medium text-gray-700">
                  Tüm Blok Seçilsin mi?
                </label>
                <input
                  type="checkbox"
                  name="allSeats"
                  checked={currentEntity.allSeats}
                  onChange={handleAllSeatsChange}
                />
              </div>
            </div>
            <div className="overflow-auto max-h-[400px] w-[700px]">
              {!currentEntity.allSeats && (
                <SeatsBlock
                  onSelectionChange={handleSelectionChange}
                  key={currentEntity.block}
                  seatData={seats}
                />
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveCurrentEntity}
                type="button"
                className="mt-6 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kategori Kaydet
              </button>
            </div>

            <div>
              <button
                onClick={resetCurrentEntity}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="button"
              >
                Kategori Ekle
              </button>
            </div>

            {/* Render the list of saved ticket price categories */}
            {ticketPriceEntities.map((entity, index) => (
              <div key={index} className="p-2 border rounded my-2">
                <p>Kategori Adı: {entity.name}</p>
                <p>Blok: {findNameById(entity.block, blockNames)}</p>
                <p>Fiyat: {entity.price}</p>
                <p>
                  {entity.allSeats
                    ? "Tüm blok seçildi"
                    : `Seçili Koltuklar: ${entity.seats
                      .map((seat) => findSeatById(seat.id, selectedSeat))
                      .join(", ")}`}
                </p>
                <button
                  onClick={() => removeTicketPriceEntity(index)}
                  type="button"
                  className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Etkinlik Oluştur
          </button>
        </form>
      </div>{" "}
      <div className="h-screen border-l-2 border-gray-400 mx-4"></div>
      <div className="">
        <div className="">
          <DestinationMain
            topBarTitle={formValues.eventName}
            destinationHero={{
              locationImage: location?.image ?? "",
              eventId: "",
              date:
                formatDate(formValues.date) !== "NaN-NaN-NaN"
                  ? formatDate(formValues.date)
                  : "",
              time: formValues.time,
              title: formValues.eventName,
              image: formValues.image,
              price: ticketPriceEntities.reduce((min, entity) => {
                return entity.price < min ? entity.price : min;
              }, ticketPriceEntities[0]?.price),
              categoryPrices: ticketPriceEntities.map((entity) => ({
                label: `${entity.name} - ${entity.price}₺`,
                value: entity.price,
              })),
              highlightsStrings: highlights,
              otherDetailsStrings: desc,
              persons: [{ label: "", value: "" }],
            }}
            tourPreparations={{
              locationInfo: {
                googleMaps: location?.map ?? "",
                address: location?.address ?? "",
                transportation: location?.transportation ?? "",
              },
            }}
            creator={{
              id: "",
              createdAt: formatDate(userCreated),
              location: selectedlocations,
              name: userName,
            }}
            similarEvents={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
