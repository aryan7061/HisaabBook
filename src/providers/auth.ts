import { AuthProvider } from "@refinedev/core";

import { API_URL, dataProvider } from "./data";
import { LoginMutation, MeQuery, RegisterMutation } from "@/graphql/types";

export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};

const JUST_REGISTERED_KEY = "refine-just-registered";

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

  login: async ({ email }: { email: string }) => {
    try {
      const { data } = await dataProvider.custom<LoginMutation>({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);

      if (sessionStorage.getItem(JUST_REGISTERED_KEY)) {
        sessionStorage.removeItem(JUST_REGISTERED_KEY);

        return {
          success: true,
          redirectTo: "/complete-profile",
        };
      }

      return {
        success: true,
        redirectTo: "/",
      };
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
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error: any) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
        ...error,
      };
    }

    return { error };
  },

  check: async () => {
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

      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

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
              }
            }
          `,
        },
      });

      return data.me;
    } catch (error) {
      return undefined;
    }
  },
};
