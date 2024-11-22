import React, { useEffect, useState } from "react";
import { ConfigHelper } from "../base/constants";
import { ClientStorage } from "../base/storage";

const withoutToken = (WrappedComponent: any) => {
  const WithAuthComponent = (props: any) => {
    const [hasAuthorized, setAuthorized] = useState<boolean | undefined>(
      undefined
    );

    useEffect(() => {
      const isLoggedInLocal = async () => {
        if (!ClientStorage.getItem(ConfigHelper.SOLY_USER_ID)) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
          window.location.href = "/";
        }
      };

      isLoggedInLocal();
    }, []);

    return (
      <>
        {hasAuthorized !== undefined && !hasAuthorized && (
          <WrappedComponent {...props} />
        )}
      </>
    );
  };

  WithAuthComponent.displayName = `withoutToken(${getDisplayName(
    WrappedComponent
  )})`;
  return WithAuthComponent;
};

function getDisplayName(WrappedComponent: any) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export { withoutToken };
