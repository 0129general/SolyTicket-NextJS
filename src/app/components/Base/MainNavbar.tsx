"use client";

import { useState, useEffect } from "react";
import NavbarIcon from "../../assets/svg/solyticket_logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "../../../../redux/app/hooks";
import { userContextRedux } from "../../../../redux/slices/user-context";
import { withBase } from "@/app/hoc/withBase";
import SearchableSelect from "./SearchableSelect";
import SearchBar from "./Searchbar";
import ThemeToggle from "./ThemeToggle";
import { ClientStorage } from "@/app/base/storage";
import { AuthApi } from "@/app/api/authentication";
import { ConfigHelper } from "@/app/base/constants";

interface MainNavbarProps {
  locations: IdNameQuery[];
}

const MainNavbar = (props: MainNavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") || ""
  );
  const [locationId, setLocationId] = useState(
    searchParams.get("cityId") || ""
  );

  const locationOptions =
    (props.locations?.length > 0 &&
      props.locations?.map((item: IdNameQuery) => ({
        value: item.id,
        label: item.name,
      }))) ||
    [];

  const userContext = useAppSelector(userContextRedux);

  useEffect(() => {
    const category = searchParams.get("categoryId");
    const location = searchParams.get("cityId");
    if (category) setCategoryId(category);
    if (location) setLocationId(location);
  }, [searchParams]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLocationSelect = (id: string | null, name: string | null) => {
    if (id && name) {
      setLocationId(id);
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (id) params.append("cityId", id);
      const url = params.toString();
      router.push(`/events?${url}`);
    } else {
      setLocationId("");
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      const url = params.toString();
      router.push(`/events?${url}`);
    }
  };

  const handleCategorySelect = (id: string | null, name: string | null) => {
    if (id && name) {
      setCategoryId(id);
      const params = new URLSearchParams();
      if (locationId) params.append("cityId", locationId);
      if (id) params.append("categoryId", id);
      const url = params.toString();
      router.push(`/events?${url}`);
    } else {
      setCategoryId("");
      const params = new URLSearchParams();
      if (locationId) params.append("cityId", locationId);
      const url = params.toString();
      router.push(`/events?${url}`);
    }
  };

  const handleLogout = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    const refresh = ClientStorage.getItem(ConfigHelper.SOLY_USER_REFRESH);
    try {
      const authApi = new AuthApi({});
      const res = await authApi.logout(refresh);
      if (res && res.success) {
        ClientStorage.removeAll();
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-4 shadow-NavShadow">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={NavbarIcon}
            alt="Logo"
            className="h-12 w-auto md:h-16 md:w-auto"
          />
        </Link>

        <div className="flex items-center gap-4 md:hidden">
          <div className="flex-grow">
            <SearchBar placeholder="Search..." />
          </div>
          <button
            className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75"
            onClick={toggleMenu}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-between pl-5">
          <div className="flex items-center gap-6">
            {locationOptions.length > 0 && (
              <SearchableSelect
                options={locationOptions}
                name="locations"
                placeholder="Konum Seçiniz"
                onOptionSelect={handleLocationSelect}
                selectedValue={locationId}
                instanceId="location-select"
              />
            )}
          </div>

          <div className="w-2/6">
            <SearchBar placeholder="Etkinlik, Sanatçı, Mekan Arayın..." />
          </div>

          <div className="flex items-center gap-4">
            {!userContext?.id ? (
              <div className="flex gap-4">
                <Link
                  className={`link ${
                    pathname === "/login" ? "active" : ""
                  } block rounded-md py-3.5 text-sm font-medium transition`}
                  href="/login"
                >
                  Giriş Yap
                </Link>
                <Link
                  className={`link ${
                    pathname === "/signup" ? "active" : ""
                  } BlueButton block rounded-md text-sm font-medium transition`}
                  href="/signup"
                >
                  Üye Ol
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center gap-2 rounded-md bg-gray-100 p-2 text-sm font-medium text-gray-600 hover:bg-gray-200 border border-gray-300"
                  onClick={toggleDropdown}
                >
                  {userContext.username}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-300">
                    <div className="pt-2">
                      <ThemeToggle />
                    </div>
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/profile"
                    >
                      Profilim
                    </Link>
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/collections"
                    >
                      Biletlerim
                    </Link>
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/collections"
                    >
                      Koleksiyonlarım
                    </Link>

                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/"
                      onClick={handleLogout}
                    >
                      Çıkış
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="max-h-max fixed inset-0 z-50 flex flex-col bg-white shadow-lg md:hidden">
          <div className="flex justify-between items-center p-4">
            <Link href="/" className="block text-teal-600">
              <Image src={NavbarIcon} alt="Logo" className="h-10 w-auto" />
            </Link>
            <button
              className="rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75"
              onClick={toggleMenu}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav aria-label="Global" className="flex-1 mt-4">
            <ul className="flex flex-col items-center gap-6 text-lg">
              <li>
                <div className="pt-2">
                  <ThemeToggle />
                </div>
              </li>
              {!userContext?.id ? (
                <div className="flex flex-col items-center gap-4 p-4">
                  <Link
                    className={`link ${
                      pathname === "/login" ? "active" : ""
                    } block w-full rounded-md py-3.5 text-center text-sm font-medium text-black transition bg-gray-200`}
                    href="/login"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    className={`link ${
                      pathname === "/signup" ? "active" : ""
                    } BlueButton block w-full rounded-md text-center text-sm font-medium transition`}
                    href="/signup"
                  >
                    Üye Ol
                  </Link>
                </div>
              ) : (
                <>
                  <li>
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/profile"
                    >
                      Profilim
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/collections"
                    >
                      Biletlerim
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/collections"
                    >
                      Koleksiyonlarım
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/"
                      onClick={handleLogout}
                    >
                      Çıkış
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default withBase(MainNavbar);
