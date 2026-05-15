import mongoose from "mongoose";

let connectPromise: Promise<typeof mongoose> | null = null;

export async function connectMongo() {
  const config = useRuntimeConfig();

  if (!config.mongoUrl) {
    throw new Error("mongoUrl is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectPromise) {
    await connectPromise;
    return mongoose.connection;
  }

  connectPromise = mongoose.connect(config.mongoUrl);

  try {
    await connectPromise;
    return mongoose.connection;
  } catch (error) {
    connectPromise = null;
    throw error;
  } finally {
    if (mongoose.connection.readyState === 1) {
      connectPromise = null;
    }
  }
}
