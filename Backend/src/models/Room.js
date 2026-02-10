import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["single", "double", "deluxe", "suite"],
      required: true,
    },

    amenities: [
      {
        type: String,
      },
    ],

    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
