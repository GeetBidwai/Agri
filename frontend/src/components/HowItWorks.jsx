function HowItWorks({ language }) {
  const steps = language === "HI"
    ? [
        { title: "मुफ्त रजिस्टर करें", icon: "📝" },
        { title: "ज़रूरत पोस्ट करें", icon: "📦" },
        { title: "सीधे जुड़ें", icon: "🤝" },
        { title: "सौदा पूरा करें", icon: "💰" },
      ]
    : [
        { title: "Register Free", icon: "📝" },
        { title: "Post Requirement", icon: "📦" },
        { title: "Connect Directly", icon: "🤝" },
        { title: "Complete Deal", icon: "💰" },
      ];

  const text = language === "HI"
    ? { title: "यह कैसे काम करता है", subtitle: "व्यापार शुरू करने के आसान चरण" }
    : { title: "How It Works", subtitle: "Simple steps to start trading" };

  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold">{text.title}</h2>
        <p className="text-gray-600 mt-1">{text.subtitle}</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="border rounded-2xl p-6">
              <div className="w-10 h-10 bg-green-400 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <div className="text-3xl mb-2">{step.icon}</div>
              <h3 className="font-semibold">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
