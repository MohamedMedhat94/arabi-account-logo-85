export interface Product {
  code: string;
  name: string;
  price: number; // in USD
}

// Global products state that can be updated from CSV
let globalProducts: Product[] = [

// Default products data
  { code: "HF32", name: "Oxygen propane on a French network hose", price: 5 },
  { code: "HF37", name: "Oxygen propeller on a German network hose", price: 4 },
  { code: "HF55", name: "Probe oxygen flowmeter network English", price: 5 },
  { code: "HF36", name: "German network oxygen flowmeter probe", price: 4 },
  { code: "HF39", name: "French network oxygen probe flowmeter", price: 5 },
  { code: "HF33", name: "Oxygen propane on an American network hose", price: 6 },
  { code: "HF64", name: "Long German network oxygen flowmeter probe", price: 5 },
  { code: "HF23", name: "American network oxygen flowmeter probe", price: 5 },
  { code: "HF84", name: "German mesh suction regulator probe", price: 5 },
  { code: "HF24", name: "American Network Suction Regulator Probe", price: 5 },
  { code: "HF40", name: "English network suction regulator probe", price: 5 },
  { code: "HF75", name: "Air Flow Meter Network Probe", price: 5 },
  { code: "HF43", name: "Air propeller on German network hose", price: 4 },
  { code: "HF34", name: "L type flume meter prop adapter", price: 2.5 },
  { code: "HF44", name: "German network air flowmeter probe", price: 4 },
  { code: "HF38", name: "French network air flowmeter probe", price: 5 },
  { code: "HF53", name: "Chamber Children's Consumer", price: 3 },
  { code: "HF57", name: "Chambers Consumer Majors", price: 3 },
  { code: "HF85", name: "Permanent children's chamber", price: 16 },
  { code: "HF60", name: "Bottom connection of the flowmeter to the hose", price: 1.5 },
  { code: "HF27", name: "Upper part of the oxygen flowmeter with the German network probe", price: 10 },
  { code: "HF26", name: "Upper part oxygen flowmeter with probe network", price: 10 },
  { code: "HF06", name: "Oxygen regulator tubes in Al-Koura", price: 3.5 },
  { code: "HF14", name: "2L Sterilizable Shockproof Suction Jar", price: 7.5 },
  { code: "HF17", name: "Upper part of the oxygen flowmeter with the French network probe", price: 10 },
  { code: "HF74", name: "Upper part of the air flowmeter with a German mesh probe", price: 10 },
  { code: "HF63", name: "French mesh air flow meter upper part", price: 10 },
  { code: "HF16", name: "2L suction jar skin", price: 2 },
  { code: "HF58", name: "Joan Cobb Flowmeter", price: 1 },
  { code: "HF15", name: "2L Sterilizable Shockproof Suction Jar Lid", price: 6 },
  { code: "HF05", name: "Metal filter for flowmeter", price: 1.5 },
  { code: "HF54", name: "Metal oxygen flowmeter, two-piece network, English", price: 13.5 },
  { code: "HF10", name: "One-piece metal flowmeter, French network", price: 0 }, // manual entry required
  { code: "HF46", name: "Meter meter metal oxygen two pieces German network", price: 13.5 },
  { code: "HF13", name: "Two-piece air metal flowmeter, French mesh", price: 13.5 },
  { code: "HF04", name: "small flowmeter cup", price: 2.5 },
  { code: "HF48", name: "Large flowmeter cup without humidifier", price: 3 },
  { code: "HF59", name: "Oxygen humidifier flowmeter made by Al-Hikma Office (Chinese flowmeter)", price: 7 },
  { code: "HF47", name: "Oxygen humidifier flowmeter made by Al-Hikma Office (regular flowmeter)", price: 7 },
  { code: "HF18", name: "Small humidifier flowmeter cup", price: 0 }, // manual entry required
  { code: "HF65", name: "Humidifier flowmeter made by Al-Hikma Office (regular flowmeter)", price: 4 },
  { code: "HF25", name: "Bottom Probe Flowmeter Adapter for Network", price: 0 }, // manual entry required
  { code: "HF67", name: "Oxygen regulator for cylinder without humidifier", price: 23 },
  { code: "HF78", name: "HEO brand suction device, French network", price: 0 }, // manual entry required
  { code: "hf89", name: "Turkish suction regulator trap", price: 7 },
  { code: "hf102", name: "Newborn Y-shaped pacifier with sterilizable plug", price: 5 },
  { code: "hf104", name: "Loctide red adhesive", price: 0 }, // manual entry required
  { code: "HF105", name: "Large sterilizable soil", price: 6 },
  { code: "HF107", name: "Upper part oxygen flowmeter with probe wisdom network German long", price: 10.5 },
  { code: "HF108", name: "1 Liter Sterilizable Shockproof Suction Jar", price: 6.5 },
  { code: "HF110", name: "Children's permanent chamber without base", price: 0 }, // manual entry required
  { code: "HF111", name: "Connector 22/10", price: 2 },
  { code: "hf113", name: "Cover, 1 liter full suction jar", price: 5 },
  { code: "HF115", name: "French director oxygen brand (H)", price: 14 },
  { code: "HF117", name: "French outlet suction brand", price: 14 },
  { code: "HF118", name: "humidifier nut adapter", price: 2.5 },
  { code: "HF119", name: "Plastic palm connector", price: 1.5 },
  { code: "HF120", name: "Pump drawing a heart with a nail, Wisdom Office", price: 10.5 },
  { code: "HF122", name: "Wisdom Suction Regulator Probe Network English", price: 1.5 },
  { code: "HF83", name: "French suction regulator with key", price: 27 }
];

// Export the default products and provide functions to manage them
export const products = globalProducts;

/**
 * Update the global products list (useful for CSV imports)
 */
export const updateProducts = (newProducts: Product[]) => {
  globalProducts.length = 0; // Clear existing products
  globalProducts.push(...newProducts);
};

/**
 * Add products to the existing list
 */
export const addProducts = (newProducts: Product[]) => {
  globalProducts.push(...newProducts);
};

/**
 * Reset to default products
 */
export const resetToDefaultProducts = () => {
  const defaultProducts: Product[] = [
    { code: "HF32", name: "Oxygen propane on a French network hose", price: 5 },
    { code: "HF37", name: "Oxygen propeller on a German network hose", price: 4 },
    { code: "HF55", name: "Probe oxygen flowmeter network English", price: 5 },
    { code: "HF36", name: "German network oxygen flowmeter probe", price: 4 },
    { code: "HF39", name: "French network oxygen probe flowmeter", price: 5 },
    { code: "HF33", name: "Oxygen propane on an American network hose", price: 6 },
    { code: "HF64", name: "Long German network oxygen flowmeter probe", price: 5 },
    { code: "HF23", name: "American network oxygen flowmeter probe", price: 5 },
    { code: "HF84", name: "German mesh suction regulator probe", price: 5 },
    { code: "HF24", name: "American Network Suction Regulator Probe", price: 5 },
    { code: "HF40", name: "English network suction regulator probe", price: 5 },
    { code: "HF75", name: "Air Flow Meter Network Probe", price: 5 },
    { code: "HF43", name: "Air propeller on German network hose", price: 4 },
    { code: "HF34", name: "L type flume meter prop adapter", price: 2.5 },
    { code: "HF44", name: "German network air flowmeter probe", price: 4 },
    { code: "HF38", name: "French network air flowmeter probe", price: 5 },
    { code: "HF53", name: "Chamber Children's Consumer", price: 3 },
    { code: "HF57", name: "Chambers Consumer Majors", price: 3 },
    { code: "HF85", name: "Permanent children's chamber", price: 16 },
    { code: "HF60", name: "Bottom connection of the flowmeter to the hose", price: 1.5 },
    { code: "HF27", name: "Upper part of the oxygen flowmeter with the German network probe", price: 10 },
    { code: "HF26", name: "Upper part oxygen flowmeter with probe network", price: 10 },
    { code: "HF06", name: "Oxygen regulator tubes in Al-Koura", price: 3.5 },
    { code: "HF14", name: "2L Sterilizable Shockproof Suction Jar", price: 7.5 },
    { code: "HF17", name: "Upper part of the oxygen flowmeter with the French network probe", price: 10 },
    { code: "HF74", name: "Upper part of the air flowmeter with a German mesh probe", price: 10 },
    { code: "HF63", name: "French mesh air flow meter upper part", price: 10 },
    { code: "HF16", name: "2L suction jar skin", price: 2 },
    { code: "HF58", name: "Joan Cobb Flowmeter", price: 1 },
    { code: "HF15", name: "2L Sterilizable Shockproof Suction Jar Lid", price: 6 },
    { code: "HF05", name: "Metal filter for flowmeter", price: 1.5 },
    { code: "HF54", name: "Metal oxygen flowmeter, two-piece network, English", price: 13.5 },
    { code: "HF10", name: "One-piece metal flowmeter, French network", price: 0 },
    { code: "HF46", name: "Meter meter metal oxygen two pieces German network", price: 13.5 },
    { code: "HF13", name: "Two-piece air metal flowmeter, French mesh", price: 13.5 },
    { code: "HF04", name: "small flowmeter cup", price: 2.5 },
    { code: "HF48", name: "Large flowmeter cup without humidifier", price: 3 },
    { code: "HF59", name: "Oxygen humidifier flowmeter made by Al-Hikma Office (Chinese flowmeter)", price: 7 },
    { code: "HF47", name: "Oxygen humidifier flowmeter made by Al-Hikma Office (regular flowmeter)", price: 7 },
    { code: "HF18", name: "Small humidifier flowmeter cup", price: 0 },
    { code: "HF65", name: "Humidifier flowmeter made by Al-Hikma Office (regular flowmeter)", price: 4 },
    { code: "HF25", name: "Bottom Probe Flowmeter Adapter for Network", price: 0 },
    { code: "HF67", name: "Oxygen regulator for cylinder without humidifier", price: 23 },
    { code: "HF78", name: "HEO brand suction device, French network", price: 0 },
    { code: "hf89", name: "Turkish suction regulator trap", price: 7 },
    { code: "hf102", name: "Newborn Y-shaped pacifier with sterilizable plug", price: 5 },
    { code: "hf104", name: "Loctide red adhesive", price: 0 },
    { code: "HF105", name: "Large sterilizable soil", price: 6 },
    { code: "HF107", name: "Upper part oxygen flowmeter with probe wisdom network German long", price: 10.5 },
    { code: "HF108", name: "1 Liter Sterilizable Shockproof Suction Jar", price: 6.5 },
    { code: "HF110", name: "Children's permanent chamber without base", price: 0 },
    { code: "HF111", name: "Connector 22/10", price: 2 },
    { code: "hf113", name: "Cover, 1 liter full suction jar", price: 5 },
    { code: "HF115", name: "French director oxygen brand (H)", price: 14 },
    { code: "HF117", name: "French outlet suction brand", price: 14 },
    { code: "HF118", name: "humidifier nut adapter", price: 2.5 },
    { code: "HF119", name: "Plastic palm connector", price: 1.5 },
    { code: "HF120", name: "Pump drawing a heart with a nail, Wisdom Office", price: 10.5 },
    { code: "HF122", name: "Wisdom Suction Regulator Probe Network English", price: 1.5 },
    { code: "HF83", name: "French suction regulator with key", price: 27 }
  ];
  
  updateProducts(defaultProducts);
};

// Initialize with default products
resetToDefaultProducts();

export const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "EGP", name: "Egyptian Pound", symbol: "LE", rate: 50 }
];