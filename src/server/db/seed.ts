import "dotenv/config";
import { db } from "./index";
import {
  places,
  activities,
  foods,
  drinks,
  souvenirs,
  type NewPlace,
  type NewActivity,
  type NewFood,
  type NewDrink,
  type NewSouvenir,
} from "./schema";

// Sample Places (Villages, Temples, Parks, Markets)
const samplePlaces: NewPlace[] = [
  {
    name: "Kampot Pepper Farm",
    nameKh: "កសិដ្ឋាន​ម្រេច​កំពត",
    description:
      "Experience the world-famous Kampot pepper plantation. Learn about traditional farming methods and taste the finest peppercorns grown on red soil.",
    province: "Kampot",
    lat: "10.6104",
    lng: "104.1886",
    mapsUrl: "https://maps.google.com/?q=10.6104,104.1886",
    imageUrl: "/placeholder-kampot-pepper.jpg",
    priceRange: "$3 - $5",
    openingHours: "8:00 AM - 5:00 PM",
  },
  {
    name: "Battambang Bamboo Train",
    nameKh: "រថភ្លើងឬស្សីបាត់ដំបង",
    description:
      "Ride the unique bamboo train (Norry) through rice fields and villages. A thrilling journey on bamboo platforms powered by small motors.",
    province: "Battambang",
    lat: "13.0957",
    lng: "103.2022",
    mapsUrl: "https://maps.google.com/?q=13.0957,103.2022",
    imageUrl: "/placeholder-bamboo-train.jpg",
    priceRange: "$5",
    openingHours: "7:00 AM - 6:00 PM",
  },
  {
    name: "Koh Ker Temple Complex",
    nameKh: "ប្រាសាទកោះកេរ",
    description:
      "Ancient Khmer temple complex far from tourist crowds. Climb the 7-tiered pyramid for stunning forest views.",
    province: "Preah Vihear",
    lat: "13.7885",
    lng: "104.5311",
    mapsUrl: "https://maps.google.com/?q=13.7885,104.5311",
    imageUrl: "/placeholder-koh-ker.jpg",
    priceRange: "$10",
    openingHours: "7:30 AM - 5:30 PM",
  },
  {
    name: "Kampong Phluk Floating Village",
    nameKh: "ភូមិអណ្តែតកំពង់ផ្លុក",
    description:
      "Traditional stilt village on Tonle Sap Lake. Houses rise up to 10 meters during wet season. Authentic local life experience.",
    province: "Siem Reap",
    lat: "12.9100",
    lng: "104.0900",
    mapsUrl: "https://maps.google.com/?q=12.9100,104.0900",
    imageUrl: "/placeholder-floating-village.jpg",
    priceRange: "$15 - $20",
    openingHours: "6:00 AM - 6:00 PM",
  },
  {
    name: "Bokor Hill Station",
    nameKh: "ស្ថានីយ៍ភ្នំបូកគោ",
    description:
      "Abandoned French colonial hill station shrouded in mist. Eerie atmosphere with old casino and church ruins.",
    province: "Kampot",
    lat: "10.6333",
    lng: "104.0500",
    mapsUrl: "https://maps.google.com/?q=10.6333,104.0500",
    imageUrl: "/placeholder-bokor.jpg",
    priceRange: "$0 (Free)",
    openingHours: "Open 24/7",
  },
];

