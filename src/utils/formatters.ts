export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateSavings = (price: number, originalPrice: number): number => {
  return Math.max(0, originalPrice - price);
};

export const getEstimatedDeliveryDate = (fastDelivery: boolean = true): string => {
  const date = new Date();
  const daysToAdd = fastDelivery ? 1 : 3;
  date.setDate(date.getDate() + daysToAdd);
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  return `${fastDelivery ? 'Tomorrow' : date.toLocaleDateString('en-US', options)}, by 9 PM`;
};

export const formatCardNumber = (value: string): string => {
  const clean = value.replace(/\D/g, '').substring(0, 16);
  const groups = clean.match(/.{1,4}/g);
  return groups ? groups.join(' ') : clean;
};

export const formatExpiry = (value: string): string => {
  const clean = value.replace(/\D/g, '').substring(0, 4);
  if (clean.length >= 3) {
    return `${clean.substring(0, 2)}/${clean.substring(2)}`;
  }
  return clean;
};
