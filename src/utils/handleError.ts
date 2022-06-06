import { AxiosError } from "axios";

export const handleError = (e: any) => {
  if (e instanceof AxiosError && e.response) {
    const message: string | string[] = e.response.data.message;
    if (typeof message === "string") {
      return message;
    }
    if (Array.isArray(message)) {
      return message.map((data) => data);
    }
  }
};
