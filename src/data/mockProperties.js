export const mockProperties = [
  {
    id: "prop-1",
    title: "The Helix Penthouse",
    slug: "the-helix-penthouse",
    price: 8500000,
    priceHistory: [
      { month: "Jan", price: 8100000 },
      { month: "Feb", price: 8200000 },
      { month: "Mar", price: 8300000 },
      { month: "Apr", price: 8400000 },
      { month: "May", price: 8500000 }
    ],
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: "88 Obsidian Crest, Sector 4",
      city: "Neo Metropolis",
      state: "NM",
      zip: "10001"
    },
    details: {
      bedrooms: 4,
      bathrooms: 4.5,
      area: 5200,
      floors: 2,
      parking: 3
    },
    amenities: ["Gravity Pool", "Holographic Home Theater", "Automated Security Node", "AI Chef Station", "Skydeck"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80",
    virtualTourUrl: "#",
    aiScore: 98,
    aiPricePrediction: {
      sixMonth: 8800000,
      oneYear: 9200000,
      threeYear: 10500000
    },
    status: "available",
    agentId: "agent-1",
    createdAt: "2026-05-01",
    tagline: "Ultra-luxury sky living with 360-degree holographic glass panels."
  },
  {
    id: "prop-2",
    title: "Aetheria Eco-Villa",
    slug: "aetheria-eco-villa",
    price: 4200000,
    priceHistory: [
      { month: "Jan", price: 3900000 },
      { month: "Feb", price: 4000000 },
      { month: "Mar", price: 4100000 },
      { month: "Apr", price: 4150000 },
      { month: "May", price: 4200000 }
    ],
    location: {
      lat: 40.7250,
      lng: -74.0150,
      address: "12 Biophilic Oasis Lane",
      city: "Neo Metropolis",
      state: "NM",
      zip: "10002"
    },
    details: {
      bedrooms: 3,
      bathrooms: 3,
      area: 3400,
      floors: 1,
      parking: 2
    },
    amenities: ["Self-sustaining Solar Mesh", "Rainwater Fusion Cell", "Indoor Vertical Forest", "Smart Glass Insulation"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    beforeImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    virtualTourUrl: "#",
    aiScore: 94,
    aiPricePrediction: {
      sixMonth: 4400000,
      oneYear: 4700000,
      threeYear: 5300000
    },
    status: "available",
    agentId: "agent-1",
    createdAt: "2026-05-10",
    tagline: "Zero-emission biophilic pod utilizing solar carbon skin technology."
  },
  {
    id: "prop-3",
    title: "Nebula Heights Duplex",
    slug: "nebula-heights-duplex",
    price: 6100000,
    priceHistory: [
      { month: "Jan", price: 5800000 },
      { month: "Feb", price: 5900000 },
      { month: "Mar", price: 6000000 },
      { month: "Apr", price: 6050000 },
      { month: "May", price: 6100000 }
    ],
    location: {
      lat: 40.7000,
      lng: -73.9900,
      address: "42 Chrome Spires, Floor 62",
      city: "Neo Metropolis",
      state: "NM",
      zip: "10003"
    },
    details: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: 4100,
      floors: 2,
      parking: 2
    },
    amenities: ["Quantum HVAC", "Smart-Tint Windows", "Cyber Security Shield", "Biometric Elevator"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    beforeImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80",
    virtualTourUrl: "#",
    aiScore: 91,
    aiPricePrediction: {
      sixMonth: 6250000,
      oneYear: 6500000,
      threeYear: 7200000
    },
    status: "available",
    agentId: "agent-2",
    createdAt: "2026-05-15",
    tagline: "Dynamic smart home with cyber-defense shields and high-altitude sky terraces."
  }
];

export const mockAgents = [
  {
    id: "agent-1",
    name: "Alex Vane",
    role: "Lead Broker & AI Stager Specialist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    specializations: ["Luxury Skyhomes", "AI-Staged Properties", "Investments"],
    rating: 4.9,
    sales: 124,
    bio: "Pioneering the intersection of virtual reality showing and machine learning evaluation to find elite spaces."
  },
  {
    id: "agent-2",
    name: "Sophia Sterling",
    role: "Quantum Investor Liaison",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    specializations: ["Commercial Spire Shares", "Tokenized Real Estate"],
    rating: 4.8,
    sales: 98,
    bio: "Exclusively advising international capital pools in purchasing hyper-luxury properties."
  }
];
