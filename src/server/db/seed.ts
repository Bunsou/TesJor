import "dotenv/config";
import { db } from "./index";
import { listings, type NewListing } from "./schema";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Sample Listings Data
const sampleListings: NewListing[] = [
  // ========================================
  // PLACES
  // ========================================
  {
    slug: generateSlug("Kampot Pepper Farm"),
    category: "place",
    tags: ["farm", "agriculture", "tour", "kampot"],
    title: "Kampot Pepper Farm",
    titleKh: "កសិដ្ឋាន​ម្រេច​កំពត",
    description:
      "Experience the world-famous Kampot pepper plantation. Learn about traditional farming methods and taste the finest peppercorns grown on red soil. Take a guided tour through the farm and discover why Kampot pepper has geographical indication status.",
    addressText: "Kampot Province, Cambodia",
    lat: 10.6104,
    lng: 104.1886,
    mainImage: "/default-image/place.png",
    priceLevel: "$",
    priceDetails: [
      { label: "Tour & Tasting", price: "5", currency: "USD" },
      { label: "Locals", price: "3", currency: "USD" },
    ],
    operatingHours: {
      monday: [{ open: "08:00", close: "17:00" }],
      tuesday: [{ open: "08:00", close: "17:00" }],
      wednesday: [{ open: "08:00", close: "17:00" }],
      thursday: [{ open: "08:00", close: "17:00" }],
      friday: [{ open: "08:00", close: "17:00" }],
      saturday: [{ open: "08:00", close: "17:00" }],
      sunday: [{ open: "08:00", close: "17:00" }],
    },
    contactInfo: {
      phone: "+855 12 345 678",
      facebook: "https://facebook.com/kampotpepper",
    },
    googlePlaceId: "ChIJ_placeholder_1",
  },
  {
    slug: generateSlug("Battambang Bamboo Train"),
    category: "place",
    tags: ["transport", "adventure", "unique", "battambang"],
    title: "Battambang Bamboo Train",
    titleKh: "រថភ្លើងឬស្សីបាត់ដំបង",
    description:
      "Ride the unique bamboo train (Norry) through rice fields and villages. A thrilling journey on bamboo platforms powered by small motors. This iconic Cambodian experience is a must-do when visiting Battambang.",
    addressText: "O Dambang, Battambang Province, Cambodia",
    lat: 13.0811,
    lng: 103.1991,
    mainImage: "/default-image/event.png",
    priceLevel: "$",
    priceDetails: [{ label: "Round Trip", price: "5", currency: "USD" }],
    operatingHours: {
      monday: [{ open: "07:00", close: "18:00" }],
      tuesday: [{ open: "07:00", close: "18:00" }],
      wednesday: [{ open: "07:00", close: "18:00" }],
      thursday: [{ open: "07:00", close: "18:00" }],
      friday: [{ open: "07:00", close: "18:00" }],
      saturday: [{ open: "07:00", close: "18:00" }],
      sunday: [{ open: "07:00", close: "18:00" }],
    },
    googlePlaceId: "ChIJ_placeholder_2",
  },
  {
    slug: generateSlug("Koh Ker Temple Complex"),
    category: "place",
    tags: ["temple", "ancient", "history", "unesco"],
    title: "Koh Ker Temple Complex",
    titleKh: "ប្រាសាទកោះកេរ",
    description:
      "Ancient Khmer temple complex far from tourist crowds. Climb the 7-tiered pyramid for stunning forest views. Built in the 10th century as the capital of the Khmer Empire, Koh Ker offers a mysterious and uncrowded alternative to Angkor Wat.",
    addressText:
      "Srayong Commune, Kulen District, Preah Vihear Province, Cambodia",
    lat: 13.7885,
    lng: 104.5311,
    mainImage: "/default-image/place.png",
    priceLevel: "$$",
    priceDetails: [
      { label: "Foreigners", price: "10", currency: "USD" },
      { label: "Cambodians", price: "5000", currency: "KHR" },
    ],
    operatingHours: {
      monday: [{ open: "07:30", close: "17:30" }],
      tuesday: [{ open: "07:30", close: "17:30" }],
      wednesday: [{ open: "07:30", close: "17:30" }],
      thursday: [{ open: "07:30", close: "17:30" }],
      friday: [{ open: "07:30", close: "17:30" }],
      saturday: [{ open: "07:30", close: "17:30" }],
      sunday: [{ open: "07:30", close: "17:30" }],
    },
    googlePlaceId: "ChIJ_placeholder_3",
  },
  {
    slug: generateSlug("Kampong Phluk Floating Village"),
    category: "place",
    tags: ["village", "lake", "culture", "tonle-sap"],
    title: "Kampong Phluk Floating Village",
    titleKh: "ភូមិអណ្តែតកំពង់ផ្លុក",
    description:
      "Traditional stilt village on Tonle Sap Lake. Houses rise up to 10 meters during wet season. Authentic local life experience with boat tours through mangrove forests and the opportunity to see fishermen at work.",
    addressText:
      "Kampong Phluk, Prasat Bakong District, Siem Reap Province, Cambodia",
    lat: 12.8758,
    lng: 104.0514,
    mainImage: "/default-image/place.png",
    priceLevel: "$$",
    priceDetails: [{ label: "Boat Tour", price: "20", currency: "USD" }],
    operatingHours: {
      monday: [{ open: "06:00", close: "18:00" }],
      tuesday: [{ open: "06:00", close: "18:00" }],
      wednesday: [{ open: "06:00", close: "18:00" }],
      thursday: [{ open: "06:00", close: "18:00" }],
      friday: [{ open: "06:00", close: "18:00" }],
      saturday: [{ open: "06:00", close: "18:00" }],
      sunday: [{ open: "06:00", close: "18:00" }],
    },
    googlePlaceId: "ChIJ_placeholder_4",
  },
  {
    slug: generateSlug("Bokor Hill Station"),
    category: "place",
    tags: ["mountain", "history", "colonial", "kampot"],
    title: "Bokor Hill Station",
    titleKh: "ស្ថានីយ៍ភ្នំបូកគោ",
    description:
      "Abandoned French colonial hill station shrouded in mist. Eerie atmosphere with old casino and church ruins. The misty mountain climate and ghostly buildings create a unique and mysterious experience.",
    addressText: "Bokor National Park, Kampot Province, Cambodia",
    lat: 10.6333,
    lng: 104.05,
    mainImage: "/default-image/place.png",
    priceLevel: "Free",
    operatingHours: {},
    googlePlaceId: "ChIJ_placeholder_5",
  },
  {
    slug: generateSlug("Angkor Wat"),
    category: "place",
    tags: ["temple", "unesco", "angkor", "heritage"],
    title: "Angkor Wat",
    titleKh: "អង្គរវត្ត",
    description:
      "The largest religious monument in the world and Cambodia's crown jewel. Built in the 12th century, this magnificent temple complex is a masterpiece of Khmer architecture. Witness breathtaking sunrise views and explore intricate bas-reliefs depicting Hindu epics.",
    addressText: "Angkor Archaeological Park, Siem Reap Province, Cambodia",
    lat: 13.4125,
    lng: 103.867,
    mainImage: "/default-image/place.png",
    priceLevel: "$$$",
    priceDetails: [
      { label: "1-Day Pass", price: "37", currency: "USD" },
      { label: "3-Day Pass", price: "62", currency: "USD" },
      { label: "7-Day Pass", price: "72", currency: "USD" },
    ],
    operatingHours: {
      monday: [{ open: "05:00", close: "17:30" }],
      tuesday: [{ open: "05:00", close: "17:30" }],
      wednesday: [{ open: "05:00", close: "17:30" }],
      thursday: [{ open: "05:00", close: "17:30" }],
      friday: [{ open: "05:00", close: "17:30" }],
      saturday: [{ open: "05:00", close: "17:30" }],
      sunday: [{ open: "05:00", close: "17:30" }],
    },
    googlePlaceId: "ChIJ_placeholder_6",
  },
  {
    slug: generateSlug("Royal Palace Phnom Penh"),
    category: "place",
    tags: ["palace", "royal", "culture", "phnom-penh"],
    title: "Royal Palace Phnom Penh",
    titleKh: "ព្រះបរមរាជវាំងភ្នំពេញ",
    description:
      "Official residence of the King of Cambodia. Marvel at the stunning Silver Pagoda with its floor of 5,000 silver tiles. Explore beautiful Khmer architecture, manicured gardens, and witness the grandeur of Cambodian royalty.",
    addressText: "Sothearos Blvd, Phnom Penh, Cambodia",
    lat: 11.5644,
    lng: 104.9282,
    mainImage: "/default-image/place.png",
    priceLevel: "$$",
    priceDetails: [
      { label: "Foreign Visitors", price: "10", currency: "USD" },
      { label: "Cambodian Citizens", price: "Free", currency: "KHR" },
    ],
    operatingHours: {
      monday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      tuesday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      wednesday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      thursday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      friday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      saturday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      sunday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
    },
    contactInfo: {
      phone: "+855 23 430 345",
    },
    googlePlaceId: "ChIJ_placeholder_7",
  },
  {
    slug: generateSlug("Koh Rong Island"),
    category: "place",
    tags: ["island", "beach", "nature", "sihanoukville"],
    title: "Koh Rong Island",
    titleKh: "កោះរ៉ុង",
    description:
      "Paradise island with pristine white sand beaches and crystal-clear waters. Experience bioluminescent plankton at night, snorkel in coral reefs, or simply relax in beach hammocks. Perfect for digital detox and island life.",
    addressText: "Koh Rong, Sihanoukville Province, Cambodia",
    lat: 10.7126,
    lng: 103.2961,
    mainImage: "/default-image/place.png",
    priceLevel: "$$",
    priceDetails: [{ label: "Ferry Round Trip", price: "25", currency: "USD" }],
    operatingHours: {},
    googlePlaceId: "ChIJ_placeholder_8",
  },

  // ========================================
  // FOODS
  // ========================================
  {
    slug: generateSlug("Fish Amok"),
    category: "food",
    tags: ["traditional", "curry", "seafood", "national-dish"],
    title: "Fish Amok",
    titleKh: "អាម៉ុកត្រី",
    description:
      "Cambodia's national dish. Steamed fish mousse with coconut milk, lemongrass, and aromatic spices in banana leaf. The creamy texture and fragrant spices make this a must-try dish that represents the essence of Khmer cuisine.",
    addressText: "Available nationwide - Restaurants & Street Vendors",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/food.png",
    priceLevel: "$",
    priceDetails: [
      { label: "Street Vendor", price: "3", currency: "USD" },
      { label: "Restaurant", price: "6", currency: "USD" },
    ],
  },
  {
    slug: generateSlug("Beef Lok Lak"),
    category: "food",
    tags: ["beef", "stir-fry", "traditional", "lunch"],
    title: "Beef Lok Lak",
    titleKh: "លក់​ឡក់​សាច់​គោ",
    description:
      "Stir-fried marinated beef cubes served with fresh vegetables, rice, and a tangy lime-pepper dipping sauce. Popular lunch dish that's both flavorful and satisfying.",
    addressText: "Available nationwide - Restaurants",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/food.png",
    priceLevel: "$",
    priceDetails: [{ label: "Average Price", price: "5", currency: "USD" }],
  },
  {
    slug: generateSlug("Nom Banh Chok"),
    category: "food",
    tags: ["noodles", "breakfast", "traditional", "curry"],
    title: "Nom Banh Chok (Khmer Noodles)",
    titleKh: "នំបញ្ចុក",
    description:
      "Fresh rice noodles topped with green fish curry gravy and raw vegetables. Traditional breakfast dish beloved by locals. The light yet flavorful curry makes it perfect for starting your day.",
    addressText: "Available nationwide - Morning Markets & Street Vendors",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/food.png",
    priceLevel: "$",
    priceDetails: [{ label: "Typical Price", price: "1.5", currency: "USD" }],
  },
  {
    slug: generateSlug("Bai Sach Chrouk"),
    category: "food",
    tags: ["pork", "rice", "breakfast", "grilled"],
    title: "Bai Sach Chrouk",
    titleKh: "បាយសាច់ជ្រូក",
    description:
      "Grilled marinated pork served over broken rice with pickled vegetables and clear soup. The most popular breakfast dish in Cambodia. The caramelized pork is sweet, savory, and absolutely addictive.",
    addressText: "Available nationwide - Morning Markets & Street Vendors",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/food.png",
    priceLevel: "$",
    priceDetails: [{ label: "Street Price", price: "2", currency: "USD" }],
  },
  {
    slug: generateSlug("Khmer Red Curry"),
    category: "food",
    tags: ["curry", "traditional", "spicy", "coconut"],
    title: "Khmer Red Curry",
    titleKh: "ការីក្រហម",
    description:
      "Rich and aromatic red curry with beef, chicken, or fish, mixed with vegetables, potatoes, and coconut milk. Less spicy than Thai curry but full of complex flavors from lemongrass, galangal, and Khmer spices.",
    addressText: "Available nationwide - Restaurants",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/food.png",
    priceLevel: "$",
    priceDetails: [{ label: "Average Price", price: "4.5", currency: "USD" }],
  },

  // ========================================
  // DRINKS
  // ========================================
  {
    slug: generateSlug("Palm Juice"),
    category: "drink",
    tags: ["traditional", "sweet", "natural", "refreshing"],
    title: "Palm Juice (Tuk Tnout Choo)",
    titleKh: "ទឹកត្នោតជ្រូក",
    description:
      "Fresh juice from sugar palm trees. Sweet and refreshing with a unique flavor. Best served cold. This traditional drink has been enjoyed for generations and is both delicious and nutritious.",
    addressText: "Available nationwide - Street Vendors & Markets",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/drink.png",
    priceLevel: "$",
    priceDetails: [{ label: "Street Price", price: "0.75", currency: "USD" }],
  },
  {
    slug: generateSlug("Iced Coffee"),
    category: "drink",
    tags: ["coffee", "iced", "traditional", "breakfast"],
    title: "Teuk Krola Paeng (Iced Coffee)",
    titleKh: "ទឹកកាហ្វេប៉េងខ្មៅ",
    description:
      "Strong Cambodian iced coffee made with robusta beans and sweetened condensed milk. Incredibly smooth and energizing. The perfect pick-me-up on a hot Cambodian day.",
    addressText: "Available nationwide - Cafes & Street Vendors",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/drink.png",
    priceLevel: "$",
    priceDetails: [{ label: "Typical Price", price: "1.5", currency: "USD" }],
  },
  {
    slug: generateSlug("Sugarcane Juice"),
    category: "drink",
    tags: ["juice", "sweet", "fresh", "natural"],
    title: "Sugarcane Juice (Tuk Ampov)",
    titleKh: "ទឹកអំពៅ",
    description:
      "Freshly pressed sugarcane juice, sometimes mixed with lime and kumquat. Natural sweetness with a refreshing citrus twist. Watch vendors press the cane through manual or electric presses.",
    addressText: "Available nationwide - Street Vendors & Markets",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/drink.png",
    priceLevel: "$",
    priceDetails: [{ label: "Glass", price: "0.5", currency: "USD" }],
  },
  {
    slug: generateSlug("Num Tkak Cho"),
    category: "drink",
    tags: ["smoothie", "traditional", "healthy", "breakfast"],
    title: "Num Tkak Cho (Lime Shake)",
    titleKh: "នំត្កាកឈូ",
    description:
      "Sweet and tangy shake made with fresh lime, sugar, and ice. Often blended with egg for extra richness. A popular breakfast drink that's both refreshing and energizing.",
    addressText: "Available nationwide - Drink Stalls",
    lat: 11.5564,
    lng: 104.9282,
    mainImage: "/default-image/drink.png",
    priceLevel: "$",
    priceDetails: [{ label: "Small Cup", price: "1", currency: "USD" }],
  },

  // ========================================
  // SOUVENIRS
  // ========================================
  {
    slug: generateSlug("Krama Traditional Scarf"),
    category: "souvenir",
    tags: ["textile", "traditional", "clothing", "handmade"],
    title: "Krama (Traditional Scarf)",
    titleKh: "ក្រមា",
    description:
      "Iconic checkered cotton scarf worn by Cambodians. Multiple uses: headwrap, towel, baby carrier. Various colors available. An essential item in Cambodian culture with countless practical applications.",
    addressText: "Central Market & Old Market, Phnom Penh & Siem Reap",
    lat: 11.5696,
    lng: 104.9251,
    mainImage: "/default-image/souvenir.png",
    priceLevel: "$",
    priceDetails: [
      { label: "Basic Cotton", price: "3", currency: "USD" },
      { label: "Premium Quality", price: "8", currency: "USD" },
    ],
  },
  {
    slug: generateSlug("Kampot Pepper"),
    category: "souvenir",
    tags: ["spice", "gourmet", "kampot", "gift"],
    title: "Kampot Pepper",
    titleKh: "ម្រេចកំពត",
    description:
      "World-renowned Kampot peppercorns with geographical indication status. Red, black, and white varieties. Considered some of the finest pepper in the world, with a unique aromatic profile.",
    addressText: "Kampot Province & Specialty Shops Nationwide",
    lat: 10.6104,
    lng: 104.1886,
    mainImage: "/default-image/souvenir.png",
    priceLevel: "$$",
    priceDetails: [
      { label: "100g", price: "5", currency: "USD" },
      { label: "500g", price: "15", currency: "USD" },
    ],
  },
  {
    slug: generateSlug("Silk Scarf"),
    category: "souvenir",
    tags: ["silk", "handwoven", "luxury", "traditional"],
    title: "Silk Scarf",
    titleKh: "ក្រមាសូត្រ",
    description:
      "Hand-woven silk scarves with traditional patterns. Made in Cambodian silk villages. Luxury quality with intricate designs inspired by ancient Khmer art.",
    addressText: "Silk Villages (Siem Reap) & Markets Nationwide",
    lat: 13.3671,
    lng: 103.8448,
    mainImage: "/default-image/souvenir.png",
    priceLevel: "$$",
    priceDetails: [
      { label: "Standard Size", price: "20", currency: "USD" },
      { label: "Premium/Large", price: "60", currency: "USD" },
    ],
  },
  {
    slug: generateSlug("Silver Jewelry"),
    category: "souvenir",
    tags: ["jewelry", "handmade", "silver", "traditional"],
    title: "Cambodian Silver Jewelry",
    titleKh: "គ្រឿងអលង្ការប្រាក់",
    description:
      "Handcrafted silver jewelry featuring traditional Khmer designs. From intricate necklaces to delicate bracelets, each piece tells a story of Cambodian craftsmanship. Many designs incorporate ancient Angkorian motifs.",
    addressText: "Russian Market, Phnom Penh & Artisan Shops",
    lat: 11.5458,
    lng: 104.9176,
    mainImage: "/default-image/souvenir.png",
    priceLevel: "$$",
    priceDetails: [
      { label: "Simple Bracelet", price: "15", currency: "USD" },
      { label: "Elaborate Necklace", price: "50", currency: "USD" },
    ],
  },
  {
    slug: generateSlug("Stone Carving"),
    category: "souvenir",
    tags: ["art", "sculpture", "traditional", "handmade"],
    title: "Angkor Stone Carving",
    titleKh: "ចម្លាក់ថ្មអង្គរ",
    description:
      "Miniature replicas of Angkor Wat and other temples, or Buddha statues carved from sandstone. Skilled artisans recreate the intricate details of ancient Khmer architecture in these beautiful keepsakes.",
    addressText: "Artisan Angkor, Siem Reap & Handicraft Markets",
    lat: 13.3622,
    lng: 103.8597,
    mainImage: "/default-image/souvenir.png",
    priceLevel: "$$",
    priceDetails: [
      { label: "Small Carving", price: "10", currency: "USD" },
      { label: "Large Piece", price: "100", currency: "USD" },
    ],
  },
];

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing listings first
    console.log("🗑️  Clearing existing listings...");
    await db.delete(listings);
    console.log("✅ Cleared existing data");

    // Insert Listings
    console.log("📍 Seeding listings...");
    await db.insert(listings).values(sampleListings);
    console.log(`✅ Inserted ${sampleListings.length} listings`);

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📝 Next step: Create first admin user");
    console.log("   After signing in with Google, run this SQL command:");
    console.log(
      "   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';\n"
    );
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed()
  .catch((error) => {
    console.error("Seed process failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    console.log("🔚 Seed process finished");
    process.exit(0);
  });
