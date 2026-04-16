import { useEffect, useState } from "react";

import api from "../api";

function SellerKycSection({ language, onProfileRefresh }) {
  const [statusInfo, setStatusInfo] = useState(null);
  const [form, setForm] = useState({ id_proof: null, selfie: null });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const text = language === "HI"
    ? {
        title: "Seller KYC",
        subtitle: "ID proof à¤”à¤° selfie upload à¤•à¤°à¥‡à¤‚",
        pending: "Pending",
        verified: "Verified",
        rejected: "Rejected",
        notSubmitted: "Not Submitted",
        idProof: "ID Proof",
        selfie: "Selfie",
        submit: "Upload KYC",
        submitting: "Uploading...",
        success: "KYC submitted successfully.",
      }
    : {
        title: "Seller KYC",
        subtitle: "Upload your ID proof and selfie. Verification remains optional.",
        pending: "Pending",
        verified: "Verified",
        rejected: "Rejected",
        notSubmitted: "Not Submitted",
        idProof: "ID Proof",
        selfie: "Selfie",
        submit: "Upload KYC",
        submitting: "Uploading...",
        success: "KYC submitted successfully.",
      };

  const fetchStatus = () => {
    setLoading(true);
    api.get("/kyc/status/")
      .then((res) => setStatusInfo(res.data))
      .catch((err) => {
        console.error(err);
        setStatusInfo({ submitted: false, status: "Not Submitted" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id_proof || !form.selfie) {
      return;
    }

    const formData = new FormData();
    formData.append("id_proof", form.id_proof);
    formData.append("selfie", form.selfie);

    setSubmitting(true);
    api.post("/kyc/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        alert(text.success);
        setForm({ id_proof: null, selfie: null });
        fetchStatus();
        if (onProfileRefresh) {
          onProfileRefresh();
        }
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.detail || "Something went wrong!");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">{text.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{text.subtitle}</p>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Status</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {loading ? "Loading..." : statusInfo?.status || text.notSubmitted}
        </p>
      </div>

      {statusInfo?.status !== "Verified" && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setForm((current) => ({ ...current, id_proof: e.target.files?.[0] || null }))}
            className="w-full rounded-xl border border-gray-200 p-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm((current) => ({ ...current, selfie: e.target.files?.[0] || null }))}
            className="w-full rounded-xl border border-gray-200 p-3"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white"
          >
            {submitting ? text.submitting : text.submit}
          </button>
        </form>
      )}
    </div>
  );
}

export default SellerKycSection;
