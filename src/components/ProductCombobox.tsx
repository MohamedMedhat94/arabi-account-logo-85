import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { products, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
  placeholder?: string;
  className?: string;
  currencySymbol: string;
  convertPrice: (price: number) => number;
}

export default function ProductCombobox({
  value,
  onChange,
  onProductSelect,
  placeholder = "Type to search products...",
  className = "",
  currencySymbol,
  convertPrice
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    product.code.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (product: Product) => {
    onChange(product.name);
    onProductSelect(product);
    setOpen(false);
    setSearchValue("");
  };

  const currentProduct = products.find(p => p.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-2 focus:border-primary/50 transition-colors bg-background",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0 z-[9999]" 
        align="start"
        side="bottom"
        sideOffset={2}
      >
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search products..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {filteredProducts.slice(0, 20).map((product) => (
                <CommandItem
                  key={product.code}
                  value={product.code}
                  onSelect={() => handleSelect(product)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">
                        {product.code} - {product.name}
                      </div>
                      <div className="text-xs font-medium text-primary">
                        {currencySymbol}{convertPrice(product.price).toFixed(2)}
                        {product.price === 0 && (
                          <span className="text-destructive ml-2">
                            (Manual entry required)
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        value === product.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}