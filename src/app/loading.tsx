import HomePageComponent from "./components/Base/page/HomePage";
import LogoFiller from "./components/Base/Spinner/LogoFiller";

export default function Loading() {
  const homePageValues: HomepageValuesResponse = {
    upcomingEventsCount: 0,
    ticketSoldCount: 0,
    totalCustomerCount: 0,
  };
  const categoryItems: IdNameQuery[] = [];
  const locations: IdNameQuery[] = [];
  const recentEvents: Event[] = [];
  const categoryForGuide: CategoryWithCount[] = [];
  const locationsForHomepage: LocationsForHomepage[] = [];

  const overlayStyle = {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    overflow: 'hidden', // Prevent scrolling
  };

  const pageStyle = {
    height: '100vh',
    overflow: 'hidden', // Prevent scrolling
  };

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}>
        <LogoFiller />
      </div>
      
    </div>
  );
}
