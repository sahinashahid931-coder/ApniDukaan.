import React, { useEffect } from 'react';
import { Order } from '../types';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Download, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewOrders
}) => {
  useEffect(() => {
    if (isOpen && order) {
      // Trigger festive celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleDownloadInvoice = () => {
    alert(`Tax Invoice for Order ${order.id} downloaded successfully.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="order-success-modal"
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 space-y-6"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#388e3c] flex items-center justify-center shadow-inner animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Order Placed Successfully!
          </h2>

          <p className="text-xs sm:text-sm text-slate-500">
            Thank you for shopping on ApniDukaan. A confirmation email and SMS have been sent to your registered contacts.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-[#0b8442]">
            <span>Order ID: {order.id}</span>
          </div>
        </div>

        {/* Delivery Timeline Progress */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <Truck className="w-4 h-4" />
              Delivery by {order.estimatedDeliveryDate}
            </span>
            <span className="text-[#388e3c] bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-black uppercase">
              CONFIRMED
            </span>
          </div>

          {/* Stepper Line */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] sm:text-xs">
            <div className="flex flex-col items-center gap-1 text-emerald-600 font-bold">
              <div className="w-6 h-6 rounded-full bg-[#388e3c] text-white flex items-center justify-center">✓</div>
              <span>Confirmed</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-500 font-medium">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">2</div>
              <span>Packed</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-500 font-medium">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">3</div>
              <span>Shipped</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-500 font-medium">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">4</div>
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Items Ordered ({order.items.length})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1">
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} className="pt-2 flex items-center gap-3 text-xs">
                <img src={product.image} alt={product.title} className="w-12 h-12 object-contain rounded p-1 bg-slate-50 border border-slate-200" />
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 line-clamp-1">{product.title}</h5>
                  <p className="text-slate-500">Qty: {quantity} • Brand: {product.brand}</p>
                </div>
                <span className="font-bold text-slate-900">{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Payment Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Delivery Address</span>
            <p className="font-bold text-slate-800">{order.address.name} ({order.address.phone})</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {order.address.address}, {order.address.locality}, {order.address.city} - {order.address.pincode}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Payment Details</span>
            <p className="font-bold text-slate-800">
              Method: <span className="text-[#0b8442]">{order.paymentMethod}</span>
            </p>
            <p className="text-slate-600 text-[11px]">
              Total Paid: <span className="font-bold text-slate-900">{formatPrice(order.totalAmount)}</span>
            </p>
            <p className="text-slate-400 text-[11px]">
              Transaction ID: {order.paymentDetails.transactionId}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleDownloadInvoice}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Invoice</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              View Orders
            </button>

            <button
              id="continue-shopping-success-btn"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2 bg-[#fb641b] hover:bg-[#e6550f] text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
