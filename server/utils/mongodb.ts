import mongoose from "mongoose";

let isConnecting = false;

export async function connectMongo() {
  const config = useRuntimeConfig();

  if (!config.mongoUrl) {
    throw new Error("mongoUrl is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return mongoose.connection;
  }

  isConnecting = true;

  try {
    await mongoose.connect(config.mongoUrl);
    return mongoose.connection;
  } finally {
    isConnecting = false;
  }
}