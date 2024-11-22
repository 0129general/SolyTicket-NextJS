import EventCardLoader from "@/app/components/Base/page/EvetCardLoader";
import PageTitle from "@/app/components/Base/PageTitle";
import LogoFiller from "@/app/components/Base/Spinner/LogoFiller";

export default function Loading() {



  const pageStyle = {
    height: "100vh",
    overflow: "hidden", // Prevent scrolling
  };

  return (
    <div style={pageStyle}>
      {/* <div style={overlayStyle}> */}
      <PageTitle title={``} />
      <div className="container mx-auto px-2 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          <EventCardLoader />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
