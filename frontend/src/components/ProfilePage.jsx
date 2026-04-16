import { useEffect, useState } from "react";

import api from "../api";
import SellerKycSection from "./SellerKycSection";

function ProfilePage({ language, showSellerKyc = false }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const text = language === "HI"
    ? {
        title: "मेरी प्रोफ़ाइल",
        subtitle: "अपने खाते की जानकारी देखें",
        username: "यूज़रनेम",
        phone: "फ़ोन नंबर",
        listings: "आपकी लिस्टिंग",
        role: "भूमिका",
        verified: "सत्यापित विक्रेता",
        notVerified: "सत्यापित नहीं",
        kycStatus: "सत्यापन स्थिति",
        not_started: "⚪ शुरू नहीं हुआ",
        pending: "⏳ सत्यापन लंबित",
        verified_status: "✅ सत्यापित विक्रेता",
        rejected: "❌ सत्यापन अस्वीकृत",
        loading: "लोड हो रहा है...",
        unavailable: "उपलब्ध नहीं",
      }
    : {
        title: "My Profile",
        subtitle: "View your account details",
        username: "Username",
        phone: "Phone Number",
        listings: "Your Listings",
        role: "Role",
        verified: "Verified Seller",
        notVerified: "Not verified",
        kycStatus: "Verification Status",
        not_started: "⚪ Not Started",
        pending: "⏳ Pending Verification",
        verified_status: "✅ Verified Seller",
        rejected: "❌ Verification Rejected",
        loading: "Loading...",
        unavailable: "Not available",
      };

  const localizedRole = profile?.role === "seller"
    ? language === "HI" ? "विक्रेता" : "seller"
    : profile?.role === "buyer"
      ? language === "HI" ? "खरीदार" : "buyer"
      : profile?.role || "buyer";

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
          kyc_status: res.data.kyc_status,
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
                  {localizedRole}
                </p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{text.kycStatus}</p>
                  <p className={`text-xs font-bold mt-1 ${
                    profile?.kyc_status === "verified" ? "text-green-600" :
                    profile?.kyc_status === "pending" ? "text-yellow-600" :
                    profile?.kyc_status === "rejected" ? "text-red-600" :
                    "text-gray-400"
                  }`}>
                    {profile?.kyc_status === "verified" ? text.verified_status :
                     profile?.kyc_status === "pending" ? text.pending :
                     profile?.kyc_status === "rejected" ? text.rejected :
                     text.not_started}
                  </p>
                </div>
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
