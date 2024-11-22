import React from "react";


interface TopBarProps {
  title: string
}

export const TopBar = ({ title }: TopBarProps) => (
  <div className="bg-primary">
    <div className="resContainer py-4 sm:h-[80px] flex flex-wrap gap-y-4 justify-between items-center">
      <h4 className="text-lg sm:text-[22px] font-medium text-white">
        {/* {title} */}
      </h4>
      {/* <div className="flex gap-7 items-center">
        <p className="text-sm sm:text-base  font-medium text-white">
          Başlangıç Fiyatı 20 ₺ / Kişi
        </p>
        <button className="px-5 lg:px-9 h-[40px] text-sm sm:h-[50px] rounded-[4px] bg-white  text-primary sm:text-[15px] font-medium">
          Sepete Ekle
        </button>
      </div> */}
    </div>
  </div>
);
