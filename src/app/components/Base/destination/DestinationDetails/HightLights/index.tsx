import Image from "next/image";
import React from "react";

interface DestHightLightsProps {
  highlighted: string[];
  desc: string[];
  image: string;
}

export const DestHightLights = ({
  highlighted,
  desc,
  image,
}: DestHightLightsProps): React.ReactElement => {
  return (
    <div className="sm:mt-3">
      {highlighted.length > 0 && (
        <>
          <h3 className="text-lg sm:text-[26px] font-bold">Öne Çıkanlar</h3>
          <div className="py-5 sm:px-3 sm:py-7 bg-primary/5 rounded-xl mt-3">
            <ul className="list-disc ml-8 flex flex-col gap-3.5 sm:gap-5">
              {highlighted.map((item, index) => (
                <li key={index} className="text-sm sm:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <ul className="mt-7 sm:mt-12 list-disc ml-5 sm:ml-8 flex flex-col gap-7">
        {desc.length > 0 &&
          desc.map((item, index) => (
            <li key={index} className="text-base">
              {item}
            </li>
          ))}
      </ul>
      <div className="py-5 sm:py-8">
        {image && <Image src={`https://ipfs.io/ipfs/${image}`} alt="" width={400} height={400} />}
      </div>
      <div>
        <h3 className="text-lg sm:text-[26px] font-bold">
          Fiyata şunlar dahildir:
        </h3>
        <ul className="list-disc ml-4 flex flex-col gap-3 sm:gap-5 mt-5">
          <li className="text-sm sm:text-base">Ana Saray Alanları</li>
          <li className="text-sm sm:text-base">Mukaddes Emanetler Dairesi</li>
          <li className="text-sm sm:text-base">Hazine Bolumu</li>
        </ul>
      </div>
      <div className="mt-4 sm:mt-7">
        <h3 className="text-lg sm:text-[26px] font-bold">
          Fiyata dahil olmayanlar:
        </h3>
        <ul className="list-disc ml-4 flex flex-col gap-3 sm:gap-5 mt-5">
          <li className="text-sm sm:text-base">Ulaşım</li>
          <li className="text-sm sm:text-base">Rehberli tur</li>
        </ul>
      </div>
    </div>
  );
};
