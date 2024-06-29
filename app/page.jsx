import Hero from "@/components/Hero";
import HomeProperties from "@/components/HomeProperies";
import InfoBoxes from "@/components/InfoBoxes";
import FeaturedProperties from "@/components/FeaturedProperties";
//import connectDB from "@/config/database";

// export const metadata = {
//     title: 'Dashboard'
// }

const HomePage = () => {
  // await connectDB(); // initial test (add async on the function above)
  //console.log(process.env.MONGODB_URI) // OK

  return (
    <>
      <Hero />
      <InfoBoxes />
      <FeaturedProperties />
      <HomeProperties />
    </>
  );
};

export default HomePage;
