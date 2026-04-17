import { useEffect, useState } from "react";

import api from "../api";

const getProductImages = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images;
  }

  if (product?.image) {
    return [product.image];
  }

  return [];
};

const createEditForm = (product) => ({
  product_name: product?.product_name || product?.name || "",
  hindi_name: product?.hindi_name || product?.hindi || "",
  category: product?.category || "",
  listing_type: product?.listing_type || "SELL",
  variety: product?.variety || "",
  quantity: product?.quantity ?? "",
  price_per_kg: product?.price_per_kg ?? "",
  location: product?.location || "",
  description: product?.description || "",
});

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

function ProfilePage({ language, dashboardMode = false, showSellerKyc = false }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProducts, setUserProducts] = useState([]);
  const [userBids, setUserBids] = useState([]);
  const [fetchingDashboard, setFetchingDashboard] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(() => createEditForm(null));
  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [processingBidId, setProcessingBidId] = useState(null);

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
        acceptedBid: "Accepted",
        rejectedBid: "Rejected",
        bidUpdated: "Offer updated successfully.",
        bidUpdateError: "Unable to update this offer right now.",
        actions: "Actions",
        productUpdated: "Product updated successfully.",
        productDeleted: "Product deleted successfully.",
        editValidation: "Please fill product name, quantity, price, category, listing type, and location.",
        editError: "Unable to update this product right now.",
        deleteError: "Unable to delete this product right now.",
        deleteConfirm: "Delete this product? This action cannot be undone.",
        cancel: "Cancel",
        save: "Save",
        saving: "Saving...",
        deleting: "Deleting...",
        noProducts: "No products available",
        loadingProducts: "Loading products...",
        productDetails: "Product details",
        listingType: "Listing Type",
        category: "Category",
        quantity: "Quantity",
        location: "Location",
        description: "Description",
        variety: "Variety",
        name: "Product Name",
        hindi: "Hindi Name",
        buy: "Buy",
        sell: "Sell",
        image: "Product Images",
        imageHelp: "Select new images only if you want to replace the current gallery.",
        editProfile: "Profile overview",
        sellerRole: "Seller account",
        buyerRole: "Buyer account",
        accountStatus: "Account Status",
        verifiedAccount: "Verified account",
        limitedAccount: "Verification pending",
        memberSince: "Marketplace Access",
        memberSinceValue: "Active account",
        dashboardCta: "Open Dashboard",
        verifyCta: "Complete Verification",
        createListing: "Create Listing",
        manageVerification: "Manage Verification",
        statsListings: "Total Listings",
        statsOffers: "Incoming Offers",
        statsStatus: "Verification",
        statsProducts: "Live Products",
        quickActions: "Quick Actions",
        dashboardWelcome: "Welcome back",
        dashboardSummary: "Track listings, offers, and verification from one place.",
        profileSummary: "Keep your account information and seller status in one place.",
        sellerTools: "Seller tools for your account",
        sellerToolsCopy: "Once verified, you can create listings, update products, and respond to offers from here.",
        kycPanelTitle: "Verification Center",
        kycPanelCopy: "Submit your documents and monitor verification progress before you start selling.",
        verificationHintVerified: "Your account is ready to create and manage listings.",
        verificationHintPending: "Your documents are under review. Selling unlocks after approval.",
        verificationHintDefault: "Verification is required before you can publish listings.",
        noOffers: "No offers available",
        loadingOffers: "Loading offers...",
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
  const displayName = profile?.username || text.unavailable;
  const profileInitial = displayName && displayName !== text.unavailable
    ? displayName.charAt(0).toUpperCase()
    : "?";
  const roleLabel = canAccessSellerArea ? text.sellerRole : text.buyerRole;
  const verificationHint = profile?.kyc_status === "verified"
    ? text.verificationHintVerified
    : profile?.kyc_status === "pending"
      ? text.verificationHintPending
      : text.verificationHintDefault;
  const dashboardStats = [
    {
      label: text.statsListings,
      value: profile?.listing_count ?? 0,
      tone: "border-blue-100 bg-blue-50 text-blue-700",
    },
    {
      label: text.statsProducts,
      value: userProducts.length,
      tone: "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    {
      label: text.statsOffers,
      value: userBids.length,
      tone: "border-amber-100 bg-amber-50 text-amber-700",
    },
    {
      label: text.statsStatus,
      value: verificationLabel,
      tone: profile?.kyc_status === "verified"
        ? "border-green-100 bg-green-50 text-green-700"
        : profile?.kyc_status === "pending"
          ? "border-yellow-100 bg-yellow-50 text-yellow-700"
          : "border-slate-200 bg-slate-100 text-slate-700",
    },
  ];

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm(createEditForm(product));
    setSelectedImageFiles([]);
    setSelectedImagePreviews([]);
  };

  const closeEditModal = () => {
    if (savingProduct) {
      return;
    }

    setEditingProduct(null);
    setEditForm(createEditForm(null));
    setSelectedImageFiles([]);
    setSelectedImagePreviews([]);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleEditImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedImageFiles(files);
    setSelectedImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();

    if (
      !editingProduct ||
      !editForm.product_name.trim() ||
      !String(editForm.quantity).trim() ||
      !String(editForm.price_per_kg).trim() ||
      !editForm.category.trim() ||
      !editForm.listing_type.trim() ||
      !editForm.location.trim()
    ) {
      alert(text.editValidation || "Please fill product name, quantity, price, category, listing type, and location.");
      return;
    }

    setSavingProduct(true);

    try {
      const payload = new FormData();
      payload.append("product_name", editForm.product_name);
      payload.append("hindi_name", editForm.hindi_name);
      payload.append("category", editForm.category);
      payload.append("listing_type", editForm.listing_type);
      payload.append("variety", editForm.variety);
      payload.append("quantity", Number(editForm.quantity));
      payload.append("price_per_kg", editForm.price_per_kg);
      payload.append("location", editForm.location);
      payload.append("description", editForm.description);
      selectedImageFiles.forEach((file) => {
        payload.append("images", file);
      });

      const response = await api.put(`/products/${editingProduct.id}/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUserProducts((current) => current.map((product) => (
        product.id === editingProduct.id ? response.data : product
      )));
      setEditingProduct(null);
      setEditForm(createEditForm(null));
      setSelectedImageFiles([]);
      setSelectedImagePreviews([]);
      alert(text.productUpdated || "Product updated successfully.");
    } catch (err) {
      console.error("Failed to update product:", err);
      alert(err.response?.data?.detail || text.editError || "Unable to update this product right now.");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(text.deleteConfirm || "Delete this product? This action cannot be undone.")) {
      return;
    }

    setDeletingProductId(productId);

    try {
      await api.delete(`/products/${productId}/`);
      setUserProducts((current) => current.filter((product) => product.id !== productId));
      setProfile((current) => current ? { ...current, listing_count: Math.max((current.listing_count ?? 1) - 1, 0) } : current);
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
        setEditForm(createEditForm(null));
        setSelectedImageFiles([]);
        setSelectedImagePreviews([]);
      }
      alert(text.productDeleted || "Product deleted successfully.");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert(err.response?.data?.detail || text.deleteError || "Unable to delete this product right now.");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleBidDecision = async (bid, action) => {
    if (!bid?.id || !bid?.product_id) {
      return;
    }

    setProcessingBidId(bid.id);

    try {
      const response = await api.post(`/products/${bid.product_id}/bids/${bid.id}/decision/`, { action });

      setUserBids((current) => current.map((item) => {
        if (item.id === bid.id) {
          return { ...item, ...response.data };
        }

        if (action === "accept" && item.product_id === bid.product_id && item.status === "pending") {
          return { ...item, status: "rejected" };
        }

        return item;
      }));

      alert(text.bidUpdated || "Offer updated successfully.");
    } catch (err) {
      console.error(`Failed to ${action} bid:`, err);
      alert(err.response?.data?.detail || text.bidUpdateError || "Unable to update this offer right now.");
    } finally {
      setProcessingBidId(null);
    }
  };

  const currentGallery = selectedImagePreviews.length > 0
    ? selectedImagePreviews
    : getProductImages(editingProduct);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 via-white to-gray-50 px-6 py-10">
      <div className={`${dashboardMode ? "max-w-6xl" : "max-w-5xl"} mx-auto space-y-6`}>
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-8 py-8 text-white">
            <div className={`flex ${dashboardMode ? "flex-col gap-6 lg:flex-row lg:items-center lg:justify-between" : "flex-col gap-6 md:flex-row md:items-center md:justify-between"}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-3xl font-bold backdrop-blur-sm">
                  {profileInitial}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">
                    {dashboardMode ? text.dashboardWelcome : text.editProfile}
                  </p>
                  <h2 className="mt-1 text-3xl font-bold">
                    {dashboardMode ? dashboardTitle : text.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-white/85">
                    {dashboardMode ? text.dashboardSummary : text.profileSummary}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {!dashboardMode && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = "#/seller-dashboard";
                    }}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    {text.dashboardCta}
                  </button>
                )}
                {(dashboardMode || showSellerKyc) && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = "#/verify-account";
                    }}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    {text.manageVerification}
                  </button>
                )}
                {dashboardMode && canAccessSellerArea && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = "#/create/sell";
                    }}
                    className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    {text.createListing}
                  </button>
                )}
                {!canAccessSellerArea && !dashboardMode && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = "#/verify-account";
                    }}
                    className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    {text.verifyCta}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-emerald-100 bg-white p-6 md:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-sm text-gray-500">{text.username}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{displayName}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-sm text-gray-500">{text.phone}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{profile?.phone || text.unavailable}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-sm text-gray-500">{text.accountStatus}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {canAccessSellerArea ? text.verifiedAccount : text.limitedAccount}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-sm text-gray-500">{text.memberSince}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{text.memberSinceValue}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-gray-600">{text.loading}</p>
        ) : (
          <>
            {!dashboardMode && !showSellerKyc && (
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{text.editProfile}</h3>
                      <p className="mt-2 text-sm text-gray-600">{verificationHint}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      canAccessSellerArea ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {roleLabel}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">{text.listings}</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">{profile?.listing_count ?? 0}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">{text.kycStatus}</p>
                      <p className={`mt-2 text-2xl font-bold ${verificationColor}`}>{verificationLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900">{text.quickActions}</h3>
                  <p className="mt-2 text-sm text-gray-600">{text.sellerToolsCopy}</p>
                  <div className="mt-6 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.hash = "#/seller-dashboard";
                      }}
                      className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-left text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      {text.dashboardCta}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.location.hash = "#/verify-account";
                      }}
                      className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-left text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      {text.verifyCta}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showSellerKyc && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{text.kycPanelTitle}</h3>
                    <p className="mt-2 text-sm text-gray-600">{text.kycPanelCopy}</p>
                    <p className={`mt-4 text-lg font-semibold ${verificationColor}`}>{verificationLabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = "#/verify-account";
                    }}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {text.verifyCta}
                  </button>
                </div>
              </div>
            )}

            {dashboardMode && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((item) => (
                  <div key={item.label} className={`rounded-3xl border p-5 shadow-sm ${item.tone}`}>
                    <p className="text-sm font-medium opacity-80">{item.label}</p>
                    <p className="mt-3 text-3xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {dashboardMode && !canAccessSellerArea && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
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
              <div className="space-y-12">
                <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{text.quickActions}</h3>
                      <p className="mt-2 text-sm text-gray-600">{text.sellerTools}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          window.location.hash = "#/create/sell";
                        }}
                        className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        {text.createListing}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.hash = "#/verify-account";
                        }}
                        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        {text.manageVerification}
                      </button>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{text.myProducts}</h3>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="border-b border-gray-100 bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">{text.name || "Product Name"}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">{text.price}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">{text.status}</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase text-gray-500">{text.actions || "Actions"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {userProducts.length > 0 ? (
                            userProducts.map((p) => (
                              <tr key={p.id} className="transition-colors hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name || p.product_name}</td>
                                <td className="px-6 py-4 font-semibold text-green-600">Rs {p.price_per_kg}/kg</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                    p.is_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                  }`}>
                                    {p.is_verified ? "Verified" : "Pending"}
                                  </span>
                                </td>
                                <td className="space-x-3 px-6 py-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(p)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-blue-300"
                                    disabled={deletingProductId === p.id}
                                  >
                                    {text.edit}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:text-red-300"
                                    disabled={deletingProductId === p.id}
                                  >
                                    {deletingProductId === p.id ? (text.deleting || "Deleting...") : text.delete}
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-6 py-12 text-center italic text-gray-500">
                                {fetchingDashboard ? (text.loadingProducts || "Loading products...") : (text.noProducts || "No products available")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="mb-6 text-2xl font-bold text-gray-900">{text.incomingOffers}</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {userBids.length > 0 ? (
                      userBids.map((o) => (
                        <div key={o.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <p className="mb-1 text-sm text-gray-500">{o.product_name}</p>
                              <p className="text-lg font-bold text-gray-900">{o.buyer_name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs uppercase text-gray-500">{text.offered}</p>
                              <p className="text-lg font-bold text-green-600">Rs {o.bid_price}/kg</p>
                            </div>
                          </div>
                          {o.status && o.status !== "pending" && (
                            <div className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              o.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {o.status === "accepted" ? (text.acceptedBid || "Accepted") : (text.rejectedBid || "Rejected")}
                            </div>
                          )}
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleBidDecision(o, "accept")}
                              disabled={o.status !== "pending" || processingBidId === o.id}
                              className="flex-1 rounded-xl bg-green-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                            >
                              {text.accept}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBidDecision(o, "reject")}
                              disabled={o.status !== "pending" || processingBidId === o.id}
                              className="flex-1 rounded-xl bg-gray-100 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              {text.reject}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full rounded-2xl border border-gray-100 bg-white py-12 text-center italic text-gray-500">
                        {fetchingDashboard ? text.loadingOffers : text.noOffers}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/40 px-4 py-6">
          <div className="mx-auto w-full max-w-2xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{text.edit} {editingProduct.name || editingProduct.product_name}</h3>
                <p className="mt-1 text-sm text-gray-500">{text.productDetails || "Product details"}</p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                disabled={savingProduct}
              >
                {text.cancel || "Cancel"}
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                name="product_name"
                value={editForm.product_name}
                onChange={handleEditChange}
                placeholder={text.name || "Product Name"}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                name="hindi_name"
                value={editForm.hindi_name}
                onChange={handleEditChange}
                placeholder={text.hindi || "Hindi Name"}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
              <select
                name="listing_type"
                value={editForm.listing_type}
                onChange={handleEditChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              >
                <option value="SELL">{text.sell || "Sell"}</option>
                <option value="BUY">{text.buy || "Buy"}</option>
              </select>
              <input
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                placeholder={text.category || "Category"}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                name="variety"
                value={editForm.variety}
                onChange={handleEditChange}
                placeholder={text.variety || "Variety"}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                type="number"
                min="1"
                name="quantity"
                value={editForm.quantity}
                onChange={handleEditChange}
                placeholder={text.quantity || "Quantity"}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                name="price_per_kg"
                value={editForm.price_per_kg}
                onChange={handleEditChange}
                placeholder={text.price || "Price"}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                placeholder={text.location || "Location"}
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                placeholder={text.description || "Description"}
                rows="4"
                className="sm:col-span-2 w-full rounded-xl border border-gray-200 px-4 py-3"
              />
              <div className="sm:col-span-2">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleEditImagesChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                />
                <p className="mt-2 text-xs text-gray-500">{text.imageHelp || "Select new images only if you want to replace the current gallery."}</p>
              </div>

              {currentGallery.length > 0 && (
                <div className="sm:col-span-2 grid grid-cols-2 gap-3 rounded-xl border border-gray-100 p-3 sm:grid-cols-4">
                  {currentGallery.map((image, index) => (
                    <img key={`${image}-${index}`} src={image} alt={`${editForm.product_name || text.image} ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                  ))}
                </div>
              )}

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700"
                  disabled={savingProduct}
                >
                  {text.cancel || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white disabled:bg-green-300"
                  disabled={savingProduct}
                >
                  {savingProduct ? (text.saving || "Saving...") : (text.save || "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProfilePage;


