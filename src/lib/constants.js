import { TbWorld } from "react-icons/tb";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
const userPreferences= [
    {
      title: "Types of Weddings",
      value: ["Hindu Wedding", "Muslim Wedding", "Sikh Wedding", "Christian Wedding", "Buddhist Wedding"],
    },
    {
      title: "Wedding Attire",
      value: ["Sherwani", "Lehenga", "Saree", "Tuxedo", "Anarkali Suit"],
    },
    {
      title: "Wedding Venues",
      value: ["Beach", "Palace", "Garden", "Banquet Hall", "Farmhouse"],
    },
    {
      title: "Wedding Rituals",
      value: ["Mehendi Ceremony", "Haldi Ceremony", "Sangeet", "Pheras", "Nikah"],
    },
    {
      title: "Food and Catering",
      value: ["Vegetarian Menu", "Non-Vegetarian Menu", "Desserts", "Buffet", "Live Counters"],
    },
    {
      title: "Photography Styles",
      value: ["Candid Photography", "Traditional Photography", "Pre-Wedding Shoot", "Drone Photography", "Cinematic Videography"],
    },
    {
      title: "Wedding Decor",
      value: ["Floral Arrangements", "Lighting Decor", "Mandap Setup", "Stage Decor", "Table Centerpieces"],
    },
    {
      title: "Entertainment Options",
      value: ["Live Band", "DJ", "Dance Performances", "Fireworks", "Stand-up Comedy"],
    },
    {
      title: "Wedding Gifts",
      value: ["Customized Hampers", "Cash Envelopes", "Home Decor Items", "Jewelry", "Gift Cards"],
    },
    {
      title: "Honeymoon Destinations",
      value: ["Maldives", "Goa", "Paris", "Switzerland", "Kerala"],
    },
  ];
