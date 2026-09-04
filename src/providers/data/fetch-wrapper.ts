import { GraphQLFormattedError } from "graphql";

export type GraphQLRequestError = {
  message: string;
  statusCode: string;
  status?: number;
};

const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("access_token");

  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>,
): GraphQLRequestError | null => {
  if (!body) {
    return {
      message: "Unknown Error",
      statusCode: "INTERNAL_SERVER_ERROR",
      status: 500,
    };
  }

  if ("errors" in body) {
    const errors = body?.errors;

    const messages = errors?.map((error) => error?.message)?.join("");

    const extensions = errors?.[0]?.extensions as
      | {
          code?: string;
          status?: number;
          originalError?: { statusCode?: number };
        }
      | undefined;

    const status = extensions?.status ?? extensions?.originalError?.statusCode;

    return {
      message: messages || JSON.stringify(errors),
      statusCode: String(extensions?.code ?? status ?? 500),
      status,
    };
  }
  return null;
};

export const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);

  const responseClone = response.clone();
  const body = await responseClone.json();

  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};
