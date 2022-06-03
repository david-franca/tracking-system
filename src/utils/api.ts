import axios from "axios";

export const api = axios.create({
  baseURL: "http://64.227.27.136:3001/",
});
