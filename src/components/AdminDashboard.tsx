import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Mock data
  const stats = {
    totalBookings: 156,
    pendingBookings: 23,
    completedBookings: 133,
    totalRevenue: 15600000,
    thisMonthRevenue: 3200000,
    activeTechnicians: 8
  };

  const recentBookings = [
    {
      id: 'BK001',
      customerName: 'Ahmad Wijaya',
      phone: '+62853-6814-8449',
      printerBrand: 'Canon',
      printerModel: 'PIXMA G2010',
      problem: 'Hasil cetak putus-putus',
      serviceType: 'Teknisi Datang',
      date: '2024-01-15',
      time: '10:00',
      status: 'pending',
      technician: 'Budi Santoso'
    },
    {
      id: 'BK002',
      customerName: 'Siti Nurhaliza',
      phone: '+62853-6814-8449',
      printerBrand: 'Epson',
      printerModel: 'L3110',
      problem: 'Head tersumbat',
      serviceType: 'Antar ke Toko',
      date: '2024-01-15',
      time: '14:00',
      status: 'in-progress',
      technician: 'Andi Pratama'
    },
    {
      id: 'BK003',
      customerName: 'Dedi Kurniawan',
      phone: '+62853-6814-8449',
      printerBrand: 'HP',
      printerModel: 'DeskJet 2135',
      problem: 'Paper jam',
      serviceType: 'Teknisi Datang',
      date: '2024-01-14',
      time: '16:00',
      status: 'completed',
      technician: 'Sari Wulandari'
    }
  ];

  const technicians = [
    {
      id: 'T001',
      name: 'Budi Santoso',
      phone: '+62853-6814-8449',
      specialization: ['Canon', 'Epson'],
      experience: 5,
      rating: 4.8,
      activeJobs: 3,
      status: 'available'
    },
    {
      id: 'T002',
      name: 'Andi Pratama',
      phone: '+62853-6814-8449',
      specialization: ['HP', 'Brother'],
      experience: 4,
      rating: 4.7,
      activeJobs: 2,
      status: 'busy'
    },
    {
      id: 'T003',
      name: 'Sari Wulandari',
      phone: '+62853-6814-8449',
      specialization: ['Samsung', 'Fuji Xerox'],
      experience: 6,
      rating: 4.9,
      activeJobs: 1,
      status: 'available'
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
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
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
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
              { id: 'services', name: 'Layanan Lengkap', icon: Wrench },
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
                    {recentBookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {booking.customerName}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">{booking.phone}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {booking.printerBrand} {booking.printerModel}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">{booking.problem}</div>
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
                            <button className="text-green-600 hover:text-green-900">
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
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-blue-600">
                              #{booking.id}
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {booking.customerName}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">{booking.phone}</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {booking.printerBrand} {booking.printerModel}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">{booking.problem}</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">{booking.serviceType}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{booking.technician}</div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm text-gray-900">{booking.date}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{booking.time} WIB</div>
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
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
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
                  <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    Tambah Teknisi
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
                        tech.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tech.status === 'available' ? 'Tersedia' : 'Sibuk'}
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
                      <div className="flex justify-between">
                        <span className="text-gray-600">Job Aktif:</span>
                        <span className="font-medium">{tech.activeJobs}</span>
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

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md mobile-fade-left">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Layanan Lengkap</h2>
                <p className="text-gray-600 mt-2">Daftar lengkap layanan yang tersedia untuk Komputer, Laptop, dan Printer</p>
              </div>
            </div>

            {/* Service Categories */}
            <div className="grid gap-8">
              {Object.entries(serviceCategories).map(([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                          <p className="text-blue-100">Layanan profesional dengan teknisi berpengalaman</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.services.map((service, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h4>
                                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Harga:</span>
                                <span className="font-bold text-blue-600">{service.price}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Durasi:</span>
                                <span className="font-medium text-gray-700">{service.duration}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Kategori:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  service.category === 'Hardware' ? 'bg-red-100 text-red-800' :
                                  service.category === 'Software' ? 'bg-blue-100 text-blue-800' :
                                  service.category === 'Maintenance' ? 'bg-green-100 text-green-800' :
                                  service.category === 'Security' ? 'bg-purple-100 text-purple-800' :
                                  service.category === 'Recovery' ? 'bg-orange-100 text-orange-800' :
                                  service.category === 'Network' ? 'bg-indigo-100 text-indigo-800' :
                                  service.category === 'Consumable' ? 'bg-yellow-100 text-yellow-800' :
                                  service.category === 'Repair' ? 'bg-pink-100 text-pink-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {service.category}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex space-x-2">
                              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                                <Edit className="h-4 w-4 inline mr-1" />
                                Edit
                              </button>
                              <button className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Total {category.services.length} layanan tersedia
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Tambah Layanan Baru
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Service Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mobile-fade-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ringkasan Layanan</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Monitor className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Komputer</h4>
                  <p className="text-2xl font-bold text-blue-600">{serviceCategories.komputer.services.length}</p>
                  <p className="text-sm text-gray-600">Layanan</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Laptop className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Laptop</h4>
                  <p className="text-2xl font-bold text-green-600">{serviceCategories.laptop.services.length}</p>
                  <p className="text-sm text-gray-600">Layanan</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Printer className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Printer</h4>
                  <p className="text-2xl font-bold text-purple-600">{serviceCategories.printer.services.length}</p>
                  <p className="text-sm text-gray-600">Layanan</p>
                </div>
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
                      {formatCurrency(stats.totalRevenue / stats.completedBookings)}
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
                      {Math.round((stats.completedBookings / stats.totalBookings) * 100)}%
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
    </div>
  );
};

export default AdminDashboard;