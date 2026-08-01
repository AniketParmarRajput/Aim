export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-brand-dark via-[#3D2B1F] to-brand-dark px-6 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,115,85,0.15),transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-brand-light/10 border border-white/20 text-white/80 text-[11px] font-medium px-3 py-1 rounded-full mb-5">
            ⚡ About Easy Shop
          </span>
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-4">
            Your One-Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-tan to-yellow-300">Shopping Destination</span>
          </h1>
          <p className="text-white/60 text-[15px] max-w-2xl mx-auto">
            We bring you the latest trends, premium quality products, and unbeatable
            deals — all in one place. Easy Shop is built to make online shopping
            simple, fast, and secure.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Mission */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Our Mission</h2>
          <p className="text-gray-500 leading-relaxed">
            Our mission is simple: to make online shopping effortless for everyone.
            From premium fashion and essentials for Men, Women, and Kids to everyday
            must-haves, we curate high-quality products at the best prices. We combine
            cutting-edge technology with a customer-first approach to deliver a
            shopping experience that is fast, secure, and enjoyable.
          </p>
        </div>

        {/* What we offer */}
        <h2 className="text-2xl font-bold text-brand-dark mb-5">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            { icon: "🛍️", title: "Wide Product Range", desc: "Fashion, electronics, and lifestyle products across Men, Women, Kids & more." },
            { icon: "🔥", title: "Exclusive Deals & Discounts", desc: "Big Sale events and Top Deals with discounts up to 60% off." },
            { icon: "💳", title: "Flexible Payment Options", desc: "Pay via Cash on Delivery, cards, or UPI — your choice, your convenience." },
            { icon: "🚚", title: "Fast & Free Delivery", desc: "Quick doorstep delivery, with free shipping on qualifying orders." },
            { icon: "🔄", title: "Easy Returns", desc: "Hassle-free 7-day returns and exchanges on all products." },
            { icon: "🔒", title: "100% Secure Checkout", desc: "Your data and payments are protected with industry-standard security." },
          ].map((s) => (
            <div key={s.title} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300">
              <span className="text-2xl">{s.icon}</span>
              <h3 className="text-[15px] font-semibold text-gray-900 mt-2">{s.title}</h3>
              <p className="text-[13px] text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Why choose us */}
        <h2 className="text-2xl font-bold text-brand-dark mb-5">Why Shop With Us?</h2>
        <div className="bg-gradient-to-r from-brand-dark via-[#3D2B1F] to-brand-dark rounded-2xl p-8 text-center">
          <p className="text-white/80 text-[15px] leading-relaxed mb-2">
            Thousands of happy customers trust Easy Shop for quality products,
            honest pricing, and a shopping experience that puts them first.
          </p>
          <p className="text-white font-bold text-lg">
            Easy Shop — Shop Easy, Live Easy. 🛍️
          </p>
        </div>
      </div>
    </div>
  );
}
