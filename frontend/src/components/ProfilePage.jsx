import { useEffect, useState } from "react";

import api from "../api";

function ProfilePage({ language }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const text = language === "HI"
    ? {
        title: "मेरी प्रोफाइल",
        subtitle: "अपने खाते की जानकारी देखें",
        username: "यूज़रनेम",
        phone: "फोन नंबर",
        listings: "आपकी लिस्टिंग",
        loading: "लोड हो रहा है...",
        unavailable: "उपलब्ध नहीं",
      }
    : {
        title: "My Profile",
        subtitle: "View your account details",
        username: "Username",
        phone: "Phone Number",
        listings: "Your Listings",
        loading: "Loading...",
        unavailable: "Not available",
      };

  useEffect(() => {
    api.get("/auth/me/")
      .then((res) => {
        setProfile(res.data);
        localStorage.setItem("authUser", JSON.stringify({
          id: res.data.id,
          username: res.data.username,
          phone: res.data.phone,
        }));
      })
      .catch((err) => {
        console.error(err);
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-gray-50 py-14 px-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto rounded-2xl bg-white p-8 shadow">
        <h2 className="text-3xl font-bold text-gray-900">{text.title}</h2>
        <p className="mt-2 text-gray-600">{text.subtitle}</p>

        {loading ? (
          <p className="mt-6 text-gray-600">{text.loading}</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
