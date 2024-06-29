const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
// Since we are fetching from the server, when there are changes to the DB, to get the newest data, we need to make hard-refresh (ctrl+refresh). To avoid that (hard refreshing), we need to add to the fetch, this option:{cache: 'no-store'}

// Fetch all properties or the featured ones
// passing an object with a property with default value false and setting a default value of that object to an empty object, because if we call this function without passing anything in, it will cause error

export const dynamic = 'force-dynamic';

async function fetchProperties({ showFeatured = false } = {}) {
  try {
    //* Handle the case where the domain is not available yet (when deploying to Vercel) and avoid getting error
    if (!apiDomain) {
      return [];
    }
    // http://localhost:3000/api/propeties
    const res = await fetch(
      `${apiDomain}/properties${showFeatured ? "/featured" : ""}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch single property
async function fetchProperty(id) {
  try {
    //* Handle the case where the domain is not available yet (when deploying to Vercel) and not  get error
    if (!apiDomain) {
      return null;
    }
    // http://localhost:3000/api/propeties
    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { fetchProperties, fetchProperty };
