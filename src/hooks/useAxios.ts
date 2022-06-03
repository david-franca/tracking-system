import useSWR from "swr";

import { api } from "../utils/api";

export const useAxios = <Data = any, Error = any>(
  url: string,
  token: string
) => {
  const { data, error } = useSWR<Data, Error>(url, async (url) => {
    api.defaults.headers.common["x-access-token"] = token;
    const response = await api.get(url, {
      headers: { "x-access-token": token },
    });
    return response.data;
  });
  return { data, error };
};
