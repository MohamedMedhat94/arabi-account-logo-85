import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, ArrowLeft, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const MonthlyReports = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const monthlyData = {
    revenue: 125000,
    expenses: 85000,
    profit: 40000,
    invoices: 45,
    clients: 23
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
            التقارير الشهرية
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
            Monthly Reports
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

        {/* Month/Year Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 border rounded-md bg-background"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border rounded-md bg-background"
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                الإيرادات / Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {monthlyData.revenue.toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-red-500" />
                المصروفات / Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {monthlyData.expenses.toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                صافي الربح / Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {monthlyData.profit.toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>عدد الفواتير / Invoices Count</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{monthlyData.invoices}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>عدد العملاء / Clients Count</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{monthlyData.clients}</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center mt-8">
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            طباعة التقرير / Print Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReports;