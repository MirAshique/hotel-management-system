import mongoose from "mongoose";

const hotelSettingsSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
      default: "My Hotel",
    },

    logo: {
      public_id: String,
      url: String,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    cancellationPolicy: {
      type: String,
      required: true,
    },

    taxPercentage: {
      type: Number,
      default: 0,
    },

    rules: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const HotelSettings = mongoose.model(
  "HotelSettings",
  hotelSettingsSchema
);

export default HotelSettings;
