const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // ─── USERS ────────────────────────────────────
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@solemate.com',
        password: 'admin123',
        role: 'admin',
        phone: '555-0100',
        address: { street: '123 Admin St', city: 'New York', state: 'NY', zip: '10001', country: 'US' },
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'customer123',
        role: 'customer',
        phone: '555-0101',
        address: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'US' },
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'customer123',
        role: 'customer',
        phone: '555-0102',
        address: { street: '789 Pine Rd', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' },
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'customer123',
        role: 'customer',
        phone: '555-0103',
        address: { street: '321 Elm St', city: 'Houston', state: 'TX', zip: '77001', country: 'US' },
      },
    ]);
    console.log(`Created ${users.length} users`);

    const adminUser = users[0];
    const customer1 = users[1];
    const customer2 = users[2];
    const customer3 = users[3];

    // ─── CATEGORIES ─────────────────────────────────
    const menCat = await Category.create({
      name: 'Men',
      description: 'Footwear for men — from casual sneakers to formal shoes',
      image: '/images/categories/men.png',
    });
    const womenCat = await Category.create({
      name: 'Women',
      description: 'Footwear for women — stylish heels, flats, and sneakers',
      image: '/images/categories/women.png',
    });
    const kidsCat = await Category.create({
      name: 'Kids',
      description: 'Comfortable and durable footwear for children',
      image: '/images/categories/kids.png',
    });
    const runningCat = await Category.create({
      name: 'Running',
      description: 'Performance running shoes for every terrain',
      image: '/images/categories/running.png',
      parent: menCat._id,
    });
    const casualCat = await Category.create({
      name: 'Casual',
      description: 'Everyday casual footwear for comfort and style',
      image: '/images/categories/casual.png',
      parent: menCat._id,
    });
    const sportsCat = await Category.create({
      name: 'Sports',
      description: 'Athletic footwear for every sport',
      image: '/images/categories/sports.png',
      parent: menCat._id,
    });

    console.log('Created 6 categories');

    // ─── PRODUCTS ────────────────────────────────────
    const products = await Product.create([
      {
        name: 'Velocity Runner Pro',
        description: 'Engineered for speed and comfort, the Velocity Runner Pro features responsive cushioning and a breathable mesh upper. Perfect for daily training and race day performance. The lightweight design reduces fatigue while the durable outsole provides excellent traction on any surface.',
        price: 42000,
        compareAtPrice: 53200,
        category: runningCat._id,
        brand: 'SoleMate Athletics',
        gender: 'men',
        sizes: [
          { size: '8', stock: 12 }, { size: '8.5', stock: 8 }, { size: '9', stock: 15 },
          { size: '9.5', stock: 10 }, { size: '10', stock: 18 }, { size: '10.5', stock: 7 },
          { size: '11', stock: 14 }, { size: '12', stock: 6 },
        ],
        colors: [
          { name: 'Midnight Black', hex: '#1a1a2e', images: ['/images/products/velocity-black-1.png'] },
          { name: 'Ocean Blue', hex: '#1e3a5f', images: ['/images/products/velocity-blue-1.png'] },
        ],
        images: ['/images/products/velocity-runner-1.png', '/images/products/velocity-runner-2.png'],
        isFeatured: true,
        isNewArrival: true,
        tags: ['running', 'performance', 'lightweight', 'cushioned'],
      },
      {
        name: 'Urban Stride Classic',
        description: 'The Urban Stride Classic blends timeless design with modern comfort technology. Premium leather upper with cushioned insole makes this the perfect shoe for both office and weekend outings. A versatile choice that transitions seamlessly from day to night.',
        price: 36400,
        category: casualCat._id,
        brand: 'SoleMate Lifestyle',
        gender: 'men',
        sizes: [
          { size: '8', stock: 10 }, { size: '9', stock: 12 }, { size: '10', stock: 15 },
          { size: '11', stock: 8 }, { size: '12', stock: 5 },
        ],
        colors: [
          { name: 'Classic White', hex: '#f5f5f0', images: ['/images/products/urban-white-1.png'] },
          { name: 'Warm Gray', hex: '#8b8680', images: ['/images/products/urban-gray-1.png'] },
        ],
        images: ['/images/products/urban-stride-1.png', '/images/products/urban-stride-2.png'],
        isFeatured: true,
        tags: ['casual', 'classic', 'leather', 'comfortable'],
      },
      {
        name: 'Aero Sprint X',
        description: 'Built for the track and the street, the Aero Sprint X delivers explosive energy return with every step. The carbon-plate midsole and ultralight flyknit upper make this a serious contender for your next PR. Track-inspired design meets everyday wearability.',
        price: 50400,
        compareAtPrice: 61600,
        category: sportsCat._id,
        brand: 'SoleMate Athletics',
        gender: 'men',
        sizes: [
          { size: '8', stock: 8 }, { size: '9', stock: 10 }, { size: '9.5', stock: 6 },
          { size: '10', stock: 12 }, { size: '10.5', stock: 4 }, { size: '11', stock: 9 },
        ],
        colors: [
          { name: 'Neon Volt', hex: '#c8e600', images: ['/images/products/aero-volt-1.png'] },
          { name: 'Fire Red', hex: '#c41e3a', images: ['/images/products/aero-red-1.png'] },
        ],
        images: ['/images/products/aero-sprint-1.png', '/images/products/aero-sprint-2.png'],
        isFeatured: true,
        isNewArrival: true,
        tags: ['sports', 'sprint', 'carbon-plate', 'performance'],
      },
      {
        name: 'Cloud Walk Comfort',
        description: 'Step into cloud-like comfort with the Cloud Walk. Featuring memory foam cushioning and a slip-resistant sole, these shoes are designed for all-day wear. The clean, minimalist design goes with everything in your wardrobe.',
        price: 25200,
        category: casualCat._id,
        brand: 'SoleMate Comfort',
        gender: 'women',
        sizes: [
          { size: '6', stock: 14 }, { size: '6.5', stock: 10 }, { size: '7', stock: 18 },
          { size: '7.5', stock: 12 }, { size: '8', stock: 16 }, { size: '8.5', stock: 8 },
          { size: '9', stock: 6 },
        ],
        colors: [
          { name: 'Blush Pink', hex: '#e8c4c4', images: ['/images/products/cloud-pink-1.png'] },
          { name: 'Pure White', hex: '#ffffff', images: ['/images/products/cloud-white-1.png'] },
          { name: 'Sage Green', hex: '#9cae9c', images: ['/images/products/cloud-green-1.png'] },
        ],
        images: ['/images/products/cloud-walk-1.png', '/images/products/cloud-walk-2.png'],
        isFeatured: true,
        tags: ['casual', 'comfort', 'memory-foam', 'minimalist'],
      },
      {
        name: 'Flex Motion Women\'s Trainer',
        description: 'Designed specifically for women\'s feet, the Flex Motion delivers exceptional support and flexibility for your workout. Breathable knit upper with supportive heel counter ensures a secure fit during high-intensity training sessions.',
        price: 37800,
        compareAtPrice: 44800,
        category: sportsCat._id,
        brand: 'SoleMate Athletics',
        gender: 'women',
        sizes: [
          { size: '6', stock: 10 }, { size: '7', stock: 14 }, { size: '7.5', stock: 8 },
          { size: '8', stock: 12 }, { size: '8.5', stock: 6 }, { size: '9', stock: 4 },
        ],
        colors: [
          { name: 'Coral Sunset', hex: '#ff6b6b', images: ['/images/products/flex-coral-1.png'] },
          { name: 'Midnight Purple', hex: '#4a1a6b', images: ['/images/products/flex-purple-1.png'] },
        ],
        images: ['/images/products/flex-motion-1.png', '/images/products/flex-motion-2.png'],
        isNewArrival: true,
        tags: ['training', 'women', 'flexible', 'supportive'],
      },
      {
        name: 'Trail Blazer GTX',
        description: 'Conquer any trail with the Trail Blazer GTX. Waterproof Gore-Tex membrane keeps your feet dry while the aggressive Vibram outsole grips any surface. Reinforced toe cap and ankle support protect you on the toughest terrain.',
        price: 56000,
        category: runningCat._id,
        brand: 'SoleMate Outdoor',
        gender: 'men',
        sizes: [
          { size: '8', stock: 6 }, { size: '9', stock: 8 }, { size: '10', stock: 10 },
          { size: '11', stock: 7 }, { size: '12', stock: 3 },
        ],
        colors: [
          { name: 'Forest Green', hex: '#2d5a27', images: ['/images/products/trail-green-1.png'] },
          { name: 'Storm Gray', hex: '#5a5a5a', images: ['/images/products/trail-gray-1.png'] },
        ],
        images: ['/images/products/trail-blazer-1.png', '/images/products/trail-blazer-2.png'],
        tags: ['trail', 'waterproof', 'hiking', 'outdoor'],
      },
      {
        name: 'Little Explorer Velcro',
        description: 'Easy on, easy off! The Little Explorer features adjustable velcro straps that kids can fasten themselves. Durable rubber outsole withstands playground adventures while the cushioned insole keeps little feet comfortable all day.',
        price: 15400,
        category: kidsCat._id,
        brand: 'SoleMate Kids',
        gender: 'kids',
        sizes: [
          { size: '10C', stock: 20 }, { size: '11C', stock: 18 }, { size: '12C', stock: 15 },
          { size: '13C', stock: 12 }, { size: '1Y', stock: 14 }, { size: '2Y', stock: 10 },
        ],
        colors: [
          { name: 'Royal Blue', hex: '#2060c0', images: ['/images/products/explorer-blue-1.png'] },
          { name: 'Cherry Red', hex: '#d22b2b', images: ['/images/products/explorer-red-1.png'] },
          { name: 'Sunny Yellow', hex: '#f0c040', images: ['/images/products/explorer-yellow-1.png'] },
        ],
        images: ['/images/products/little-explorer-1.png', '/images/products/little-explorer-2.png'],
        isFeatured: true,
        tags: ['kids', 'velcro', 'durable', 'easy-on'],
      },
      {
        name: 'Junior Bounce Active',
        description: 'The Junior Bounce Active is built for energetic kids who never stop moving. Ultra-responsive bounce cushioning absorbs impact while the reinforced mesh upper keeps feet cool. Available in fun, vibrant colors that kids love.',
        price: 19600,
        compareAtPrice: 22400,
        category: kidsCat._id,
        brand: 'SoleMate Kids',
        gender: 'kids',
        sizes: [
          { size: '11C', stock: 12 }, { size: '12C', stock: 10 }, { size: '13C', stock: 14 },
          { size: '1Y', stock: 16 }, { size: '2Y', stock: 8 }, { size: '3Y', stock: 6 },
        ],
        colors: [
          { name: 'Galaxy Purple', hex: '#6b3fa0', images: ['/images/products/bounce-purple-1.png'] },
          { name: 'Electric Green', hex: '#39e75f', images: ['/images/products/bounce-green-1.png'] },
        ],
        images: ['/images/products/junior-bounce-1.png', '/images/products/junior-bounce-2.png'],
        isNewArrival: true,
        tags: ['kids', 'active', 'cushioned', 'colorful'],
      },
      {
        name: 'Elegance Stiletto Heel',
        description: 'Make a statement with the Elegance Stiletto. Premium Italian leather, hand-finished details, and a comfortable padded footbed make this the perfect heel for special occasions. The 3.5-inch heel height strikes the ideal balance between style and walkability.',
        price: 44500,
        category: womenCat._id,
        brand: 'SoleMate Luxe',
        gender: 'women',
        sizes: [
          { size: '6', stock: 8 }, { size: '6.5', stock: 6 }, { size: '7', stock: 10 },
          { size: '7.5', stock: 7 }, { size: '8', stock: 9 }, { size: '8.5', stock: 4 },
        ],
        colors: [
          { name: 'Classic Black', hex: '#1a1a1a', images: ['/images/products/stiletto-black-1.png'] },
          { name: 'Burgundy Wine', hex: '#722f37', images: ['/images/products/stiletto-wine-1.png'] },
        ],
        images: ['/images/products/elegance-heel-1.png', '/images/products/elegance-heel-2.png'],
        tags: ['heels', 'formal', 'leather', 'elegant'],
      },
      {
        name: 'Marathon Elite Carbon',
        description: 'The ultimate marathon racing shoe. Carbon fiber plate delivers propulsive energy return, while the nitrogen-infused foam midsole provides exceptional cushioning mile after mile. Worn by elite runners worldwide. Designed to break records.',
        price: 70000,
        category: runningCat._id,
        brand: 'SoleMate Performance',
        gender: 'unisex',
        sizes: [
          { size: '7', stock: 4 }, { size: '8', stock: 6 }, { size: '9', stock: 8 },
          { size: '10', stock: 5 }, { size: '11', stock: 3 }, { size: '12', stock: 2 },
        ],
        colors: [
          { name: 'Racing Orange', hex: '#ff6b35', images: ['/images/products/marathon-orange-1.png'] },
          { name: 'Stealth Black', hex: '#0d0d0d', images: ['/images/products/marathon-black-1.png'] },
        ],
        images: ['/images/products/marathon-elite-1.png', '/images/products/marathon-elite-2.png'],
        isFeatured: true,
        isNewArrival: true,
        tags: ['marathon', 'racing', 'carbon-fiber', 'elite'],
      },
      {
        name: 'Canvas Slip-On Classic',
        description: 'The timeless slip-on gets a SoleMate upgrade. Premium canvas upper with reinforced stitching, elastic side gussets for easy on/off, and a cushioned EVA insole. A wardrobe staple that works with jeans, shorts, or chinos.',
        price: 16800,
        category: casualCat._id,
        brand: 'SoleMate Lifestyle',
        gender: 'unisex',
        sizes: [
          { size: '7', stock: 20 }, { size: '8', stock: 25 }, { size: '9', stock: 22 },
          { size: '10', stock: 18 }, { size: '11', stock: 12 }, { size: '12', stock: 8 },
        ],
        colors: [
          { name: 'Navy', hex: '#1a2744', images: ['/images/products/canvas-navy-1.png'] },
          { name: 'Off White', hex: '#f5f0e8', images: ['/images/products/canvas-white-1.png'] },
          { name: 'Charcoal', hex: '#36454f', images: ['/images/products/canvas-charcoal-1.png'] },
        ],
        images: ['/images/products/canvas-slip-1.png', '/images/products/canvas-slip-2.png'],
        tags: ['casual', 'canvas', 'slip-on', 'everyday'],
      },
      {
        name: 'Power Lift Training Shoe',
        description: 'Engineered for the gym. Flat, stable platform with zero-drop heel-to-toe design gives you a solid base for squats and deadlifts. Reinforced lateral support prevents rollover during dynamic movements. Grippy rubber outsole sticks to any gym floor.',
        price: 33500,
        category: sportsCat._id,
        brand: 'SoleMate Athletics',
        gender: 'men',
        sizes: [
          { size: '8', stock: 8 }, { size: '9', stock: 10 }, { size: '10', stock: 12 },
          { size: '11', stock: 6 }, { size: '12', stock: 4 },
        ],
        colors: [
          { name: 'Iron Black', hex: '#2c2c2c', images: ['/images/products/power-black-1.png'] },
          { name: 'Gunmetal', hex: '#536872', images: ['/images/products/power-gunmetal-1.png'] },
        ],
        images: ['/images/products/power-lift-1.png', '/images/products/power-lift-2.png'],
        tags: ['training', 'gym', 'weightlifting', 'stable'],
      },
      {
        name: 'Breeze Sandal',
        description: 'The ultimate summer sandal. Contoured footbed with arch support, adjustable triple-strap system, and water-resistant materials make the Breeze perfect for beach days, pool parties, or casual summer outings.',
        price: 12500,
        category: casualCat._id,
        brand: 'SoleMate Comfort',
        gender: 'women',
        sizes: [
          { size: '6', stock: 15 }, { size: '7', stock: 20 }, { size: '8', stock: 18 },
          { size: '9', stock: 10 }, { size: '10', stock: 5 },
        ],
        colors: [
          { name: 'Sandy Tan', hex: '#c4a882', images: ['/images/products/breeze-tan-1.png'] },
          { name: 'Ocean Blue', hex: '#4a90d9', images: ['/images/products/breeze-blue-1.png'] },
        ],
        images: ['/images/products/breeze-sandal-1.png', '/images/products/breeze-sandal-2.png'],
        tags: ['sandals', 'summer', 'comfortable', 'water-resistant'],
      },
      {
        name: 'Retro High-Top Sneaker',
        description: 'Vintage basketball-inspired style meets modern comfort. The Retro High-Top features a premium leather and suede upper, padded collar for ankle support, and a heritage-style vulcanized sole. Old-school cool that never goes out of style.',
        price: 30800,
        category: menCat._id,
        brand: 'SoleMate Heritage',
        gender: 'men',
        sizes: [
          { size: '8', stock: 10 }, { size: '9', stock: 14 }, { size: '10', stock: 16 },
          { size: '11', stock: 8 }, { size: '12', stock: 5 },
        ],
        colors: [
          { name: 'Heritage Red', hex: '#b22234', images: ['/images/products/retro-red-1.png'] },
          { name: 'Classic Black', hex: '#1a1a1a', images: ['/images/products/retro-black-1.png'] },
        ],
        images: ['/images/products/retro-hightop-1.png', '/images/products/retro-hightop-2.png'],
        isNewArrival: true,
        tags: ['sneakers', 'high-top', 'retro', 'basketball'],
      },
      {
        name: 'Zen Yoga Flat',
        description: 'Find your balance in the Zen Yoga Flat. Flexible sole bends with every pose while the moisture-wicking lining keeps feet dry. Collapsible heel lets you slip them on as a mule. From studio to street in one effortless shoe.',
        price: 21000,
        category: womenCat._id,
        brand: 'SoleMate Comfort',
        gender: 'women',
        sizes: [
          { size: '6', stock: 12 }, { size: '7', stock: 16 }, { size: '7.5', stock: 10 },
          { size: '8', stock: 14 }, { size: '8.5', stock: 6 }, { size: '9', stock: 8 },
        ],
        colors: [
          { name: 'Lavender Mist', hex: '#c4b7d5', images: ['/images/products/zen-lavender-1.png'] },
          { name: 'Stone', hex: '#a09080', images: ['/images/products/zen-stone-1.png'] },
        ],
        images: ['/images/products/zen-flat-1.png', '/images/products/zen-flat-2.png'],
        tags: ['yoga', 'flats', 'flexible', 'studio'],
      },
      {
        name: 'Thunder Basketball Pro',
        description: 'Dominate the court with the Thunder Basketball Pro. High-cut design provides superior ankle stability. Zoom Air cushioning in the forefoot delivers explosive responsiveness on cuts and jumps. Herringbone traction pattern grips the hardwood.',
        price: 47000,
        category: sportsCat._id,
        brand: 'SoleMate Athletics',
        gender: 'men',
        sizes: [
          { size: '8', stock: 7 }, { size: '9', stock: 9 }, { size: '10', stock: 11 },
          { size: '11', stock: 8 }, { size: '12', stock: 5 }, { size: '13', stock: 3 },
        ],
        colors: [
          { name: 'Court Black', hex: '#0d0d0d', images: ['/images/products/thunder-black-1.png'] },
          { name: 'Team Red', hex: '#cc0000', images: ['/images/products/thunder-red-1.png'] },
        ],
        images: ['/images/products/thunder-bball-1.png', '/images/products/thunder-bball-2.png'],
        isFeatured: true,
        tags: ['basketball', 'high-top', 'court', 'performance'],
      },
      {
        name: 'Tiny Steps First Walker',
        description: 'Baby\'s first shoes! Soft, flexible sole mimics barefoot walking to support natural foot development. Machine-washable upper with extra-wide opening makes dressing easy. Designed with pediatric podiatrists for healthy little feet.',
        price: 11000,
        category: kidsCat._id,
        brand: 'SoleMate Kids',
        gender: 'kids',
        sizes: [
          { size: '3C', stock: 15 }, { size: '4C', stock: 18 }, { size: '5C', stock: 20 },
          { size: '6C', stock: 12 }, { size: '7C', stock: 10 },
        ],
        colors: [
          { name: 'Baby Blue', hex: '#a8c8e8', images: ['/images/products/tiny-blue-1.png'] },
          { name: 'Soft Pink', hex: '#f0c0c0', images: ['/images/products/tiny-pink-1.png'] },
          { name: 'Mint Green', hex: '#a8e0c0', images: ['/images/products/tiny-mint-1.png'] },
        ],
        images: ['/images/products/tiny-steps-1.png', '/images/products/tiny-steps-2.png'],
        isNewArrival: true,
        tags: ['baby', 'first-walker', 'soft-sole', 'washable'],
      },
      {
        name: 'Executive Oxford',
        description: 'Command the boardroom in the Executive Oxford. Full-grain calfskin leather with Goodyear welt construction ensures these shoes last for years. Hand-burnished finish develops a unique patina over time. Blake-stitched for a sleeker silhouette.',
        price: 61000,
        category: menCat._id,
        brand: 'SoleMate Luxe',
        gender: 'men',
        sizes: [
          { size: '8', stock: 5 }, { size: '9', stock: 7 }, { size: '10', stock: 8 },
          { size: '10.5', stock: 4 }, { size: '11', stock: 6 }, { size: '12', stock: 3 },
        ],
        colors: [
          { name: 'Cognac', hex: '#834a20', images: ['/images/products/oxford-cognac-1.png'] },
          { name: 'Black', hex: '#1a1a1a', images: ['/images/products/oxford-black-1.png'] },
        ],
        images: ['/images/products/executive-oxford-1.png', '/images/products/executive-oxford-2.png'],
        tags: ['formal', 'oxford', 'leather', 'business'],
      },
      {
        name: 'Nimbus Everyday Sneaker',
        description: 'Your go-to sneaker for every day. The Nimbus features a soft knit upper that adapts to your foot shape, a cushioned midsole for all-day comfort, and a durable rubber outsole. Clean lines and versatile colorways make it endlessly pairable.',
        price: 28000,
        category: casualCat._id,
        brand: 'SoleMate Lifestyle',
        gender: 'unisex',
        sizes: [
          { size: '7', stock: 18 }, { size: '8', stock: 22 }, { size: '9', stock: 20 },
          { size: '10', stock: 16 }, { size: '11', stock: 10 }, { size: '12', stock: 6 },
        ],
        colors: [
          { name: 'Cloud Gray', hex: '#c0c0c0', images: ['/images/products/nimbus-gray-1.png'] },
          { name: 'Midnight', hex: '#191970', images: ['/images/products/nimbus-midnight-1.png'] },
          { name: 'All White', hex: '#fafafa', images: ['/images/products/nimbus-white-1.png'] },
        ],
        images: ['/images/products/nimbus-sneaker-1.png', '/images/products/nimbus-sneaker-2.png'],
        isFeatured: true,
        isNewArrival: true,
        tags: ['sneakers', 'everyday', 'comfortable', 'versatile'],
      },
      {
        name: 'Frost Winter Boot',
        description: 'Brave the cold with the Frost Winter Boot. Thinsulate insulation keeps feet warm down to -25°F. Waterproof full-grain leather upper and sealed seams keep snow and slush out. Aggressive lug sole provides confident traction on ice and packed snow.',
        price: 53000,
        compareAtPrice: 64000,
        category: menCat._id,
        brand: 'SoleMate Outdoor',
        gender: 'men',
        sizes: [
          { size: '8', stock: 6 }, { size: '9', stock: 8 }, { size: '10', stock: 10 },
          { size: '11', stock: 5 }, { size: '12', stock: 3 },
        ],
        colors: [
          { name: 'Brown Leather', hex: '#654321', images: ['/images/products/frost-brown-1.png'] },
          { name: 'Black', hex: '#1a1a1a', images: ['/images/products/frost-black-1.png'] },
        ],
        images: ['/images/products/frost-boot-1.png', '/images/products/frost-boot-2.png'],
        tags: ['boots', 'winter', 'waterproof', 'insulated'],
      },
    ]);

    console.log(`Created ${products.length} products`);

    // ─── REVIEWS ─────────────────────────────────
    const reviews = await Review.create([
      {
        product: products[0]._id, // Velocity Runner
        user: customer1._id,
        rating: 5,
        title: 'Best running shoes I\'ve ever owned',
        comment: 'Incredible cushioning and the fit is perfect right out of the box. I\'ve run 200+ miles in these and they still feel great. Highly recommend for anyone training for a marathon.',
      },
      {
        product: products[0]._id,
        user: customer2._id,
        rating: 4,
        title: 'Great shoes, runs a bit narrow',
        comment: 'Love the lightweight feel and responsiveness. My only complaint is they run slightly narrow — I\'d recommend going half a size up if you have wider feet.',
      },
      {
        product: products[3]._id, // Cloud Walk
        user: customer2._id,
        rating: 5,
        title: 'Like walking on clouds',
        comment: 'These live up to their name! The memory foam insole is heavenly. I wear them all day at work and my feet never hurt. Already bought a second pair in a different color.',
      },
      {
        product: products[9]._id, // Marathon Elite
        user: customer1._id,
        rating: 5,
        title: 'PR machine',
        comment: 'Set a new half-marathon PR by 3 minutes in these. The energy return from the carbon plate is unreal. Yes, they\'re expensive, but worth every penny if you\'re serious about racing.',
      },
      {
        product: products[6]._id, // Little Explorer
        user: customer3._id,
        rating: 4,
        title: 'My kid loves them',
        comment: 'My 5-year-old can put these on himself thanks to the velcro straps. They\'ve held up through months of playground rough-housing. Good quality for the price.',
      },
    ]);

    console.log(`Created ${reviews.length} reviews`);

    // ─── SAMPLE ORDERS ───────────────────────────
    const orders = await Order.create([
      {
        user: customer1._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            image: products[0].images[0],
            size: '10',
            color: 'Midnight Black',
            quantity: 1,
            price: products[0].price,
          },
          {
            product: products[10]._id,
            name: products[10].name,
            image: products[10].images[0],
            size: '10',
            color: 'Navy',
            quantity: 2,
            price: products[10].price,
          },
        ],
        shippingAddress: {
          name: 'John Doe',
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          country: 'US',
          phone: '555-0101',
        },
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        subtotal: 269.97,
        shippingCost: 0,
        tax: 21.60,
        total: 291.57,
      },
      {
        user: customer2._id,
        items: [
          {
            product: products[3]._id,
            name: products[3].name,
            image: products[3].images[0],
            size: '7',
            color: 'Blush Pink',
            quantity: 1,
            price: products[3].price,
          },
        ],
        shippingAddress: {
          name: 'Jane Smith',
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zip: '60601',
          country: 'US',
          phone: '555-0102',
        },
        paymentMethod: 'paypal',
        paymentStatus: 'paid',
        orderStatus: 'shipped',
        subtotal: 89.99,
        shippingCost: 9.99,
        tax: 7.20,
        total: 107.18,
        trackingNumber: 'SM-TRK-12345',
      },
      {
        user: customer3._id,
        items: [
          {
            product: products[6]._id,
            name: products[6].name,
            image: products[6].images[0],
            size: '12C',
            color: 'Royal Blue',
            quantity: 1,
            price: products[6].price,
          },
          {
            product: products[7]._id,
            name: products[7].name,
            image: products[7].images[0],
            size: '12C',
            color: 'Galaxy Purple',
            quantity: 1,
            price: products[7].price,
          },
        ],
        shippingAddress: {
          name: 'Sarah Connor',
          street: '321 Elm St',
          city: 'Houston',
          state: 'TX',
          zip: '77001',
          country: 'US',
          phone: '555-0103',
        },
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        subtotal: 124.98,
        shippingCost: 0,
        tax: 10.00,
        total: 134.98,
      },
    ]);

    console.log(`Created ${orders.length} orders`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('   Admin: admin@solemate.com / admin123');
    console.log('   Customer: john@example.com / customer123');
    console.log('   Customer: jane@example.com / customer123');
    console.log('   Customer: sarah@example.com / customer123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
