import React from "react";

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white/60 px-6 py-8 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-brand-orange flex items-center justify-center text-white text-[10px]">⚡</div>
            <span className="text-white font-medium">Easy Shop</span>
          </div>
          <p className="text-xs">Manage your store, employees and orders from one place.</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Quick Links</h4>
          <div className="flex flex-col gap-1 text-xs">
            <a href="/Common/pages/Products" className="hover:text-white transition-colors">Products</a>
            <a href="/Common/pages/Pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/Common/pages/About" className="hover:text-white transition-colors">About</a>
            <a href="/Common/pages/Contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Contact</h4>
          <p className="text-xs">support@yourbrand.com</p>
          <p className="text-xs">+1 234 567 890</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-white/10 text-center text-xs">
        &copy; {new Date().getFullYear()} Easy Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
