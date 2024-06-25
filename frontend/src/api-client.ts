import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelType } from "./shared/types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const validateToken = async () => {
  const response = await fetch(`${API_URL}/api/auth/validate_token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signin = async (formData: SignInFormData) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const signOut = async () => {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("something wrong during logout");
  }
};

export const addMyHotel = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};
