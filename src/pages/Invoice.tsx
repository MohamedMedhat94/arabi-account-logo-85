import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Trash2, QrCode, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateInvoicePDFVector } from '@/utils/pdf/vectorInvoice';
import logoHekma from '/lovable-uploads/7719847d-3aa5-4ae9-9ff7-68e9a2d064c4.png';

import { products, currencies, Product, updateProducts } from '@/data/products';
import { countries } from '@/data/countries';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import ReactSelect from 'react-select';
import ProductCombobox from '@/components/ProductCombobox';
interface InvoiceItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
const Invoice = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const invoiceType = searchParams.get('type') || 'proforma'; // Default to proforma
  
  // Create isolated state management for each invoice type
  const getStorageKey = (key: string) => `invoice_${invoiceType}_${key}`;
  
  // Initialize state with type-specific storage
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const saved = localStorage.getItem(getStorageKey('currency'));
    return saved ? JSON.parse(saved) : 'USD';
  });
  
  const [items, setItems] = useState<InvoiceItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('items'));
    return saved ? JSON.parse(saved) : [{
      id: '1',
      itemCode: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }];
  });
  
  const [clientInfo, setClientInfo] = useState(() => {
    const saved = localStorage.getItem(getStorageKey('clientInfo'));
    return saved ? JSON.parse(saved) : {
      name: '',
      tel: '',
      address: '',
      country: '',
      date: new Date().toISOString().split('T')[0],
      piNo: '',
      taxPercent: 0,
      discountPercent: 0
    };
  });

  // Payment terms and additional data state (Proforma-specific)
  const [paymentTermsData, setPaymentTermsData] = useState(() => {
    const saved = localStorage.getItem(getStorageKey('paymentTerms'));
    return saved ? JSON.parse(saved) : {
      paymentTerms: '100% Advance',
      priceValidity: '',
      portOfLoading: 'Egypt',
      portOfDestination: '',
      timeOfShipment: '',
      bankName: 'Emirates NBD',
      accountNo: '1020399670707',
      remarks: ''
    };
  });

  // Save state changes to type-specific storage
  useEffect(() => {
    localStorage.setItem(getStorageKey('currency'), JSON.stringify(selectedCurrency));
  }, [selectedCurrency, invoiceType]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('items'), JSON.stringify(items));
  }, [items, invoiceType]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('clientInfo'), JSON.stringify(clientInfo));
  }, [clientInfo, invoiceType]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('paymentTerms'), JSON.stringify(paymentTermsData));
  }, [paymentTermsData, invoiceType]);

  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  
  // Currency conversion helper
  const convertPrice = (usdPrice: number) => {
    return selectedCurrency === 'EGP' ? usdPrice * 50 : usdPrice;
  };

  // Update all prices when currency changes
  useEffect(() => {
    setItems(prevItems => 
      prevItems.map(item => {
        const product = products.find(p => p.name === item.description);
        if (product && product.price > 0) {
          const newUnitPrice = convertPrice(product.price);
          return {
            ...item,
            unitPrice: newUnitPrice,
            total: item.quantity * newUnitPrice
          };
        }
        return item;
      })
    );
  }, [selectedCurrency]);

  const selectProduct = (itemId: string, productCode: string) => {
    const product = products.find(p => p.code === productCode);
    if (product) {
      updateItem(itemId, 'itemCode', product.code);
      updateItem(itemId, 'description', product.name);
      updateItem(itemId, 'unitPrice', convertPrice(product.price));
    }
  };

  const filteredProducts = (query: string) => {
    if (!query) return [];
    return products.filter(product =>
      product.name.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 10);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Ensure valid values for quantity and prices
        if (field === 'quantity' && typeof value === 'number') {
          updatedItem.quantity = Math.max(1, value || 1);
        }
        if (field === 'unitPrice' && typeof value === 'number') {
          updatedItem.unitPrice = Math.max(0, value || 0);
        }
        
        // Recalculate total when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Math.max(0, updatedItem.quantity * updatedItem.unitPrice);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleProductSelect = (itemId: string, product: Product) => {
    const currentItem = items.find(item => item.id === itemId);
    const convertedPrice = convertPrice(product.price);
    const quantity = currentItem ? currentItem.quantity : 1;
    
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          itemCode: product.code,
          description: product.name,
          unitPrice: convertedPrice,
          total: quantity * convertedPrice
        };
      }
      return item;
    }));
  };

  const addItem = () => {
    if (items.length < 20) {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        itemCode: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      };
      setItems([...items, newItem]);
    }
  };

  const generatePDF = async () => {
    try {
      toast({
        title: "جاري إنشاء الفاتورة",
        description: "جاري تحضير ملف PDF نصّي..."
      });

      // Create completely isolated data object for this specific invoice type
      const data = {
        clientName: clientInfo.name || '',
        clientTel: clientInfo.tel || '',
        clientAddress: clientInfo.address || '',
        clientCountry: clientInfo.country || '',
        date: clientInfo.date || new Date().toISOString().slice(0, 10),
        piNo: clientInfo.piNo || '',
        currency: selectedCurrency,
        currencySymbol: currentCurrency.symbol,
        invoiceType: invoiceType, // Critical: Ensure invoice type isolation
        items: items.map((it) => ({
          itemCode: it.itemCode || '',
          description: it.description || '',
          quantity: Number(it.quantity) || 0,
          unitPrice: Number(it.unitPrice) || 0,
          total: Number(it.total) || 0,
        })),
        grandTotal: Number(grandTotal) || 0,
        taxPercent: Number(clientInfo.taxPercent) || 0,
        taxAmount: Number(taxAmount) || 0,
        discountPercent: Number(clientInfo.discountPercent) || 0,
        discountAmount: Number(discountAmount) || 0,
        netTotal: Number(netTotal) || 0,
        // Include payment terms data for Proforma invoices
        paymentTerms: invoiceType === 'proforma' ? paymentTermsData.paymentTerms : undefined,
        priceValidity: invoiceType === 'proforma' ? paymentTermsData.priceValidity : undefined,
        portOfLoading: invoiceType === 'proforma' ? paymentTermsData.portOfLoading : undefined,
        portOfDestination: invoiceType === 'proforma' ? paymentTermsData.portOfDestination : undefined,
        timeOfShipment: invoiceType === 'proforma' ? paymentTermsData.timeOfShipment : undefined,
        bankName: invoiceType === 'proforma' ? paymentTermsData.bankName : undefined,
        accountNo: invoiceType === 'proforma' ? paymentTermsData.accountNo : undefined,
        remarks: invoiceType === 'proforma' ? paymentTermsData.remarks : undefined,
      };

      await generateInvoicePDFVector(data);
      
      toast({
        title: "تم إنشاء الفاتورة بنجاح",
        description: "تم تحميل ملف PDF للفاتورة"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "خطأ في إنشاء الفاتورة",
        description: "حدث خطأ أثناء إنشاء ملف PDF",
        variant: "destructive"
      });
    }
  };


  // Calculate totals
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = grandTotal * clientInfo.taxPercent / 100;
  const discountAmount = grandTotal * clientInfo.discountPercent / 100;
  const netTotal = grandTotal + taxAmount - discountAmount;
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 md:p-8 invoice-container" id="invoice-page">
      <div className="mx-auto max-w-7xl space-y-8 invoice-professional">
        
        {/* Company Header - Enhanced Professional Design */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-background to-background/95 invoice-header">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              
              {/* Arabic Section */}
              <div className="text-right space-y-2 flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                  مكتب الحكمة الهندسي
                </h1>
                <div className="space-y-1 text-muted-foreground">
                  <p className="text-xs font-medium">العنوان: ٤١ شارع الماوردي، القصر العيني، القاهرة، مصر</p>
                  <p className="text-xs font-medium">تليفون: ٢٠ ١١ ٤٧٣٠٤٨٨٠+ | فاكس: ٢٠٢٧٩٣٢١١٥+</p>
                  <p className="text-xs font-medium">البريد الإلكتروني: el_hekma2013@yahoo.com</p>
                </div>
              </div>
              
              {/* Logo Section */}
              <div className="flex-shrink-0 invoice-logo-section">
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-2xl border border-primary/20">
                  <img 
                    src={logoHekma} 
                    alt="مكتب الحكمة الهندسي" 
                    className="h-24 w-24 object-contain filter drop-shadow-md" 
                  />
                </div>
              </div>
              
              {/* English Section */}
              <div className="text-left space-y-2 flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                  EL HEKMA Engineering Office
                </h1>
                <div className="space-y-1 text-muted-foreground">
                  <p className="text-xs font-medium">ADD: 41 Al-Mawardi Street, Al-Qasr Al-Aini,</p>
                  <p className="text-xs font-medium">Cairo, Egypt</p>
                  <p className="text-xs font-medium">Tel: +20 11 47304880 | Fax: +2027932115</p>
                  <p className="text-xs font-medium">Email: el_hekma2013@yahoo.com</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Invoice Title - Enhanced */}
        <div className="text-center py-8">
          <div className="inline-block">
            <h2 className="text-5xl font-bold text-primary mb-2">
              {invoiceType === 'commercial' ? 'Commercial Invoice' : 'Proforma Invoice'}
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full"></div>
          </div>
        </div>

        {/* Client Information - Enhanced */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-primary mb-6 border-b border-primary/20 pb-2">
              Client Information / معلومات العميل
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-semibold text-foreground">
                  Client / العميل
                </Label>
                <Input 
                  id="clientName" 
                  placeholder="Client Name" 
                  value={clientInfo.name} 
                  onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })}
                  className="h-12 border-2 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientTel" className="text-sm font-semibold text-foreground">
                  Tel / التليفون
                </Label>
                <Input 
                  id="clientTel" 
                  placeholder="+20 1X XXX XXXX" 
                  value={clientInfo.tel} 
                  onChange={e => setClientInfo({ ...clientInfo, tel: e.target.value })}
                  className="h-12 border-2 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientAddress" className="text-sm font-semibold text-foreground">
                  Address / العنوان
                </Label>
                <Input 
                  id="clientAddress" 
                  placeholder="Client Address" 
                  value={clientInfo.address} 
                  onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })}
                  className="h-12 border-2 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCountry" className="text-sm font-semibold text-foreground">
                  Country / البلد
                </Label>
                <ReactSelect
                  value={clientInfo.country ? { label: clientInfo.country, value: clientInfo.country } : null}
                  onChange={(option) => setClientInfo({ ...clientInfo, country: option?.value || '' })}
                  options={countries.map(c => ({ label: c, value: c }))}
                  placeholder="Search country..."
                  className="react-select-container text-sm"
                  classNamePrefix="react-select"
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: '48px',
                      minHeight: '48px',
                      border: '2px solid hsl(var(--border))',
                      background: 'hsl(var(--background))',
                      '&:hover': { borderColor: 'hsl(var(--primary) / 0.5)' },
                      '&:focus-within': { borderColor: 'hsl(var(--primary) / 0.5)' }
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 100,
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))'
                    }),
                    option: (base, state) => ({
                      ...base,
                      background: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--background))',
                      color: state.isFocused ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))'
                    })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate" className="text-sm font-semibold text-foreground">
                  Date / التاريخ
                </Label>
                <Input 
                  id="invoiceDate" 
                  type="date" 
                  value={clientInfo.date} 
                  onChange={e => setClientInfo({ ...clientInfo, date: e.target.value })}
                  className="h-12 border-2 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="piNo" className="text-sm font-semibold text-foreground">
                  PI No. / رقم الفاتورة المبدئية
                </Label>
                <Input 
                  id="piNo" 
                  placeholder="Proforma Invoice No." 
                  value={clientInfo.piNo} 
                  onChange={e => setClientInfo({ ...clientInfo, piNo: e.target.value })}
                  className="h-12 border-2 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-semibold text-foreground">
                  Currency / العملة
                </Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="h-12 border-2 focus:border-primary/50 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {currencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxPercent" className="text-sm font-semibold text-foreground">
                  Tax % / نسبة الضريبة
                </Label>
                 <Input 
                   id="taxPercent" 
                   type="number" 
                   min="0"
                   step="0.01"
                   placeholder="0" 
                   value={clientInfo.taxPercent} 
                   onChange={e => setClientInfo({ ...clientInfo, taxPercent: Math.max(0, Number(e.target.value)) })}
                   className="h-12 border-2 focus:border-primary/50 transition-colors"
                 />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPercent" className="text-sm font-semibold text-foreground">
                  Discount % / نسبة الخصم
                </Label>
                 <Input 
                   id="discountPercent" 
                   type="number" 
                   min="0"
                   step="0.01"
                   placeholder="0" 
                   value={clientInfo.discountPercent} 
                   onChange={e => setClientInfo({ ...clientInfo, discountPercent: Math.max(0, Number(e.target.value)) })}
                   className="h-12 border-2 focus:border-primary/50 transition-colors"
                 />
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Items Table - Full Width */}
        <Card className="shadow-lg border-0 overflow-hidden avoid-break">
          <CardHeader className="bg-primary text-primary-foreground py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">
                Invoice Items / عناصر الفاتورة
              </h3>
              <Button 
                onClick={addItem} 
                disabled={items.length >= 20}
                className="no-print bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border border-primary-foreground/30"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item ({items.length}/20)
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="invoice-items-table">
              <TableHeader>
                <TableRow className="bg-primary text-primary-foreground hover:bg-primary">
                  <TableHead className="font-bold text-center py-3 text-primary-foreground">#</TableHead>
                  <TableHead className="font-bold text-center py-3 text-primary-foreground">Item Code / كود الصنف</TableHead>
                  <TableHead className="font-bold text-center py-3 text-primary-foreground">Description / الوصف</TableHead>
                  <TableHead className="font-bold text-center py-3 text-primary-foreground">Quantity / الكمية</TableHead>
                  <TableHead className="font-bold text-center py-3 text-primary-foreground">Unit Price / سعر الوحدة</TableHead>
                  <TableHead className="font-bold text-center py-3 text-primary-foreground">Total / الإجمالي</TableHead>
                  <TableHead className="font-bold text-center py-3 text-primary-foreground no-print">Remove / حذف</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    className={`transition-colors hover:bg-muted/20 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/10"
                    }`}
                  >
                    <TableCell className="text-center font-semibold py-3">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3">
                      <Input 
                        placeholder="Item Code" 
                        value={item.itemCode} 
                        onChange={e => updateItem(item.id, 'itemCode', e.target.value)} 
                        className="border-2 focus:border-primary/50 transition-colors bg-background text-sm"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <ProductCombobox
                        value={item.description}
                        onChange={(value) => updateItem(item.id, 'description', value)}
                        onProductSelect={(product) => handleProductSelect(item.id, product)}
                        placeholder="Select product..."
                        currencySymbol={currentCurrency.symbol}
                        convertPrice={convertPrice}
                        className="text-sm"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input 
                        type="number" 
                        min="1"
                        step="1"
                        placeholder="1" 
                        value={item.quantity || 1} 
                        onChange={e => updateItem(item.id, 'quantity', Math.max(1, Number(e.target.value) || 1))} 
                        className="border-2 focus:border-primary/50 transition-colors bg-background text-sm text-center"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01" 
                        placeholder="0.00" 
                        value={item.unitPrice} 
                        onChange={e => updateItem(item.id, 'unitPrice', Math.max(0, Number(e.target.value) || 0))} 
                        className="border-2 focus:border-primary/50 transition-colors bg-background text-sm text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center font-bold text-base py-3">
                      {currentCurrency.symbol}{item.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center py-3 no-print">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(item.id)} 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Terms Section - Conditional for Proforma Invoice only */}
        <div className={`grid grid-cols-1 ${invoiceType === 'proforma' ? 'lg:grid-cols-2' : ''} gap-8`}>
          {invoiceType === 'proforma' && (
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-primary">Payment Terms / شروط الدفع</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">100% Advance</Label>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Price Validity / صالح المعروض:</Label>
                  <select 
                    className="w-full p-2 border border-input rounded-md bg-background text-sm"
                    value={paymentTermsData.priceValidity}
                    onChange={e => setPaymentTermsData({ ...paymentTermsData, priceValidity: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="7 Days">7 Days</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Port of Loading:</Label>
                  <Input 
                    value={paymentTermsData.portOfLoading}
                    onChange={e => setPaymentTermsData({ ...paymentTermsData, portOfLoading: e.target.value })}
                    placeholder="Egypt" 
                    className="text-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Port of Destination / ميناء الوجهة:</Label>
                  <ReactSelect
                    value={paymentTermsData.portOfDestination ? { label: paymentTermsData.portOfDestination, value: paymentTermsData.portOfDestination } : null}
                    onChange={(option) => setPaymentTermsData({ ...paymentTermsData, portOfDestination: option?.value || '' })}
                    options={countries.map(c => ({ label: c, value: c }))}
                    placeholder="Search country..."
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '32px',
                        fontSize: '14px'
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Time of Shipment:</Label>
                  <Input 
                    type="date" 
                    value={paymentTermsData.timeOfShipment}
                    onChange={e => setPaymentTermsData({ ...paymentTermsData, timeOfShipment: e.target.value })}
                    className="text-sm" 
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Payment Information:</Label>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Company Name:</Label>
                      <Input value="EL HEKMA Engineering Office" readOnly className="text-xs bg-muted/50" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Bank Name:</Label>
                      <Input 
                        value={paymentTermsData.bankName}
                        onChange={e => setPaymentTermsData({ ...paymentTermsData, bankName: e.target.value })}
                        placeholder="Emirates NBD" 
                        className="text-xs" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Account No:</Label>
                      <Input 
                        value={paymentTermsData.accountNo}
                        onChange={e => setPaymentTermsData({ ...paymentTermsData, accountNo: e.target.value })}
                        placeholder="1020399670707" 
                        className="text-xs" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Remarks:</Label>
                  <Textarea 
                    value={paymentTermsData.remarks}
                    onChange={e => setPaymentTermsData({ ...paymentTermsData, remarks: e.target.value })}
                    placeholder="Write any additional remarks here..." 
                    className="text-sm min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary and PDF Section */}
          <div className="space-y-6">
            {/* Totals Summary */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="space-y-3 p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-background rounded-md border">
                    <span className="font-medium text-sm">Grand Total:</span>
                    <span className="font-bold text-lg">{currentCurrency.symbol}{grandTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 px-3 bg-background rounded-md border">
                    <span className="font-medium text-sm">Tax ({clientInfo.taxPercent}%):</span>
                    <span className="font-bold text-lg text-green-600">{currentCurrency.symbol}{taxAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 px-3 bg-background rounded-md border">
                    <span className="font-medium text-sm">Discount ({clientInfo.discountPercent}%):</span>
                    <span className="font-bold text-lg text-red-600">-{currentCurrency.symbol}{discountAmount.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between items-center py-3 px-4 bg-primary text-primary-foreground rounded-lg">
                    <span className="font-bold text-base">Net Total:</span>
                    <span className="font-bold text-xl">{currentCurrency.symbol}{netTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PDF Generation Button */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <Button 
                  onClick={generatePDF} 
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Generate PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>


        {/* The Seller Section - Compact Design */}
        <Card className="shadow-md border-0 bg-gradient-to-br from-background to-muted/20 invoice-signature-box avoid-break">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-bold text-primary text-center border-b border-primary/20 pb-2">
              THE SELLER / البائع
            </h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4 max-w-md">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-foreground">Name / الاسم:</Label>
                <div className="text-sm font-medium text-foreground pt-1 pb-1">
                  EL HEKMA Engineering Office
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-foreground">Signature / التوقيع:</Label>
                <div className="border-b-2 border-muted-foreground/40 pb-1 mt-2 min-h-[40px]"></div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-foreground">Date / التاريخ:</Label>
                <div className="border-b-2 border-muted-foreground/40 pb-1 mt-2 min-h-[30px]"></div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Footer - Enhanced Professional Design */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-background to-background/95 invoice-footer">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-6 mb-6">
              <QrCode className="w-16 h-16 text-primary/60" />
              <div className="text-center">
                <p className="text-lg font-medium text-foreground mb-2">
                  For more information, you can visit our website:
                </p>
                <a 
                  href="https://heomed.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xl font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  https://heomed.com/
                </a>
              </div>
            </div>
            
            <Separator className="my-6 bg-gradient-to-r from-transparent via-primary to-transparent h-0.5" />
            
            <p className="text-sm text-muted-foreground font-medium">
              © 2024 EL HEKMA Engineering Office. All rights reserved. | جميع الحقوق محفوظة لمكتب الحكمة الهندسي
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invoice;