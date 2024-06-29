import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  //* ensures that only the fields that are specified in or schema, will be saved in our database
  mongoose.set("strictQuery", true);

  //* If the database is already connected don't connect again (see below comment)
  if (connected) {
    console.log("MongoDB is already connected!");
    return;
  }

  //* Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("MongoDB connected!");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;

//? We are using the Next.js API routes, which work in a similar way to serverless functions. We hit that API route, it runs a function and it will try to connect to the database and do whatever we want to do: fetch data, insert data, etc. If it's already connected we don;t want to try to connect again.

//* To test the connection, go to Home page, import connectDB and inside the function, invoke it: await connectDB(); (add 'async' in front of the HomePage func). And check the terminal console (HomePage is a server component)
