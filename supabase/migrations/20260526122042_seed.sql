-- Seed initial properties data

INSERT INTO properties (title, slug, price, location, details, amenities, image, before_image, after_image, tagline, ai_score, ai_price_prediction, status)
VALUES
  (
    'The Helix Penthouse',
    'the-helix-penthouse',
    8500000,
    '{"lat": 40.7128, "lng": -74.006, "address": "88 Obsidian Crest, Sector 4", "city": "Neo Metropolis", "state": "NM", "zip": "10001"}',
    '{"bedrooms": 4, "bathrooms": 4.5, "area": 5200, "floors": 2, "parking": 3}',
    ARRAY['Gravity Pool', 'Holographic Home Theater', 'Automated Security Node', 'AI Chef Station', 'Skydeck'],
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
    'Ultra-luxury sky living with 360-degree holographic glass panels.',
    98,
    '{"sixMonth": 8800000, "oneYear": 9200000, "threeYear": 10500000}',
    'available'
  ),
  (
    'Aetheria Eco-Villa',
    'aetheria-eco-villa',
    4200000,
    '{"lat": 40.725, "lng": -74.015, "address": "12 Biophilic Oasis Lane", "city": "Neo Metropolis", "state": "NM", "zip": "10002"}',
    '{"bedrooms": 3, "bathrooms": 3, "area": 3400, "floors": 1, "parking": 2}',
    ARRAY['Self-sustaining Solar Mesh', 'Rainwater Fusion Cell', 'Indoor Vertical Forest', 'Smart Glass Insulation'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    'Zero-emission biophilic pod utilizing solar carbon skin technology.',
    94,
    '{"sixMonth": 4400000, "oneYear": 4700000, "threeYear": 5300000}',
    'available'
  ),
  (
    'Nebula Heights Duplex',
    'nebula-heights-duplex',
    6100000,
    '{"lat": 40.7, "lng": -73.99, "address": "42 Chrome Spires, Floor 62", "city": "Neo Metropolis", "state": "NM", "zip": "10003"}',
    '{"bedrooms": 3, "bathrooms": 3.5, "area": 4100, "floors": 2, "parking": 2}',
    ARRAY['Quantum HVAC', 'Smart-Tint Windows', 'Cyber Security Shield', 'Biometric Elevator'],
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    'Dynamic smart home with cyber-defense shields and high-altitude sky terraces.',
    91,
    '{"sixMonth": 6250000, "oneYear": 6500000, "threeYear": 7200000}',
    'available'
  );
