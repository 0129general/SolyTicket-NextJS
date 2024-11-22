"use client";

import React, { useEffect, useState } from "react";
import { EventsCardData, CollectionData } from "@/app/assets/data/swiperData";
import Image from "next/image";
import { RadioGroup, Radio } from "@nextui-org/react";
import { EventsApi } from "@/app/api/events";
import { HomepageApi } from "@/app/api/homepage";
import { SeatType } from "@/app/assets/data/seats";
import SolySelect from "@/app/components/Base/SolySelect";
import { SeatsBlock } from "@/app/components/Base/seatmap";

interface PurchasePageProps {
  params: {
    payment: string;
  };
}

const Payment = ({ params }: PurchasePageProps) => {
  const [step, setStep] = useState<number>(0);

  const [blockSeats, setBlockSeats] = useState<any>([]);
  const [seats, setSeats] = useState<SeatType[][]>([]);
  const [event, setEvent] = useState<Event>();
  const [blockNames, setBlockNames] = useState<IdNameQuery[]>([]);
  const [blocks, setBlocks] = useState<any>();
  const [selectedSeat, setSelectedSeat] = useState<SeatType[]>([]);
  const [numberOfPerson, setNumberOfPerson] = useState("1");
  const personOptions = [
    { name: "1 Kişi", id: "1" },
    { name: "2 Kişi", id: "2" },
    { name: "3 Kişi", id: "3" },
  ];
  useEffect(() => {
    const fetchEvent = async () => {
      const eventApi = new EventsApi({});

      const res = await eventApi.getEventById(params.payment as string);
      if (res && res.data) {
        setEvent(res.data);
        await fetchBlocks(res.data.locationId, params.payment as string);
      }
    };

    fetchEvent();
  }, []);

  const fetchBlocks = async (locationId: string, eventId: string) => {
    const api = new HomepageApi({});
    const res = await api.getLocationsWithAvailableSeatingBlock(locationId, eventId);
    if (res && res.data) {
      const blockOptions = res.data?.map((block) => ({
        id: block.id,
        name: block.name,
      }));
      setBlockNames(blockOptions);
      setBlockSeats(res.data);
    }
  };

  const handleBlockChange = (value: string) => {
    setBlocks(value);
    const block = blockSeats.find((item: any) => item.id === value);
    if (block && block.seats) {
      // Deep clone the seats array to ensure it is recognized as a new reference
      setSeats(JSON.parse(JSON.stringify(block.seats)));
    } else {
      setSeats([]); // Set to an empty array if no seats are found
    }
  };

  const handleSelectionChange = (selectedSeats: SeatType[]) => {
    const selectedSeatIds = selectedSeats.map((seat) => seat.id);
    setSelectedSeat(selectedSeats);
  };

  const handleNumberOfPersonsChange = (selectedValue: any) => {
    setNumberOfPerson(selectedValue);
  };
  return (
    <>
      {step === 0 ? (
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-center items-center">
              <div className="space-y-6 w-full md:w-1/4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Blok Seçiniz
                  </label>
                  <SolySelect
                    options={blockNames}
                    onClick={handleBlockChange}
                    value={blocks}
                    placeholder="Blok Seçiniz"
                  />
                </div>

                <div>
                  <label
                    htmlFor="numberOfPersons"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bir hesap kaç bilet alabilir?
                  </label>
                  <SolySelect
                    options={personOptions}
                    onClick={handleNumberOfPersonsChange}
                    value={numberOfPerson ?? ""}
                    placeholder="Kişi Sayısı"
                  />
                </div>

                <button
                  type="button"
                  disabled={seats.length === 0}
                  onClick={() => setStep(1)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Etkinlik Oluştur
                </button>
              </div>
            </div>

            {seats.length > 0 && (
              <div className="overflow-auto border-2 max-h-[1000px] rounded-lg shadow">
                <div className="flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-t-lg">
                  Sahne
                </div>
                <SeatsBlock
                  maxSelection={Number(numberOfPerson)}
                  onSelectionChange={handleSelectionChange}
                  key={blocks}
                  seatData={seats}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container mx-auto md:mt-16">
          <div className="grid md:grid-cols-2 ">
            <div className="p-10">
              <h5 className="borderBottom pb-5">Ödeme</h5>
              <div className="my-5">
                <h6 className="mb-2">Ödeme Yöntemi:</h6>
                <input
                  className="mr-1"
                  type="radio"
                  id="card"
                  value={"card"}
                  name="payment_method"
                />
                <label className="mr-4" htmlFor="card">
                  Kart
                </label>
                <input
                  className="mr-1"
                  type="radio"
                  id="bank"
                  value={"bank"}
                  name="payment_method"
                />
                <label className="mr-4" htmlFor="bank">
                  Banka
                </label>
                <input
                  className="mr-1"
                  type="radio"
                  id="transfer"
                  value={"transfer"}
                  name="payment_method"
                />
                <label className="mr-4" htmlFor="transfer">
                  Havale
                </label>
              </div>
              <div className="my-5">
                <h6>Kart Numarası</h6>
                <input
                  type="text"
                  className="newInput"
                  placeholder="1234 5678 9101 1121"
                />
              </div>
              <div className="grid grid-cols-2 gap-5 my-5">
                <div>
                  <h6>Son Kullanma Tarihi</h6>
                  <input type="text" className="newInput" placeholder="AA/YY" />
                </div>
                <div>
                  <h6>CVV</h6>
                  <input type="text" className="newInput" placeholder="123" />
                </div>
              </div>
              <div className="my-5 mb-7">
                <input className="mr-2" type="checkbox" id="saveDetails" />
                <label className="text-[#565656]" htmlFor="saveDetails">
                  Kart bilgilerimi kaydet
                </label>
              </div>
              <button className="BlueButton w-full">59.28 USD Öde</button>
              <p className="my-5 text-[#565656]">
                Kişisel bilgileriniz, siparişinizin işlenmesi, bu web
                sitesindeki deneyiminizi desteklemek ve gizlilik politikamızda
                belirtilen diğer amaçlar için kullanılacaktır.
              </p>
            </div>
            <div className="p-10 bg-[#4E43F10D]">
              <h5 className="borderBottom pb-5">Sipariş Özeti</h5>
              <div className="my-5">
                <h6 className="mb-2 w-full md:w-[50%] ">{event?.eventName}</h6>
                <div className="grid grid-cols-6 gap-4 borderBottom border-[#4E43F1] border-opacity-50 pb-5">
                  <div className="col-start-1 col-auto text-[#4E43F1]">
                    $49.80
                  </div>
                  <div className="col-end-6 col-auto max-w-max">
                    {selectedSeat[0].title}
                  </div>
                </div>
              </div>
              <div className="my-5">
                <div className="flex items-baseline justify-between self-center gap-4 borderBottom border-opacity-50 pb-7">
                  <div className="w-8/12">
                    <input
                      type="text"
                      className="newInput border-[#4E43F1] border-opacity-50 bg-white"
                      placeholder="Hediye veya indirim kodu"
                    />
                  </div>
                  <div className="w-auto">
                    <button className="BlueButton max-w-full p-[auto]">
                      Uygula
                    </button>
                  </div>
                </div>
              </div>
              <div className="my-5">
                <div className="flex items-baseline justify-between self-center gap-4 pb-2 subHeadingText">
                  <div className="w-auto">Ara Toplam</div>
                  <div className="w-auto">$49.80</div>
                </div>
                <div className="flex items-baseline justify-between self-center gap-4 borderBottom border-opacity-50 pb-5 subHeadingText">
                  <div className="w-auto ">Kargo</div>
                  <div className="w-auto">$7.24</div>
                </div>
              </div>
              <div className="my-5">
                <div className="flex justify-between self-center gap-4 pb-2 items-center">
                  <div className="w-auto ">
                    <div className="subHeadingText">Toplam</div>
                    <div className="font-normal text-[14px] text-[#565656]">
                      Vergiler dahil $2.24
                    </div>
                  </div>
                  <div className="auto text-[32px] subHeadingtext">$59.28</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
