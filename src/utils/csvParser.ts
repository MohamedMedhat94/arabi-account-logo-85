export interface CSVProduct {
  code: string;
  name: string;
  price: number;
}

/**
 * Parse CSV content and extract product data
 * Expected CSV format: Product, Code, Price
 */
export const parseProductCSV = (csvContent: string): CSVProduct[] => {
  const lines = csvContent.trim().split('\n');
  const products: CSVProduct[] = [];
  
  // Skip header row (assuming first row is headers)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split by comma, handling quoted fields
    const fields = parseCSVLine(line);
    
    if (fields.length >= 3) {
      const product: CSVProduct = {
        name: fields[0]?.trim() || '',
        code: fields[1]?.trim() || '',
        price: parseFloat(fields[2]?.trim() || '0') || 0
      };
      
      // Only add if we have at least a name and code
      if (product.name && product.code) {
        products.push(product);
      }
    }
  }
  
  return products;
};

/**
 * Parse a single CSV line, handling quoted fields with commas
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

/**
 * Load and parse CSV file from file input
 */
export const loadCSVFile = (file: File): Promise<CSVProduct[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const products = parseProductCSV(content);
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Convert CSV products to the format expected by the application
 */
export const convertCSVToProducts = (csvProducts: CSVProduct[]) => {
  return csvProducts.map(csvProduct => ({
    code: csvProduct.code,
    name: csvProduct.name,
    price: csvProduct.price
  }));
};