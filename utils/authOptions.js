import connectDB from "@/config/database";
import UserModel from "@/models/UserModel";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // to be able to log in with different google users accounts and not try to log us in with the first user acc that logged in
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful sign in
    async signIn({ profile }) {
      // 1. Connect to database
      await connectDB();
      // 2. Check if user exists
      const userExists = await UserModel.findOne({ email: profile.email });
      // 3. If not exists then add user to database
      if (!userExists) {
        //* Truncate user name if too long
        const username = profile.name.slice(0, 20);

        await UserModel.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      // 4. Return true to allow sign in
      return true;
    },
    // Modifies the session object
    async session({ session }) {
      // 1. Get user from database
      const user = await UserModel.findOne({ email: session.user.email });
      // 2. Assign the user id (from the database user._id) to the session
      session.user.id = user._id.toString();
      // 3.Return session
      return session;
    },
  },
};
