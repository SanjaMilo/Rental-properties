import connectDB from "@/config/database";
import UserModel from "@/models/UserModel";

import { getSessionUser } from "@/utils/getSessionUser";

//? From the Next.js documentation: Route Segment Config. Read: The Route Segment options
//? This is for deploying it (to Vercel)
export const dynamic = "force-dynamic";

//* POST /api/bookmarks/check
export const POST = async (request) => {
  try {
    await connectDB();

    // Get the Property Id (from the request body, and convert string -> to json)
    const { propertyId } = await request.json();
    // Get the User
    const sessionUser = await getSessionUser();
    // Check if there is a session and a user
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }
    const { userId } = sessionUser;

    // Get the User from the Database base on their Id:
    const user = await UserModel.findOne({ _id: userId });
    // Check if the Property is already bookmarked for this User
    let isBookmarked = user.bookmarks.includes(propertyId);

    return new Response(JSON.stringify({ isBookmarked }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
