import { Product } from '../types';

export const CATEGORIES = [
  {
    id: 'all',
    name: 'Top Offers',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150&auto=format&fit=crop&q=80',
    subcategories: ['Festive Deals', 'Under ₹499', 'Clearance Sale', 'Mega Brand Days']
  },
  {
    id: 'mobiles',
    name: 'Mobiles',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=80',
    subcategories: ['Apple', 'Samsung', 'OnePlus', 'Google Pixel', 'Budget 5G Phones']
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&auto=format&fit=crop&q=80',
    subcategories: ['Laptops', 'Headphones', 'Smartwatches', 'Tablets', 'Gaming Accessories']
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=150&auto=format&fit=crop&q=80',
    subcategories: ["Men's Wear", "Women's Ethnic", 'Footwear', 'Watches & Bags', 'Winter Wear']
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: 'Tv',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=150&auto=format&fit=crop&q=80',
    subcategories: ['Smart TVs', 'Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves']
  },
  {
    id: 'home',
    name: 'Home & Furniture',
    icon: 'Sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=80',
    subcategories: ['Sofas & Chairs', 'Beds & Mattresses', 'Kitchen & Dining', 'Home Decor', 'Lighting']
  },
  {
    id: 'beauty',
    name: 'Beauty, Toys & More',
    icon: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80',
    subcategories: ['Skincare', 'Fragrances', 'Action Toys', 'Board Games', 'Grooming Essentials']
  },
  {
    id: 'grocery',
    name: 'Grocery',
    icon: 'ShoppingBasket',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    subcategories: ['Staples', 'Beverages', 'Dry Fruits & Nuts', 'Snacks & Packaged Food', 'Personal Care']
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'mob-1',
    title: 'Apple iPhone 15 (Black, 128 GB)',
    brand: 'Apple',
    category: 'mobiles',
    subcategory: 'Apple',
    price: 64999,
    originalPrice: 79900,
    discountPercent: 18,
    rating: 4.7,
    ratingCount: 84320,
    reviewsCount: 4210,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 100,
    highlights: [
      '128 GB ROM',
      '15.49 cm (6.1 inch) Super Retina XDR Display',
      '48MP + 12MP Dual Rear Camera | 12MP Front Camera',
      'A16 Bionic Chip, 6 Core Processor',
      'Dynamic Island & Ceramic Shield Protection'
    ],
    specs: {
      'Model Name': 'iPhone 15',
      'Color': 'Black',
      'Storage': '128 GB',
      'Display': '6.1 inch OLED Super Retina XDR',
      'Processor': 'A16 Bionic Chip',
      'Primary Camera': '48 MP Main + 12 MP Ultra Wide',
      'Secondary Camera': '12 MP TrueDepth',
      'Battery': 'Up to 20 hours video playback',
      'Warranty': '1 Year Manufacturer Warranty'
    },
    offers: [
      'Bank Offer: 10% Instant Discount up to ₹1,500 on HDFC Bank Credit Cards',
      'Special Price: Extra ₹5,000 off on exchange of old smartphone',
      'No Cost EMI: Starting from ₹5,417/month on major credit cards',
      'Partner Offer: Free 3 Months Spotify Premium subscription'
    ],
    description: 'Experience innovation like never before with iPhone 15. Featuring the groundbreaking Dynamic Island, a high-resolution 48MP main camera with 2x Telephoto, and an all-day battery life encased in durable color-infused glass.'
  },
  {
    id: 'mob-2',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    brand: 'Samsung',
    category: 'mobiles',
    subcategory: 'Samsung',
    price: 119999,
    originalPrice: 134999,
    discountPercent: 11,
    rating: 4.8,
    ratingCount: 32150,
    reviewsCount: 1890,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 150,
    highlights: [
      '12 GB RAM | 256 GB ROM',
      '17.27 cm (6.8 inch) Quad HD+ Dynamic AMOLED 2X Display',
      '200MP + 50MP + 12MP + 10MP Quad Camera | 12MP Front',
      'Snapdragon 8 Gen 3 for Galaxy Processor',
      'Built-in S-Pen & Galaxy AI Features'
    ],
    specs: {
      'Model Name': 'Galaxy S24 Ultra 5G',
      'Color': 'Titanium Gray',
      'RAM & Storage': '12 GB RAM | 256 GB ROM',
      'Display': '6.8 inch Dynamic AMOLED 2X, 120Hz',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3',
      'Rear Camera': '200MP Wide + 50MP Periscope + 12MP Ultra-wide + 10MP Telephoto',
      'Battery': '5000 mAh with 45W Fast Charging',
      'Warranty': '1 Year Brand Warranty'
    },
    offers: [
      'Bank Offer: Flat ₹6,000 Instant Discount on ICICI & SBI Cards',
      'Exchange Bonus: Additional ₹10,000 off on eligible flagships',
      'No Cost EMI: Available up to 18 months'
    ],
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra, unleash your creativity and productivity. Built with a robust titanium frame and unmatched 200MP optical zoom camera.'
  },
  {
    id: 'mob-3',
    title: 'OnePlus 12 5G (Silky Black, 256 GB)',
    brand: 'OnePlus',
    category: 'mobiles',
    subcategory: 'OnePlus',
    price: 54999,
    originalPrice: 64999,
    discountPercent: 15,
    rating: 4.6,
    ratingCount: 19400,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 80,
    highlights: [
      '12 GB RAM | 256 GB ROM',
      '17.32 cm (6.82 inch) ProXDR 120Hz Display',
      '50MP + 48MP + 64MP 4th Gen Hasselblad Camera',
      'Snapdragon 8 Gen 3 Mobile Platform',
      '100W SUPERVOOC Fast Charging'
    ],
    specs: {
      'Model Name': 'OnePlus 12 5G',
      'Display': '6.82 inch 2K 120Hz LTPO ProXDR',
      'Battery': '5400 mAh dual-cell',
      'Charging': '100W Wired + 50W Wireless AIRVOOC',
      'Processor': 'Snapdragon 8 Gen 3',
      'Warranty': '1 Year on Phone, 6 Months on Accessories'
    },
    offers: [
      'Bank Offer: ₹3,000 Instant Discount on Axis Bank Cards',
      'Special Offer: Free OnePlus Protective Case included'
    ],
    description: 'Powered by the Trinity Engine and Hasselblad camera system, the OnePlus 12 sets the benchmark for ultra-fast, smooth performance and breathtaking mobile photography.'
  },
  {
    id: 'elec-1',
    title: 'Apple MacBook Air M3 (13.6 inch, 8GB RAM, 256GB SSD, Space Grey)',
    brand: 'Apple',
    category: 'electronics',
    subcategory: 'Laptops',
    price: 94990,
    originalPrice: 114900,
    discountPercent: 17,
    rating: 4.8,
    ratingCount: 12500,
    reviewsCount: 780,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 120,
    highlights: [
      'Apple M3 chip with 8-core CPU and 8-core GPU',
      '8 GB Unified Memory | 256 GB Superfast SSD Storage',
      '34.46 cm (13.6-inch) Liquid Retina display with True Tone',
      '1080p FaceTime HD camera, Three-mic array, Four-speaker sound',
      'Up to 18 hours battery life, MagSafe 3 charging'
    ],
    specs: {
      'Processor': 'Apple M3 Chip (8-Core CPU)',
      'Display': '13.6 inch 2560x1664 Liquid Retina 500 nits',
      'Operating System': 'macOS Sonoma',
      'Weight': '1.24 kg ultralight design',
      'Ports': 'MagSafe 3, 2x Thunderbolt / USB 4, 3.5mm headphone jack'
    },
    offers: [
      'Bank Offer: ₹5,000 Flat Discount on HDFC Credit Cards',
      'Student Offer: ₹2,000 Extra discount on valid college ID'
    ],
    description: 'The world’s most popular laptop is better than ever with the M3 chip. Super-portable, lightning fast, and whisper quiet with fanless design.'
  },
  {
    id: 'elec-2',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones (Silver)',
    brand: 'Sony',
    category: 'electronics',
    subcategory: 'Headphones',
    price: 26990,
    originalPrice: 34990,
    discountPercent: 22,
    rating: 4.7,
    ratingCount: 18450,
    reviewsCount: 1940,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 50,
    highlights: [
      'Industry-leading Noise Cancellation with two processors & 8 mics',
      'Magnificent sound engineered with High-Resolution Audio',
      'Up to 30 hours battery life with quick charge (3 min charge = 3 hrs playback)',
      'Crystal clear hands-free calling with 4 beamforming mics',
      'Multipoint connection: Connect to two Bluetooth devices simultaneously'
    ],
    specs: {
      'Type': 'Over Ear Wireless Headphone',
      'Bluetooth': 'Version 5.2 with LDAC / AAC / SBC',
      'Battery Life': '30 Hours (NC ON), 40 Hours (NC OFF)',
      'Weight': '250 g',
      'Warranty': '1 Year Domestic Warranty'
    },
    offers: [
      'Bank Offer: 10% Instant Discount up to ₹1,500 on ICICI Bank Cards',
      'Combo Offer: Buy with carrying case and save ₹500'
    ],
    description: 'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Featuring two processors and eight microphones for unprecedented noise cancellation.'
  },
  {
    id: 'elec-3',
    title: 'ASUS ROG Zephyrus G16 (2024) OLED Gaming Laptop',
    brand: 'ASUS',
    category: 'electronics',
    subcategory: 'Laptops',
    price: 169990,
    originalPrice: 209990,
    discountPercent: 19,
    rating: 4.9,
    ratingCount: 4200,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 200,
    highlights: [
      'Intel Core Ultra 9 185H Processor (AI Boost NPU)',
      '16 GB LPDDR5X RAM | 1 TB PCIe 4.0 NVMe SSD',
      'NVIDIA GeForce RTX 4070 8GB GDDR6 Graphics',
      '16.0-inch 2.5K (240Hz, 0.2ms) ROG Nebula OLED Display',
      'Slash Lighting CNC Aluminum Chassis | 1.85 kg'
    ],
    specs: {
      'Processor': 'Intel Core Ultra 9 185H (16 Cores, 22 Threads)',
      'Graphics': 'NVIDIA GeForce RTX 4070 (105W TGP)',
      'Display': '16" 2.5K OLED, 100% DCI-P3, G-SYNC',
      'Storage': '1 TB M.2 NVMe SSD',
      'Cooling': 'ROG Intelligent Cooling with Liquid Metal',
      'Warranty': '1 Year Onsite Warranty + 1 Year Accidental Damage'
    },
    offers: [
      'Bank Offer: Flat ₹7,500 off on Credit Card transactions',
      'Bonus: 3 Months PC Game Pass included'
    ],
    description: 'Precision gaming meets ultra-sleek craftsmanship. Zephyrus G16 brings unparalleled OLED visuals, AI computing, and elite graphics inside an ultra-slim aluminum body.'
  },
  {
    id: 'elec-4',
    title: 'boAt Nirvana Ion ANC True Wireless Earbuds (Charcoal Black)',
    brand: 'boAt',
    category: 'electronics',
    subcategory: 'Headphones',
    price: 2499,
    originalPrice: 9990,
    discountPercent: 75,
    rating: 4.3,
    ratingCount: 148200,
    reviewsCount: 14200,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 20,
    highlights: [
      'Active Noise Cancellation up to 32dB',
      'Massive 120 Hours Total Playtime (24 hours per charge)',
      'Crystal Bionic Sound powered by HiFi DSP',
      'Quad Mics with ENx Technology for crystal calls',
      'BEAST Mode with 60ms Ultra Low Latency'
    ],
    specs: {
      'Driver Size': '10mm dual drivers',
      'Battery': 'Up to 120 hours total playback',
      'IP Rating': 'IPX4 Water & Sweat Resistance',
      'Bluetooth': 'v5.2',
      'Warranty': '1 Year Replacement Warranty'
    },
    offers: [
      'Special Price: Extra 10% off at checkout',
      'Buy 2 get extra 5% off'
    ],
    description: 'Immerse yourself in uninterrupted high-fidelity sound. With an extraordinary 120 hours of battery life and active noise cancellation, boAt Nirvana Ion is built for audiophiles.'
  },
  {
    id: 'fash-1',
    title: "Levi's Men's 511 Slim Fit Mid-Rise Stretchable Jeans (Dark Indigo)",
    brand: "Levi's",
    category: 'fashion',
    subcategory: "Men's Wear",
    price: 2199,
    originalPrice: 3999,
    discountPercent: 45,
    rating: 4.4,
    ratingCount: 28400,
    reviewsCount: 1950,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 25,
    highlights: [
      'Fit: Slim Fit through hip and thigh',
      'Fabric: 99% Cotton, 1% Elastane Stretch Denim',
      'Fly: Zip fly with button closure',
      'Pockets: Classic 5-pocket styling',
      'Care: Machine wash cold inside out'
    ],
    specs: {
      'Style Code': '04511-2098',
      'Fabric': 'Cotton Lycra Blend',
      'Rise': 'Mid Rise',
      'Distress': 'Clean Look',
      'Ideal For': 'Men'
    },
    offers: [
      'Buy More Save More: Buy 2 get 10% off',
      'Bank Offer: 5% Cashback on ApniDukaan Axis Bank Card'
    ],
    description: 'A modern slim with room to move. The 511 Slim Fit Jeans are a classic since right now. These jeans sit below your waist with a slim fit from hip to ankle.'
  },
  {
    id: 'fash-2',
    title: 'Nike Air Max SC Lifestyle Running Sneakers (White & Obsidian)',
    brand: 'Nike',
    category: 'fashion',
    subcategory: 'Footwear',
    price: 4995,
    originalPrice: 7495,
    discountPercent: 33,
    rating: 4.6,
    ratingCount: 39500,
    reviewsCount: 3100,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 40,
    highlights: [
      'Max Air unit delivers lightweight cushioning throughout the day',
      'Leather, textile and mesh combine for durable, breathable construction',
      'Rubber outsole provides traction and durability',
      'Flex grooves in sole let your foot move naturally'
    ],
    specs: {
      'Closure': 'Lace-Up',
      'Upper Material': 'Mesh and Genuine Leather',
      'Sole Material': 'Rubber Air Cushion',
      'Ideal For': 'Men & Unisex Casual / Running'
    },
    offers: [
      'Bank Offer: Extra ₹500 off on Debit Card transaction',
      'Special Price: Get Free Nike Sports Socks on purchase'
    ],
    description: 'With its easy-going lines, heritage track look and visible Air cushioning, the Nike Air Max SC is the ideal finish to any outfit.'
  },
  {
    id: 'fash-3',
    title: 'Puma Men Full Sleeve Solid Hooded Sweatshirt (Puma Black)',
    brand: 'Puma',
    category: 'fashion',
    subcategory: "Men's Wear",
    price: 1499,
    originalPrice: 3499,
    discountPercent: 57,
    rating: 4.3,
    ratingCount: 16200,
    reviewsCount: 1100,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 15,
    highlights: [
      'Regular fit with kangaroo pocket',
      'Jersey-lined hood with adjustable drawcord',
      'Ribbed cuffs and hem for comfort and fit',
      'Bold Puma Cat logo on the chest'
    ],
    specs: {
      'Fabric': '68% Cotton, 32% Recycled Polyester French Terry',
      'Pattern': 'Solid',
      'Neck': 'Hooded',
      'Sleeve': 'Full Sleeve'
    },
    offers: [
      'Combo: Buy 2 get extra ₹300 off',
      'Flat 10% instant discount on Axis Bank cards'
    ],
    description: 'Stay cozy in iconic athletic style with this Puma Essentials hoodie. Premium fleece blend ensures maximum warmth and casual versatility.'
  },
  {
    id: 'app-1',
    title: 'LG 55 inch Ultra HD (4K) OLED Smart WebOS TV (OLED55C3PSA)',
    brand: 'LG',
    category: 'appliances',
    subcategory: 'Smart TVs',
    price: 114990,
    originalPrice: 174990,
    discountPercent: 34,
    rating: 4.8,
    ratingCount: 8900,
    reviewsCount: 1250,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 150,
    highlights: [
      'Self-Lighting OLED Pixels with Infinite Contrast',
      'α9 AI Processor Gen6 with 4K Super Upscaling',
      'Dolby Vision IQ and Dolby Atmos Cinematic Sound',
      '0.1ms Response Time, 120Hz Refresh Rate, G-Sync & FreeSync',
      'WebOS 23 with ThinQ AI and Magic Remote'
    ],
    specs: {
      'Screen Size': '139 cm (55 inch)',
      'Resolution': 'Ultra HD (4K) 3840 x 2160 Pixels',
      'Sound Output': '40W (2.2 Channel)',
      'HDMI Ports': '4 x HDMI 2.1 (4K 120Hz support)',
      'Warranty': '3 Years Comprehensive Brand Warranty'
    },
    offers: [
      'Bank Offer: Flat ₹9,000 off on HDFC & SBI Credit Cards',
      'Free Installation: Guaranteed within 24 hours of delivery'
    ],
    description: 'The LG OLED C3 brings brilliance to cinema and gaming. Enjoy pure blacks, radiant colors, and ultra-fluid gameplay driven by the α9 Gen6 AI processor.'
  },
  {
    id: 'app-2',
    title: 'Samsung 253L 3-Star Digital Inverter Frost Free Double Door Refrigerator',
    brand: 'Samsung',
    category: 'appliances',
    subcategory: 'Refrigerators',
    price: 24990,
    originalPrice: 31990,
    discountPercent: 21,
    rating: 4.5,
    ratingCount: 52100,
    reviewsCount: 4600,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 50,
    highlights: [
      'Digital Inverter Technology for 50% energy savings & quiet operation',
      'Moist Fresh Zone keeps fruits and vegetables fresh for longer',
      'Easy Slide Shelf for easy reach of food items',
      'Stabilizer Free Operation (100V - 300V)',
      'Toughened Glass Shelves holding up to 175 kg'
    ],
    specs: {
      'Capacity': '253 Liters',
      'Energy Rating': '3 Star (2024)',
      'Defrosting Type': 'Frost Free',
      'Compressor Warranty': '20 Years Warranty on Digital Inverter Compressor'
    },
    offers: [
      'Bank Offer: Extra ₹1,500 off on Credit/Debit Cards',
      'Exchange Offer: Up to ₹3,500 off on old refrigerator'
    ],
    description: 'Smart, energy-efficient, and spacious. Samsung 253L Double Door Refrigerator ensures even cooling in every corner with minimal electricity consumption.'
  },
  {
    id: 'app-3',
    title: 'Dyson V12 Detect Slim Cordless Vacuum Cleaner (Yellow/Nickel)',
    brand: 'Dyson',
    category: 'appliances',
    subcategory: 'Microwaves',
    price: 49900,
    originalPrice: 65900,
    discountPercent: 24,
    rating: 4.7,
    ratingCount: 6800,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 90,
    highlights: [
      'Fluffy Optic cleaner head reveals invisible dust on hard floors',
      'Piezo sensor counts and measures the size of dust particles',
      'Scientific proof of deep cleaning on LCD screen',
      'Dyson Hyperdymium motor spins up to 125,000rpm',
      'Up to 60 minutes run time with click-in battery'
    ],
    specs: {
      'Suction Power': '150 AW',
      'Bin Volume': '0.35 L',
      'Run Time': '60 minutes',
      'Weight': '2.2 kg ultra lightweight'
    },
    offers: [
      'Bank Offer: ₹3,000 instant discount on all cards',
      'No Cost EMI: ₹4,158/month for 12 months'
    ],
    description: 'The most powerful lightweight cordless vacuum. Engineered with laser illumination to reveal microscopic dust and intelligent suction power regulation.'
  },
  {
    id: 'home-1',
    title: 'Wakefit Orthopedic Memory Foam 6-inch King Size Mattress',
    brand: 'Wakefit',
    category: 'home',
    subcategory: 'Beds & Mattresses',
    price: 12999,
    originalPrice: 19999,
    discountPercent: 35,
    rating: 4.6,
    ratingCount: 76000,
    reviewsCount: 8900,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 30,
    highlights: [
      'Next-Gen High Resilience foam and Body-conforming memory foam',
      'Differential pressure distribution for spine alignment and back pain relief',
      'Breathable premium knitted fabric cover with zipper',
      'Zero partner disturbance technology',
      '100 Nights Risk-Free Trial'
    ],
    specs: {
      'Size': 'King (78 x 72 x 6 inches)',
      'Comfort Level': 'Medium Firm',
      'Mattress Material': 'Next-Gen Memory Foam + HR Foam',
      'Warranty': '10 Years Manufacturer Warranty'
    },
    offers: [
      'Special Price: Flat ₹1,000 instant coupon discount',
      'Free 2 Memory Foam Pillows worth ₹1,998 included'
    ],
    description: 'Engineered for restorative deep sleep. Wakefit Orthopedic Memory Foam adapts to your natural spine curvature, relieving joint stress for refreshed mornings.'
  },
  {
    id: 'home-2',
    title: 'Solid Sheesham Wood TV Entertainment Unit with Storage (Walnut Finish)',
    brand: 'Urban Ladder',
    category: 'home',
    subcategory: 'Sofas & Chairs',
    price: 15499,
    originalPrice: 24999,
    discountPercent: 38,
    rating: 4.5,
    ratingCount: 14200,
    reviewsCount: 1640,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: false,
    superCoins: 40,
    highlights: [
      'Crafted from 100% Genuine Seasoned Sheesham Wood (Rosewood)',
      'Accommodates TVs up to 65 inches with cable management slots',
      '2 spacious drawers + 2 open media console compartments',
      'Handcrafted natural wood grain texture with rich walnut finish'
    ],
    specs: {
      'Dimensions': '150 cm x 40 cm x 50 cm (L x W x H)',
      'Primary Material': 'Solid Wood (Sheesham)',
      'Finish Color': 'Walnut Brown',
      'Pre-assembled': 'No, DIY with carpenter support available'
    },
    offers: [
      'Bank Offer: 10% instant discount on ICICI cards',
      'Free Delivery & Professional Assembly Included'
    ],
    description: 'Elevate your living room aesthetics. This timeless solid Sheesham wood entertainment center balances artisan elegance with robust electronics organization.'
  },
  {
    id: 'beauty-1',
    title: 'Philips OneBlade Pro Hybrid Beard Trimmer & Shaver (QP6530/15)',
    brand: 'Philips',
    category: 'beauty',
    subcategory: 'Grooming Essentials',
    price: 3499,
    originalPrice: 4995,
    discountPercent: 30,
    rating: 4.6,
    ratingCount: 42100,
    reviewsCount: 3800,
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 20,
    highlights: [
      'Trim, edge, and shave any length of hair without nicks',
      'Unique OneBlade technology with fast-moving cutter (200x per second)',
      'Precision comb with 12 length settings (0.5 to 9mm)',
      'Rechargeable Li-ion battery gives 90 mins performance from 1 hour charge',
      '100% water resistant: Wet & dry usage'
    ],
    specs: {
      'Blade Material': 'Stainless Steel Dual-sided',
      'Battery Run Time': '90 mins',
      'Charging Time': '1 hour full charge',
      'Warranty': '2 Years Worldwide Guarantee'
    },
    offers: [
      'Extra 5% off on prepaid orders',
      'Free replacement blade coupon for 6 months'
    ],
    description: 'The Philips OneBlade Pro is a revolutionary hybrid styler. It does not shave as close as a traditional blade, keeping your skin comfortable and bump-free.'
  },
  {
    id: 'beauty-2',
    title: 'LEGO Technic Mercedes-AMG F1 W14 E Performance Building Set',
    brand: 'LEGO',
    category: 'beauty',
    subcategory: 'Action Toys',
    price: 18999,
    originalPrice: 22999,
    discountPercent: 17,
    rating: 4.9,
    ratingCount: 3100,
    reviewsCount: 410,
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 60,
    highlights: [
      'Authentic 1:8 scale model of the Mercedes-AMG F1 W14 race car',
      'Working steering, differential, slick tires, and moving V6 pistons',
      'Opening wing inspired by the real world car DRS system',
      '1,642 precision pieces for passionate motorsport fans'
    ],
    specs: {
      'Piece Count': '1,642 Pieces',
      'Age Recommendation': '18+ Collector Edition',
      'Model Number': '42171',
      'Dimensions': '63 cm Long x 26 cm Wide'
    },
    offers: [
      'Bank Offer: ₹1,500 instant discount on Axis Bank cards',
      'Free collectible display stand included'
    ],
    description: 'Channel your inner champion with this intricate LEGO Technic model. Replicate the engineering marvel of the Mercedes-AMG Petronas F1 car with moving internal mechanics.'
  },
  {
    id: 'groc-1',
    title: 'California Premium Jumbo Almonds 1kg (100% Natural & Crunchy)',
    brand: 'Happilo',
    category: 'grocery',
    subcategory: 'Dry Fruits & Nuts',
    price: 799,
    originalPrice: 1299,
    discountPercent: 38,
    rating: 4.5,
    ratingCount: 89000,
    reviewsCount: 7800,
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 10,
    highlights: [
      'Rich in Vitamin E, Magnesium, Protein, and Dietary Fiber',
      '100% Raw, Vegan, Gluten-Free and Non-GMO',
      'Vacuum-sealed pouch for locked-in crispness and aroma',
      'Zero cholesterol and zero trans fats'
    ],
    specs: {
      'Quantity': '1 kg',
      'Container Type': 'Resealable Zip Pouch',
      'Origin': 'California, USA',
      'Shelf Life': '12 Months'
    },
    offers: [
      'Buy 2 packs and get extra 8% off',
      'Bank Offer: 5% unlimited cashback with ApniDukaan Axis Bank Credit Card'
    ],
    description: 'Start your morning with brain-nourishing energy. Happilo Premium California Almonds deliver unmatched crunch, wholesome flavor, and dense vital nutrients.'
  },
  {
    id: 'groc-2',
    title: 'Tata Tea Gold Premium Black Tea with 15% Long Leaves, 1kg Pouch',
    brand: 'Tata Tea',
    category: 'grocery',
    subcategory: 'Beverages',
    price: 485,
    originalPrice: 620,
    discountPercent: 21,
    rating: 4.7,
    ratingCount: 112000,
    reviewsCount: 9300,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    assured: true,
    inStock: true,
    fastDelivery: true,
    superCoins: 8,
    highlights: [
      'Exquisite blend of rich CTC tea and 15% gently rolled long tea leaves',
      'Delivers unmatched irresistible aroma and rich full-bodied taste',
      'Carefully harvested from the pristine slopes of Assam',
      'Packaged in freshness-retaining multi-layer pack'
    ],
    specs: {
      'Quantity': '1 kg',
      'Tea Form': 'Leaves & CTC Granules',
      'Flavor': 'Natural Assam Tea Flavor'
    },
    offers: [
      'SuperSaver: Buy 2 get 10% off',
      'Free Delivery on grocery carts above ₹399'
    ],
    description: 'Awaken your senses with the rich taste and uplifting aroma of Tata Tea Gold, crafted with an exquisite blend of high-grown CTC tea leaves and hand-selected long leaves.'
  }
];

export const POPULAR_SEARCH_TAGS = [
  'iPhone 15',
  'MacBook Air M3',
  'Samsung S24 Ultra',
  'Wireless Earbuds',
  'OLED Smart TV',
  'Air Max Sneakers',
  'Smartwatch',
  'Dry Fruits 1kg'
];
