
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaSearch } from "react-icons/fa"; // Import search icon
import Image from "next/image";
import useDebounce from "@/app/base/hooks/useDebounce";
import { HomepageApi } from "@/app/api/homepage";
import LocalImage from "@/../../public/images/gon-freecss-from-hunter-1f.jpg";
import { useRouter } from "next/navigation";
import ThemeContext from "@/app/context/ThemeContext";

interface SearchBarProps {
  placeholder: string;
}

const SearchBar = (props: SearchBarProps) => {
  // const { theme } = useContext(ThemeContext);
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("SolySelect must be used within a ThemeProvider");
  }

  const { theme } = themeContext;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const router = useRouter();
  const [results, setResults] = useState<
    { id: string; image?: string; name: string; type: string }[]
  >([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const homepageApi = new HomepageApi({});
        const res = await homepageApi.searchCategoryEventOrganizer(
          debouncedSearchTerm
        );

        if (res && res.data) {
          setResults(res.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResultClick = (result: { id: string; type: string }) => {
    let route = "";
    const params = new URLSearchParams();
    switch (result.type) {
      case "event":
        route = `/events/${result.id}`;
        break;
      case "category":
        params.append("categoryId", result.id);
        const url1 = params.toString();
        route = `/events?${url1}`;
        break;
      case "organizer":
        params.append("organizerId", result.id);
        const url = params.toString();
        route = `/events?${url}`;
        break;
      default:
        route = "/";
    }

    router.push(route);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div
        className={`flex items-center border rounded-md p-2 w-full ${theme === "dark"
          ? "border-gray-600 bg-gray-800 text-gray-200"
          : "border-gray-300 bg-white text-gray-700"
          }`}
      >
        <FaSearch
          className={`mr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
        />
        <input
          type="text"
          placeholder={props.placeholder}
          value={searchTerm}
          onChange={handleSearch}
          className={`border-none outline-none w-full ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
            }`}
        />
      </div>
      {results.length > 0 && (
        <div
          className={`absolute mt-1 w-full rounded-md shadow-lg max-h-64 overflow-y-auto custom-scrollbar ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
            }`}
        >
          {results.map((result, index) => (
            <div
              key={index}
              className={`flex items-center p-2 cursor-pointer ${theme === "dark" ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-700"
                }`}
              onClick={() => handleResultClick(result)}
            >
              {result.image && (
                <div className="relative w-10 h-10 mr-2">
                  <Image
                    src={LocalImage}
                    alt={result.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              )}
              <span>
                {result.name} ({result.type})
              </span>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2d3748;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
