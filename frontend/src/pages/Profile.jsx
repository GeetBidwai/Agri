import { useState } from "react";

const createInitialProfile = (user) => ({
  name: user?.name || user?.username || "",
  phone: user?.phone || "",
  location: user?.location || "Maharashtra, India",
});

const getKycTone = (status) => {
  if (status === "verified") {
    return "bg-green-100 text-green-700";
  }

  if (status === "pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
};

function Profile({ user, onLogout, onToggleLanguage }) {
  const [profileForm, setProfileForm] = useState(() => createInitialProfile(user));
  const [language, setLanguage] = useState(user?.language || "EN");
  const [kycStatus] = useState(user?.kyc_status || "not_submitted");
  const [documents, setDocuments] = useState({
    identity: null,
    selfie: null,
  });

  const roleLabel = user?.role === "seller" ? "Seller" : "Buyer";
  const displayName = profileForm.name || user?.username || "User";

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleDocumentChange = (event) => {
    const { name, files } = event.target;
    setDocuments((current) => ({ ...current, [name]: files?.[0] || null }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
  };

  const handleLanguageToggle = (nextLanguage) => {
    setLanguage(nextLanguage);
    if (typeof onToggleLanguage === "function") {
      onToggleLanguage(nextLanguage);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                <p className="mt-1 text-sm text-gray-500">{profileForm.phone || "+91 00000 00000"}</p>
                <p className="mt-1 text-sm text-gray-500">{profileForm.location}</p>
                <span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {roleLabel}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileForm.location}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Save
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">KYC Verification</h2>
                <p className="mt-1 text-sm text-gray-500">Upload your documents to verify your account.</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getKycTone(kycStatus)}`}>
                {kycStatus === "verified" ? "Verified" : kycStatus === "pending" ? "Pending" : "Not Submitted"}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Aadhaar / PAN</label>
                <input
                  type="file"
                  name="identity"
                  onChange={handleDocumentChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
                {documents.identity && (
                  <p className="mt-2 text-xs text-gray-500">{documents.identity.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Selfie</label>
                <input
                  type="file"
                  name="selfie"
                  onChange={handleDocumentChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
                {documents.selfie && (
                  <p className="mt-2 text-xs text-gray-500">{documents.selfie.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Settings</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              type="button"
              className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Change Password
            </button>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => handleLanguageToggle("EN")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  language === "EN" ? "bg-green-600 text-white" : "text-gray-700"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageToggle("HI")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  language === "HI" ? "bg-green-600 text-white" : "text-gray-700"
                }`}
              >
                HI
              </button>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
