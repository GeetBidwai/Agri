function HowItWorks() {
  const steps = [
    { title: "Register Free", hindi: "मुफ्त रजिस्टर करें", icon: "📝" },
    { title: "Post Requirement", hindi: "जरूरत पोस्ट करें", icon: "📦" },
    { title: "Connect Directly", hindi: "सीधे जुड़ें", icon: "🤝" },
    { title: "Complete Deal", hindi: "सौदा पूरा करें", icon: "💰" },
  ];

  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-2xl font-bold">How It Works</h2>
        <p className="text-gray-600 mt-1">
          Simple steps to start trading
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="border rounded-2xl p-6">
              
              <div className="w-10 h-10 bg-green-400 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>

              <div className="text-3xl mb-2">{step.icon}</div>

              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-400 font-devanagari">
                {step.hindi}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;