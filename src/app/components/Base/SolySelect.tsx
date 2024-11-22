"use client";

import ThemeContext from "@/app/context/ThemeContext";
import React, { useState, useRef, useEffect, useContext } from "react";

interface SolySelectProps {
  options: { id: string; name: string }[] | undefined;
  placeholder: string;
  value?: string;
  onClick?: (value: string) => void;
}

const SolySelect: React.FC<SolySelectProps> = ({
  options,
  placeholder,
  value,
  onClick,
}) => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("SolySelect must be used within a ThemeProvider");
  }

  const { theme } = themeContext;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    value || ""
  );
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (id: string) => {
    setSelectedOption(id);
    setIsOpen(false);
    if (onClick) {
      onClick(id);
    }
  };

  const handleClearSelection = () => {
    setSelectedOption("");
    if (onClick) {
      onClick("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  useEffect(() => {
    if (dropdownRef.current) {
      const options = dropdownRef.current.children;
      let maxWidth = 0;
      for (let i = 0; i < options.length; i++) {
        const option = options[i] as HTMLElement;
        if (option.offsetWidth > maxWidth) {
          maxWidth = option.offsetWidth;
        }
      }
      setDropdownWidth(maxWidth + 20); // Adding some padding
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  return (
    <div className={theme === "dark" ? "dark" : ""} ref={containerRef}>
      <div
        className={`rounded-xl mr-2 text-[16px] font-normal border ${theme === "dark"
          ? "border-gray-600 bg-gray-800 text-gray-200"
          : "border-gray-300 bg-white text-gray-700"
          } focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 cursor-pointer flex justify-between items-center relative`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ minWidth: `150px`, paddingRight: selectedOption ? "3rem" : "1.5rem" }} // Increased padding-right
      >
        <span className="truncate">
          {selectedOption
            ? options?.find((option) => option.id === selectedOption)?.name
            : placeholder}
        </span>

        {selectedOption && (
          <button
            className="absolute right-7 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handleClearSelection();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-circle"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        )}

        <svg
          className={`w-4 h-4 transition-transform transform ${isOpen ? "rotate-180" : ""
            } absolute right-2`} // Fixed position for the dropdown arrow
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute mt-1 w-auto ${theme === "dark"
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-300"
            } border rounded-xl shadow-lg z-10`}
        >
          {options?.map((item, index) => (
            <div
              key={item.id}
              className={`py-2 px-3 text-lg cursor-pointer ${theme === "dark"
                ? "text-gray-200 hover:bg-gray-700"
                : "text-black hover:bg-gray-100"
                } ${index === 0 ? "rounded-t-xl" : ""} ${index === options.length - 1 ? "rounded-b-xl" : ""
                }`}
              onClick={() => handleOptionClick(item.id)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>


  );
};

export default SolySelect;
