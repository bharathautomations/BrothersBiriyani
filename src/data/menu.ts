export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
  rating: number;
  isPopular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// Prices are draft INR estimates for Bengaluru pricing - confirm against the physical menu card
// (Menu1/2/3.jpeg) and update here; this file is the single source of truth for all menu displays.
export const menuCategories: MenuCategory[] = [
  {
    id: 'biriyani',
    name: 'Biriyani',
    items: [
      {
        name: 'Chicken Dum Biriyani',
        description:
          'Slow-cooked perfection where turmeric-infused basmati embraces juicy chicken in a symphony of aromatic spices, served with tangy curry, fresh cilantro raita, and zesty lime.',
        price: '₹220',
        image: '/images/ChickenDumBiriyani.jpeg',
        rating: 5,
        isPopular: true,
      },
      {
        name: 'Mutton Biriyani',
        description:
          'Long-grain basmati infused with saffron strands and whole spices, crowned with fall-apart-tender mutton, complemented by cooling raita, spicy curry, and crisp onions on fresh banana leaf.',
        price: '₹320',
        image: '/images/MuttonBiriyani.jpeg',
        rating: 5,
        isPopular: true,
      },
      {
        name: 'Chicken Biriyani with Kebab',
        description:
          'Golden saffron-kissed basmati rice layered with tender chicken, accompanied by smoky charcoal-grilled kebabs, cooling mint raita, and aromatic spiced curry—a complete feast on a banana leaf.',
        price: '₹280',
        image: '/images/ChickenBiriyaniWithKebab.jpeg',
        rating: 5,
        isPopular: true,
      },
    ],
  },
  {
    id: 'kebabs-starters',
    name: 'Kebabs & Starters',
    items: [
      {
        name: 'Chicken Kebab',
        description:
          'Tandoori-spiced chicken pieces kissed by fire, featuring a deep crimson marinade of red chili, paprika, and garam masala, served with pink onion rings and fresh lime on a traditional banana leaf.',
        price: '₹180',
        image: '/images/ChickenKebab.jpeg',
        rating: 5,
      },
      {
        name: 'Chicken Lollipop',
        description:
          'Crispy Indo-Chinese drumstick delights with a fiery red pepper coating, double-fried to golden perfection and garnished with tangy onion rings and a citrus squeeze.',
        price: '₹200',
        image: '/images/ChickenLollipop.jpeg',
        rating: 4,
      },
    ],
  },
  {
    id: 'soups',
    name: 'Soups',
    items: [
      {
        name: 'Kaal Soup',
        description:
          'Rustic bone-in mutton soup simmered with earthy peppercorns, warming ginger, and aromatic star anise in a soul-soothing golden broth—a traditional remedy and delicacy.',
        price: '₹150',
        image: '/images/KaalSoup.jpeg',
        rating: 5,
      },
    ],
  },
  {
    id: 'family-packs',
    name: 'Family Packs',
    items: [
      {
        name: 'Chicken Bucket Biriyani Mega',
        description:
          'Family-sized bucket overflowing with fragrant golden biriyani studded with succulent chicken pieces, served with tandoori kebabs, creamy raita, and rich curry for the ultimate sharing experience.',
        price: '₹1,800',
        image: '/images/ChickenBucketBiriyaniMega.jpeg',
        rating: 5,
        isPopular: true,
      },
    ],
  },
];

export const signatureDishes: MenuItem[] = menuCategories.flatMap((category) => category.items);
