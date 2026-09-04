import { AuthProvider } from "@refinedev/core";

import { API_URL, dataProvider } from "./data";
import {
  DemoLoginMutation,
  LoginMutation,
  MeQuery,
  RegisterMutation,
} from "@/graphql/types";

export const DEMO_ACCOUNT_EMAIL =
  import.meta.env.VITE_DEMO_LOGIN_EMAIL || "demo@hisaabbook.com";

const ACCESS_TOKEN_KEY = "access_token";
const JUST_REGISTERED_KEY = "refine-just-registered";

type RequestError = {
  message?: string;
  name?: string;
  statusCode?: string;
  status?: number;
};

const isUnauthenticated = (error: RequestError | undefined): boolean =>
  error?.status === 401 || error?.statusCode === "UNAUTHENTICATED";

export const authProvider: AuthProvider = {
  register: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await dataProvider.custom<RegisterMutation>({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password },
          rawQuery: `
            mutation Register($email: String!, $password: String!) {
              register(registerInput: { email: $email, password: $password }) {
                id
                email
              }
            }
          `,
        },
      });

      if (data?.register?.id) {
        sessionStorage.setItem(JUST_REGISTERED_KEY, "true");

        return {
          success: true,
          redirectTo: "/login",
        };
      }

      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Register failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },

  login: async ({
    email,
    password,
    isDemo,
  }: {
    email?: string;
    password?: string;
    isDemo?: boolean;
  }) => {
    try {
      let accessToken: string;

      if (isDemo) {
        const { data } = await dataProvider.custom<DemoLoginMutation>({
          url: API_URL,
          method: "post",
          headers: {},
          meta: {
            rawQuery: `
              mutation DemoLogin {
                demoLogin {
                  accessToken
                }
              }
            `,
          },
        });
        accessToken = data.demoLogin.accessToken;
      } else {
        const { data } = await dataProvider.custom<LoginMutation>({
          url: API_URL,
          method: "post",
          headers: {},
          meta: {
            variables: { email, password },
            rawQuery: `
              mutation Login($email: String!, $password: String!) {
                login(loginInput: { email: $email, password: $password }) {
                  accessToken
                }
              }
            `,
          },
        });
        accessToken = data.login.accessToken;
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

      if (sessionStorage.getItem(JUST_REGISTERED_KEY)) {
        sessionStorage.removeItem(JUST_REGISTERED_KEY);
        return { success: true, redirectTo: "/complete-profile" };
      }

      return { success: true, redirectTo: "/" };
    } catch (e) {
      const error = e as Error;
      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    if (isUnauthenticated(error as RequestError)) {
      return { logout: true, redirectTo: "/login", error };
    }

    return { error };
  },

  check: async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      return { authenticated: false, redirectTo: "/login" };
    }

    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
            query Me {
              me {
                name
              }
            }
          `,
        },
      });

      return { authenticated: true };
    } catch {
      localStorage.removeItem(ACCESS_TOKEN_KEY);

      return { authenticated: false, redirectTo: "/login", logout: true };
    }
  },

  getIdentity: async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    try {
      const { data } = await dataProvider.custom<MeQuery>({
        url: API_URL,
        method: "post",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        meta: {
          rawQuery: `
            query Me {
              me {
                id
                name
                email
                phone
                jobTitle
                timezone
                avatarUrl
                role
              }
            }
          `,
        },
      });

      return data.me;
    } catch {
      return undefined;
    }
  },
};
