import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadCSVFile, convertCSVToProducts } from '@/utils/csvParser';
import { Product } from '@/data/products';

interface CSVProductUploaderProps {
  onProductsLoaded: (products: Product[]) => void;
  className?: string;
}

export default function CSVProductUploader({ onProductsLoaded, className = "" }: CSVProductUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV file (.csv extension required)",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Loading CSV File...",
        description: "Processing your product data"
      });

      const csvProducts = await loadCSVFile(file);
      const products = convertCSVToProducts(csvProducts);

      if (products.length === 0) {
        toast({
          title: "No Products Found",
          description: "The CSV file doesn't contain any valid product data",
          variant: "destructive"
        });
        return;
      }

      onProductsLoaded(products);
      
      toast({
        title: "Products Loaded Successfully",
        description: `Loaded ${products.length} products from CSV file`
      });

      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error loading CSV:', error);
      toast({
        title: "Error Loading CSV",
        description: "Failed to parse the CSV file. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`shadow-lg border-0 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5 text-primary" />
          Load Products from CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button 
            onClick={triggerFileSelect}
            className="w-full h-12 bg-primary hover:bg-primary/90"
          >
            <FileText className="mr-2 h-4 w-4" />
            Choose CSV File
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Expected CSV Format:</p>
              <div className="bg-background p-2 rounded border font-mono text-xs">
                <div>Product,Code,Price</div>
                <div>"Oxygen regulator",HF32,5.00</div>
                <div>"Air flowmeter",HF37,4.50</div>
              </div>
              <p className="mt-2">
                • First row should contain headers
                • Product name in first column
                • Product code in second column  
                • Price in third column
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}