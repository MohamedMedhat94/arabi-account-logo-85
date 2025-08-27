import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, TrendingUp, Calendar, PieChart, Download, Truck, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateShipmentReportPDF, sampleShipmentData } from '@/utils/pdf/shipmentReportGenerator';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateShipmentReport = async () => {
    setIsGenerating(true);
    try {
      const fileName = await generateShipmentReportPDF(sampleShipmentData);
      toast({
        title: "PDF Generated Successfully",
        description: `Shipment report saved as ${fileName}`,
      });
    } catch (error) {
      console.error('Error generating shipment report:', error);
      toast({
        title: "Error",
        description: "Failed to generate shipment report PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/f6bf1bb2-b71a-4027-bca1-b885cd9bee92.png" 
            alt="مكتب الحكمة الهندسي" 
            className="mx-auto mb-6 h-20 w-auto"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            التقارير المالية
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
            Financial Reports
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            عرض وتحليل البيانات المالية والفواتير بطريقة تفصيلية ومنظمة
            <br />
            View and analyze financial data and invoices in detail
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              العودة للرئيسية / Back to Home
            </Button>
          </Link>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Monthly Reports */}
          <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-4 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">التقارير الشهرية</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly Reports</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                عرض تقارير المبيعات والإيرادات الشهرية مع الرسوم البيانية
              </p>
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                عرض التقرير / View Report
              </Button>
            </CardContent>
          </Card>

          {/* Annual Summary */}
          <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
            <CardHeader>
              <div className="bg-accent/10 text-accent-foreground p-4 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">الملخص السنوي</CardTitle>
              <p className="text-sm text-muted-foreground">Annual Summary</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                ملخص شامل للأداء المالي السنوي والنمو المحقق
              </p>
              <Button className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                عرض الملخص / View Summary
              </Button>
            </CardContent>
          </Card>

          {/* Invoice History */}
          <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-4 rounded-full w-fit mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">سجل الفواتير</CardTitle>
              <p className="text-sm text-muted-foreground">Invoice History</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                عرض جميع الفواتير المصدرة مع إمكانية البحث والتصفية
              </p>
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                عرض السجل / View History
              </Button>
            </CardContent>
          </Card>

          {/* Client Analysis */}
          <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
            <CardHeader>
              <div className="bg-accent/10 text-accent-foreground p-4 rounded-full w-fit mx-auto mb-4">
                <PieChart className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">تحليل العملاء</CardTitle>
              <p className="text-sm text-muted-foreground">Client Analysis</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                تحليل مفصل لبيانات العملاء والمبيعات لكل عميل
              </p>
              <Button className="w-full">
                <PieChart className="w-4 h-4 mr-2" />
                عرض التحليل / View Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Tax Reports */}
          <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-4 rounded-full w-fit mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">تقارير الضرائب</CardTitle>
              <p className="text-sm text-muted-foreground">Tax Reports</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                تقارير مفصلة للضرائب المحصلة والمستحقة
              </p>
              <Button className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                عرض التقرير / View Report
              </Button>
            </CardContent>
          </Card>

          {/* Shipment Tracking Report */}
          <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-4 rounded-full w-fit mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">تقرير تتبع الشحنة</CardTitle>
              <p className="text-sm text-muted-foreground">Shipment Tracking Report</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                تقرير شامل لحالة الشحنة ومراحل النقل والمعالجة
              </p>
              <Button 
                className="w-full" 
                onClick={handleGenerateShipmentReport}
                disabled={isGenerating}
              >
                <FileCheck className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : '📄 Print PDF / طباعة PDF'}
              </Button>
            </CardContent>
          </Card>

          {/* Export Data */}
          <Card className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
            <CardHeader>
              <div className="bg-accent/10 text-accent-foreground p-4 rounded-full w-fit mx-auto mb-4">
                <Download className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl">تصدير البيانات</CardTitle>
              <p className="text-sm text-muted-foreground">Export Data</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                تصدير البيانات بصيغ مختلفة (PDF, Excel, CSV)
              </p>
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                تصدير / Export
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6 text-foreground">إجراءات سريعة / Quick Actions</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/invoice">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileText className="mr-2 h-5 w-5" />
                إنشاء فاتورة جديدة / Create Invoice
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-5 w-5" />
              تصدير كل البيانات / Export All Data
            </Button>
          </div>
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

export default Reports;