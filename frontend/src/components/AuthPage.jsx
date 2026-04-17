import { useState } from "react";

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

function AuthPage({ mode, onAuthSuccess, onNavigate, language }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const copy = {
    EN: {
      loginTitle: "Login to your account",
      signupTitle: "Create your account",
      loginSubtitle: "Sign in to create and manage your listings.",
      signupSubtitle: "Sign up to buy freely and complete verification before posting listings.",
      username: "Username",
      phone: "Phone Number",
      password: "Password",
      loading: "Please wait...",
      login: "Login",
      signup: "Sign Up",
      newHere: "New here?",
      already: "Already have an account?",
      createAccount: "Create an account",
      switchLogin: "Login",
    },
    HI: {
      loginTitle: "अपने खाते में लॉगिन करें",
      signupTitle: "अपना खाता बनाएं",
      loginSubtitle: "लिस्टिंग बनाने और प्रबंधित करने के लिए साइन इन करें।",
      signupSubtitle: "खरीद और बिक्री की लिस्टिंग पोस्ट करने के लिए साइन अप करें।",
      username: "यूज़रनेम",
      phone: "फ़ोन नंबर",
      password: "पासवर्ड",
      loading: "कृपया प्रतीक्षा करें...",
      login: "लॉगिन",
      signup: "साइन अप",
      newHere: "नए हैं?",
      already: "क्या आपका खाता है?",
      createAccount: "खाता बनाएं",
      switchLogin: "लॉगिन",
    },
  };

  const text = copy[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    api.post(`/auth/${isLogin ? "login" : "signup"}/`, form)
      .then((res) => {
        localStorage.setItem("authToken", res.data.token);
        const nextUser = normalizeAuthUser(res.data.user);
        localStorage.setItem("authUser", JSON.stringify(nextUser));
        onAuthSuccess(nextUser);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="bg-gray-50 py-16 px-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLogin ? text.loginTitle : text.signupTitle}
        </h2>
        <p className="text-gray-600 mt-2">
          {isLogin ? text.loginSubtitle : text.signupSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input name="username" value={form.username} placeholder={text.username} onChange={handleChange} className="w-full p-3 border rounded-lg" />

          {!isLogin && (
            <>
              <input name="phone" value={form.phone} placeholder={text.phone} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </>
          )}

          <input type="password" name="password" value={form.password} placeholder={text.password} onChange={handleChange} className="w-full p-3 border rounded-lg" />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button disabled={loading} className="w-full rounded-lg bg-green-600 text-white px-4 py-3 font-medium">
            {loading ? text.loading : isLogin ? text.login : text.signup}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          {isLogin ? text.newHere : text.already}{" "}
          <button
            type="button"
            onClick={() => onNavigate(isLogin ? "signup" : "login")}
            className="text-green-700 font-medium"
          >
            {isLogin ? text.createAccount : text.switchLogin}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
