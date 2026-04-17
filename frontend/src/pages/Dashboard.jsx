const buildStats = (isSeller) => ([
  {
    title: "Total Listings",
    value: "24",
    color: "blue",
    accent: "text-blue-700",
    bg: "bg-blue-50",
    ring: "border-blue-100",
  },
  {
    title: "Active Listings",
    value: "18",
    color: "green",
    accent: "text-green-700",
    bg: "bg-green-50",
    ring: "border-green-100",
  },
  {
    title: "Orders",
    value: "12",
    color: "purple",
    accent: "text-purple-700",
    bg: "bg-purple-50",
    ring: "border-purple-100",
  },
  {
    title: isSeller ? "Earnings" : "Spending",
    value: isSeller ? "Rs 48,500" : "Rs 18,200",
    color: "amber",
    accent: "text-amber-700",
    bg: "bg-amber-50",
    ring: "border-amber-100",
  },
]);

const recentActivity = [
  { id: 1, type: "Listing", text: "Bajra listing created and published", time: "2 hours ago" },
  { id: 2, type: "Order", text: "Order received for Wheat from Indore", time: "5 hours ago" },
  { id: 3, type: "Listing", text: "Rice stock quantity updated", time: "Yesterday" },
  { id: 4, type: "Order", text: "Maize order marked as delivered", time: "2 days ago" },
  { id: 5, type: "Listing", text: "Tur Dal price adjusted for local market", time: "3 days ago" },
];

function Dashboard({ user, onNavigate }) {
  const isSeller = user?.role === "seller";
  const isVerified = Boolean(user?.is_verified);
  const displayName = user?.name || user?.username || "Farmer";
  const stats = buildStats(isSeller);

  const handleNavigate = (route, value) => {
    if (typeof onNavigate === "function") {
      onNavigate(route, value);
      return;
    }

    const fallbackRoutes = {
      create: "#/create/sell",
      profile: "#/profile",
      orders: "#/product-bids/1",
    };

    window.location.hash = fallbackRoutes[route] || "#/";
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {displayName} <span aria-hidden="true">??</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">Overview of your activity</p>
        </div>

        {!isVerified && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
            <p className="text-sm font-medium text-amber-800">
              Complete your KYC to unlock full features
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border ${item.ring} bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md`}
            >
              <div className={`inline-flex rounded-xl ${item.bg} px-3 py-1 text-xs font-semibold ${item.accent}`}>
                {item.color}
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500">{item.title}</p>
              <p className={`mt-3 text-3xl font-bold ${item.accent}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleNavigate("create", "SELL")}
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("orders")}
              className="rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
            >
              View Orders
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("profile")}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Go to Profile
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:bg-gray-100 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {item.type}
                  </span>
                  <p className="mt-2 text-sm font-medium text-gray-900">{item.text}</p>
                </div>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
