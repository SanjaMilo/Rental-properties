import connectDB from "@/config/database";
import PropertyModel from "@/models/PropertyModel";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

//* GET /api/properties
//TODO GET /api/properties?page={page}&pageSize={pageSize}
export const GET = async (request) => {
  try {
    // return new Response('welcome', {status: 200});
    await connectDB();

    //* Get query params from url:
    const page = request.nextUrl.searchParams.get("page") || 1;
    const pageSize = request.nextUrl.searchParams.get("pageSize") || 3; // Number of properties on a page

    //* If we are on page 3, we need to skip pages 1 and 2
    const skip = (page - 1) * pageSize; // number of properties on the previous pages

    const total = await PropertyModel.countDocuments({}); // total number of properties
    //console.log(totalProperties) // 11

    // const properties = await PropertyModel.find({}) // empty object means all
    const properties = await PropertyModel.find({}).skip(skip).limit(pageSize); // get properties for a specific page

    const result = {
      total,
      properties,
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong!", { status: 500 });
  }
};

//* POST /api/properties
export const POST = async (request) => {
  try {
    await connectDB();

    //* Get the 'User ID' to set the property 'owner'. This we do not get from the form, but the 'logged in user', that we get from the 'server session'.
    const sessionUser = await getSessionUser();
    console.log("Session User:", sessionUser); // we do not want to di-structure it right away, because it might have no session user and handle that case:
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }
    // We do have a user case:
    const { userId } = sessionUser;

    // Get the data from the Form fields
    const formData = await request.formData();
    console.log(formData);

    // Access all values from amenities and images
    const amenities = formData.getAll("amenities"); // array
    // If you don't upload an image, the form will send an empty string, and that will cause an error when we upload them on the Cloudinery, so we will filter out those:
    const images = formData
      .getAll("images")
      .filter((image) => image.name !== ""); // array

    //* Create property data object for setting in the database
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId, // user id from the session
    };
    //console.log(propertyData); // OK

    //* Upload image(s) to Cloudinery
    const imageUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);
      // Convert image data to base64
      const imageBase64 = imageData.toString("base64");
      // Make request to Upload to Cloudinery
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "propertypulse",
        }
      );

      imageUploadPromises.push(result.secure_url);

      // Wait for all images to upload
      const uploadedImages = await Promise.all(imageUploadPromises);
      // Add uploaded image to the propertyData object:
      propertyData.images = uploadedImages;
    }

    //* Save to the Database
    const newProperty = await PropertyModel.create(propertyData);

    //* After saving it to the database we want to redirect from the server to the property page that we are creating:
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    ); // NEXTAUTH_URL=http://localhost:3000

    // return new Response(JSON.stringify({message: 'Success'}), {status: 200});
  } catch (error) {
    return new Response("Failed to add property", { status: 500 });
  }
};

//console.log(images);
// [
//     File {
//       size: 36977,
//       type: 'image/jpeg',
//       name: 'sea.jpg',
//       lastModified: 1718539821106
//     }
// ]
