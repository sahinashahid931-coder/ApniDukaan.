// Pincode lookup utility with live postal API and offline prefix mapping

export interface PincodeLookupResult {
  success: boolean;
  city: string;
  state: string;
  district?: string;
  localities?: string[];
  message?: string;
}

// In-memory cache for fast repeated lookups
const pincodeCache = new Map<string, PincodeLookupResult>();

// Major Indian States list
export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

// Offline prefix to State & Capital/Major City fallback mapping
const PREFIX_FALLBACKS: Record<string, { state: string; city: string }> = {
  // Delhi
  '11': { state: 'Delhi', city: 'New Delhi' },
  // Haryana
  '12': { state: 'Haryana', city: 'Gurugram' },
  '13': { state: 'Haryana', city: 'Ambala' },
  // Punjab & Chandigarh
  '14': { state: 'Punjab', city: 'Ludhiana' },
  '15': { state: 'Punjab', city: 'Bathinda' },
  '16': { state: 'Chandigarh', city: 'Chandigarh' },
  // Himachal Pradesh
  '17': { state: 'Himachal Pradesh', city: 'Shimla' },
  // Jammu & Kashmir
  '18': { state: 'Jammu and Kashmir', city: 'Jammu' },
  '19': { state: 'Jammu and Kashmir', city: 'Srinagar' },
  // Uttar Pradesh & Uttarakhand
  '20': { state: 'Uttar Pradesh', city: 'Aligarh' },
  '21': { state: 'Uttar Pradesh', city: 'Allahabad' },
  '22': { state: 'Uttar Pradesh', city: 'Lucknow' },
  '23': { state: 'Uttar Pradesh', city: 'Varanasi' },
  '24': { state: 'Uttarakhand', city: 'Dehradun' },
  '25': { state: 'Uttar Pradesh', city: 'Meerut' },
  '26': { state: 'Uttar Pradesh', city: 'Bareilly' },
  '27': { state: 'Uttar Pradesh', city: 'Gorakhpur' },
  '28': { state: 'Uttar Pradesh', city: 'Agra' },
  // Rajasthan
  '30': { state: 'Rajasthan', city: 'Jaipur' },
  '31': { state: 'Rajasthan', city: 'Udaipur' },
  '32': { state: 'Rajasthan', city: 'Kota' },
  '33': { state: 'Rajasthan', city: 'Bikaner' },
  '34': { state: 'Rajasthan', city: 'Jodhpur' },
  // Gujarat
  '36': { state: 'Gujarat', city: 'Rajkot' },
  '37': { state: 'Gujarat', city: 'Kutch' },
  '38': { state: 'Gujarat', city: 'Ahmedabad' },
  '39': { state: 'Gujarat', city: 'Surat' },
  // Maharashtra & Goa
  '40': { state: 'Maharashtra', city: 'Mumbai' },
  '41': { state: 'Maharashtra', city: 'Pune' },
  '42': { state: 'Maharashtra', city: 'Nashik' },
  '43': { state: 'Maharashtra', city: 'Aurangabad' },
  '44': { state: 'Maharashtra', city: 'Nagpur' },
  // Madhya Pradesh & Chhattisgarh
  '45': { state: 'Madhya Pradesh', city: 'Indore' },
  '46': { state: 'Madhya Pradesh', city: 'Bhopal' },
  '47': { state: 'Madhya Pradesh', city: 'Gwalior' },
  '48': { state: 'Madhya Pradesh', city: 'Jabalpur' },
  '49': { state: 'Chhattisgarh', city: 'Raipur' },
  // Andhra Pradesh & Telangana
  '50': { state: 'Telangana', city: 'Hyderabad' },
  '51': { state: 'Andhra Pradesh', city: 'Tirupati' },
  '52': { state: 'Andhra Pradesh', city: 'Vijayawada' },
  '53': { state: 'Andhra Pradesh', city: 'Visakhapatnam' },
  // Karnataka
  '56': { state: 'Karnataka', city: 'Bengaluru' },
  '57': { state: 'Karnataka', city: 'Mangaluru' },
  '58': { state: 'Karnataka', city: 'Hubballi' },
  '59': { state: 'Karnataka', city: 'Belagavi' },
  // Tamil Nadu & Puducherry
  '60': { state: 'Tamil Nadu', city: 'Chennai' },
  '61': { state: 'Tamil Nadu', city: 'Thanjavur' },
  '62': { state: 'Tamil Nadu', city: 'Madurai' },
  '63': { state: 'Tamil Nadu', city: 'Vellore' },
  '64': { state: 'Tamil Nadu', city: 'Coimbatore' },
  // Kerala & Lakshadweep
  '67': { state: 'Kerala', city: 'Kozhikode' },
  '68': { state: 'Kerala', city: 'Kochi' },
  '69': { state: 'Kerala', city: 'Thiruvananthapuram' },
  // West Bengal, Sikkim, A&N
  '70': { state: 'West Bengal', city: 'Kolkata' },
  '71': { state: 'West Bengal', city: 'Howrah' },
  '72': { state: 'West Bengal', city: 'Midnapore' },
  '73': { state: 'West Bengal', city: 'Siliguri' },
  '74': { state: 'West Bengal', city: 'North 24 Parganas' },
  // Odisha
  '75': { state: 'Odisha', city: 'Bhubaneswar' },
  '76': { state: 'Odisha', city: 'Berhampur' },
  '77': { state: 'Odisha', city: 'Sambalpur' },
  // North East & Assam
  '78': { state: 'Assam', city: 'Guwahati' },
  '79': { state: 'Meghalaya', city: 'Shillong' },
  // Bihar & Jharkhand
  '80': { state: 'Bihar', city: 'Patna' },
  '81': { state: 'Bihar', city: 'Bhagalpur' },
  '82': { state: 'Bihar', city: 'Gaya' },
  '83': { state: 'Jharkhand', city: 'Ranchi' },
  '84': { state: 'Bihar', city: 'Muzaffarpur' },
  '85': { state: 'Bihar', city: 'Darbhanga' }
};

