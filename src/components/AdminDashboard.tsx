import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  Bell, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Monitor,
  Laptop,
  Printer,
  Wrench,
  Shield,
  Zap,
  LogOut,
  Plus,
  Save,
  X
} from 'lucide-react';
import { getAllBookings } from '../utils/bookingSupabase';
import { 
  fetchTechnicians, 
  updateBookingStatus, 
  assignTechnician,
  fetchPrinterBrands,
  fetchProblemCategories,
  addPrinterBrand,
  addPrinterModel,
  addProblemCategory,
  addProblem,
  updatePrinterBrand,
  updateProblemCategory
} from '../utils/supabaseData';
import NotificationSystem from './NotificationSystem';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [printerBrands, setPrinterBrands] = useState<any[]>([]);
  const [problemCategories, setProblemCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'brand' | 'category' | 'technician' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    activeTechnicians: 0
  });

  const prevBookingsLength = useRef(0);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingsData, techniciansData, brandsData, categoriesData] = await Promise.all([
          getAllBookings(),
          fetchTechnicians(),
          fetchPrinterBrands(),
          fetchProblemCategories()
        ]);
        
        setBookings(bookingsData);
        setTechnicians(techniciansData);
        setPrinterBrands(brandsData);
        setProblemCategories(categoriesData);
        
        // Calculate stats
        const totalBookings = bookingsData.length;
        const pendingBookings = bookingsData.filter(b => b.status === 'pending').length;
        const completedBookings = bookingsData.filter(b => b.status === 'completed').length;
        const activeTechnicians = techniciansData.filter(t => t.is_active).length;
        
        setStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          totalRevenue: completedBookings * 100000, // Estimate
          thisMonthRevenue: completedBookings * 50000, // Estimate
          activeTechnicians
        });

        // Check for new bookings and send notifications
        if (prevBookingsLength.current > 0 && bookingsData.length > prevBookingsLength.current) {
          const newBookings = bookingsData.slice(0, bookingsData.length - prevBookingsLength.current);
          newBookings.forEach(booking => {
            // Add notification to dashboard
            setNotifications(prev => [...prev, {
              id: Date.now(),
              message: `Booking baru dari ${booking.customer.name} - ${booking.id}`,
              timestamp: new Date().toISOString()
            }]);
          });
        }
        prevBookingsLength.current = bookingsData.length;
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add new printer brand
  const handleAddPrinterBrand = async (name: string) => {
    try {
      await addPrinterBrand(name);
      const updatedBrands = await fetchPrinterBrands();
      setPrinterBrands(updatedBrands);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding printer brand:', error);
    }
  };

  // Add new problem category
  const handleAddProblemCategory = async (name: string, icon: string) => {
    try {
      await addProblemCategory(name, icon);
      const updatedCategories = await fetchProblemCategories();
      setProblemCategories(updatedCategories);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding problem category:', error);
    }
  };

  // Add new technician
  const handleAddTechnician = async (data: any) => {
    try {
      await supabase.from('technicians').insert({
        name: data.name,
        phone: data.phone,
        email: data.email,
        specialization: data.specialization,
        experience: parseInt(data.experience),
        rating: parseFloat(data.rating) || 0
      });
      const updatedTechnicians = await fetchTechnicians();
      setTechnicians(updatedTechnicians);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding technician:', error);
    }
  };
  
  // Service data
  const serviceCategories = {
    komputer: {
      title: 'Layanan Komputer',
      icon: Monitor,
      services: [
        {
          name: 'Install Ulang Windows',
          description: 'Install ulang sistem operasi Windows dengan driver lengkap',
          price: 'Rp 150.000',
          duration: '2-3 jam',
          category: 'Software'
        },
        {
          name: 'Upgrade RAM & Storage',
          description: 'Upgrade memory RAM dan storage SSD/HDD',
          price: 'Rp 100.000',
          duration: '1-2 jam',
          category: 'Hardware'
        },
        {
          name: 'Cleaning & Maintenance',
          description: 'Pembersihan hardware dan maintenance rutin',
          price: 'Rp 75.000',
          duration: '1 jam',
          category: 'Maintenance'
        },
        {
          name: 'Virus Removal',
          description: 'Pembersihan virus dan malware lengkap',
          price: 'Rp 100.000',
          duration: '2-4 jam',
          category: 'Security'
        },
        {
          name: 'Data Recovery',
          description: 'Pemulihan data yang hilang atau terhapus',
          price: 'Rp 200.000',
          duration: '4-8 jam',
          category: 'Recovery'
        },
        {
          name: 'Network Setup',
          description: 'Konfigurasi jaringan dan internet',
          price: 'Rp 125.000',
          duration: '1-2 jam',
          category: 'Network'
        }
      ]
    },
    laptop: {
      title: 'Layanan Laptop',
      icon: Laptop,
      services: [
        {
          name: 'Ganti Keyboard',
          description: 'Penggantian keyboard laptop yang rusak',
          price: 'Rp 200.000',
          duration: '1-2 jam',
          category: 'Hardware'
        },
        {
          name: 'Ganti LCD/LED Screen',
          description: 'Penggantian layar laptop yang pecah atau bergaris',
          price: 'Rp 800.000',
          duration: '2-3 jam',
          category: 'Hardware'
        },
        {
          name: 'Ganti Baterai',
          description: 'Penggantian baterai laptop yang sudah drop',
          price: 'Rp 300.000',
          duration: '30 menit',
          category: 'Hardware'
        },
        {
          name: 'Repair Charging Port',
          description: 'Perbaikan port charger yang longgar atau rusak',
          price: 'Rp 150.000',
          duration: '1-2 jam',
          category: 'Hardware'
        },
        {
          name: 'Cooling System Repair',
          description: 'Perbaikan sistem pendingin dan ganti thermal paste',
          price: 'Rp 125.000',
          duration: '1-2 jam',
          category: 'Maintenance'
        },
        {
          name: 'Motherboard Repair',
          description: 'Perbaikan motherboard laptop',
          price: 'Rp 500.000',
          duration: '1-3 hari',
          category: 'Hardware'
        }
      ]
    },
    printer: {
      title: 'Layanan Printer',
      icon: Printer,
      services: [
        {
          name: 'Head Cleaning',
          description: 'Pembersihan head printer untuk hasil cetak optimal',
          price: 'Rp 50.000',
          duration: '30 menit',
          category: 'Maintenance'
        },
        {
          name: 'Refill Tinta',
          description: 'Isi ulang tinta printer dengan kualitas terbaik',
          price: 'Rp 25.000',
          duration: '15 menit',
          category: 'Consumable'
        },
        {
          name: 'Ganti Cartridge',
          description: 'Penggantian cartridge printer yang rusak',
          price: 'Rp 150.000',
          duration: '15 menit',
          category: 'Hardware'
        },
        {
          name: 'Paper Jam Repair',
          description: 'Perbaikan masalah paper jam dan feeding',
          price: 'Rp 75.000',
          duration: '30 menit',
          category: 'Repair'
        },
        {
          name: 'Roller Cleaning',
          description: 'Pembersihan roller untuk feeding yang lancar',
          price: 'Rp 40.000',
          duration: '30 menit',
          category: 'Maintenance'
        },
        {
          name: 'Driver Installation',
          description: 'Install driver printer dan konfigurasi',
          price: 'Rp 30.000',
          duration: '30 menit',
          category: 'Software'
        }
      ]
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Reload bookings
      const updatedBookings = await getAllBookings();
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationSystem notifications={notifications} />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Kelola service printer Barokah Printer</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'bookings', name: 'Bookings', icon: Calendar },
              { id: 'technicians', name: 'Teknisi', icon: Users },
              { id: 'printer-brands', name: 'Merk Printer', icon: Printer },
              { id: 'problem-categories', name: 'Kategori Masalah', icon: Wrench },
              { id: 'settings', name: 'Pengaturan', icon: Settings },
              { id: 'reports', name: 'Laporan', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mobile-fade-left">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Booking</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Selesai</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.completedBookings}</p>
                  </div>
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Revenue Bulan Ini</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600">
                      {formatCurrency(stats.thisMonthRevenue)}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-md mobile-fade-left">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Booking Terbaru</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Printer
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Masalah
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teknisi
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {booking.customer.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">{booking.customer.phone}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {booking.printer.brand} {booking.printer.model}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">{booking.problem.description}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {booking.technician}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mobile-fade-left">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="text"
                      placeholder="Cari customer, phone, atau ID booking..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                  <button className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mobile-fade-left">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID & Customer
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Printer & Masalah
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jadwal
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-blue-600">
                              #{booking.id}
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {booking.customer.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">{booking.customer.phone}</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {booking.printer.brand} {booking.printer.model}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">{booking.problem.category}</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">{booking.service.type}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{booking.technician}</div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm text-gray-900">{booking.service.date}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{booking.service.time} WIB</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Technicians Tab */}
        {activeTab === 'technicians' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md mobile-fade-left">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Manajemen Teknisi</h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                {technicians.map((tech) => (
                  <div key={tech.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{tech.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{tech.phone}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tech.is_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tech.is_available ? 'Tersedia' : 'Sibuk'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pengalaman:</span>
                        <span className="font-medium">{tech.experience} tahun</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium">{tech.rating}/5.0</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">Spesialisasi:</p>
                      <div className="flex flex-wrap gap-1">
                        {tech.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-2 sm:px-3 rounded text-xs sm:text-sm hover:bg-blue-700">
                        Edit
                      </button>
                      <button className="bg-gray-200 text-gray-700 py-2 px-2 sm:px-3 rounded text-xs sm:text-sm hover:bg-gray-300">
                        Jadwal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Printer Brands Tab */}
        {activeTab === 'printer-brands' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Manajemen Merk Printer</h2>
                    <p className="text-gray-600 mt-1">Kelola merk dan model printer yang didukung</p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Merk</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {printerBrands.map((brand) => (
                    <div key={brand.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{brand.name}</h3>
                        <button
                          onClick={() => setEditingItem(brand)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {brand.models?.length || 0} model tersedia
                      </p>
                      <div className="space-y-1">
                        {brand.models?.slice(0, 3).map((model: any) => (
                          <div key={model.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {model.name} ({model.type})
                          </div>
                        ))}
                        {brand.models?.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{brand.models.length - 3} model lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problem Categories Tab */}
        {activeTab === 'problem-categories' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Manajemen Kategori Masalah</h2>
                    <p className="text-gray-600 mt-1">Kelola kategori dan jenis masalah printer</p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Kategori</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {problemCategories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <button
                          onClick={() => setEditingItem(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {category.problems?.length || 0} masalah terdaftar
                      </p>
                      <div className="space-y-1">
                        {category.problems?.slice(0, 3).map((problem: any) => (
                          <div key={problem.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {problem.name}
                          </div>
                        ))}
                        {category.problems?.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{category.problems.length - 3} masalah lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pengaturan Sistem</h2>
                <p className="text-gray-600 mt-1">Kelola pengaturan aplikasi dan notifikasi</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Notifikasi WhatsApp</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span>Notifikasi booking baru</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span>Update status service</span>
                      </label>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Nomor WhatsApp Admin:</label>
                        <input 
                          type="text" 
                          defaultValue="+62853-6814-8449"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Pengaturan Umum</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nama Toko:</label>
                        <input 
                          type="text" 
                          defaultValue="Barokah Printer"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email:</label>
                        <input 
                          type="email" 
                          defaultValue="barokahprint22@gmail.com"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Alamat:</label>
                        <textarea 
                          defaultValue="Jl. Depati Parbo No.rt 17, Pematang Sulur, Kec. Telanaipura, Kota Jambi"
                          className="w-full px-3 py-2 border rounded-lg"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Backup & Restore</h3>
                  <div className="flex space-x-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Backup Data
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      Export Laporan
                    </button>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                      Import Data
                    </button>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mobile-fade-left">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Revenue Analysis</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Total Revenue:</span>
                    <span className="text-lg sm:text-2xl font-bold text-green-600">
                      {formatCurrency(stats.totalRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Bulan Ini:</span>
                    <span className="text-base sm:text-xl font-semibold text-blue-600">
                      {formatCurrency(stats.thisMonthRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Rata-rata per Service:</span>
                    <span className="font-medium text-sm sm:text-base">
                      {formatCurrency(stats.completedBookings > 0 ? stats.totalRevenue / stats.completedBookings : 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Service Statistics</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Completion Rate:</span>
                    <span className="text-base sm:text-xl font-semibold text-green-600">
                      {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Average Rating:</span>
                    <span className="font-medium text-sm sm:text-base">4.8/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Response Time:</span>
                    <span className="font-medium text-sm sm:text-base">&lt; 2 jam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Transaction Report */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Laporan Transaksi Real-time</h3>
                <p className="text-gray-600 mt-1">Data transaksi terbaru dan analisis performa</p>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Hari Ini</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {bookings.filter(b => new Date(b.createdAt).toDateString() === new Date().toDateString()).length}
                    </p>
                    <p className="text-sm text-blue-700">Booking baru</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">Minggu Ini</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {bookings.filter(b => {
                        const bookingDate = new Date(b.createdAt);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return bookingDate >= weekAgo;
                      }).length}
                    </p>
                    <p className="text-sm text-green-700">Total booking</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900">Pending</h4>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                    <p className="text-sm text-yellow-700">Menunggu konfirmasi</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.slice(0, 10).map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(booking.createdAt).toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.customer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.printer.brand} - {booking.problem.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.actualCost || booking.estimatedCost}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md mobile-fade-left">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Export Reports</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <button className="flex items-center justify-center p-3 sm:p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-600" />
                    <span>Export Bookings</span>
                  </button>
                  <button className="flex items-center justify-center p-3 sm:p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-600" />
                    <span>Export Revenue</span>
                  </button>
                  <button className="flex items-center justify-center p-3 sm:p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-600" />
                    <span>Export Technicians</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {activeTab === 'printer-brands' ? 'Tambah Merk Printer' : 
               activeTab === 'problem-categories' ? 'Tambah Kategori Masalah' : 'Tambah Teknisi'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              
              if (activeTab === 'printer-brands') {
                const name = formData.get('name') as string;
                handleAddPrinterBrand(name);
              } else if (activeTab === 'problem-categories') {
                const name = formData.get('name') as string;
                const icon = formData.get('icon') as string;
                handleAddProblemCategory(name, icon || 'Wrench');
              } else if (activeTab === 'technicians') {
                const data = {
                  name: formData.get('name') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  specialization: (formData.get('specialization') as string).split(',').map(s => s.trim()),
                  experience: formData.get('experience') as string,
                  rating: formData.get('rating') as string
                };
                handleAddTechnician(data);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama {activeTab === 'printer-brands' ? 'Merk' : 
                          activeTab === 'problem-categories' ? 'Kategori' : 'Teknisi'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={activeTab === 'printer-brands' ? 'Contoh: Canon' : 
                                activeTab === 'problem-categories' ? 'Contoh: Masalah Pencetakan' : 'Contoh: Budi Santoso'}
                  />
                </div>
                
                {activeTab === 'technicians' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+62853-6814-8449"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="teknisi@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spesialisasi (pisahkan dengan koma)</label>
                      <input
                        type="text"
                        name="specialization"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Canon, Epson, HP"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pengalaman (tahun)</label>
                      <input
                        type="number"
                        name="experience"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        name="rating"
                        min="1"
                        max="5"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="4.5"
                      />
                    </div>
                  </>
                )}
                
                {activeTab === 'problem-categories' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (Lucide Icon Name)
                    </label>
                    <input
                      type="text"
                      name="icon"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Printer, Wrench, Settings"
                    />
                  </div>
                )}
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pengaturan Sistem</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Notifikasi</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Notifikasi booking baru</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Update status service</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Kontak</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">WhatsApp Admin:</label>
                    <input 
                      type="text" 
                      defaultValue="+62853-6814-8449"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email:</label>
                    <input 
                      type="email" 
                      defaultValue="barokahprint22@gmail.com"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;