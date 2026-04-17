function Footer() {
  return (
    <footer className="border-t border-green-800 bg-green-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold">Agri</h3>
            <p className="mt-3 text-sm text-gray-300">
              Connecting buyers and sellers in agriculture
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Marketplace</h4>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              <a href="#/" className="block transition-colors hover:text-white">Browse Listings</a>
              <a href="#/create/sell" className="block transition-colors hover:text-white">Post Listing</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h4>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              <a href="#/" className="block transition-colors hover:text-white">About Us</a>
              <a href="mailto:support@agri.com" className="block transition-colors hover:text-white">Contact Us</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Help & Safety</h4>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              <a href="#/" className="block transition-colors hover:text-white">Safety Guidelines</a>
              <a href="#/" className="block transition-colors hover:text-white">Report Listing</a>
            </div>
            <div className="mt-5 text-sm text-gray-300">
              <p>support@agri.com</p>
              <p className="mt-1">+91 00000 00000</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-gray-200">
          ⚠️ Never pay advance without verifying the seller.
        </div>

        <div className="mt-6 text-sm text-gray-400">
          © 2026 Agri. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
