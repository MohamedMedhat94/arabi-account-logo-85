import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowLeft, Calculator, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const TaxReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisQuarter');
  const [selectedTaxType, setSelectedTaxType] = useState('all');

  const taxData = {
    vat: {
      name: 'ضريبة القيمة المضافة (VAT)',
      rate: 14,
      collected: 21000,
      paid: 14280,
      net: 6720
    },
    income: {
      name: 'ضريبة الدخل',
      rate: 22.5,
      amount: 108000
    },
    stamp: {
      name: 'ضريبة الدمغة',
      rate: 0.4,
      amount: 600
    }
  };

  const monthlyTaxes = [
    { month: 'يناير', vat: 7000, income: 36000, stamp: 200 },
    { month: 'فبراير', vat: 7500, income: 36000, stamp: 200 },
    { month: 'مارس', vat: 6500, income: 36000, stamp: 200 }
  ];

  const totalTaxes = taxData.vat.collected + taxData.income.amount + taxData.stamp.amount;

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
            تقارير الضرائب
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
            Tax Reports
          </h2>
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

        {/* Period and Type Selection */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="thisMonth">هذا الشهر</option>
            <option value="thisQuarter">هذا الربع</option>
            <option value="thisYear">هذا العام</option>
          </select>
          <select 
            value={selectedTaxType} 
            onChange={(e) => setSelectedTaxType(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="all">جميع الضرائب</option>
            <option value="vat">ضريبة القيمة المضافة</option>
            <option value="income">ضريبة الدخل</option>
            <option value="stamp">ضريبة الدمغة</option>
          </select>
        </div>

        {/* Tax Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Calculator className="w-5 h-5 mr-2" />
                إجمالي الضرائب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {totalTaxes.toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <BarChart3 className="w-5 h-5 mr-2" />
                ضريبة القيمة المضافة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {taxData.vat.collected.toLocaleString()} ج.م
              </p>
              <p className="text-sm text-muted-foreground">محصلة</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <TrendingUp className="w-5 h-5 mr-2" />
                ضريبة الدخل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {taxData.income.amount.toLocaleString()} ج.م
              </p>
              <p className="text-sm text-muted-foreground">{taxData.income.rate}%</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <FileText className="w-5 h-5 mr-2" />
                ضريبة الدمغة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">
                {taxData.stamp.amount.toLocaleString()} ج.م
              </p>
              <p className="text-sm text-muted-foreground">{taxData.stamp.rate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* VAT Details */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">تفاصيل ضريبة القيمة المضافة / VAT Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">
                    {taxData.vat.collected.toLocaleString()} ج.م
                  </p>
                  <p className="text-sm text-muted-foreground">ضريبة محصلة</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-red-600">
                    {taxData.vat.paid.toLocaleString()} ج.م
                  </p>
                  <p className="text-sm text-muted-foreground">ضريبة مدفوعة</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">
                    {taxData.vat.net.toLocaleString()} ج.م
                  </p>
                  <p className="text-sm text-muted-foreground">صافي الضريبة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">التوزيع الشهري / Monthly Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {monthlyTaxes.map((month) => (
              <Card key={month.month}>
                <CardHeader>
                  <CardTitle className="text-center">{month.month}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>ضريبة القيمة المضافة:</span>
                    <span className="font-semibold">{month.vat.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضريبة الدخل:</span>
                    <span className="font-semibold">{month.income.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضريبة الدمغة:</span>
                    <span className="font-semibold">{month.stamp.toLocaleString()} ج.م</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold">
                    <span>الإجمالي:</span>
                    <span>{(month.vat + month.income + month.stamp).toLocaleString()} ج.م</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Dates */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                مواعيد هامة / Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">ضريبة القيمة المضافة:</h4>
                  <p className="text-sm text-muted-foreground">تقديم الإقرار: 10 من كل شهر</p>
                  <p className="text-sm text-muted-foreground">سداد الضريبة: 15 من كل شهر</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">ضريبة الدخل:</h4>
                  <p className="text-sm text-muted-foreground">تقديم الإقرار: 31 مارس</p>
                  <p className="text-sm text-muted-foreground">السداد النهائي: 30 أبريل</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            طباعة تقرير الضرائب / Print Tax Report
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            تصدير بيانات الضرائب / Export Tax Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxReports;