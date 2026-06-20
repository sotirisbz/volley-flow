import mogoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mogoose.connect(process.env.MONGO_URI);
    console.log(`VolleyFlow DB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
