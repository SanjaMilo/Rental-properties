import connectDB from "@/config/database";
import PropertyModel from "@/models/PropertyModel";
import { getSessionUser } from "@/utils/getSessionUser";

//* GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const property = await PropertyModel.findById(params.id);

    if (!property) return new Response("Property Not Found", { status: 404 });

    return new Response(JSON.stringify(property), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong!", { status: 500 });
  }
};

//* We need to make sure there is a session and need to match the 'user' and the session to the property 'owner'. We  don't what just anybody to delete any property.

//* DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
  try {
    const propertyId = params.id;

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await PropertyModel.findById(propertyId);

    if (!property) return new Response("Property Not Found", { status: 404 });

    // Verify ownership
    if (property.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await property.deleteOne(); // DELETING from the Database

    return new Response("Property Deleted!", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong!", { status: 500 });
  }
};

//* PUT /api/properties/:id
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    //* Get the 'User ID' to set the property 'owner'. This we do not get from the form, but the 'logged in user', that we get from the 'server session'.
    const sessionUser = await getSessionUser();
    console.log("Session User:", sessionUser); // we do not want to di-structure it right away, because it might have no session user and handle that case:
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { id } = params;

    // We have a user case:
    const { userId } = sessionUser;

    // Get the data from the Form fields
    const formData = await request.formData();
    console.log(formData);

    // Access all values from amenities and images
    const amenities = formData.getAll("amenities"); // array

    // Get the property to update
    const existingProperty = await PropertyModel.findById(id);

    if (!existingProperty) {
      return new Response("Property does not exist", { status: 404 });
    }

    // Verify ownership
    if (existingProperty.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

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

    //* Update in the Database
    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      id,
      propertyData
    );

    return new Response(JSON.stringify(updatedProperty), { status: 200 });
  } catch (error) {
    return new Response("Failed to add property", { status: 500 });
  }
};
