import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, FileText, ArrowLeft, BarChart3, PieChart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnualSummary = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const annualData = {
    totalRevenue: 1500000,
    totalExpenses: 1020000,
    netProfit: 480000,
    totalInvoices: 540,
    totalClients: 150,
    avgMonthlyRevenue: 125000,
    growth: 15.5
  };

  const quarterlyData = [
    { quarter: 'Q1', revenue: 350000, profit: 105000 },
    { quarter: 'Q2', revenue: 380000, profit: 120000 },
    { quarter: 'Q3', revenue: 400000, profit: 125000 },
    { quarter: 'Q4', revenue: 370000, profit: 130000 }
  ];

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
            الملخص السنوي
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
            Annual Summary
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

        {/* Year Selection */}
        <div className="flex justify-center mb-8">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border rounded-md bg-background text-lg"
          >
            {[2021, 2022, 2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Main Annual Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <TrendingUp className="w-6 h-6 mr-2" />
                إجمالي الإيرادات / Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {annualData.totalRevenue.toLocaleString()} ج.م
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                نمو {annualData.growth}% مقارنة بالعام السابق
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <BarChart3 className="w-6 h-6 mr-2" />
                إجمالي المصروفات / Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {annualData.totalExpenses.toLocaleString()} ج.م
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                68% من إجمالي الإيرادات
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <PieChart className="w-6 h-6 mr-2" />
                صافي الربح / Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {annualData.netProfit.toLocaleString()} ج.م
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                32% هامش ربح
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quarterly Breakdown */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">الأداء الفصلي / Quarterly Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {quarterlyData.map((quarter) => (
              <Card key={quarter.quarter}>
                <CardHeader>
                  <CardTitle className="text-center">{quarter.quarter}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold text-green-600">
                    {quarter.revenue.toLocaleString()} ج.م
                  </p>
                  <p className="text-sm text-muted-foreground">الإيرادات</p>
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    {quarter.profit.toLocaleString()} ج.م
                  </p>
                  <p className="text-sm text-muted-foreground">الربح</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                إجمالي الفواتير / Total Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{annualData.totalInvoices}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                عدد العملاء / Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{annualData.totalClients}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                متوسط الإيرادات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {annualData.avgMonthlyRevenue.toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Button size="lg">
            <FileText className="w-4 h-4 mr-2" />
            طباعة الملخص السنوي / Print Annual Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnualSummary;