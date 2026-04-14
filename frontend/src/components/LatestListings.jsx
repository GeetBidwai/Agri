import ListingCard from "./ListingCard";

function LatestListings({ listings }) {
  return (
    <section className="bg-gray-50 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-2xl font-bold">Latest Listings</h2>
        <p className="text-gray-600 mt-1">
          Fresh buy & sell opportunities
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {listings.map((item, index) => (
            <ListingCard key={index} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}

export default LatestListings;