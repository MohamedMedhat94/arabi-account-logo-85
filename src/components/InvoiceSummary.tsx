import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ReactSelect from "react-select";
import { currencies } from "@/data/products";

const countries = [
  // 🌍 الدول العربية
  "Algeria","Bahrain","Comoros","Djibouti","Egypt","Iraq","Jordan","Kuwait",
  "Lebanon","Libya","Mauritania","Morocco","Oman","Palestine","Qatar",
  "Saudi Arabia","Somalia","Sudan","Syria","Tunisia","United Arab Emirates","Yemen",
  
  // 🌍 دول أفريقيا
  "Angola","Benin","Botswana","Burkina Faso","Burundi","Cameroon","Cape Verde",
  "Central African Republic","Chad","Democratic Republic of the Congo","Côte d'Ivoire",
  "Eritrea","Eswatini","Ethiopia","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau",
  "Kenya","Lesotho","Liberia","Madagascar","Malawi","Mali","Mauritius","Mozambique",
  "Namibia","Niger","Nigeria","Rwanda","Sao Tome and Principe","Seychelles",
  "Sierra Leone","South Africa","South Sudan","Tanzania","Togo","Uganda","Zambia","Zimbabwe",
  
  // 🌏 دول آسيا
  "Afghanistan","Armenia","Azerbaijan","Bangladesh","Bhutan","Brunei","Cambodia",
  "China","Cyprus","Georgia","India","Indonesia","Iran","Israel","Japan","Kazakhstan",
  "Kyrgyzstan","Laos","Malaysia","Maldives","Mongolia","Myanmar","Nepal","North Korea",
  "Pakistan","Philippines","Singapore","South Korea","Sri Lanka","Tajikistan",
  "Thailand","Timor-Leste","Turkmenistan","Uzbekistan","Vietnam"
];

interface InvoiceSummaryProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export default function InvoiceSummary({ selectedCurrency, onCurrencyChange }: InvoiceSummaryProps) {
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  
  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div>
          <Label>Payment Term</Label>
          <Input value="100% Advance" readOnly />
        </div>

        <div>
          <Label>Ocean Vessel / Voy</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sea">By Sea</SelectItem>
              <SelectItem value="air">By Air</SelectItem>
              <SelectItem value="land">By Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Port of Loading</Label>
          <Input value="EGYPT" readOnly />
        </div>


        <div>
          <Label>Port of Destination / بلد الوجهة</Label>
          <ReactSelect
            options={countries.map(c => ({ label: c, value: c }))}
            placeholder="Search country..."
            className="text-sm"
          />
        </div>

        <div>
          <Label>Currency / العملة</Label>
          <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency..." />
            </SelectTrigger>
            <SelectContent className="bg-background border z-50">
              {currencies.map(currency => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Time of Shipment</Label>
          <Input type="date" />
        </div>

        <div>
          <h3 className="text-md font-semibold mt-4">Payment Information</h3>
          <Label>Company Name</Label>
          <Input value="EL HEKMA Engineering Office" readOnly />
          
          <Label>Bank Name</Label>
          <Input value="Emirates NBD" readOnly />
          
          <Label>Account No</Label>
          <Input value="1029355429202" readOnly />
        </div>

        <div>
          <Label>Remarks</Label>
          <Textarea placeholder="Write any additional remarks here..." />
        </div>
       
      </CardContent>
    </Card>
  );
}