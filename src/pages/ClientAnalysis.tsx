import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, ArrowLeft, Users, TrendingUp, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisYear');

  const clientsData = [
    {
      id: 1,
      name: 'شركة النصر للمقاولات',
      totalRevenue: 125000,
      invoicesCount: 8,
      lastInvoice: '2024-02-15',
      status: 'نشط',
      category: 'مقاولات'
    },
    {
      id: 2,
      name: 'مؤسسة البناء الحديث',
      totalRevenue: 85000,
      invoicesCount: 6,
      lastInvoice: '2024-02-10',
      status: 'نشط',
      category: 'تطوير عقاري'
    },
    {
      id: 3,
      name: 'شركة الأهرام للتطوير',
      totalRevenue: 220000,
      invoicesCount: 12,
      lastInvoice: '2024-02-20',
      status: 'نشط',
      category: 'تطوير عقاري'
    },
    {
      id: 4,
      name: 'مكتب الاستشارات الهندسية',
      totalRevenue: 95000,
      invoicesCount: 7,
      lastInvoice: '2024-01-25',
      status: 'معتاد',
      category: 'استشارات'
    },
    {
      id: 5,
      name: 'شركة العمران الجديد',
      totalRevenue: 180000,
      invoicesCount: 10,
      lastInvoice: '2024-02-18',
      status: 'نشط',
      category: 'مقاولات'
    }
  ];

  const categoryStats = {
    'مقاولات': { count: 2, revenue: 305000 },
    'تطوير عقاري': { count: 2, revenue: 305000 },
    'استشارات': { count: 1, revenue: 95000 }
  };

  const topClients = clientsData
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'text-green-600 bg-green-100';
      case 'معتاد': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
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
            تحليل العملاء
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
            Client Analysis
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

        {/* Period Selection */}
        <div className="flex justify-center mb-8">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background text-lg"
          >
            <option value="thisMonth">هذا الشهر</option>
            <option value="thisQuarter">هذا الربع</option>
            <option value="thisYear">هذا العام</option>
            <option value="allTime">جميع الأوقات</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                إجمالي العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{clientsData.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                العملاء النشطون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {clientsData.filter(c => c.status === 'نشط').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                إجمالي الإيرادات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {clientsData.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                متوسط قيمة الفاتورة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {Math.round(clientsData.reduce((sum, c) => sum + c.totalRevenue, 0) / clientsData.reduce((sum, c) => sum + c.invoicesCount, 0)).toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Analysis */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">تحليل حسب الفئة / Category Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-center">{category}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold text-primary">
                    {stats.count} عملاء
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {stats.revenue.toLocaleString()} ج.م
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center mb-6">أهم العملاء / Top Clients</h3>
          <div className="space-y-4 max-w-6xl mx-auto">
            {topClients.map((client, index) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{client.name}</h4>
                        <p className="text-sm text-muted-foreground">{client.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-green-600">{client.totalRevenue.toLocaleString()} ج.م</p>
                        <p className="text-muted-foreground">إجمالي الإيرادات</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{client.invoicesCount}</p>
                        <p className="text-muted-foreground">عدد الفواتير</p>
                      </div>
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button>
            <PieChart className="w-4 h-4 mr-2" />
            تصدير تحليل العملاء / Export Client Analysis
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            تقرير مفصل / Detailed Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientAnalysis;