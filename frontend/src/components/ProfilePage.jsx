import { useEffect, useState } from "react";

import api from "../api";
import SellerKycSection from "./SellerKycSection";

function ProfilePage({ language, showSellerKyc = false }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const text = language === "HI"
    ? {
        title: "à¤®à¥‡à¤°à¥€ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²",
        subtitle: "à¤…à¤ªà¤¨à¥‡ à¤–à¤¾à¤¤à¥‡ à¤•à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤¦à¥‡à¤–à¥‡à¤‚",
        username: "à¤¯à¥‚à¤œà¤¼à¤°à¤¨à¥‡à¤®",
        phone: "à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°",
        listings: "à¤†à¤ªà¤•à¥€ à¤²à¤¿à¤¸à¥à¤Ÿà¤¿à¤‚à¤—",
        role: "Role",
        verified: "Verified Seller",
        loading: "à¤²à¥‹à¤¡ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ...",
        unavailable: "à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¨à¤¹à¥€à¤‚",
      }
    : {
        title: "My Profile",
        subtitle: "View your account details",
        username: "Username",
        phone: "Phone Number",
        listings: "Your Listings",
        role: "Role",
        verified: "Verified Seller",
        loading: "Loading...",
        unavailable: "Not available",
      };

  const fetchProfile = () => {
    setLoading(true);
    api.get("/auth/me/")
      .then((res) => {
        setProfile(res.data);
        localStorage.setItem("authUser", JSON.stringify({
          id: res.data.id,
          username: res.data.username,
          phone: res.data.phone,
          role: res.data.role,
          is_verified: res.data.is_verified,
        }));
      })
      .catch((err) => {
        console.error(err);
        setProfile(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <section className="bg-gray-50 py-14 px-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto rounded-2xl bg-white p-8 shadow">
        <h2 className="text-3xl font-bold text-gray-900">{text.title}</h2>
        <p className="mt-2 text-gray-600">{text.subtitle}</p>

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
                <p className="text-sm text-gray-500">{text.role}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {profile?.role || "buyer"}
                </p>
                <p className="mt-2 text-xs text-teal-600">
                  {profile?.is_verified ? text.verified : "Not verified"}
                </p>
              </div>
            </div>

            {showSellerKyc && (
              <SellerKycSection language={language} onProfileRefresh={fetchProfile} />
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
