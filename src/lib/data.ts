import raw from "./data.json";

export const SITE = {
  name: "Jay Bhavani Vadapav",
  tagline: "Vadapav Bole To Jay Bhavani",
  url: "https://jaybhavanivadapav.com",
  phone: "+91 75758 05500",
  phoneHref: "tel:+917575805500",
  email: "jbvfoods24x7@gmail.com",
  franchiseEmail: "franchise@jbvindia.com",
  address: "Office no - 808, 809, The Capital 2, Science City Road, Sola, Ahmedabad, 380060",
  social: {
    facebook: "https://www.facebook.com/jaybhavaniofficial/",
    instagram: "https://www.instagram.com/jaybhavaniofficial/?hl=en",
  },
  franchiseLogin: "https://fms.billberrypos.com/",
  orderUs: "https://order.toasttab.com/online/jay-bhavani-suwanee-indian-street-food-3230-caliber-st-a-104",
  orderAu: {
    Gungahlin: "https://jaybhavani.com.au/gungahlin/",
    Clayton: "https://jaybhavani.com.au/clayton/",
    Brisbane: "https://jaybhavani.com.au/brisbane/",
    Adelaide: "https://jaybhavani.com.au/adelaide/",
    Sydney: "https://jaybhavani.com.au/riverstone/",
  } as Record<string, string>,
};

export const NAV = [
  { href: "/about/", label: "About" },
  { href: "/store-locator/", label: "Store Locator" },
  { href: "/menu/", label: "Menu" },
  { href: "/franchise/", label: "Franchise" },
  { href: "/gallery/", label: "Gallery" },
  { href: "/contact-us/", label: "Contact Us" },
];

export type MenuItem = { name: string; img: string };
export type Category = { slug: string; label: string; items: MenuItem[] };
export const MENU: Category[] = (raw.menu as { slug: string; label: string; items: MenuItem[] }[]).map((c) => ({
  slug: c.slug === "excotic-vadapav" ? "exotic-vadapav" : c.slug,
  label: c.label,
  items: c.items,
}));
export const catBySlug = (s: string) => MENU.find((c) => c.slug === s);
export const MENU_COUNT = MENU.reduce((n, c) => n + c.items.length, 0);

/** The 12 hero categories on the home page (original "food-menu" tiles) */
export const FEATURED = [
  { label: "Vadapav", slug: "vadapav", img: "/img/food-menu/vadapav.webp" },
  { label: "Dabeli", slug: "dabeli", img: "/img/food-menu/dabeli.webp" },
  { label: "Chinese & Paneer Puff", slug: "puff", img: "/img/food-menu/puff.webp" },
  { label: "Sandwich", slug: "sandwich", img: "/img/food-menu/sandwich.webp" },
  { label: "Maska Bun", slug: "maskabun", img: "/img/food-menu/maskabun.webp" },
  { label: "South Indian", slug: "south-indian", img: "/img/food-menu/south-indian.webp" },
  { label: "Bhaji Pav", slug: "pav-bhaji", img: "/img/food-menu/bhaji-pav.webp" },
  { label: "Pulav", slug: "pulav", img: "/img/food-menu/pulav.webp" },
  { label: "Chinese", slug: "chinese", img: "/img/food-menu/chinese.webp" },
  { label: "French Fries", slug: "french-fries", img: "/img/food-menu/french-fries.webp" },
  { label: "Milkshakes", slug: "milk-shakes", img: "/img/food-menu/milkshake.webp" },
  { label: "Fresh Juice", slug: "fresh-juice", img: "/img/food-menu/fruit-juice.webp" },
];

export type Store = { city: string; region: string; country: "INDIA" | "USA" | "CANADA" | "AUSTRALIA"; address: string; hours: string; map: string };
const cap = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
export const STORES: Store[] = (raw.stores as { city: string | null; state: string | null; country: string; address: string; hours: string; map: string }[]).map((s) => {
  const india = s.country === "INDIA";
  return {
    city: cap(india ? (s.city || s.state || "") : (s.state || s.country)),
    region: cap(india ? (s.state || "") : s.country),
    country: s.country as Store["country"],
    address: s.address.replace(/\s+/g, " ").trim(),
    hours: s.hours,
    map: s.map,
  };
});
export const COUNTRIES = ["INDIA", "USA", "CANADA", "AUSTRALIA"] as const;
export const storeCount = (c: string) => STORES.filter((s) => s.country === c).length;

export const TIMELINE = (raw.timeline as { year: string; img: string; text: string }[]).slice().reverse(); // chronological

export const OVERSEAS = {
  USA: ["Suwanee", "Edison", "Decatur", "Mechanicsburg", "Hoffman Estate", "Houston", "Bakersfield", "Tampa"],
  Canada: ["Scarborough", "London", "Etobicoke", "Kitchener", "Oshawa", "Windsor", "Montreal", "Hamilton"],
  Australia: ["Gungahlin", "Clayton", "Brisbane", "Adelaide", "Sydney"],
};

export const USPS = [
  { icon: "/img/jb-icon/1.webp", title: "Irresistible Taste", text: "Blending spices and flavors that keep you coming back for more and more" },
  { icon: "/img/jb-icon/2.webp", title: "Crispy, Hot, and Fresh", text: "Everything we serve is made fresh, crispy on the outside, and hot to perfection inside" },
  { icon: "/img/jb-icon/3.webp", title: "Spicy Surprises", text: "Our signature chutneys add an extra zing, making every bite a burst of flavor" },
  { icon: "/img/jb-icon/4.webp", title: "A Feast for All Tastes", text: "From vada pav to dosa, sandwiches to chocolate shakes, we’ve got something to satisfy every craving!" },
];

export const GALLERY = Array.from({ length: 24 }, (_, i) => `/img/gallery/jaybhavani-gallery-${i + 1}.webp`);
export const EVENT_TYPES = ["Baby Shower", "Marriage", "Reception", "Corporate Event", "Other"];
export const FRANCHISE_COUNTRIES = ["India", "USA", "Australia", "Canada", "UK"];
