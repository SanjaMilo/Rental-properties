//? Changing and transferring the fetch to be from the new created component Properties, that is going to be a client component:
//? 1. Create component Properties.jsx

// import PropertyCard from "@/components/PropertyCard";
// import properties from '@/properties.json';
import { fetchProperties } from "@/utils/requests";
import PropertySearchForm from "@/components/PropertySearchForm";
import Properties from "@/components/Properties";

const PropertiesPage = async () => {
  //const properties = await fetchProperties();

  //properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>

      <Properties />
    </>
  );
};

export default PropertiesPage;
