import React, { useState, useEffect } from 'react';
import { Address } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Home, 
  Briefcase, 
  Phone,
  Building,
  Loader2,
  Check
} from 'lucide-react';
import { INDIAN_STATES, lookupPincode } from '../utils/pincode';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onSaveAddress: (address: Address) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefaultAddress: (addressId: string) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addresses,
  onSaveAddress,
  onDeleteAddress,
  onSetDefaultAddress
}) => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);

  // Address form fields - blank by default, no pre-filled Bengaluru/Karnataka
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: user?.phone?.replace(/\D/g, '').slice(-10) || '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    type: 'HOME' as 'HOME' | 'WORK'
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Automatic Pincode fetch when 6 digits are entered
  useEffect(() => {
    const cleanPin = formData.pincode.replace(/\D/g, '').trim();
    if (cleanPin.length === 6) {
      let isMounted = true;
      setIsLookingUpPincode(true);
      setPincodeMessage(null);

      lookupPincode(cleanPin)
        .then((res) => {
          if (!isMounted) return;
          if (res.success) {
            setFormData((prev) => ({
              ...prev,
              city: res.city,
              state: res.state,
              locality: (!prev.locality && res.localities && res.localities.length > 0) ? res.localities[0] : prev.locality
            }));
            setPincodeMessage(`Auto-filled: ${res.city}, ${res.state}`);
            setFormError(null);
          } else {
            setPincodeMessage(null);
          }
        })
        .finally(() => {
          if (isMounted) setIsLookingUpPincode(false);
        });

      return () => {
        isMounted = false;
      };
    } else {
      setPincodeMessage(null);
    }
  }, [formData.pincode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (formData.phone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (formData.pincode.length !== 6) {
      setFormError('Please enter a valid 6-digit pincode');
      return;
    }
    if (!formData.address.trim()) {
      setFormError('Please enter flat/house no. and building details');
      return;
    }
    if (!formData.city.trim()) {
      setFormError('Please enter your City / District');
      return;
    }
    if (!formData.state.trim()) {
      setFormError('Please select your State');
      return;
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      pincode: formData.pincode.trim(),
      locality: formData.locality.trim() || 'Locality',
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      landmark: formData.landmark?.trim() || undefined,
      type: formData.type,
      isDefault: addresses.length === 0
    };

    onSaveAddress(newAddress);
    setShowAddForm(false);
    setFormError(null);
    setPincodeMessage(null);
    setFormData({
      name: user?.displayName || '',
      phone: user?.phone?.replace(/\D/g, '').slice(-10) || '',
      pincode: '',
      locality: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
      type: 'HOME'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="saved-addresses-modal"
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="bg-[#0b8442] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-300" />
            <h2 className="text-lg font-bold">Manage Delivery Addresses</h2>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">
              {addresses.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-emerald-700 rounded transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          
          {/* Top Info Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0b8442] flex-shrink-0 mt-0.5" />
            <span>
              Your saved delivery addresses are used when you click <strong>Buy Now</strong> or <strong>Place Order</strong>. Add or update your delivery locations below.
            </span>
          </div>

          {/* Add New Address Button */}
          {!showAddForm && (
            <button
              id="modal-add-address-btn"
              onClick={() => {
                setShowAddForm(true);
                if (user?.displayName) {
                  setFormData((prev) => ({
                    ...prev,
                    name: user.displayName || '',
                    phone: user.phone?.replace(/\D/g, '').slice(-10) || ''
                  }));
                }
              }}
              className="w-full py-3 px-4 bg-white border-2 border-dashed border-[#0b8442] text-[#0b8442] font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-emerald-50/50 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD A NEW DELIVERY ADDRESS</span>
            </button>
          )}

          {/* Add Address Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-5 rounded-lg border border-slate-300 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0b8442]" />
                  <span>Add Delivery Address</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">Enter details below</span>
              </div>

              {formError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">10-Digit Mobile Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l text-slate-600 font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full p-2.5 border border-slate-300 rounded-r bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-bold">6-Digit Pincode *</label>
                    {isLookingUpPincode && (
                      <span className="text-[10px] text-[#0b8442] font-semibold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Fetching City & State...
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 560001 or 110001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                  />
                  {pincodeMessage && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {pincodeMessage}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Locality / Colony / Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colony, Area or Street"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Flat, House No., Building, Street *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Flat 302, Green Valley Apartments"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    placeholder="City or District"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                  >
                    <option value="">-- Select State --</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Metro Station"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <span className="font-bold text-slate-700">Address Type:</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="modal-addr-type"
                    checked={formData.type === 'HOME'}
                    onChange={() => setFormData({ ...formData, type: 'HOME' })}
                    className="text-[#0b8442]"
                  />
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  <span>Home</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="modal-addr-type"
                    checked={formData.type === 'WORK'}
                    onChange={() => setFormData({ ...formData, type: 'WORK' })}
                    className="text-[#0b8442]"
                  />
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>Work</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-[#0b8442] hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded text-xs shadow-sm cursor-pointer transition-colors"
                >
                  SAVE ADDRESS
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded text-xs cursor-pointer transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}

          {/* List of Saved Addresses */}
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center space-y-2 border border-slate-200">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700">No Address Saved Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you add your delivery address, it will be saved here so you can purchase products instantly with 1-click.
                </p>
              </div>
            ) : (
              addresses.map((addr) => (
                <div 
                  key={addr.id}
                  className={`bg-white p-4 rounded-lg border transition-all ${
                    addr.isDefault 
                      ? 'border-[#0b8442] ring-1 ring-emerald-100 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 text-xs flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{addr.name}</span>
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          {addr.type === 'HOME' ? <Home className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Default Delivery Address
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-slate-600 font-semibold">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>+91 {addr.phone}</span>
                      </div>

                      <p className="text-slate-600 leading-relaxed pt-1">
                        {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <strong className="text-slate-800">{addr.pincode}</strong>
                      </p>

                      {addr.landmark && (
                        <p className="text-slate-400 text-[11px]">Landmark: {addr.landmark}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => onSetDefaultAddress(addr.id)}
                          className="text-[11px] text-[#0b8442] hover:underline font-bold cursor-pointer"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
