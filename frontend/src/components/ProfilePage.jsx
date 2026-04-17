import { useEffect, useState } from "react";

import api from "../api";

const normalizeAuthUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    phone: user.phone,
    is_verified: Boolean(user.is_verified),
    kyc_status: user.kyc_status,
    listing_count: user.listing_count ?? 0,
  };
};

function ProfilePage({ language, dashboardMode = false }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProducts, setUserProducts] = useState([]);
  const [userBids, setUserBids] = useState([]);
  const [fetchingDashboard, setFetchingDashboard] = useState(false);

  const text = language === "HI"
    ? {
        title: "मेरी प्रोफाइल",
        subtitle: "अपने खाते की जानकारी देखें",
        username: "यूज़रनेम",
        phone: "फ़ोन नंबर",
        listings: "आपकी लिस्टिंग",
        kycStatus: "सत्यापन स्थिति",
        not_started: "शुरू नहीं हुआ",
        pending: "सत्यापन लंबित",
        verified_status: "सत्यापित",
        rejected: "सत्यापन अस्वीकृत",
        loading: "लोड हो रहा है...",
        unavailable: "उपलब्ध नहीं",
        myProducts: "मेरे उत्पाद",
        incomingOffers: "आने वाले ऑफ़र",
        edit: "संपादित करें",
        delete: "हटाएं",
        accept: "स्वीकार करें",
        reject: "अस्वीकार करें",
        price: "कीमत",
        status: "स्थिति",
        offered: "प्रस्तावित",
      }
    : {
        title: "My Profile",
        subtitle: "View your account details",
        username: "Username",
        phone: "Phone Number",
        listings: "Your Listings",
        kycStatus: "Verification Status",
        not_started: "Not Started",
        pending: "Pending Verification",
        verified_status: "Verified",
        rejected: "Verification Rejected",
        loading: "Loading...",
        unavailable: "Not available",
        myProducts: "My Products",
        incomingOffers: "Incoming Offers",
        edit: "Edit",
        delete: "Delete",
        accept: "Accept",
        reject: "Reject",
        price: "Price",
        status: "Status",
        offered: "Offered",
      };

  const dashboardTitle = language === "HI" ? "डैशबोर्ड" : "My Dashboard";
  const dashboardSubtitle = language === "HI"
    ? "अपनी लिस्टिंग और सत्यापन स्थिति प्रबंधित करें"
    : "Manage your listings and verification status";
  const verifyPromptTitle = language === "HI"
    ? "लिस्टिंग पोस्ट करने के लिए खाता सत्यापित करें"
    : "Complete verification to start selling";
  const verifyPromptBody = language === "HI"
    ? "आप खरीद, बिड और ब्राउज तुरंत कर सकते हैं. बिक्री शुरू करने के लिए सिर्फ सत्यापन पूरा करना है."
    : "You can browse, buy, and place bids already. Finish verification here to unlock listing creation.";
  const verifyNow = language === "HI" ? "अभी सत्यापित करें" : "Verify Now";

  const canAccessSellerArea = Boolean(profile?.is_verified);

  const fetchProfile = () => {
    setLoading(true);
    api.get("/auth/me/")
      .then((res) => {
        const nextProfile = normalizeAuthUser(res.data);
        setProfile(nextProfile);
        localStorage.setItem("authUser", JSON.stringify(nextProfile));

        if (dashboardMode && nextProfile?.is_verified) {
          fetchDashboardData(nextProfile.username);
        }
      })
      .catch((err) => {
        console.error(err);
        setProfile(null);
      })
      .finally(() => setLoading(false));
  };

  const fetchDashboardData = async (username) => {
    setFetchingDashboard(true);
    try {
      const productsRes = await api.get("/products/");
      const filteredProducts = productsRes.data.filter((p) => p.seller === username);
      setUserProducts(filteredProducts);

      const bidsRes = await api.get("/products/user-bids/");
      setUserBids(bidsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setFetchingDashboard(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const verificationLabel = profile?.kyc_status === "verified"
    ? text.verified_status
    : profile?.kyc_status === "pending"
      ? text.pending
      : profile?.kyc_status === "rejected"
        ? text.rejected
        : text.not_started;

  const verificationColor = profile?.kyc_status === "verified"
    ? "text-green-600"
    : profile?.kyc_status === "pending"
      ? "text-yellow-600"
      : profile?.kyc_status === "rejected"
        ? "text-red-600"
        : "text-gray-500";

  return (
    <section className="bg-gray-50 py-14 px-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto rounded-2xl bg-white p-8 shadow">
        <h2 className="text-3xl font-bold text-gray-900">{dashboardMode ? dashboardTitle : text.title}</h2>
        <p className="mt-2 text-gray-600">{dashboardMode ? dashboardSubtitle : text.subtitle}</p>

        {loading ? (
          <p className="mt-6 text-gray-600">{text.loading}</p>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{text.username}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {profile?.username || text.unavailable}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{text.phone}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {profile?.phone || text.unavailable}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{text.listings}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {profile?.listing_count ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{text.kycStatus}</p>
                <p className={`mt-2 text-lg font-semibold ${verificationColor}`}>
                  {verificationLabel}
                </p>
              </div>
            </div>

            {dashboardMode && !canAccessSellerArea && (
              <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <h3 className="text-xl font-bold text-gray-900">{verifyPromptTitle}</h3>
                <p className="mt-2 text-sm text-gray-700">{verifyPromptBody}</p>
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = "#/verify-account";
                  }}
                  className="mt-4 rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white"
                >
                  {verifyNow}
                </button>
              </div>
            )}

            {dashboardMode && canAccessSellerArea && (
              <div className="mt-12 space-y-12">
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{text.myProducts}</h3>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{text.title}</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{text.price}</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{text.status}</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {userProducts.length > 0 ? (
                            userProducts.map((p) => (
                              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                <td className="px-6 py-4 text-green-600 font-semibold">Rs {p.price_per_kg}/kg</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                    p.verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                  }`}>
                                    {p.verified ? "Verified" : "Pending"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3">
                                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">{text.edit}</button>
                                  <button className="text-sm font-medium text-red-600 hover:text-red-700">{text.delete}</button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                                {fetchingDashboard ? "Loading products..." : "No products available"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{text.incomingOffers}</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {userBids.length > 0 ? (
                      userBids.map((o) => (
                        <div key={o.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">{o.product_name}</p>
                              <p className="text-lg font-bold text-gray-900">{o.buyer_name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase">{text.offered}</p>
                              <p className="text-lg font-bold text-green-600">Rs {o.bid_price}/kg</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold text-sm transition-colors">
                              {text.accept}
                            </button>
                            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold text-sm transition-colors">
                              {text.reject}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center text-gray-500 italic bg-white rounded-2xl border border-gray-100">
                        {fetchingDashboard ? "Loading offers..." : "No offers available"}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
