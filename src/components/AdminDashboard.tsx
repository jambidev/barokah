import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  LogOut,
  Bell,
  Settings,
  BarChart3,
  DollarSign,
  Star,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Printer,
  AlertTriangle
} from 'lucide-react';
import { getAllBookings } from '../utils/bookingSupabase';
import { 
  fetchPrinterBrands, 
  fetchProblemCategories, 
  fetchTechnicians,
  addPrinterBrand,
  addProblemCategory,
  addTechnician,
  updatePrinterBrand,
  updateProblemCategory,
  updateTechnician,
  deleteProblemCategory,
  deleteTechnician
} from '../utils/supabaseData';
import NotificationSystem from './NotificationSystem';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<any[]>([]);
  const [printerBrands, setPrinterBrands] = useState<any[]>([]);
  const [problemCategories, setProblemCategories] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Modal states
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);

  // Edit states
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingTechnician, setEditingTechnician] = useState<any>(null);

  // Form states
  const [brandForm, setBrandForm] = useState({ name: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'AlertCircle' });
  const [technicianForm, setTechnicianForm] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: [] as string[],
    experience: 0,
    rating: 0,
    schedule: {
      monday: { available: true, startTime: '08:00', endTime: '17:00' },
      tuesday: { available: true, startTime: '08:00', endTime: '17:00' },
      wednesday: { available: true, startTime: '08:00', endTime: '17:00' },
      thursday: { available: true, startTime: '08:00', endTime: '17:00' },
      friday: { available: true, startTime: '08:00', endTime: '17:00' },
      saturday: { available: true, startTime: '08:00', endTime: '17:00' },
      sunday: { available: false, startTime: '08:00', endTime: '17:00' }
    }
  });

  const iconOptions = [
    'AlertCircle', 'Printer', 'Wrench', 'Settings', 'Wifi', 'RefreshCw', 
    'FileText', 'ScanLine', 'Phone', 'Droplets', 'Cog'
  ];

  const specializationOptions = [
    'Printer Inkjet', 'Printer Laser', 'Printer Multifunction', 
    'Scanner', 'Fax', 'Network Setup', 'Software Installation'
  ];

  const dayNames = {
    monday: 'Senin',
    tuesday: 'Selasa', 
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu'
  };

  // Load data
  useEffect(() => {
    loadAllData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadAllData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Check for new bookings and create notifications
  useEffect(() => {
    const checkNewBookings = () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      const newBookings = bookings.filter(booking => {
        const bookingTime = new Date(booking.createdAt);
        return bookingTime > fiveMinutesAgo;
      });

      const newNotifications = newBookings.map(booking => ({
        id: Date.now() + Math.random(),
        message: `Booking baru dari ${booking.customer.name} - ${booking.printer.brand} ${booking.printer.model}`,
        timestamp: booking.createdAt,
        read: false
      }));

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    };

    if (bookings.length > 0) {
      checkNewBookings();
    }
  }, [bookings]);

  const loadAllData = async () => {
    try {
      const [bookingsData, brandsData, categoriesData, techniciansData] = await Promise.all([
        getAllBookings(),
        fetchPrinterBrands(),
        fetchProblemCategories(),
        fetchTechnicians()
      ]);

      setBookings(bookingsData);
      setPrinterBrands(brandsData);
      setProblemCategories(categoriesData);
      setTechnicians(techniciansData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistics calculations
  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings
      .filter(b => b.actualCost)
      .reduce((sum, b) => sum + parseFloat(b.actualCost.replace(/[^\d]/g, '')), 0),
    averageRating: bookings
      .filter(b => b.rating)
      .reduce((sum, b, _, arr) => sum + b.rating / arr.length, 0) || 0,
    activeTechnicians: technicians.filter(t => t.is_available).length
  };

  // Form handlers
  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await updatePrinterBrand(editingBrand.id, brandForm.name);
      } else {
        await addPrinterBrand(brandForm.name);
      }
      await loadAllData();
      resetBrandForm();
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Terjadi kesalahan saat menyimpan merk printer');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateProblemCategory(editingCategory.id, categoryForm.name, categoryForm.icon);
      } else {
        await addProblemCategory(categoryForm.name, categoryForm.icon);
      }
      await loadAllData();
      resetCategoryForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Terjadi kesalahan saat menyimpan kategori masalah');
    }
  };

  const handleTechnicianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const technicianData = {
        name: technicianForm.name,
        phone: technicianForm.phone,
        email: technicianForm.email,
        specialization: technicianForm.specialization,
        experience: technicianForm.experience,
        rating: technicianForm.rating
      };

      if (editingTechnician) {
        await updateTechnician(editingTechnician.id, technicianData);
      } else {
        await addTechnician(technicianData);
      }
      await loadAllData();
      resetTechnicianForm();
    } catch (error) {
      console.error('Error saving technician:', error);
      alert('Terjadi kesalahan saat menyimpan data teknisi');
    }
  };

  // Edit handlers
  const handleEditBrand = (brand: any) => {
    setEditingBrand(brand);
    setBrandForm({ name: brand.name });
    setShowBrandModal(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, icon: category.icon });
    setShowCategoryModal(true);
  };

  const handleEditTechnician = (technician: any) => {
    setEditingTechnician(technician);
    setTechnicianForm({
      name: technician.name,
      phone: technician.phone,
      email: technician.email || '',
      specialization: technician.specialization || [],
      experience: technician.experience || 0,
      rating: technician.rating || 0,
      schedule: {
        monday: { available: true, startTime: '08:00', endTime: '17:00' },
        tuesday: { available: true, startTime: '08:00', endTime: '17:00' },
        wednesday: { available: true, startTime: '08:00', endTime: '17:00' },
        thursday: { available: true, startTime: '08:00', endTime: '17:00' },
        friday: { available: true, startTime: '08:00', endTime: '17:00' },
        saturday: { available: true, startTime: '08:00', endTime: '17:00' },
        sunday: { available: false, startTime: '08:00', endTime: '17:00' }
      }
    });
    setShowTechnicianModal(true);
  };

  // Delete handlers
  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await deleteProblemCategory(categoryId);
        await loadAllData();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Terjadi kesalahan saat menghapus kategori');
      }
    }
  };

  const handleDeleteTechnician = async (technicianId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus teknisi ini?')) {
      try {
        await deleteTechnician(technicianId);
        await loadAllData();
      } catch (error) {
        console.error('Error deleting technician:', error);
        alert('Terjadi kesalahan saat menghapus teknisi');
      }
    }
  };

  // Reset form functions
  const resetBrandForm = () => {
    setBrandForm({ name: '' });
    setEditingBrand(null);
    setShowBrandModal(false);
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', icon: 'AlertCircle' });
    setEditingCategory(null);
    setShowCategoryModal(false);
  };

  const resetTechnicianForm = () => {
    setTechnicianForm({
      name: '',
      phone: '',
      email: '',
      specialization: [],
      experience: 0,
      rating: 0,
      schedule: {
        monday: { available: true, startTime: '08:00', endTime: '17:00' },
        tuesday: { available: true, startTime: '08:00', endTime: '17:00' },
        wednesday: { available: true, startTime: '08:00', endTime: '17:00' },
        thursday: { available: true, startTime: '08:00', endTime: '17:00' },
        friday: { available: true, startTime: '08:00', endTime: '17:00' },
        saturday: { available: true, startTime: '08:00', endTime: '17:00' },
        sunday: { available: false, startTime: '08:00', endTime: '17:00' }
      }
    });
    setEditingTechnician(null);
    setShowTechnicianModal(false);
  };

  const handleSpecializationChange = (specialization: string) => {
    setTechnicianForm(prev => ({
      ...prev,
      specialization: prev.specialization.includes(specialization)
        ? prev.specialization.filter(s => s !== specialization)
        : [...prev.specialization, specialization]
    }));
  };

  const handleScheduleChange = (day: string, field: string, value: any) => {
    setTechnicianForm(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          [field]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://stellar-gnome-533245.netlify.app/assets/barokah-CaQ0uYpS.png" 
                alt="Barokah Printer" 
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Barokah Printer Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationSystem notifications={notifications} />
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'bookings', name: 'Booking', icon: Calendar },
              { id: 'technicians', name: 'Teknisi', icon: Users },
              { id: 'brands', name: 'Merk Printer', icon: Printer },
              { id: 'categories', name: 'Kategori Masalah', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Booking</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Selesai</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completedBookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      Rp {stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Laporan Transaksi Real-time</h3>
                <p className="text-gray-600 mt-1">Data transaksi terbaru dan analisis periode</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Printer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Biaya
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 10).map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.customer.name}
                            </div>
                            <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.printer.brand} {booking.printer.model}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString('id-ID')}
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
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Manajemen Booking</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID & Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Printer & Masalah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teknisi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-blue-600">#{booking.id}</div>
                          <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                          <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.printer.brand} {booking.printer.model}
                          </div>
                          <div className="text-sm text-gray-500">{booking.problem.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.technician}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.service.date).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Technicians Tab */}
        {activeTab === 'technicians' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Manajemen Teknisi</h3>
              <button
                onClick={() => setShowTechnicianModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Teknisi</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicians.map((technician) => (
                <div key={technician.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{technician.name}</h4>
                      <p className="text-sm text-gray-600">{technician.phone}</p>
                      {technician.email && (
                        <p className="text-sm text-gray-600">{technician.email}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTechnician(technician)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTechnician(technician.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {technician.experience} tahun pengalaman
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        Rating: {technician.rating}/5
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        technician.is_available ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <span className="text-sm text-gray-600">
                        {technician.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                      </span>
                    </div>
                  </div>

                  {technician.specialization && technician.specialization.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Spesialisasi:</p>
                      <div className="flex flex-wrap gap-1">
                        {technician.specialization.map((spec: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Printer Brands Tab */}
        {activeTab === 'brands' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Manajemen Merk Printer</h3>
              <button
                onClick={() => setShowBrandModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Merk</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Merk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {printerBrands.map((brand) => (
                      <tr key={brand.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{brand.models?.length || 0} model</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditBrand(brand)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Problem Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Manajemen Kategori Masalah</h3>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Kategori</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problemCategories.map((category) => (
                <div key={category.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-600">
                          {category.problems?.length || 0} masalah
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingBrand ? 'Edit Merk Printer' : 'Tambah Merk Printer'}
              </h3>
              <button
                onClick={resetBrandForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBrandSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Merk
                </label>
                <input
                  type="text"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Canon"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetBrandForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingBrand ? 'Update' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Kategori Masalah' : 'Tambah Kategori Masalah'}
              </h3>
              <button
                onClick={resetCategoryForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Masalah Pencetakan"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingCategory ? 'Update' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Technician Modal */}
      {showTechnicianModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTechnician ? 'Edit Teknisi' : 'Tambah Teknisi'}
              </h3>
              <button
                onClick={resetTechnicianForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTechnicianSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={technicianForm.name}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor HP
                  </label>
                  <input
                    type="tel"
                    value={technicianForm.phone}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={technicianForm.email}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pengalaman (tahun)
                  </label>
                  <input
                    type="number"
                    value={technicianForm.experience}
                    onChange={(e) => setTechnicianForm(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spesialisasi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {specializationOptions.map(spec => (
                    <label key={spec} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={technicianForm.specialization.includes(spec)}
                        onChange={() => handleSpecializationChange(spec)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jadwal Kerja
                </label>
                <div className="space-y-3">
                  {Object.entries(dayNames).map(([dayKey, dayName]) => (
                    <div key={dayKey} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-20">
                        <span className="text-sm font-medium text-gray-700">{dayName}</span>
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={technicianForm.schedule[dayKey as keyof typeof technicianForm.schedule].available}
                          onChange={(e) => handleScheduleChange(dayKey, 'available', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Tersedia</span>
                      </label>
                      {technicianForm.schedule[dayKey as keyof typeof technicianForm.schedule].available && (
                        <>
                          <input
                            type="time"
                            value={technicianForm.schedule[dayKey as keyof typeof technicianForm.schedule].startTime}
                            onChange={(e) => handleScheduleChange(dayKey, 'startTime', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value={technicianForm.schedule[dayKey as keyof typeof technicianForm.schedule].endTime}
                            onChange={(e) => handleScheduleChange(dayKey, 'endTime', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetTechnicianForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingTechnician ? 'Update' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;