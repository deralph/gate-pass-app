// src/services/userService.ts
import api from "./api";

export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
};
export const updateUserProfile = async (
  fullName: string,
  profileImage?: string | null
) => {
  const formData = new FormData();

  // Append user data
  formData.append("fullName", fullName);
  if (profileImage) {
    const profileUriParts = profileImage.split(".");
    const profileFileType = profileUriParts[profileUriParts.length - 1];
    if (profileImage) {
      formData.append("profilePicture", {
        uri: profileImage,
        name: `profile.${profileFileType}`,
        type: `image/${profileFileType}`,
      } as any);
    }
  }
  try {
    const response = await api.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
};

export const getUserCars = async () => {
  try {
    const response = await api.get("/users/cars");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user cars"
    );
  }
};

export const getUserActivities = async (limit = 10) => {
  try {
    const response = await api.get(`/users/activities?limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user activities"
    );
  }
};
