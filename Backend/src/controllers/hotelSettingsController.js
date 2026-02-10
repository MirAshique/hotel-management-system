import HotelSettings from "../models/HotelSettings.js";

// @desc    Get hotel settings
// @route   GET /api/settings
// @access  Public
export const getHotelSettings = async (req, res) => {
  let settings = await HotelSettings.findOne();

  if (!settings) {
    settings = await HotelSettings.create({
      hotelName: "My Hotel",
      email: "info@myhotel.com",
      phone: "+000000000",
      address: "Hotel Address",
      cancellationPolicy: "Free cancellation within 24 hours",
      taxPercentage: 0,
      rules: "No smoking inside rooms",
    });
  }

  res.json({
    success: true,
    settings,
  });
};

// @desc    Update hotel settings
// @route   PUT /api/settings
// @access  Admin
export const updateHotelSettings = async (req, res) => {
  const settings = await HotelSettings.findOne();

  if (!settings) {
    res.status(404);
    throw new Error("Hotel settings not found");
  }

  settings.hotelName = req.body.hotelName ?? settings.hotelName;
  settings.email = req.body.email ?? settings.email;
  settings.phone = req.body.phone ?? settings.phone;
  settings.address = req.body.address ?? settings.address;
  settings.cancellationPolicy =
    req.body.cancellationPolicy ?? settings.cancellationPolicy;
  settings.taxPercentage =
    req.body.taxPercentage ?? settings.taxPercentage;
  settings.rules = req.body.rules ?? settings.rules;

  const updatedSettings = await settings.save();

  res.json({
    success: true,
    settings: updatedSettings,
  });
};
