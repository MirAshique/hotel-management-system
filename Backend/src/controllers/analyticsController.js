import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// @desc    Get admin dashboard analytics
// @route   GET /api/analytics
// @access  Admin
export const getAdminAnalytics = async (req, res) => {
  // Total bookings
  const totalBookings = await Booking.countDocuments();

  // Revenue (only checked-out bookings = real revenue)
  const revenueAgg = await Booking.aggregate([
    { $match: { status: "checked-out" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;

  // Status counts
  const statusAgg = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusMap = {
    pending: 0,
    confirmed: 0,
    "checked-in": 0,
    "checked-out": 0,
    cancelled: 0,
  };

  statusAgg.forEach((s) => {
    statusMap[s._id] = s.count;
  });

  // Active guests = confirmed + checked-in
  const activeGuests =
    statusMap.confirmed + statusMap["checked-in"];

  res.json({
    success: true,
    totalRevenue,
    totalBookings,
    activeGuests,
    pending: statusMap.pending,
    confirmed: statusMap.confirmed,
    checkedin: statusMap["checked-in"],
    checkedout: statusMap["checked-out"],
    cancelled: statusMap.cancelled,
  });
};
