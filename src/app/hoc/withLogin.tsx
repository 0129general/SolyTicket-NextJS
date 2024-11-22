// withLogin.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode"; // corrected import
import { useAppDispatch, useAppSelector } from "../../../redux/app/hooks";
import {
  setUserContext,
  userContextRedux,
} from "../../../redux/slices/user-context";
import { ClientStorage } from "../base/storage";
import { ConfigHelper } from "../base/constants";
import { isLoggedIn } from "../base/proxy/authenticate";
import { clearLoginStorage } from "../base/utils/proxyUtils";
import { queryParamsToURL } from "../utilities/queryParamsToUrl";

const withLogin = (WrappedComponent: any) => {
  const WithLoginComponent = (props: any) => {
    const [hasAuthorized, setAuthorized] = useState<boolean | undefined>(
      undefined
    );
    const userContext = useAppSelector(userContextRedux);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
      const checkUserIsLoggedIn = async () => {
        let hasAuth: boolean = false;

        // Check has token
        if (isLoggedIn()) {
          const token: string = ClientStorage.getItem(
            ConfigHelper.SOLY_USER_ID
          );

          let decoded: any = Object.assign({});

          try {
            decoded = jwtDecode(token);
          } catch (error) {}

          // Check token expiration
          if (
            decoded &&
            decoded.exp &&
            decoded.exp * 1000 > new Date().getTime()
          ) {
            hasAuth = true;
            setAuthorized(true);
            dispatch(
              setUserContext({
                id: decoded.id,
                role: decoded.rol,
                username: decoded.username,
              })
            );
          } else {
            dispatch(setUserContext(Object.assign({})));
            clearLoginStorage();
          }
        }

        if (!hasAuth) {
          const queryParams = Object.assign({ "return-url": router.pathname });

          if (router.pathname?.indexOf("get-to-know") > -1) {
            router.push("/signup");
          } else {
            router.push(queryParamsToURL("/login", queryParams));
          }
        }
      };

      checkUserIsLoggedIn();
    }, [userContext?.id, dispatch, router]);

    return (
      <>
        {hasAuthorized !== undefined && hasAuthorized && (
          <WrappedComponent {...props} />
        )}
      </>
    );
  };

  WithLoginComponent.displayName = `withLogin(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithLoginComponent;
};

export default withLogin;
