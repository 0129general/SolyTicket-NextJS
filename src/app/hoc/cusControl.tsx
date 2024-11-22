// src/app/hoc/cusRoleControl.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoFiller from "../components/Base/Spinner/LogoFiller";
import { ClientStorage } from "../base/storage";
import { ConfigHelper } from "../base/constants";

const cusRoleControl = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole: string
) => {
  const CusRoleControl: React.FC<P> = (props) => {
    const [hasAccess, setHasAccess] = useState(false);
    const router = useRouter();

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

    useEffect(() => {
      const userRole = ClientStorage.getItem(ConfigHelper.SOLY_USER_ROLE);
      console.log(`User role: ${userRole}, Required role: ${requiredRole}`);

      if (userRole === requiredRole) {
        setHasAccess(true);
      } else if (!userRole) {
        setHasAccess(true);
      } else {
        router.push("/home"); // Redirect to a not authorized page
      }
    }, [router]);

    if (!hasAccess) {
      return (
        <div style={pageStyle}>
          <div style={overlayStyle}>
            <LogoFiller />
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  CusRoleControl.displayName = `CusRoleControl(${getDisplayName(
    WrappedComponent
  )})`;

  return CusRoleControl;
};

// Helper function to get the display name of the wrapped component
const getDisplayName = (WrappedComponent: React.ComponentType<any>) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default cusRoleControl;
