import React from 'react';
import { Store, HelpCircle, Gift, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#172337] text-white text-xs mt-12 border-t-4 border-[#0b8442]">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Col 1 */}
        <div className="space-y-3">
          <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">About</h4>
          <ul className="space-y-2 text-slate-300">
            <li><a href="#about" className="hover:underline">Contact Us</a></li>
            <li><a href="#about" className="hover:underline">About Us</a></li>
            <li><a href="#about" className="hover:underline">Careers</a></li>
            <li><a href="#about" className="hover:underline">ApniDukaan Stories</a></li>
            <li><a href="#about" className="hover:underline">Corporate Information</a></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Help</h4>
          <ul className="space-y-2 text-slate-300">
            <li><a href="#help" className="hover:underline">Payments</a></li>
            <li><a href="#help" className="hover:underline">Shipping</a></li>
            <li><a href="#help" className="hover:underline">Cancellation & Returns</a></li>
            <li><a href="#help" className="hover:underline">FAQ</a></li>
            <li><a href="#help" className="hover:underline">Report Infringement</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Consumer Policy</h4>
          <ul className="space-y-2 text-slate-300">
            <li><a href="#policy" className="hover:underline">Cancellation & Returns</a></li>
            <li><a href="#policy" className="hover:underline">Terms Of Use</a></li>
            <li><a href="#policy" className="hover:underline">Security</a></li>
            <li><a href="#policy" className="hover:underline">Privacy</a></li>
            <li><a href="#policy" className="hover:underline">Sitemap</a></li>
            <li><a href="#policy" className="hover:underline">EPR Compliance</a></li>
          </ul>
        </div>

        {/* Col 4: Mail Us */}
        <div className="space-y-3 md:border-l md:border-slate-700 md:pl-6">
          <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Mail Us:</h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            ApniDukaan Internet Private Limited,<br />
            Buildings Alyssa, Begonia &<br />
            Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India
          </p>
        </div>

        {/* Col 5: Registered Office */}
        <div className="space-y-3">
          <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Registered Office Address:</h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            ApniDukaan Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Bengaluru, 560103, Karnataka, India<br />
            CIN : U51109KA2012PTC066107<br />
            Telephone: 044-45614700 / 044-67415800
          </p>
        </div>

      </div>

      {/* Lower Footer Bottom Bar */}
      <div className="border-t border-slate-700/80 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-300">
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-yellow-400">
              <Store className="w-4 h-4" /> Become a Seller
            </span>
            <span className="flex items-center gap-1.5 text-yellow-400">
              <Sparkles className="w-4 h-4" /> Advertise
            </span>
            <span className="flex items-center gap-1.5 text-yellow-400">
              <Gift className="w-4 h-4" /> Gift Cards
            </span>
            <span className="flex items-center gap-1.5 text-yellow-400">
              <HelpCircle className="w-4 h-4" /> Help Center
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>© 2026 ApniDukaan.com. All rights reserved.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
