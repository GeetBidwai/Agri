import { useEffect, useState } from "react";

import api from "../api";

const SELLER_TYPES = [
  { value: "farmer", label: "Farmer" },
  { value: "trader", label: "Trader" },
  { value: "wholesaler", label: "Wholesaler" },
  { value: "retailer", label: "Retailer" },
];

const createInitialForm = () => ({
  full_name: "",
  aadhaar_number: "",
  aadhaar_front_image: null,
  aadhaar_back_image: null,
  selfie_image: null,
  address: "",
  seller_type: "",
});

function VerifyAccount({ language, onStatusChange }) {
  const [form, setForm] = useState(createInitialForm);
  const [statusInfo, setStatusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const text = language === "HI"
    ? {
        title: "अकाउंट वेरिफाई करें",
        subtitle: "KYC जानकारी जमा करें",
        fullName: "पूरा नाम",
        aadhaar: "आधार नंबर",
        aadhaarFront: "आधार फ्रंट",
        aadhaarBack: "आधार बैक",
        selfie: "सेल्फी",
        address: "पता",
        sellerType: "विक्रेता प्रकार",
        selectSellerType: "विक्रेता प्रकार चुनें",
        submit: "जमा करें",
        submitting: "जमा हो रहा है...",
        pending: "सत्यापन लंबित",
        approved: "✔ सत्यापित विक्रेता",
        rejected: "सत्यापन अस्वीकृत",
        notSubmitted: "खाता सत्यापित करें",
        success: "सत्यापन जमा हो गया (स्वीकृति लंबित)",
        loading: "लोड हो रहा है...",
        validation: "कृपया जरूरी फ़ील्ड भरें",
        error: "कुछ गलत हो गया!",
        sellerTypeOptions: {
          farmer: "किसान",
          trader: "व्यापारी",
          wholesaler: "थोक विक्रेता",
          retailer: "खुदरा विक्रेता",
        },
      }
    : {
        title: "Verify Account",
        subtitle: "Submit your KYC details",
        fullName: "Full Name",
        aadhaar: "Aadhaar Number",
        aadhaarFront: "Aadhaar Front Upload",
        aadhaarBack: "Aadhaar Back Upload",
        selfie: "Selfie Upload",
        address: "Address",
        sellerType: "Seller Type",
        selectSellerType: "Select Seller Type",
        submit: "Submit",
        submitting: "Submitting...",
        pending: "Verification Pending",
        approved: "✔ Verified Seller",
        rejected: "Verification Rejected",
        notSubmitted: "Verify Account",
        success: "Verification submitted (Pending approval)",
        loading: "Loading...",
        validation: "Please fill required fields",
        error: "Something went wrong!",
        sellerTypeOptions: {
          farmer: "Farmer",
          trader: "Trader",
          wholesaler: "Wholesaler",
          retailer: "Retailer",
        },
      };

  useEffect(() => {
    api.get("/verification-status/")
      .then((res) => {
        setStatusInfo(res.data);
        if (onStatusChange) {
          onStatusChange(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [onStatusChange]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((current) => ({ ...current, [name]: files[0] || null }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.full_name || !form.aadhaar_number || !form.aadhaar_front_image || !form.aadhaar_back_image || !form.address || !form.seller_type) {
      alert(text.validation);
      return;
    }

    const formData = new FormData();
    formData.append("full_name", form.full_name);
    formData.append("aadhaar_number", form.aadhaar_number);
    formData.append("aadhaar_front_image", form.aadhaar_front_image);
    formData.append("aadhaar_back_image", form.aadhaar_back_image);
    if (form.selfie_image) {
      formData.append("selfie_image", form.selfie_image);
    }
    formData.append("address", form.address);
    formData.append("seller_type", form.seller_type);

    setSubmitting(true);

    api.post("/verify-seller/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        alert(text.success);
        const nextStatus = { ...res.data, submitted: true };
        setStatusInfo(nextStatus);
        setForm(createInitialForm());
        if (onStatusChange) {
          onStatusChange(nextStatus);
        }
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.detail || text.error);
      })
      .finally(() => setSubmitting(false));
  };

  const verificationStatus = statusInfo?.verification_status || "not_submitted";
  const localizedVerificationStatus = verificationStatus === "approved"
    ? text.approved
    : verificationStatus === "pending"
      ? text.pending
      : verificationStatus === "rejected"
        ? text.rejected
        : text.notSubmitted;

  return (
    <section className="bg-gray-50 py-14 px-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto rounded-2xl bg-white p-8 shadow">
        <h2 className="text-3xl font-bold text-gray-900">{text.title}</h2>
        <p className="mt-2 text-gray-600">{text.subtitle}</p>

        {loading ? (
          <p className="mt-6 text-gray-600">{text.loading}</p>
        ) : (
          <>
            <div className="mt-6 rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">{localizedVerificationStatus}</p>
            </div>

            {verificationStatus !== "approved" && verificationStatus !== "pending" && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input name="full_name" value={form.full_name} placeholder={text.fullName} onChange={handleChange} className="w-full rounded-xl border border-gray-200 p-3" />
                <input name="aadhaar_number" value={form.aadhaar_number} placeholder={text.aadhaar} onChange={handleChange} className="w-full rounded-xl border border-gray-200 p-3" />
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    {language === "HI" ? "आधार कार्ड (फ्रंट)" : "Aadhaar Card (Front)"}
                  </label>
                  <input type="file" name="aadhaar_front_image" accept="image/*" onChange={handleChange} className="w-full rounded-xl border border-gray-200 p-3" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    {language === "HI" ? "आधार कार्ड (बैक)" : "Aadhaar Card (Back)"}
                  </label>
                  <input type="file" name="aadhaar_back_image" accept="image/*" onChange={handleChange} className="w-full rounded-xl border border-gray-200 p-3" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    {language === "HI" ? "आधार के साथ सेल्फी" : "Selfie with Aadhaar"}
                  </label>
                  <input type="file" name="selfie_image" accept="image/*" onChange={handleChange} className="w-full rounded-xl border border-gray-200 p-3" />
                </div>

                <textarea name="address" value={form.address} placeholder={text.address} onChange={handleChange} rows="4" className="w-full rounded-xl border border-gray-200 p-3" />
                <select name="seller_type" value={form.seller_type} onChange={handleChange} className="w-full rounded-xl border border-gray-200 p-3">
                  <option value="">{text.selectSellerType}</option>
                  {SELLER_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {text.sellerTypeOptions[option.value] || option.label}
                    </option>
                  ))}
                </select>

                <button type="submit" className="w-full rounded-xl bg-green-500 px-4 py-3 text-white" disabled={submitting}>
                  {submitting ? text.submitting : text.submit}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default VerifyAccount;
