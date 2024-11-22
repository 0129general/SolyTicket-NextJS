import React from "react";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "../../../redux/app/hooks";
import { ClientStorage } from "../base/storage";
import { ConfigHelper } from "../base/constants";
import { setUserContext } from "../../../redux/slices/user-context";
import { clearLoginStorage } from "../base/utils/proxyUtils";
import { UserRoleEnum } from "../base/models/common-models";

const withBase = (WrappedComponent: any) => {
  const WithBaseComponent = (props: any) => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
      const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);
      const role = ClientStorage.getItem(ConfigHelper.SOLY_USER_ROLE);
      const username = ClientStorage.getItem(ConfigHelper.SOLY_USERNAME);
      const expiredAt = ClientStorage.getItem(
        ConfigHelper.SOLY_USER_TOKEN_CREATE_TIME
      );

      if (!userId && !expiredAt) {
        dispatch(
          setUserContext({
            id: "",
            role: UserRoleEnum.Customer,
            username: "",
          })
        );
        return;
      }

      try {
        if (expiredAt * 1000 > new Date().getTime()) {
          dispatch(
            setUserContext({
              id: userId,
              role: role,
              username: username,
            })
          );
        } else {
          // clearLoginStorage();
          dispatch(
            setUserContext({
              id: "",
              role: UserRoleEnum.Customer,
              username: "",
            })
          );
        }
      } catch (error) {
        // clearLoginStorage();
        dispatch(
          setUserContext({
            id: "",
            role: UserRoleEnum.Customer,
            username: "",
          })
        );
      }
    }, [dispatch]);

    return <WrappedComponent {...props} />;
  };

  WithBaseComponent.displayName = `withBase(${getDisplayName(
    WrappedComponent
  )})`;

  return WithBaseComponent;
};

function getDisplayName(WrappedComponent: any) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export { withBase };
