import api from "./api";

export const fetchMyProfile = () => {
  return api.get("/student/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
