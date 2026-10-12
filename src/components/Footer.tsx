import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="bg-white rounded-lg p-3 inline-block mb-4">
              <Logo size={32} textColor="#000000" />
            </div>
            <p className="text-sm text-gray-400">
              Live by the Leaf. We're not just Petro. We're Petro-Canada.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Careers</h3>
            <ul className="space-y-2 text-sm">
              <li>Guest Service Attendant</li>
              <li>Cleaner</li>
              <li>Supervisor</li>
              <li>Inventory Manager</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Winnipeg Locations</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>8 store locations across Winnipeg</li>
              <li>Part-time & Full-time positions</li>
              <li>Equal opportunity employer</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-500 text-center">
          © 2026 Petro-Canada. A Suncor Energy business. All trademarks used under licence.
        </div>
      </div>
    </footer>
  );
}
