import React from 'react';
import { Order } from '../types';
import { UserProfile } from '../services/firebase';
import { X, Package, Truck, Download, ChevronRight, CheckCircle2, Smartphone, ShieldCheck, LogIn } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
  onOpenAuth
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="my-orders-modal"
        className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="bg-[#0b8442] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-lg font-bold leading-tight">My Orders ({orders.length})</h2>
              {currentUser?.phone ? (
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-medium">
                  <Smartphone className="w-3 h-3" />
                  <span>Activity for {currentUser.phone}</span>
                </p>
              ) : (
                <p className="text-[11px] text-emerald-100">Guest Order History</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity banner */}
        {currentUser ? (
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2 flex items-center justify-between text-xs text-emerald-900 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Account: <strong>{currentUser.displayName}</strong> ({currentUser.phone})</span>
            </div>
            <span className="text-[11px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded font-bold">
              Account Private
            </span>
          </div>
        ) : (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <span>You are browsing as Guest. Sign in with your mobile number to sync all past orders.</span>
            {onOpenAuth && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded text-xs flex items-center gap-1 cursor-pointer shrink-0 ml-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        )}

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center space-y-3 border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-base">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {currentUser?.phone 
                  ? `There are no previous orders associated with ${currentUser.phone}. Any purchases made on this number will appear here.`
                  : 'When you purchase products, your order history and tracking details will appear here.'}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4 hover:border-emerald-200 transition-colors"
              >
                {/* Order Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Order ID: {order.id}</span>
                    <p className="text-slate-400 text-[11px]">Placed on {order.date} • Paid via {order.paymentMethod}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Confirmed
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="space-y-3">
                  {order.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3 text-xs items-center">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-14 h-14 object-contain rounded p-1 bg-slate-50 border border-slate-100" 
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{product.title}</h4>
                        <p className="text-slate-500 text-[11px]">Qty: {quantity} • Brand: {product.brand}</p>
                        <p className="text-slate-700 font-semibold mt-0.5">{formatPrice(product.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking & Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <Truck className="w-4 h-4" />
                    <span>Expected Delivery: {order.estimatedDeliveryDate}</span>
                  </div>

                  <button
                    onClick={() => alert(`Tax invoice for Order ${order.id} downloaded.`)}
                    className="text-[#0b8442] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Invoice</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
