import React, { useEffect, useState } from "react";
import { userContextRedux } from "../../../redux/slices/user-context";
import { useAppSelector } from "../../../redux/app/hooks";
import { UserRoleEnum } from "../base/models/common-models";
// import { useAppSelector } from "@/redux/app/hooks";
// import { userContextRedux } from "@/redux/slices/user-context";
// import { UserRoleEnum } from "@/base/models/common-models";

const withAdmin = (WrappedComponent: any) => {
  const WithAdminComponent = ({ ...props }) => {
    const [hasAuthorized, setAuthorized] = useState<boolean | undefined>(
      undefined
    );
    const userContext = useAppSelector(userContextRedux);

    useEffect(() => {
      const checkUserIsAdmin = async () => {
        if (userContext?.role === UserRoleEnum.Admin) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      };

      checkUserIsAdmin();
    }, [userContext?.role]);

    useEffect(() => {
      if (hasAuthorized === false) {
        window.location.href = "/";
      }
    }, [hasAuthorized]);

    return (
      <>
        {hasAuthorized !== undefined && hasAuthorized && (
          <WrappedComponent {...props} />
        )}
      </>
    );
  };

  WithAdminComponent.displayName = `withAdmin(${getDisplayName(
    WrappedComponent
  )})`;

  return WithAdminComponent;
};

const getDisplayName = (WrappedComponent: any) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export { withAdmin };