/**
 * Normalize state name to match official list
 */
function normalizeState(stateName: string): string {
  if (!stateName) return '';
  const clean = stateName.trim().toLowerCase();
  
  const found = INDIAN_STATES.find(s => s.toLowerCase() === clean);
  if (found) return found;

  if (clean.includes('karnataka')) return 'Karnataka';
  if (clean.includes('delhi')) return 'Delhi';
  if (clean.includes('maharashtra')) return 'Maharashtra';
  if (clean.includes('tamil nadu') || clean.includes('tamilnadu')) return 'Tamil Nadu';
  if (clean.includes('telangana')) return 'Telangana';
  if (clean.includes('andhra')) return 'Andhra Pradesh';
  if (clean.includes('west bengal') || clean.includes('bengal')) return 'West Bengal';
  if (clean.includes('uttar pradesh')) return 'Uttar Pradesh';
  if (clean.includes('uttarakhand')) return 'Uttarakhand';
  if (clean.includes('haryana')) return 'Haryana';
  if (clean.includes('punjab')) return 'Punjab';
  if (clean.includes('rajasthan')) return 'Rajasthan';
  if (clean.includes('gujarat')) return 'Gujarat';
  if (clean.includes('kerala')) return 'Kerala';
  if (clean.includes('madhya pradesh')) return 'Madhya Pradesh';
  if (clean.includes('bihar')) return 'Bihar';
  if (clean.includes('jharkhand')) return 'Jharkhand';
  if (clean.includes('odisha') || clean.includes('orissa')) return 'Odisha';
  if (clean.includes('assam')) return 'Assam';
  if (clean.includes('goa')) return 'Goa';
  if (clean.includes('chandigarh')) return 'Chandigarh';

  return stateName.trim();
}

/**
 * Fetch city and state automatically from 6-digit Indian PIN code
 */
export async function lookupPincode(pincode: string): Promise<PincodeLookupResult> {
  const clean = pincode.replace(/\D/g, '').trim();
  if (clean.length !== 6) {
    return {
      success: false,
      city: '',
      state: '',
      message: 'PIN code must be exactly 6 digits'
    };
  }

  // Check cache first
  if (pincodeCache.has(clean)) {
    return pincodeCache.get(clean)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
        const offices = data[0].PostOffice;
        const firstOffice = offices[0];
        
        const rawDistrict = firstOffice.District || firstOffice.Block || firstOffice.Circle || '';
        const rawState = firstOffice.State || '';
        const normState = normalizeState(rawState);
        const city = rawDistrict.replace(/district/i, '').trim();

        const localities = offices
          .map((o: { Name?: string }) => o.Name?.trim())
          .filter(Boolean) as string[];

        const result: PincodeLookupResult = {
          success: true,
          city: city || 'City Center',
          state: normState || rawState,
          district: city,
          localities: Array.from(new Set(localities))
        };

        pincodeCache.set(clean, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Live postal API lookup failed, using offline lookup table:', err);
  }

  // Offline fallback via prefix
  const prefix2 = clean.slice(0, 2);
  const fallback = PREFIX_FALLBACKS[prefix2];
  if (fallback) {
    const result: PincodeLookupResult = {
      success: true,
      city: fallback.city,
      state: fallback.state,
      district: fallback.city
    };
    pincodeCache.set(clean, result);
    return result;
  }

  return {
    success: false,
    city: '',
    state: '',
    message: 'Could not automatically identify district for this pincode'
  };
}
