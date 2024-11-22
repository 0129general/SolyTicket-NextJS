"use client";

import { useState } from "react";
import NavbarIcon from "../../assets/svg/solyticket_logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../../../../redux/app/hooks";
import { userContextRedux } from "../../../../redux/slices/user-context";
import { withBase } from "@/app/hoc/withBase";
import ThemeToggle from "../Base/ThemeToggle";
import { ClientStorage } from "@/app/base/storage";
import { AuthApi } from "@/app/api/authentication";
import { ConfigHelper } from "@/app/base/constants";

interface NavbarProps { }

const MainNavbar = (props: NavbarProps) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userContext = useAppSelector(userContextRedux);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
      <div className="container mx-auto flex h-20 items-center justify-between gap-8">
        <Link
          className={`block text-teal-600 ${pathname === "/" ? "text-blue-500" : ""}`}
          href="/home"
        >
          <Image src={NavbarIcon} alt="Logo" />
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Main Links for Desktop */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex gap-10">
            <ThemeToggle />

            <Link
              className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/home" ? "text-blue-500" : "text-black"}`}
              href="/home"
            >
              Ana Sayfa
            </Link>
            <Link
              className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/my-events" ? "text-blue-500" : "text-black"}`}
              href="/my-events"
            >
              Etkinliklerim
            </Link>
            <Link
              className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/create-event" ? "text-blue-500" : "text-black"}`}
              href="/create-event"
            >
              Etkinlik Oluştur
            </Link>
            <Link
              className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/ads" ? "text-blue-500" : "text-black"}`}
              href="/ads"
            >
              Reklamlar
            </Link>
            <Link
              className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/soly-koleksiyon" ? "text-blue-500" : "text-black"}`}
              href="/soly-koleksiyon"
            >
              Soly Koleksiyon
            </Link>
          </div>

          {userContext?.id && (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-300">
                  <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" href="/" onClick={handleLogout}>
                    Çıkış
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-4 shadow-lg md:hidden">
          <div className="flex justify-between items-center">
            <Link className="block text-teal-600" href="#">
              <Image src={NavbarIcon} alt="Logo" />
            </Link>
            <button className="rounded bg-gray-100 p-2.5 text-gray-600" onClick={toggleMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-start gap-4 mt-4">
            <Link className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/home" ? "text-blue-500" : "text-black"}`} href="/home">
              Ana Sayfa
            </Link>
            <Link className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/my-events" ? "text-blue-500" : "text-black"}`} href="/my-events">
              Etkinliklerim
            </Link>
            <Link className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/create-event" ? "text-blue-500" : "text-black"}`} href="/create-event">
              Etkinlik Oluştur
            </Link>
            <Link className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/ads" ? "text-blue-500" : "text-black"}`} href="/ads">
              Reklamlar
            </Link>
            <Link className={`block rounded-md py-3.5 text-sm font-medium transition ${pathname === "/soly-koleksiyon" ? "text-blue-500" : "text-black"}`} href="/soly-koleksiyon">
              Soly Koleksiyon
            </Link>

            {/* Logout button for mobile */}
            {userContext?.id && (
              <div className="mt-4">
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-300">
                    <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" href="/" onClick={handleLogout}>
                      Çıkış
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default withBase(MainNavbar);
