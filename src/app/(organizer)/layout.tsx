// src/app/(organizer)/layout.tsx
"use client";

import { Suspense } from "react";
import Navbar from "../components/Organizer/Navbar";
import withRoleControl from "../hoc/orgControl";
import LogoFiller from "../components/Base/Spinner/LogoFiller";

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

const OrganizerLayout: React.FC<OrganizerLayoutProps> = ({ children }) => {
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
      <Navbar />
      <section>{children}</section>
    </Suspense>
  );
};

export default withRoleControl(OrganizerLayout, "soly-org");
// export default OrganizerLayout;
