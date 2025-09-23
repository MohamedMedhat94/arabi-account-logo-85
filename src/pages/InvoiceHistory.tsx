import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, ArrowLeft, Search, Eye, Download, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const InvoiceHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const invoices = [
    {
      id: 'INV-2024-001',
      client: 'شركة النصر للمقاولات',
      date: '2024-01-15',
      amount: 15000,
      status: 'مدفوعة',
      items: ['خدمات هندسية', 'استشارات فنية']
    },
    {
      id: 'INV-2024-002',
      client: 'مؤسسة البناء الحديث',
      date: '2024-01-20',
      amount: 8500,
      status: 'معلقة',
      items: ['تصميم معماري', 'إشراف على التنفيذ']
    },
    {
      id: 'INV-2024-003',
      client: 'شركة الأهرام للتطوير',
      date: '2024-01-25',
      amount: 22000,
      status: 'مدفوعة',
      items: ['دراسة جدوى', 'التصميم الإنشائي']
    },
    {
      id: 'INV-2024-004',
      client: 'مكتب الاستشارات الهندسية',
      date: '2024-02-01',
      amount: 12500,
      status: 'مدفوعة',
      items: ['خدمات استشارية', 'مراجعة المخططات']
    },
    {
      id: 'INV-2024-005',
      client: 'شركة العمران الجديد',
      date: '2024-02-10',
      amount: 18000,
      status: 'معلقة',
      items: ['تصميم انشائي', 'إشراف فني']
    }
  ];

  const filteredInvoices = invoices.filter(invoice => 
    invoice.client.includes(searchTerm) || invoice.id.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    return status === 'مدفوعة' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100';
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
            سجل الفواتير
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
            Invoice History
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

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="البحث بالعميل أو رقم الفاتورة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="all">جميع الفترات</option>
            <option value="thisMonth">هذا الشهر</option>
            <option value="lastMonth">الشهر الماضي</option>
            <option value="thisYear">هذا العام</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                إجمالي الفواتير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{invoices.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                المبلغ الإجمالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                الفواتير المعلقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {invoices.filter(inv => inv.status === 'معلقة').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice List */}
        <div className="space-y-4 max-w-6xl mx-auto">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{invoice.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-1">{invoice.client}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {invoice.date}
                      </span>
                      <span className="font-semibold text-foreground">
                        {invoice.amount.toLocaleString()} ج.م
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {invoice.items.join(' • ')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            تصدير سجل الفواتير / Export Invoice History
          </Button>
          <Link to="/invoice">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              إنشاء فاتورة جديدة / Create New Invoice
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHistory;