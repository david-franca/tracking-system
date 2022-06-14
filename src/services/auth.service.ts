import { User } from "../@types";
import { api } from "../utils/api";

const login = async (username: string, password: string) => {
  const { data } = await api.post<User>("/auth/log-in", {
    username,
    password,
  });
  if (data.token) localStorage.setItem("userJWT", JSON.stringify(data));
  return data;
};

const register = async (username: string, password: string, role: string) => {
  return await api.post("/auth/register", { username, password, role });
};

const logout = () => {
  localStorage.removeItem("userJWT");
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
