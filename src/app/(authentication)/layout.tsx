import Footer from "@/app/components/Base/Footer";
import MainNavbar from "../components/Base/MainNavbar";
import { Suspense } from "react";
import { HomepageApi } from "../api/homepage";
import LogoFiller from "../components/Base/Spinner/LogoFiller";

export default async function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getLocations = async (): Promise<IdNameQuery[]> => {
    try {
      const homepageApi = new HomepageApi({});
      const res = await homepageApi.getLocations();
      return res.data || [];
    } catch (error) {
      return [];
    }
  };
  const locations = await getLocations();
  const overlayStyle = {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    overflow: "hidden", // Prevent scrolling
  };

  const pageStyle = {
    height: "100vh",
    overflow: "hidden", // Prevent scrolling
  };
  return (
    <Suspense
      fallback={
        <div style={pageStyle}>
          <div style={overlayStyle}>
            <LogoFiller />
          </div>
        </div>
      }
    >
      <MainNavbar locations={locations} />
      <section>{children}</section>
    </Suspense>
  );
}
