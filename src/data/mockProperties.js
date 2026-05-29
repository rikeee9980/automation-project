export const mockProperties = [
  {
    id: "prop-1",
    title: "Luxury Penthouse in Baluwatar",
    slug: "luxury-penthouse-baluwatar",
    price: 8500000,
    purpose: "buy",
    type: "flat",
    isFeatured: true,
    priceHistory: [
      { month: "Jan", price: 8100000 },
      { month: "Feb", price: 8200000 },
      { month: "Mar", price: 8300000 },
      { month: "Apr", price: 8400000 },
      { month: "May", price: 8500000 }
    ],
    location: {
      lat: 27.7172,
      lng: 85.3240,
      address: "88 Baluwatar Marg",
      city: "Kathmandu",
      district: "Kathmandu",
      state: "Bagmati",
      zip: "44600"
    },
    details: {
      bedrooms: 4,
      bathrooms: 4,
      area: 5200,
      floors: 2,
      parking: 3
    },
    areaLocal: { ropani: 0, aana: 0, paisa: 0, dam: 0, sqft: 5200 },
    roadAccess: "20ft",
    facing: "South-East",
    builtYear: 2024,
    amenities: ["Modular Kitchen", "Rooftop Garden", "24/7 Security", "Elevator", "Covered Parking"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "available",
    agentId: "agent-1",
    createdAt: "2026-05-01",
    tagline: "Spacious 4BHK penthouse with panoramic city and mountain views in Baluwatar."
  },
  {
    id: "prop-2",
    title: "Modern Bungalow in Jhamsikhel",
    slug: "modern-bungalow-jhamsikhel",
    price: 4200000,
    purpose: "buy",
    type: "house",
    isFeatured: true,
    priceHistory: [
      { month: "Jan", price: 3900000 },
      { month: "Feb", price: 4000000 },
      { month: "Mar", price: 4100000 },
      { month: "Apr", price: 4150000 },
      { month: "May", price: 4200000 }
    ],
    location: {
      lat: 27.6710,
      lng: 85.3120,
      address: "12 Jhamsikhel Marg",
      city: "Lalitpur",
      district: "Lalitpur",
      state: "Bagmati",
      zip: "44700"
    },
    details: {
      bedrooms: 3,
      bathrooms: 3,
      area: 3400,
      floors: 2,
      parking: 2
    },
    areaLocal: { ropani: 0, aana: 10, paisa: 0, dam: 0, sqft: 3400 },
    roadAccess: "13ft",
    facing: "East",
    builtYear: 2023,
    amenities: ["Solar Water Heater", "Garden", "Marble Flooring", "Modular Kitchen"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "available",
    agentId: "agent-1",
    createdAt: "2026-05-10",
    tagline: "Beautiful 3BHK bungalow with garden and solar system in Jhamsikhel."
  },
  {
    id: "prop-3",
    title: "Duplex House in Dhumbarahi",
    slug: "duplex-house-dhumbarahi",
    price: 6100000,
    purpose: "buy",
    type: "house",
    isFeatured: false,
    priceHistory: [
      { month: "Jan", price: 5800000 },
      { month: "Feb", price: 5900000 },
      { month: "Mar", price: 6000000 },
      { month: "Apr", price: 6050000 },
      { month: "May", price: 6100000 }
    ],
    location: {
      lat: 27.7200,
      lng: 85.3400,
      address: "42 Dhumbarahi Marg",
      city: "Kathmandu",
      district: "Kathmandu",
      state: "Bagmati",
      zip: "44600"
    },
    details: {
      bedrooms: 3,
      bathrooms: 3,
      area: 4100,
      floors: 2,
      parking: 2
    },
    areaLocal: { ropani: 0, aana: 12, paisa: 0, dam: 0, sqft: 4100 },
    roadAccess: "16ft",
    facing: "North-East",
    builtYear: 2022,
    amenities: ["Tiled Flooring", "Water Tank", "Boundary Wall", "Parking"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "available",
    agentId: "agent-2",
    createdAt: "2026-05-15",
    tagline: "Well-maintained duplex house with road access and parking in Dhumbarahi."
  },
  {
    id: "prop-4",
    title: "Residential Plot in Baluwatar",
    slug: "residential-plot-baluwatar",
    price: 15000000,
    purpose: "buy",
    type: "land",
    isFeatured: true,
    priceHistory: [
      { month: "Jan", price: 14000000 },
      { month: "Feb", price: 14200000 },
      { month: "Mar", price: 14500000 },
      { month: "Apr", price: 14800000 },
      { month: "May", price: 15000000 }
    ],
    location: {
      lat: 27.7195,
      lng: 85.3260,
      address: "Lane 4, Baluwatar Heights",
      city: "Kathmandu",
      district: "Kathmandu",
      state: "Bagmati",
      zip: "44600"
    },
    details: {
      bedrooms: 0,
      bathrooms: 0,
      area: 3200,
      floors: 0,
      parking: 0
    },
    areaLocal: { ropani: 0, aana: 9, paisa: 1, dam: 2, sqft: 3200 },
    roadAccess: "20ft",
    facing: "South-East",
    builtYear: null,
    amenities: ["20ft Road Access", "Water Connection", "Electricity Grid", "South-East Facing"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "available",
    agentId: "agent-1",
    createdAt: "2026-05-20",
    tagline: "Prime residential plot in the heart of VIP neighborhood, Baluwatar."
  },
  {
    id: "prop-5",
    title: "Furnished Flat in Sanepa",
    slug: "furnished-flat-sanepa",
    price: 120000,
    purpose: "rent",
    type: "flat",
    isFeatured: false,
    priceHistory: [
      { month: "Jan", price: 110000 },
      { month: "Feb", price: 115000 },
      { month: "Mar", price: 120000 },
      { month: "Apr", price: 120000 },
      { month: "May", price: 120000 }
    ],
    location: {
      lat: 27.6780,
      lng: 85.3080,
      address: "Level 4, Sanepa Tower",
      city: "Lalitpur",
      district: "Lalitpur",
      state: "Bagmati",
      zip: "44700"
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1450,
      floors: 1,
      parking: 1
    },
    areaLocal: { ropani: 0, aana: 4, paisa: 1, dam: 0, sqft: 1450 },
    roadAccess: "12ft",
    facing: "West",
    builtYear: 2021,
    amenities: ["Fully Furnished", "Gym Access", "24/7 Power Backup", "High-speed WiFi", "Elevator"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "available",
    agentId: "agent-2",
    createdAt: "2026-05-22",
    tagline: "Fully-furnished executive flat with panoramic mountain views in Sanepa."
  },
  {
    id: "prop-6",
    title: "Lakeside Villa in Pokhara",
    slug: "lakeside-villa-pokhara",
    price: 9500000,
    purpose: "buy",
    type: "house",
    isFeatured: false,
    priceHistory: [
      { month: "Jan", price: 9000000 },
      { month: "Feb", price: 9200000 },
      { month: "Mar", price: 9300000 },
      { month: "Apr", price: 9400000 },
      { month: "May", price: 9500000 }
    ],
    location: {
      lat: 28.2096,
      lng: 83.9856,
      address: "Lakeside Marg, Baidam",
      city: "Pokhara",
      district: "Kaski",
      state: "Gandaki",
      zip: "33700"
    },
    details: {
      bedrooms: 4,
      bathrooms: 3,
      area: 4800,
      floors: 2,
      parking: 2
    },
    areaLocal: { ropani: 1, aana: 2, paisa: 0, dam: 0, sqft: 4800 },
    roadAccess: "14ft",
    facing: "South",
    builtYear: 2023,
    amenities: ["Lake View", "Garden", "Marble Flooring", "Solar Panel", "Covered Parking"],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "available",
    agentId: "agent-1",
    createdAt: "2026-05-25",
    tagline: "Stunning 4BHK villa with direct views of Phewa Lake and Annapurna Range."
  },
  {
    id: "prop-7",
    title: "Commercial Space in Bharatpur",
    slug: "commercial-space-bharatpur",
    price: 7200000,
    purpose: "buy",
    type: "commercial",
    isFeatured: false,
    priceHistory: [
      { month: "Jan", price: 6800000 },
      { month: "Feb", price: 6900000 },
      { month: "Mar", price: 7000000 },
      { month: "Apr", price: 7100000 },
      { month: "May", price: 7200000 }
    ],
    location: {
      lat: 27.6833,
      lng: 84.4333,
      address: "Narayanghat Chowk",
      city: "Bharatpur",
      district: "Chitwan",
      state: "Bagmati",
      zip: "44200"
    },
    details: {
      bedrooms: 0,
      bathrooms: 2,
      area: 3600,
      floors: 3,
      parking: 4
    },
    areaLocal: { ropani: 0, aana: 0, paisa: 0, dam: 0, sqft: 3600 },
    roadAccess: "32ft",
    facing: "East",
    builtYear: 2020,
    amenities: ["Showroom Space", "32ft Road", "Loading Area", "3-Phase Power", "Open Parking"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "available",
    agentId: "agent-2",
    createdAt: "2026-05-18",
    tagline: "Prime commercial building on 32ft road in Bharatpur's busiest commercial zone."
  },
  {
    id: "prop-8",
    title: "Traditional House in Bhaktapur",
    slug: "traditional-house-bhaktapur",
    price: 3800000,
    purpose: "buy",
    type: "house",
    isFeatured: false,
    priceHistory: [
      { month: "Jan", price: 3500000 },
      { month: "Feb", price: 3600000 },
      { month: "Mar", price: 3700000 },
      { month: "Apr", price: 3750000 },
      { month: "May", price: 3800000 }
    ],
    location: {
      lat: 27.6722,
      lng: 85.4298,
      address: "Near Dattatreya Square",
      city: "Bhaktapur",
      district: "Bhaktapur",
      state: "Bagmati",
      zip: "44800"
    },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      area: 2200,
      floors: 3,
      parking: 1
    },
    areaLocal: { ropani: 0, aana: 6, paisa: 2, dam: 0, sqft: 2200 },
    roadAccess: "8ft",
    facing: "North",
    builtYear: 2019,
    amenities: ["Newari Architecture", "Roof Terrace", "Water Tank", "Tiled Flooring"],
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "available",
    agentId: "agent-2",
    createdAt: "2026-05-12",
    tagline: "Charming 3-storey Newari-style house near UNESCO heritage Dattatreya Square."
  }
];

export const mockAgents = [
  {
    id: "agent-1",
    name: "Ramesh Sharma",
    role: "Senior Property Consultant",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    specializations: ["Residential", "Land", "Investment"],
    rating: 4.9,
    sales: 124,
    bio: "Over 10 years of experience in Kathmandu Valley real estate. Specializes in residential and land properties."
  },
  {
    id: "agent-2",
    name: "Sita Adhikari",
    role: "Property Specialist",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    specializations: ["Commercial", "Rental", "Apartments"],
    rating: 4.8,
    sales: 98,
    bio: "Expert in commercial and rental properties across the Kathmandu Valley and Pokhara."
  }
];