// Sample Activities
const sampleActivities: NewActivity[] = [
  {
    name: "Traditional Pottery Workshop",
    nameKh: "សិក្ខាសាលាធ្វើសំណាប់ប្រពៃណី",
    description:
      "Learn ancient Khmer pottery techniques from local artisans in Kampong Chhnang. Create your own clay pot to take home.",
    province: "Kampong Chhnang",
    lat: "12.2500",
    lng: "104.6667",
    mapsUrl: "https://maps.google.com/?q=12.2500,104.6667",
    imageUrl: "/placeholder-pottery.jpg",
    priceRange: "$10 - $15",
    openingHours: "9:00 AM - 4:00 PM",
  },
  {
    name: "Basket Weaving Class",
    nameKh: "ថ្នាក់រៀនចាក់កន្ត្រក",
    description:
      "Join local women to learn traditional basket weaving using palm leaves. Support rural communities while learning crafts.",
    province: "Siem Reap",
    lat: "13.3633",
    lng: "103.8564",
    mapsUrl: "https://maps.google.com/?q=13.3633,103.8564",
    imageUrl: "/placeholder-basket-weaving.jpg",
    priceRange: "$8 - $12",
    openingHours: "8:00 AM - 3:00 PM",
  },
  {
    name: "Sunset Boat Ride on Tonle Sap",
    nameKh: "ជិះទូកមើលថ្ងៃលិចនៅទន្លេសាប",
    description:
      "Peaceful sunset boat tour through floating villages and bird sanctuaries. See pink lotus fields and local fishermen.",
    province: "Siem Reap",
    lat: "12.9000",
    lng: "104.0833",
    mapsUrl: "https://maps.google.com/?q=12.9000,104.0833",
    imageUrl: "/placeholder-boat-sunset.jpg",
    priceRange: "$20 - $30",
    openingHours: "4:00 PM - 7:00 PM",
  },
  {
    name: "Khmer Cooking Class",
    nameKh: "ថ្នាក់រៀនធ្វើម្ហូបខ្មែរ",
    description:
      "Master authentic Cambodian dishes like Fish Amok and Khmer curry. Market tour included. Recipes provided.",
    province: "Siem Reap",
    lat: "13.3671",
    lng: "103.8448",
    mapsUrl: "https://maps.google.com/?q=13.3671,103.8448",
    imageUrl: "/placeholder-cooking-class.jpg",
    priceRange: "$25 - $35",
    openingHours: "9:00 AM - 1:00 PM",
  },
  {
    name: "Silk Farm Visit",
    nameKh: "ទស្សនាកសិដ្ឋានសូត្រ",
    description:
      "Discover the silk production process from silkworm to finished fabric. Watch traditional weaving on wooden looms.",
    province: "Siem Reap",
    lat: "13.3800",
    lng: "103.8900",
    mapsUrl: "https://maps.google.com/?q=13.3800,103.8900",
    imageUrl: "/placeholder-silk-farm.jpg",
    priceRange: "$5",
    openingHours: "8:00 AM - 5:00 PM",
  },
];

// Sample Foods
const sampleFoods: NewFood[] = [
  {
    name: "Fish Amok",
    nameKh: "អាម៉ុកត្រី",
    description:
      "Cambodia's national dish. Steamed fish mousse with coconut milk, lemongrass, and aromatic spices in banana leaf.",
    imageUrl: "/placeholder-fish-amok.jpg",
    priceRange: "$3 - $6",
  },
  {
    name: "Beef Lok Lak",
    nameKh: "លក់​ឡក់​សាច់​គោ",
    description:
      "Stir-fried marinated beef cubes served with fresh vegetables, rice, and a tangy lime-pepper dipping sauce.",
    imageUrl: "/placeholder-lok-lak.jpg",
    priceRange: "$4 - $7",
  },
  {
    name: "Nom Banh Chok (Khmer Noodles)",
    nameKh: "នំបញ្ចុក",
    description:
      "Fresh rice noodles topped with green fish curry gravy and raw vegetables. Traditional breakfast dish.",
    imageUrl: "/placeholder-nom-banh-chok.jpg",
    priceRange: "$1 - $2",
  },
  {
    name: "Bai Sach Chrouk (Pork & Rice)",
    nameKh: "បាយសាច់ជ្រូក",
    description:
      "Grilled pork marinated in coconut milk and garlic served over broken rice with pickled vegetables.",
    imageUrl: "/placeholder-bai-sach-chrouk.jpg",
    priceRange: "$2 - $3",
  },
  {
    name: "Kuy Teav (Noodle Soup)",
    nameKh: "គុយទាវ",
    description:
      "Savory pork bone broth noodle soup topped with pork slices, shrimp, herbs, and crispy fried garlic.",
    imageUrl: "/placeholder-kuy-teav.jpg",
    priceRange: "$2 - $4",
  },
];

// Sample Drinks
const sampleDrinks: NewDrink[] = [
  {
    name: "Palm Juice (Tuk Tnout Choo)",
    nameKh: "ទឹកត្នោតជ្រូក",
    description:
      "Fresh juice from sugar palm trees. Sweet and refreshing with a unique flavor. Best served cold.",
    imageUrl: "/placeholder-palm-juice.jpg",
    priceRange: "$0.50 - $1",
  },
  {
    name: "Sugar Cane Juice",
    nameKh: "ទឹកអំពៅ",
    description:
      "Freshly pressed sugar cane juice. Natural sweetness perfect for hot days. Often mixed with lime.",
    imageUrl: "/placeholder-sugar-cane.jpg",
    priceRange: "$0.50 - $1",
  },
  {
    name: "Teuk Krola Paeng (Iced Coffee)",
    nameKh: "ទឹកកាហ្វេប៉េងខ្មៅ",
    description:
      "Strong Cambodian iced coffee made with robusta beans and sweetened condensed milk. Incredibly smooth.",
    imageUrl: "/placeholder-iced-coffee.jpg",
    priceRange: "$1 - $2",
  },
  {
    name: "Coconut Water",
    nameKh: "ទឹកដូង",
    description:
      "Fresh young coconut water served straight from the coconut. Hydrating and naturally sweet.",
    imageUrl: "/placeholder-coconut.jpg",
    priceRange: "$1 - $1.50",
  },
  {
    name: "Nom Tkoy Doh (Fruit Shake)",
    nameKh: "ទឹកផ្លែឈើ",
    description:
      "Blended tropical fruit shake with crushed ice. Popular flavors: mango, dragon fruit, avocado.",
    imageUrl: "/placeholder-fruit-shake.jpg",
    priceRange: "$1.50 - $2.50",
  },
];

// Sample Souvenirs
const sampleSouvenirs: NewSouvenir[] = [
  {
    name: "Krama (Traditional Scarf)",
    nameKh: "ក្រមា",
    description:
      "Iconic checkered cotton scarf worn by Cambodians. Multiple uses: headwrap, towel, baby carrier. Various colors available.",
    imageUrl: "/placeholder-krama.jpg",
    priceRange: "$3 - $8",
  },
  {
    name: "Silver Jewelry",
    nameKh: "គ្រឿងអលង្ការប្រាក់",
    description:
      "Handcrafted silver pieces by local artisans. Intricate designs inspired by Angkorian motifs.",
    imageUrl: "/placeholder-silver.jpg",
    priceRange: "$15 - $100",
  },
  {
    name: "Kampot Pepper",
    nameKh: "ម្រេចកំពត",
    description:
      "World-renowned Kampot peppercorns with geographical indication status. Red, black, and white varieties.",
    imageUrl: "/placeholder-pepper.jpg",
    priceRange: "$5 - $15",
  },
  {
    name: "Palm Sugar",
    nameKh: "ស្ករត្នោត",
    description:
      "Natural palm sugar made from palm tree sap. Used in Khmer desserts and cooking. Rich caramel flavor.",
    imageUrl: "/placeholder-palm-sugar.jpg",
    priceRange: "$2 - $5",
  },
  {
    name: "Silk Scarf",
    nameKh: "ក្រមាសូត្រ",
    description:
      "Hand-woven silk scarves with traditional patterns. Made in Cambodian silk villages. Luxury quality.",
    imageUrl: "/placeholder-silk-scarf.jpg",
    priceRange: "$20 - $60",
  },
];

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Insert Places
    console.log("📍 Seeding places...");
    await db.insert(places).values(samplePlaces);
    console.log(`✅ Inserted ${samplePlaces.length} places`);

    // Insert Activities
    console.log("🎯 Seeding activities...");
    await db.insert(activities).values(sampleActivities);
    console.log(`✅ Inserted ${sampleActivities.length} activities`);

    // Insert Foods
    console.log("🍜 Seeding foods...");
    await db.insert(foods).values(sampleFoods);
    console.log(`✅ Inserted ${sampleFoods.length} foods`);

    // Insert Drinks
    console.log("🥤 Seeding drinks...");
    await db.insert(drinks).values(sampleDrinks);
    console.log(`✅ Inserted ${sampleDrinks.length} drinks`);

    // Insert Souvenirs
    console.log("🎁 Seeding souvenirs...");
    await db.insert(souvenirs).values(sampleSouvenirs);
    console.log(`✅ Inserted ${sampleSouvenirs.length} souvenirs`);

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

  process.exit(0);
}

seed();
