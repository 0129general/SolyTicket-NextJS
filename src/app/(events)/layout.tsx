import Footer from "@/app/components/Base/Footer";
import MainNavbar from "../components/Base/MainNavbar";
import { HomepageApi } from "../api/homepage";
import { Suspense } from "react";
import LogoFiller from "../components/Base/Spinner/LogoFiller";
import cusRoleControl from "../hoc/cusControl";

const getCategoryItems = async (): Promise<IdNameQuery[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getCategoryItems();
    return res.data || [];
  } catch (error) {
    return [];
  }
};

const getLocations = async (): Promise<IdNameQuery[]> => {
  try {
    const homepageApi = new HomepageApi({});
    const res = await homepageApi.getLocations();
    return res.data || [];
  } catch (error) {
    return [];
  }
};
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

interface EventLayoutProps {
  children: React.ReactNode;
}

const EventsLayout: React.FC<EventLayoutProps> = async ({ children }) => {
  // const categoryItems = await getCategoryItems();
  const locations = await getLocations();
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
      <Footer />
    </Suspense>
  );
};
export default EventsLayout;
// export default cusRoleControl(EventsLayout, "soly-cus");