const vendorDetails_p1=[
  {
    title:"Business Name",
    value:"",
    type:"text",
    placeholder:"Enter Business Name",
    name:"businessName"
  },
  {
    title:"Business Email",
    value:"",
    type:"email",
    placeholder:"Enter Business Email",
    name:"businessEmail"
  },
  {
    title:"Business Phone",
    value:"",
    type:"number",
    placeholder:"Enter Business Phone",
    name:"businessPhone"
  },
  {
    title:"Password",
    value:"",
    type:"password",
    placeholder:"Enter password",
    name:"password"
  }
]
const searchSection = [
  {
    title: "Most searched cities",  // modified
    value: [
      "Delhi NCR", "Lucknow", "Kolkata", "Nashik", "Bangalore", "Udaipur", "Hyderabad", "Mumbai",
      "Jaipur", "Ranchi", "Ahmedabad", "Gurgaon", "Chennai", "Puri", "Vadodara", "Pune", "Jodhpur",
      "Goa", "Surat", "Phagwara", "Ernakulam", "Kochi", "Trivandrum", "Chandigarh"
  ]
  
  },
  {
    title: "Wedding type", // modified
    value: [
      "Destination",
      "Traditional",
      "Ritual",
      "Modern",
      "Contemporary",
      "Beach",
      "Royal",
      "Heritage",
      "Eco-Friendly",
      "Sustainable",
      "Cultural",
      "Themed",
      "Intimate",
      "Small",
      "Luxury",
      "Adventure",
      "Outdoor"
    ]
  },
  {
    title: "Top wedding themes", // modified
    value: [
      "Royal",
      "Palace",
      "Cultural",
      "Ritual",
      "Rustic",
      "Garden",
      "Modern Minimalist",
      "Bollywood Glam",
      "Floral Extravaganza",
      "Indo-Western Fusion",
      "Adventure",
      "Outdoor"
    ]
  },
  {
    title: "Preferred wedding cuisines",  // modified
    value: [
      "North Indian",
      "South Indian",
      "Chinese",
      "Italian",
      "Japanese",
      "Lebanese",
      "Fusion (Indian + Continental)",
      "Dessert Buffets"
    ]
  },
  {
    title: "Wedding decoration styles",
    value: [
      "Floral Decor",          // Explicitly mentioned by **Bhadra Wedding Decor**, **Turiya Celebrations - Decor**, **Event Designer**
      "LED Lights",            // Highlighted by **KrishnChandra Events**, **Event Designer**, **Turiya Celebrations - Decor**
      "Traditional Drapes",    // Referenced by **Turiya Celebrations - Decor** (decorative draping) and **Bhadra Wedding Decor** (Rajasthani/Punjabi themes)
      "Themed Backdrops",      // Implied by **Pixel Stream Studios** (unconventional themes/props) and **Bhadra Wedding Decor** (Bollywood themes)
      "Rustic Chic",           // Mentioned by **Bhadra Wedding Decor** (rustic themes) and **Land Of Love** (outdoor setups)
      "Mandap & Stage Decor",  // Explicitly listed by **Event Designer**, **Turiya Celebrations - Decor**, **The Royal Events Co.**
      "Luxury Crystal"         // Implied by **Wedifys** (luxury weddings) and **ITC Gardenia** (opulent setups)
    ]
  },
  {
    title: "Bridal outfit styles", // modified
    value: [
      "Bridal Lehengas",
      "Light Lehengas",
      "Indo-Western Gowns",
      "Heavy Anarkalis",
      "Custom Sherwanis",
      "Trousseau Sarees",
      "Floral Jewelry",
      "Cocktail Gowns"
    ]
  },
  {
    title: "Groom outfit styles",
    value: [
      "Sherwani",          // Listed by **KORA by Nilesh Mitesh**, **Royal Attire**, **KJ by Kushal Jain**, **Umang Mehta**
      "Tuxedo/Suit",       // Offered by **KORA by Nilesh Mitesh**, **KJ by Kushal Jain**, **Prima Czar**
      "Kurta Pajama",      // Highlighted by **Royal Attire**, **KJ by Kushal Jain**, **Umang Mehta**
      "Achkan",            // Specialized by **KJ by Kushal Jain**
      "Indo-Western",      // Explicitly mentioned by **Umang Mehta**, **Prima Czar**, **The Jaipur Story**
      "Bandhgala",         // Offered by **KJ by Kushal Jain**, **Umang Mehta**
      "Waistcoats/Nehru Jackets" // Listed by **KORA by Nilesh Mitesh**, **Umang Mehta**
    ]
  },
  {
    title: "Trending wedding accessories",
    value: [
      "Jewelry Sets",       // Highlighted by **Shailja Diamond Jewellery**, **Amrapali**, **Raniwala Jewellers Castle**
      "Mehendi Designs",    // Explicitly covered by **A1 Artist- Mehendi Designer**, **Rahul Mehandi Art**, **Jaipuri Mehendi Art**
      "Clutches & Bags",    // Offered by **Kafi Pyar**, **Babe Pote Di Hatti** (customized clutches and bridal bags)
      "Floral Jewelry",     // Specialized by **Anchal**, **Urbalaa** (floral jewelry for sangeet/haldi)
      "Turbans (Safa)",     // Mentioned by **Royal Attire**, **KJ by Kushal Jain** (groom pagri/safa)
      "Customized Sherwanis", // Listed by **KORA by Nilesh Mitesh**, **Umang Mehta** (tailored groom wear)
      "Bridal Lehenga Dupattas" // Implied by bridal wear vendors like **Bridal Couture**, **Modi's Boutique**
    ]
  },
  {
    title: "Wedding photography styles", // modified
    value: [
      "Candid Photography",
      "Cinematic Films",
      "Drone Shots",
      "4K Videography",
      "Pre-Wedding Shoots",
      "Traditional Portraits",
      "Documentary Style",
      "Conceptual/Themed" // No split here (intentional compound term)
    ]
  },
  {
    title: "Common wedding rituals", // modified
    value: [
      "Sangeet",       // Mentioned by vendors like **Chaos Starts Here (DJ)**, **Naman Verma Photography**
      "Mehendi",       // Explicitly covered by **A1 Artist- Mehendi Designer**, **Jaipuri Mehendi Art**, **Rahul Mehandi Art**
      "Haldi",         // Referenced by **Green Leaf Foods** (catering) and **WeddingNama** (photography)
      "Pheras",        // Highlighted by **Pandit Ji Arya Samaj**, **Vaidik Pandit**, and **Rajneesh Srivastava Photography**
      "Reception",     // Listed in services by **ITC Gardenia**, **Rambagh Palace**, and **Eventmakers**
      "Engagement"     // Covered by **Mix and Match Events**, **Event Designer**, and **The Wedding Files**
    ]
  }
];
const userProfileContent=[
  {
    title:"Username",
    value:"Ujjwal"
  },{
    title:"Location",
    value:"Mumbai"
  },
  {
    title:"Number of events planned",
    value:"0"
  },{
    title:"Upcoming events",
    value:"Null"
  }
]

const vendorSocialHandle=[
  {
    icon:<TbWorld/>
  },
  {
    icon:<BsInstagram/>
  },
  {
    icon:<FaFacebookF/>
  }
]
export {userPreferences,vendorDetails_p1,searchSection,userProfileContent,vendorSocialHandle}