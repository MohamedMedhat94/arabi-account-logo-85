import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, FileText, File, Table, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ExportData = () => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedData, setSelectedData] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('thisYear');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportOptions = [
    {
      id: 'pdf',
      name: 'PDF',
      icon: FileText,
      description: 'تصدير كملف PDF للطباعة والمشاركة'
    },
    {
      id: 'excel',
      name: 'Excel (XLSX)',
      icon: Table,
      description: 'تصدير كجدول بيانات Excel للتحليل'
    },
    {
      id: 'csv',
      name: 'CSV',
      icon: File,
      description: 'تصدير كملف CSV للاستيراد في برامج أخرى'
    }
  ];

  const dataTypes = [
    { id: 'all', name: 'جميع البيانات', description: 'الفواتير والعملاء والتقارير المالية' },
    { id: 'invoices', name: 'الفواتير فقط', description: 'جميع الفواتير المصدرة' },
    { id: 'clients', name: 'بيانات العملاء', description: 'معلومات العملاء وتحليلاتهم' },
    { id: 'financial', name: 'التقارير المالية', description: 'الإيرادات والمصروفات والأرباح' },
    { id: 'taxes', name: 'بيانات الضرائب', description: 'تقارير الضرائب المحصلة والمدفوعة' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileName = `${selectedData}_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
      
      toast({
        title: "تم التصدير بنجاح",
        description: `تم حفظ الملف: ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
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
            تصدير البيانات
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
            Export Data
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            تصدير البيانات بصيغ مختلفة للاستخدام الخارجي والنسخ الاحتياطي
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Link to="/reports">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للتقارير / Back to Reports
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Export Format Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">تحديد صيغة التصدير / Select Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedFormat === option.id ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedFormat(option.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <IconComponent className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <h4 className="font-semibold mb-2">{option.name}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Data Type Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">تحديد نوع البيانات / Select Data Type</h3>
            <div className="space-y-3">
              {dataTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedData === type.id ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => setSelectedData(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        selectedData === type.id ? 'bg-primary' : 'bg-muted'
                      }`} />
                      <div>
                        <h4 className="font-semibold">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Period Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">تحديد الفترة الزمنية / Select Time Period</h3>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <select 
                    value={selectedPeriod} 
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-md bg-background"
                  >
                    <option value="thisMonth">هذا الشهر</option>
                    <option value="lastMonth">الشهر الماضي</option>
                    <option value="thisQuarter">هذا الربع</option>
                    <option value="lastQuarter">الربع الماضي</option>
                    <option value="thisYear">هذا العام</option>
                    <option value="lastYear">العام الماضي</option>
                    <option value="allTime">جميع الأوقات</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Summary */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>ملخص التصدير / Export Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>الصيغة:</span>
                    <span className="font-semibold">{exportOptions.find(o => o.id === selectedFormat)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>نوع البيانات:</span>
                    <span className="font-semibold">{dataTypes.find(t => t.id === selectedData)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الفترة:</span>
                    <span className="font-semibold">
                      {selectedPeriod === 'thisMonth' && 'هذا الشهر'}
                      {selectedPeriod === 'lastMonth' && 'الشهر الماضي'}
                      {selectedPeriod === 'thisQuarter' && 'هذا الربع'}
                      {selectedPeriod === 'lastQuarter' && 'الربع الماضي'}
                      {selectedPeriod === 'thisYear' && 'هذا العام'}
                      {selectedPeriod === 'lastYear' && 'العام الماضي'}
                      {selectedPeriod === 'allTime' && 'جميع الأوقات'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={handleExport}
              disabled={isExporting}
              className="px-8"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'جاري التصدير...' : 'تصدير البيانات / Export Data'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>سيتم حفظ الملف المُصدر في مجلد التحميلات الافتراضي</p>
            <p>The exported file will be saved to your default downloads folder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportData;