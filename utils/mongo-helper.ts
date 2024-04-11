//IMPORT MONGOOSE
import mongoose, { Model } from "mongoose";

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { DATABASE_URL } = process.env;

// connection function
export const connect = async () => {
  const conn = await mongoose
    .connect(DATABASE_URL as string)
    .catch((err) => console.log(err));
  console.log("Mongoose Connection Established");

  const userSchema = new mongoose.Schema({
    address: {
      type: String,
      index: { unique: true, dropDups: true },
    },
    discord_id: {
      type: String,
      index: { unique: true, dropDups: true },
      default: "",
    },
    totalPts: { type: Number, default: 0 },
    totalRefferals: { type: Number, default: 0 },
    refferedBy: { type: String, default: "" },
    Latest_Discord_date: { type: Date, default: null },
    Latest_NFT_date: { type: Date, default: null },
    discord_joined_claim: { type: Boolean, default: false },
    nft_minted_claim: { type: Boolean, default: false },
    totalGMcount: { type: Number, default: 0 },
    totalDailyNFTcount: { type: Number, default: 0 },
    emailAdded: { type: Boolean, default: false },
    email: { type: String, default: "" },
    ZoNFTclaimed: { type: Boolean, default: false },
    ZoBalance: { type: Number, default: 0 },
  });

  const User = mongoose.models.Users || mongoose.model("Users", userSchema);

  return { conn, User };
};
