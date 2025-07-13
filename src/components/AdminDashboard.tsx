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
  updateProblemCategory,
  deleteTechnician,
  deleteProblemCategory,
  updateTechnician,
  addTechnician
} from '../utils/supabaseData';
import NotificationSystem from './NotificationSystem';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [printerBrands, setPrinterBrands] = useState<any[]>([]);
  const [problemCategories, setProblemCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTechnicianId, setEditingTechnicianId] = useState<string | null>(null);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const lastBookingCount = useRef(0);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, techniciansData, brandsData, categoriesData] = await Promise.all([
        getAllBookings(),
        fetchTechnicians(),
        fetchPrinterBrands(),
        fetchProblemCategories()
      ]);

      setBookings(bookingsData || []);
      setTechnicians(techniciansData || []);
      setPrinterBrands(brandsData || []);
      setProblemCategories(categoriesData || []);

      // Check for new bookings
      if (bookingsData && bookingsData.length > lastBookingCount.current) {
        const newBookings = bookingsData.slice(lastBookingCount.current);
        newBookings.forEach(booking => {
          if (isNewBooking(booking.created_at)) {
            addNotification({
              id: Date.now() + Math.random(),
              type: 'success',
              title: 'Booking Baru!',
              message: `Booking ${booking.id} dari ${booking.customers?.name || 'Customer'} telah diterima`,
              timestamp: new Date().toISOString()
            });
            
            // Send WhatsApp notification
            sendWhatsAppNotification(booking);
          }
        });
        lastBookingCount.current = bookingsData.length;
      } else if (bookingsData) {
        lastBookingCount.current = bookingsData.length;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const isNewBooking = (createdAt: string) => {
    const bookingTime = new Date(createdAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - bookingTime.getTime()) / (1000 * 60);
    return diffMinutes <= 5;
  };

  const sendWhatsAppNotification = (booking: any) => {
    const message = `🔔 *BOOKING BARU MASUK!*\n\n` +
      `📋 ID: ${booking.id}\n` +
      `👤 Customer: ${booking.customers?.name || 'N/A'}\n` +
      `📱 Phone: ${booking.customers?.phone || 'N/A'}\n` +
      `🖨️ Printer: ${booking.printer_brands?.name || 'N/A'} ${booking.printer_models?.name || ''}\n` +
      `📅 Tanggal: ${booking.appointment_date}\n` +
      `⏰ Waktu: ${booking.appointment_time}\n` +
      `💰 Estimasi: ${booking.estimated_cost || 'Belum ditentukan'}\n\n` +
      `Silakan cek dashboard untuk detail lengkap.`;

    const phoneNumber = '6282169142286';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      await updateBookingStatus(selectedBooking.id, newStatus);
      await loadData();
      setShowModal(false);
      setSelectedBooking(null);
      setNewStatus('');
      
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Status Updated',
        message: `Booking ${selectedBooking.id} status updated to ${newStatus}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating status:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Error',
        message: 'Failed to update booking status',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleTechnicianAssign = async () => {
    if (!selectedBooking || !selectedTechnician) return;

    try {
      await assignTechnician(selectedBooking.id, selectedTechnician);
      await loadData();
      setShowModal(false);
      setSelectedBooking(null);
      setSelectedTechnician('');
      
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Technician Assigned',
        message: `Technician assigned to booking ${selectedBooking.id}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error assigning technician:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Error',
        message: 'Failed to assign technician',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleAddTechnician = async () => {
    try {
      if (editingTechnicianId) {
        await updateTechnician(editingTechnicianId, formData);
        addNotification({
          id: Date.now(),
          type: 'success',
          title: 'Teknisi Updated',
          message: 'Data teknisi berhasil diupdate',
          timestamp: new Date().toISOString()
        });
      } else {
        await addTechnician(formData);
        addNotification({
          id: Date.now(),
          type: 'success',
          title: 'Teknisi Added',
          message: 'Teknisi baru berhasil ditambahkan',
          timestamp: new Date().toISOString()
        });
      }
      
      await loadData();
      setShowModal(false);
      setFormData({});
      setEditingTechnicianId(null);
    } catch (error) {
      console.error('Error saving technician:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Error',
        message: 'Gagal menyimpan data teknisi',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus teknisi ini?')) return;

    try {
      await deleteTechnician(id);
      await loadData();
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Teknisi Deleted',
        message: 'Teknisi berhasil dihapus',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting technician:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Error',
        message: 'Gagal menghapus teknisi',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleAddBrand = async () => {
    try {
      if (editingBrandId) {
        await updatePrinterBrand(editingBrandId, formData);
        addNotification({
          id: Date.now(),
          type: 'success',
          title: 'Brand Updated',
          message: 'Merk printer berhasil diupdate',
          timestamp: new Date().toISOString()
        });
      } else {
        await addPrinterBrand(formData);
        addNotification({
          id: Date.now(),
          type: 'success',
          title: 'Brand Added',
          message: 'Merk printer baru berhasil ditambahkan',
          timestamp: new Date().toISOString()
        });
      }
      
      await loadData();
      setShowModal(false);
      setFormData({});
      setEditingBrandId(null);
    } catch (error) {
      console.error('Error saving brand:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Error',
        message: 'Gagal menyimpan merk printer',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      if (editingCategoryId) {
        await updateProblemCategory(editingCategoryId, formData);
        addNotification({
          id: Date.now(),
          type: 'success',
          title: 'Category Updated',
          message: 'Kategori masalah berhasil diupdate',
          timestamp: new Date().toISOString()
        });
      } else {
        await addProblemCategory(formData);
        addNotification({
          id: Date.now(),
          type: 'success',
          title: 'Category Added',
          message: 'Kategori masalah baru berhasil ditambahkan',
          timestamp: new Date().toISOString()
        });
      }
      
      await loadData();
      setShowModal(false);
      setFormData({});
      setEditingCategoryId(null);
    } catch (error) {
      console.error('Error saving category:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Error',
        message: 'Gagal menyimpan kategori masalah',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;

    try {
      await deleteProblemCategory(id);
      await loadData();
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Category Deleted',
        message: 'Kategori masalah berhasil dihapus',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Error',
        message: 'Gagal menghapus kategori masalah',
        timestamp: new Date().toISOString()
      });
    }
  };

  const openModal = (type: string, data?: any) => {
    setModalType(type);
    setShowModal(true);
    
    if (type === 'edit-technician' && data) {
      setEditingTechnicianId(data.id);
      setFormData({
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        specialization: data.specialization || [],
        experience: data.experience || 0,
        schedule: data.schedule || {
          senin: { available: true, start: '08:00', end: '17:00' },
          selasa: { available: true, start: '08:00', end: '17:00' },
          rabu: { available: true, start: '08:00', end: '17:00' },
          kamis: { available: true, start: '08:00', end: '17:00' },
          jumat: { available: true, start: '08:00', end: '17:00' },
          sabtu: { available: true, start: '08:00', end: '17:00' },
          minggu: { available: false, start: '08:00', end: '17:00' }
        }
      });
    } else if (type === 'edit-brand' && data) {
      setEditingBrandId(data.id);
      setFormData({ name: data.name });
    } else if (type === 'edit-category' && data) {
      setEditingCategoryId(data.id);
      setFormData({ name: data.name, icon: data.icon });
    } else if (type === 'status' && data) {
      setSelectedBooking(data);
    } else if (type === 'assign' && data) {
      setSelectedBooking(data);
    } else {
      setFormData({});
      setEditingTechnicianId(null);
      setEditingBrandId(null);
      setEditingCategoryId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedBooking(null);
    setFormData({});
    setEditingTechnicianId(null);
    setEditingBrandId(null);
    setEditingCategoryId(null);
    setSelectedTechnician('');
    setNewStatus('');
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customers?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalTechnicians: technicians.length,
    activeTechnicians: technicians.filter(t => t.is_available).length,
    todayBookings: bookings.filter(b => {
      const today = new Date().toISOString().split('T')[0];
      return b.appointment_date === today;
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationSystem notifications={notifications} />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Printer className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'technicians', label: 'Teknisi', icon: Users },
              { id: 'data', label: 'Data Master', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="px-4 py-6 sm:px-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalBookings}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.pendingBookings}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.completedBookings}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Technicians</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.activeTechnicians}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Bookings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest booking requests</p>
              </div>
              <ul className="divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => (
                  <li key={booking.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Printer className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customers?.name || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.id} • {booking.appointment_date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Laporan Transaksi Real-time</h3>
                <p className="text-gray-600 mt-1">Data transaksi terbaru dan analisis periode</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.customers?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.customers?.phone || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              {booking.printer_brands?.name || 'N/A'} {booking.printer_models?.name || ''}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.service_type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{booking.appointment_date}</div>
                            <div className="text-gray-500">{booking.appointment_time}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.technicians?.name || 'Not assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal('status', booking)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal('assign', booking)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Users className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Eye className="h-4 w-4" />
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

        {activeTab === 'technicians' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Technicians</h2>
              <button
                onClick={() => openModal('technician')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Technician</span>
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {technicians.map((technician) => (
                  <li key={technician.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{technician.name}</div>
                          <div className="text-sm text-gray-500">{technician.phone}</div>
                          <div className="text-sm text-gray-500">
                            Experience: {technician.experience} years • Rating: {technician.rating}/5
                          </div>
                          <div className="text-sm text-gray-500">
                            Specialization: {technician.specialization?.join(', ') || 'General'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          technician.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {technician.is_available ? 'Available' : 'Busy'}
                        </span>
                        <button
                          onClick={() => openModal('edit-technician', technician)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTechnician(technician.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Printer Brands */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Printer Brands</h3>
                  <button
                    onClick={() => openModal('brand')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="bg-white shadow rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {printerBrands.map((brand) => (
                      <li key={brand.id} className="px-4 py-3 flex justify-between items-center">
                        <span className="text-sm text-gray-900">{brand.name}</span>
                        <button
                          onClick={() => openModal('edit-brand', brand)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Problem Categories */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Problem Categories</h3>
                  <button
                    onClick={() => openModal('category')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="bg-white shadow rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {problemCategories.map((category) => (
                      <li key={category.id} className="px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm text-gray-900">{category.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('edit-category', category)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'status' && 'Update Status'}
                {modalType === 'assign' && 'Assign Technician'}
                {modalType === 'technician' && 'Add Technician'}
                {modalType === 'edit-technician' && 'Edit Technician'}
                {modalType === 'brand' && 'Add Printer Brand'}
                {modalType === 'edit-brand' && 'Edit Printer Brand'}
                {modalType === 'category' && 'Add Problem Category'}
                {modalType === 'edit-category' && 'Edit Problem Category'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              {modalType === 'status' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleStatusUpdate}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'assign' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Technician
                  </label>
                  <select
                    value={selectedTechnician}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select technician</option>
                    {technicians.filter(t => t.is_available).map(tech => (
                      <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                  </select>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleTechnicianAssign}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Assign
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'technician' || modalType === 'edit-technician') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                    <input
                      type="number"
                      value={formData.experience || 0}
                      onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Schedule Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Schedule</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map(day => (
                        <div key={day} className="flex items-center space-x-2 p-2 border rounded">
                          <div className="w-16 text-sm font-medium capitalize">{day}</div>
                          <input
                            type="checkbox"
                            checked={formData.schedule?.[day]?.available || false}
                            onChange={(e) => setFormData({
                              ...formData,
                              schedule: {
                                ...formData.schedule,
                                [day]: {
                                  ...formData.schedule?.[day],
                                  available: e.target.checked
                                }
                              }
                            })}
                            className="rounded"
                          />
                          {formData.schedule?.[day]?.available && (
                            <>
                              <input
                                type="time"
                                value={formData.schedule?.[day]?.start || '08:00'}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  schedule: {
                                    ...formData.schedule,
                                    [day]: {
                                      ...formData.schedule?.[day],
                                      start: e.target.value
                                    }
                                  }
                                })}
                                className="text-xs px-1 py-1 border rounded"
                              />
                              <span className="text-xs">-</span>
                              <input
                                type="time"
                                value={formData.schedule?.[day]?.end || '17:00'}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  schedule: {
                                    ...formData.schedule,
                                    [day]: {
                                      ...formData.schedule?.[day],
                                      end: e.target.value
                                    }
                                  }
                                })}
                                className="text-xs px-1 py-1 border rounded"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddTechnician}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-1"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingTechnicianId ? 'Update' : 'Add'}</span>
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'brand' || modalType === 'edit-brand') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter brand name"
                  />
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleAddBrand}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingBrandId ? 'Update' : 'Add'}
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'category' || modalType === 'edit-category') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon (emoji)</label>
                    <input
                      type="text"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter emoji icon"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddCategory}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingCategoryId ? 'Update' : 'Add'}
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;