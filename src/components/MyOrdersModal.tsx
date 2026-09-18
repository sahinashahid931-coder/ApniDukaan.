import React from 'react';
import { Order } from '../types';
import { X, Package, Truck, Download, ChevronRight, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders
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
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <h2 className="text-lg font-bold">My Orders ({orders.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center space-y-3 border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500">When you purchase products, your order history and tracking details will appear here.</p>
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
