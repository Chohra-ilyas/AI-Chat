import mongoose from "mongoose";
import dns from "node:dns";

// Fix querySrv ECONNREFUSED error on Windows/routers that fail Node c-ares DNS SRV resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI, {
      dbName: "AI-Chat",
    });

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
