import axios from "./axios";

export const getAllBookings = () => axios.get("/bookings");
export const updateBooking = (id, action) =>
  axios.put(`/bookings/${id}/${action}`);
