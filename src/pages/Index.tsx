import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, Building } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/f6bf1bb2-b71a-4027-bca1-b885cd9bee92.png" 
              alt="مكتب الحكمة الهندسي" 
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            مكتب الحكمة الهندسي
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-foreground">
            EL HEKMA Engineering Office
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            نظام إدارة الفواتير والحسابات الهندسية المتطور
            <br />
            Advanced Engineering Invoice & Accounting Management System
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/invoice?type=proforma">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileText className="mr-2 h-5 w-5" />
                Proforma Invoice
              </Button>
            </Link>
            <Link to="/invoice?type=commercial">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileText className="mr-2 h-5 w-5" />
                Commercial Invoice
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline" size="lg">
                <Calculator className="mr-2 h-5 w-5" />
                عرض التقارير / View Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <CardTitle>إدارة الفواتير</CardTitle>
              <CardDescription>Invoice Management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                إنشاء وإدارة الفواتير التجارية بسهولة مع دعم اللغتين العربية والإنجليزية
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-accent/10 text-accent-foreground p-3 rounded-full w-fit mx-auto mb-4">
                <Calculator className="w-8 h-8" />
              </div>
              <CardTitle>الحسابات التلقائية</CardTitle>
              <CardDescription>Automatic Calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                حساب تلقائي للمجاميع والضرائب والخصومات مع دقة عالية
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mx-auto mb-4">
                <Building className="w-8 h-8" />
              </div>
              <CardTitle>التصدير والطباعة</CardTitle>
              <CardDescription>Export & Print</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                تصدير الفواتير بصيغة PDF وطباعة احترافية مع شعار الشركة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Info */}
        <div className="mt-16 text-center text-muted-foreground">
          <p className="mb-2">
            📍 العنوان: ٤١ شارع الماوردي، القصر العيني، القاهرة، مصر
          </p>
          <p className="mb-2">
            📞 تليفون: ٢٠ ١١ ٤٧٣٠٤٨٨٠+ | فاكس: ٢٠٢٧٩٣٢١١٥+
          </p>
          <p>
            📧 البريد الإلكتروني: el_hekma2013@yahoo.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
