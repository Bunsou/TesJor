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
  // PLACES
  {
    slug: generateSlug("Kampot Pepper Farm"),
    category: "place",
    title: "Kampot Pepper Farm",
    titleKh: "កសិដ្ឋាន​ម្រេច​កំពត",
    description:
      "Experience the world-famous Kampot pepper plantation. Learn about traditional farming methods and taste the finest peppercorns grown on red soil. Take a guided tour through the farm and discover why Kampot pepper has geographical indication status.",
    addressText: "Kampot Province, Cambodia",
    lat: 10.6104,
    lng: 104.1886,
    mainImage: "/default-image/kampot-pepper.jpg",
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
    title: "Battambang Bamboo Train",
    titleKh: "រថភ្លើងឬស្សីបាត់ដំបង",
    description:
      "Ride the unique bamboo train (Norry) through rice fields and villages. A thrilling journey on bamboo platforms powered by small motors. This iconic Cambodian experience is a must-do when visiting Battambang.",
    addressText: "Battambang Province, Cambodia",
    lat: 13.0957,
    lng: 103.2022,
    mainImage: "/default-image/bamboo-train.jpg",
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
    title: "Koh Ker Temple Complex",
    titleKh: "ប្រាសាទកោះកេរ",
    description:
      "Ancient Khmer temple complex far from tourist crowds. Climb the 7-tiered pyramid for stunning forest views. Built in the 10th century as the capital of the Khmer Empire, Koh Ker offers a mysterious and uncrowded alternative to Angkor Wat.",
    addressText: "Preah Vihear Province, Cambodia",
    lat: 13.7885,
    lng: 104.5311,
    mainImage: "/default-image/koh-ker.jpg",
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
    title: "Kampong Phluk Floating Village",
    titleKh: "ភូមិអណ្តែតកំពង់ផ្លុក",
    description:
      "Traditional stilt village on Tonle Sap Lake. Houses rise up to 10 meters during wet season. Authentic local life experience with boat tours through mangrove forests and the opportunity to see fishermen at work.",
    addressText: "Siem Reap Province, Cambodia",
    lat: 12.91,
    lng: 104.09,
    mainImage: "/default-image/floating-village.jpg",
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
    title: "Bokor Hill Station",
    titleKh: "ស្ថានីយ៍ភ្នំបូកគោ",
    description:
      "Abandoned French colonial hill station shrouded in mist. Eerie atmosphere with old casino and church ruins. The misty mountain climate and ghostly buildings create a unique and mysterious experience.",
    addressText: "Kampot Province, Cambodia",
    lat: 10.6333,
    lng: 104.05,
    mainImage: "/default-image/bokor.jpg",
    priceLevel: "Free",
    operatingHours: {},
    googlePlaceId: "ChIJ_placeholder_5",
  },

  // FOODS
  {
    slug: generateSlug("Fish Amok"),
    category: "food",
    title: "Fish Amok",
    titleKh: "អាម៉ុកត្រី",
    description:
      "Cambodia's national dish. Steamed fish mousse with coconut milk, lemongrass, and aromatic spices in banana leaf. The creamy texture and fragrant spices make this a must-try dish that represents the essence of Khmer cuisine.",
    addressText: "Available nationwide",
    lat: 13.3671,
    lng: 103.8448,
    mainImage: "/default-image/fish-amok.jpg",
    priceLevel: "$",
    priceDetails: [
      { label: "Street Vendor", price: "3", currency: "USD" },
      { label: "Restaurant", price: "6", currency: "USD" },
    ],
  },
  {
    slug: generateSlug("Beef Lok Lak"),
    category: "food",
    title: "Beef Lok Lak",
    titleKh: "លក់​ឡក់​សាច់​គោ",
    description:
      "Stir-fried marinated beef cubes served with fresh vegetables, rice, and a tangy lime-pepper dipping sauce. Popular lunch dish that's both flavorful and satisfying.",
    addressText: "Available nationwide",
    lat: 13.3671,
    lng: 103.8448,
    mainImage: "/default-image/lok-lak.jpg",
    priceLevel: "$",
    priceDetails: [{ label: "Average Price", price: "5", currency: "USD" }],
  },
  {
    slug: generateSlug("Nom Banh Chok"),
    category: "food",
    title: "Nom Banh Chok (Khmer Noodles)",
    titleKh: "នំបញ្ចុក",
    description:
      "Fresh rice noodles topped with green fish curry gravy and raw vegetables. Traditional breakfast dish beloved by locals. The light yet flavorful curry makes it perfect for starting your day.",
    addressText: "Available nationwide",
    lat: 13.3671,
    lng: 103.8448,
    mainImage: "/default-image/nom-banh-chok.jpg",
    priceLevel: "$",
    priceDetails: [{ label: "Typical Price", price: "1.5", currency: "USD" }],
  },

  // DRINKS
  {
    slug: generateSlug("Palm Juice"),
    category: "drink",
    title: "Palm Juice (Tuk Tnout Choo)",
    titleKh: "ទឹកត្នោតជ្រូក",
    description:
      "Fresh juice from sugar palm trees. Sweet and refreshing with a unique flavor. Best served cold. This traditional drink has been enjoyed for generations and is both delicious and nutritious.",
    addressText: "Available nationwide",
    lat: 13.3671,
    lng: 103.8448,
    mainImage: "/default-image/palm-juice.jpg",
    priceLevel: "$",
    priceDetails: [{ label: "Street Price", price: "0.75", currency: "USD" }],
  },
  {
    slug: generateSlug("Iced Coffee"),
    category: "drink",
    title: "Teuk Krola Paeng (Iced Coffee)",
    titleKh: "ទឹកកាហ្វេប៉េងខ្មៅ",
    description:
      "Strong Cambodian iced coffee made with robusta beans and sweetened condensed milk. Incredibly smooth and energizing. The perfect pick-me-up on a hot Cambodian day.",
    addressText: "Available nationwide",
    lat: 13.3671,
    lng: 103.8448,
    mainImage: "/default-image/iced-coffee.jpg",
    priceLevel: "$",
    priceDetails: [{ label: "Typical Price", price: "1.5", currency: "USD" }],
  },

  // SOUVENIRS
  {
    slug: generateSlug("Krama Traditional Scarf"),
    category: "souvenir",
    title: "Krama (Traditional Scarf)",
    titleKh: "ក្រមា",
    description:
      "Iconic checkered cotton scarf worn by Cambodians. Multiple uses: headwrap, towel, baby carrier. Various colors available. An essential item in Cambodian culture with countless practical applications.",
    addressText: "Markets nationwide",
    lat: 13.3671,
    lng: 103.8448,
    mainImage: "/default-image/krama.jpg",
    priceLevel: "$",
    priceDetails: [
      { label: "Basic Cotton", price: "3", currency: "USD" },
      { label: "Premium Quality", price: "8", currency: "USD" },
    ],
  },
  {
    slug: generateSlug("Kampot Pepper"),
    category: "souvenir",
    title: "Kampot Pepper",
    titleKh: "ម្រេចកំពត",
    description:
      "World-renowned Kampot peppercorns with geographical indication status. Red, black, and white varieties. Considered some of the finest pepper in the world, with a unique aromatic profile.",
    addressText: "Kampot Province & markets nationwide",
    lat: 10.6104,
    lng: 104.1886,
    mainImage: "/default-image/kampot-pepper.jpg",
    priceLevel: "$$",
    priceDetails: [
      { label: "100g", price: "5", currency: "USD" },
      { label: "500g", price: "15", currency: "USD" },
    ],
  },
  {
    slug: generateSlug("Silk Scarf"),
    category: "souvenir",
    title: "Silk Scarf",
    titleKh: "ក្រមាសូត្រ",
    description:
      "Hand-woven silk scarves with traditional patterns. Made in Cambodian silk villages. Luxury quality with intricate designs inspired by ancient Khmer art.",
    addressText: "Silk villages & markets",
    lat: 13.38,
    lng: 103.89,
    mainImage: "/default-image/silk-scarf.jpg",
    priceLevel: "$$",
    priceDetails: [
      { label: "Standard Size", price: "20", currency: "USD" },
      { label: "Premium/Large", price: "60", currency: "USD" },
    ],
  },
];

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
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
