import connectDB from "@/config/database";
import UserModel from "@/models/UserModel";
import PropertyModel from "@/models/PropertyModel";
import { getSessionUser } from "@/utils/getSessionUser";

//? From the Next.js documentation: Route Segment Config. Read: The Route Segment options
//? This is for deploying it (to Vercel)
export const dynamic = "force-dynamic";

//* Get all saved properties (bookmarked)
//* GET /api/bookmarks
export const GET = async (request) => {
  try {
    connectDB();
    // Get the User
    const sessionUser = await getSessionUser();
    // Check if there is a session and a user
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }
    const { userId } = sessionUser;

    // Get user from Database
    const user = await UserModel.findOne({ _id: userId });

    // Get user's bookmarks
    const bookmarks = await PropertyModel.find({
      _id: { $in: user.bookmarks },
    });

    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

//* POST /api/bookmarks
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

    let message;

    if (isBookmarked) {
      // If already bookmarked, remove it (we re toggling)
      user.bookmarks.pull(propertyId);
      message = "Bookmark removed successfully";
      isBookmarked = false;
    } else {
      // If not bookmarked, add it (we re toggling)
      user.bookmarks.push(propertyId);
      message = "Bookmark added successfully";
      isBookmarked = true;
    }

    await user.save();

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
