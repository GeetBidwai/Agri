import { useEffect, useMemo, useState } from "react";

import api from "../api";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString();
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `\u20b9${value}/kg`;
};

function MandiPrices({ language }) {
  const [products, setProducts] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const text = language === "HI"
    ? {
        title: "\u092e\u0902\u0921\u0940 \u092d\u093e\u0935",
        subtitle: "\u0921\u0947\u091f\u093e\u092c\u0947\u0938 \u0938\u0947 \u0909\u0924\u094d\u092a\u093e\u0926 \u0915\u0940 \u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915 \u0915\u0940\u092e\u0924\u0947\u0902 \u0926\u0947\u0916\u0947\u0902",
        commodity: "\u091c\u093f\u0902\u0938",
        allCommodities: "\u0938\u092d\u0940 \u091c\u093f\u0902\u0938",
        locationFilter: "\u0938\u094d\u0925\u093e\u0928 \u091a\u0941\u0928\u0947\u0902",
        allLocations: "\u0938\u092d\u0940 \u0938\u094d\u0925\u093e\u0928",
        search: "\u0916\u094b\u091c\u0947\u0902",
        loading: "\u0921\u0947\u091f\u093e \u0932\u094b\u0921 \u0939\u094b \u0930\u0939\u093e \u0939\u0948...",
        error: "\u0921\u0947\u091f\u093e \u0932\u094b\u0921 \u0928\u0939\u0940\u0902 \u0939\u094b \u092a\u093e\u092f\u093e",
        noData: "No data available",
        variety: "\u0915\u093f\u0938\u094d\u092e",
        location: "\u0938\u094d\u0925\u093e\u0928",
        quantity: "\u092e\u093e\u0924\u094d\u0930\u093e",
        price: "\u092e\u0942\u0932\u094d\u092f (\u20b9/kg)",
        date: "\u0924\u093e\u0930\u0940\u0916",
      }
    : {
        title: "Mandi Prices",
        subtitle: "View real product prices from your marketplace database",
        commodity: "Select Commodity",
        allCommodities: "All Commodities",
        locationFilter: "Select Location",
        allLocations: "All Locations",
        search: "Search",
        loading: "Loading data...",
        error: "Unable to load data right now.",
        noData: "No data available",
        variety: "Variety",
        location: "Location",
        quantity: "Quantity",
        price: "Price (\u20b9/kg)",
        date: "Date",
      };

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/products/");
        const nextProducts = Array.isArray(response.data) ? response.data : [];

        if (!isMounted) {
          return;
        }

        setProducts(nextProducts);
        setVisibleProducts(nextProducts);
      } catch (err) {
        console.error("Failed to load mandi prices:", err);
        if (isMounted) {
          setProducts([]);
          setVisibleProducts([]);
          setError(text.error || "Unable to load data right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [text.error]);

  const commodityOptions = useMemo(() => {
    const uniqueNames = new Set();

    products.forEach((product) => {
      const name = (product?.product_name || product?.name || "").trim();
      if (name) {
        uniqueNames.add(name);
      }
    });

    return Array.from(uniqueNames).sort((left, right) => left.localeCompare(right));
  }, [products]);

  const locationOptions = useMemo(() => {
    const uniqueLocations = new Set();

    products.forEach((product) => {
      const location = (product?.location || "").trim();
      if (location) {
        uniqueLocations.add(location);
      }
    });

    return Array.from(uniqueLocations).sort((left, right) => left.localeCompare(right));
  }, [products]);

  const handleSearch = () => {
    const filteredProducts = products.filter((product) => {
      const matchesCommodity = !selectedCommodity || (product?.product_name || product?.name || "") === selectedCommodity;
      const matchesLocation = !selectedLocation || (product?.location || "") === selectedLocation;
      return matchesCommodity && matchesLocation;
    });

    setVisibleProducts(filteredProducts);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">{text.title}</h1>
          <p className="mt-2 text-gray-600">{text.subtitle}</p>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-gray-700">{text.commodity}</label>
              <select
                value={selectedCommodity}
                onChange={(event) => setSelectedCommodity(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">{text.allCommodities}</option>
                {commodityOptions.map((commodity) => (
                  <option key={commodity} value={commodity}>
                    {commodity}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-gray-700">{text.locationFilter}</label>
              <select
                value={selectedLocation}
                onChange={(event) => setSelectedLocation(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">{text.allLocations}</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              {text.search}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">{text.loading}</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-green-50 text-xs font-bold uppercase tracking-wide text-green-800">
                  <tr>
                    <th className="px-6 py-4">{text.commodity}</th>
                    <th className="px-6 py-4">{text.variety}</th>
                    <th className="px-6 py-4">{text.location}</th>
                    <th className="px-6 py-4">{text.quantity}</th>
                    <th className="px-6 py-4">{text.price}</th>
                    <th className="px-6 py-4">{text.date}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleProducts.length > 0 ? (
                    visibleProducts.map((product) => (
                      <tr key={product.id} className="transition-colors hover:bg-green-50/40">
                        <td className="px-6 py-4 font-semibold text-gray-900">{product.product_name || product.name || "-"}</td>
                        <td className="px-6 py-4 text-gray-600">{product.variety || "-"}</td>
                        <td className="px-6 py-4 text-gray-600">{product.location || "-"}</td>
                        <td className="px-6 py-4 text-gray-600">{product.quantity ?? "-"}</td>
                        <td className="px-6 py-4 font-medium text-green-700">{formatPrice(product.price_per_kg ?? product.price)}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(product.created_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">
                        {text.noData}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MandiPrices;
