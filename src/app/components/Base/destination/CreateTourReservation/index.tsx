"use client";

import React, { useState } from "react";
import { SelectField } from "../SelectField";

interface CreateTourReservationProps {
  persons: LabelValueEntity[];
  categoryPrices: LabelValueEntity[];
}

export const CreateTourReservation = ({
  persons,
  categoryPrices,
}: CreateTourReservationProps): React.ReactElement => {
  const [selectedPerson, setSelectedPerson] = useState<LabelValueEntity | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] =
    useState<LabelValueEntity | null>(null);

  const handlePersonChange = (selected: LabelValueEntity | null) => {
    setSelectedPerson(selected);
  };

  const handleCategoryChange = (selected: LabelValueEntity | null) => {
    setSelectedCategory(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can handle form submission here (e.g., send the data to a backend)
    console.log("Selected Person:", selectedPerson);
    console.log("Selected Category:", selectedCategory);
  };

  return (
    <section className="mt-8 sm:mt-16">
      <h4 className="text-lg sm:text-[22px] font-bold text-[#D2D2D2]">
        Hadi Başlayalım!
      </h4>
      <h1 className="text-xl sm:text-4xl font-semibold">
        Rezervasyon oluşturun
      </h1>

      <div className="mt-5 sm:mt-9">
        <h4 className="font-bold text-base sm:text-[22px]">
          Kişi sayısı ve kategori seçiniz
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="mt-5 sm:mt-8 flex flex-col gap-5">
            {persons && persons.length > 0 && (
              <SelectField
                options={persons}
                placeholder="Kişi Sayısı Seçiniz"
                name="persons"
                value={selectedPerson ?? [{ label: "", value: "" }]}
                onOptionSelect={(id, name) => handlePersonChange({ value: id ?? "", label: name ?? "" })}
              />
            )}
            <div className="flex gap-10 xl:gap-20 flex-wrap items-end">
              {categoryPrices && categoryPrices.length > 0 && (
                <SelectField
                  options={categoryPrices}
                  placeholder="Kategori Seçiniz"
                  name="category"
                  value={selectedCategory}
                  onOptionSelect={(id, name) => handleCategoryChange({ value: id ?? "", label: name ?? "" })}
                />
              )}
              <button
                type="submit"
                className="w-full h-[45px] sm:w-[275px] sm:h-[55px] bg-primary rounded-md text-white font-medium text-sm sm:text-[15px]"
              >
                Rezervasyon Durumu
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-12">
        <h4 className="font-bold text-base sm:text-[22px]">
          Kategori Fiyatları
        </h4>
        {categoryPrices &&
          categoryPrices.length > 0 &&
          categoryPrices.map((item, index) => (
            <div
              key={index}
              className="mt-3 flex justify-between items-center px-5 py-5 sm:py-0 sm:h-[84px] rounded-xl shadow-defaultShadow"
            >
              <p className="text-base">{item.label}</p>
              <p className="text-base font-medium text-body-gray">
                1 Kişi x {item.value} ₺
              </p>
            </div>
          ))}
      </div>
    </section>
  );
};
