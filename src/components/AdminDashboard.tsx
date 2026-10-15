import React, { useState } from 'react';
import { 
  BookingAppointment, 
  MobileTechnician, 
  CustomerReview, 
  SiteSettings, 
  EdiClaimRecord 
} from '../types';
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Users, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Bell, 
  Eye, 
  Activity, 
  Car,
  Check,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Lock,
  LogOut,
  KeyRound,
  EyeOff
} from 'lucide-react';
import logoImg from '../assets/images/chip_zorro_logo.png';
import vanImg from '../assets/images/mobile_service_van.webp';

interface AdminDashboardProps {
  bookings: BookingAppointment[];
  technicians: MobileTechnician[];
  reviews: CustomerReview[];
  claims: EdiClaimRecord[];
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (newSettings: SiteSettings) => void;
  onUpdateBookingStatus: (bookingId: string, status: BookingAppointment['status'], techId?: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onUpdateTechnician: (tech: MobileTechnician) => void;
  onAddTechnician: (tech: MobileTechnician) => void;
  onNavigateToSite: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  technicians,
  reviews,
  claims,
  siteSettings,
  onUpdateSiteSettings,
  onUpdateBookingStatus,
  onDeleteBooking,
  onUpdateTechnician,
  onAddTechnician,
  onNavigateToSite,
  onLogout,
}) => {
  // Navigation tabs within Admin
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'settings' | 'pricing' | 'technicians'>('overview');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Search & Filters for Bookings
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Settings editable state
  const [formData, setFormData] = useState<SiteSettings>({ ...siteSettings });
  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  // New Tech Modal / Form State
  const [showAddTech, setShowAddTech] = useState(false);
  const [newTechName, setNewTechName] = useState('');
  const [newTechVan, setNewTechVan] = useState('');
  const [newTechPhone, setNewTechPhone] = useState('');
  const [newTechLocation, setNewTechLocation] = useState('');

  // Selected Booking for detail preview drawer/modal
  const [selectedBooking, setSelectedBooking] = useState<BookingAppointment | null>(null);

  // Handle saving site settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(formData);
    setSavedAlert('Site configuration & live website controls updated successfully!');
    setTimeout(() => setSavedAlert(null), 3500);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || b.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Export Bookings to CSV
  const handleExportCsv = () => {
    const headers = [
      'Order #',
      'Customer Name',
      'Phone',
      'Email',
      'Address',
      'City',
      'Vehicle',
      'Damage Type',
      'Chips',
      'Status',
      'Payment Method',
      'Insurance Carrier',
      'Estimated Cost',
      'Date',
      'Time Slot',
    ];

    const rows = bookings.map((b) => [
      b.orderNumber,
      `"${b.customerName}"`,
      b.customerPhone,
      b.customerEmail,
      `"${b.address}"`,
      b.city,
      `"${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}"`,
      b.damageType,
      b.chipCount,
      b.status,
      b.paymentMethod,
      b.insuranceCarrier || 'N/A',
      `$${b.estimatedCost}`,
      b.appointmentDate,
      `"${b.timeSlot}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chip_zorro_work_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add technician
  const handleCreateTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;

    const newTech: MobileTechnician = {
      id: `tech-${Date.now()}`,
      name: newTechName,
      title: 'Certified Mobile Repair Specialist',
      vanNumber: newTechVan || `Zorro Mobile Unit 0${technicians.length + 1}`,
      phone: newTechPhone || '(555) 794-2450',
      photoUrl: vanImg,
      certifications: ['NWRA Certified', 'UltraBond Resin Specialist'],
      currentLocationName: newTechLocation || 'Metropolitan Metro Zone',
      activeStatus: 'available',
      completedJobsToday: 0,
      rating: 5.0,
    };

    onAddTechnician(newTech);
    setNewTechName('');
    setNewTechVan('');
    setNewTechPhone('');
    setNewTechLocation('');
    setShowAddTech(false);
    setSavedAlert(`Mobile Technician ${newTech.name} added to dispatch fleet!`);
    setTimeout(() => setSavedAlert(null), 3000);
  };

  // Quick stats
  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);
  const activeDispatches = bookings.filter((b) => ['dispatched', 'en_route', 'in_progress'].includes(b.status)).length;
  const insuranceJobs = bookings.filter((b) => b.paymentMethod === 'insurance').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
              <img
                src={logoImg}
                alt="Chip Zorro Logo"
                className="h-7 sm:h-8 w-auto object-contain block shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              />
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <h1 className="font-bold text-white text-xs xs:text-sm sm:text-base md:text-lg leading-tight truncate">
                  Chip Zorro <span className="text-orange-500 font-extrabold">Admin</span><span className="hidden sm:inline text-orange-500 font-extrabold"> Center</span>
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold shrink-0">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 hidden md:block truncate">
                Manage live bookings, phone numbers, pricing rates, and mobile fleet dispatches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => {
                const adminUrl = `${window.location.origin}${window.location.pathname}#admin`;
                navigator.clipboard.writeText(adminUrl).then(() => {
                  setSavedAlert('Direct Admin link copied to clipboard (#admin)');
                  setTimeout(() => setSavedAlert(null), 2500);
                });
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Copy direct admin preview link"
            >
              <span className="font-mono text-amber-400 font-bold text-[10px]">#admin</span>
              <span className="text-[11px]">Direct Link</span>
            </button>

            <button
              onClick={onNavigateToSite}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs transition-all cursor-pointer border border-emerald-500/50 whitespace-nowrap"
              title="Preview Customer Site"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Preview Site</span>
              <span className="xs:hidden">Site</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/90 text-xs font-bold text-red-200 border border-red-800/70 transition-all cursor-pointer whitespace-nowrap"
                title="Securely log out of Admin"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookings & Work Orders ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Pricing & Service Rates</span>
          </button>
          <button
            onClick={() => setActiveTab('technicians')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'technicians'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Technicians & Fleet ({technicians.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Website Settings</span>
          </button>
        </div>
      </header>

      {/* Alert toast */}
      {savedAlert && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs font-bold shadow-md animate-fadeIn flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedAlert}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Appointments</div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">{bookings.length}</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{completedCount} completed fixes</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Dispatches</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{activeDispatches}</div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-orange-400" />
                  <span>{technicians.filter((t) => t.activeStatus !== 'off_duty').length} mobile vans on road</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Revenue</div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">${totalRevenue.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{insuranceJobs} direct insurance claims</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Website ETA</div>
                <div className="text-2xl sm:text-3xl font-black text-orange-400 mt-1">{formData.dispatchEtaMinutes}</div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Displaying on top banner</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Card */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-white text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span>Recent Customer Work Orders</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all ({bookings.length})</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-slate-800">
                  {bookings.slice(0, 5).map((booking) => {
                    const tech = technicians.find((t) => t.id === booking.technicianId);
                    return (
                      <div key={booking.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                              {booking.orderNumber}
                            </span>
                            <span className="font-bold text-sm text-slate-100">{booking.customerName}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              booking.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              booking.status === 'in_progress' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              booking.status === 'en_route' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1 truncate">
                            {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model} · {booking.city}, {booking.state} · {booking.timeSlot}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-xs font-black text-white">${booking.estimatedCost}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{booking.paymentMethod}</div>
                          </div>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Inspect order details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Website Live Controls Quick Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h2 className="font-bold text-white text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Live Website Banner Status</span>
                  </h2>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Current Phone:</span>
                      <span className="font-bold text-white font-mono">{formData.phoneDisplay}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Live ETA Text:</span>
                      <span className="font-bold text-orange-400">{formData.dispatchEtaMinutes}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Base Bullseye Price:</span>
                      <span className="font-bold text-white font-mono">${formData.pricing.baseBullseye}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Insurance $0 Waived:</span>
                      <span className="font-bold text-emerald-400">
                        {formData.pricing.waiveDeductibleWithInsurance ? 'Active (Yes)' : 'Off'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Changes made in this admin panel immediately update the customer-facing booking engine, header, and dispatch system.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-xs text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Edit Business Info & Phone</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Adjust Live Repair Rates</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: BOOKINGS & WORK ORDERS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            {/* Top Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Order #, customer, phone, car, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="en_route">En Route</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="all">All Payments</option>
                    <option value="insurance">Insurance ($0 Ded)</option>
                    <option value="self_pay">Self-Pay / Card</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Bookings Table / List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800 text-[11px]">
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer & Contact</th>
                      <th className="py-3 px-4">Vehicle & Damage</th>
                      <th className="py-3 px-4">Schedule & Address</th>
                      <th className="py-3 px-4">Billing</th>
                      <th className="py-3 px-4">Assigned Tech</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          No work orders match the current search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => {
                        const tech = technicians.find((t) => t.id === b.technicianId);
                        return (
                          <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-orange-400 whitespace-nowrap">
                              {b.orderNumber}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-bold text-white">{b.customerName}</div>
                              <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{b.customerEmail}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-100 whitespace-nowrap">
                                {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <span className="capitalize">{b.damageType.replace(/_/g, ' ')}</span>
                                <span>· {b.chipCount} chip{b.chipCount > 1 ? 's' : ''}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-white whitespace-nowrap">{b.appointmentDate}</div>
                              <div className="text-[11px] text-amber-400 whitespace-nowrap">{b.timeSlot}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{b.address}, {b.city}</div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-bold text-white">${b.estimatedCost}</div>
                              <div className="text-[10px] text-slate-400">
                                {b.paymentMethod === 'insurance' ? (
                                  <span className="text-emerald-400 font-semibold">
                                    Ins: {b.insuranceCarrier || 'Carrier'} ($0 Ded)
                                  </span>
                                ) : (
                                  <span className="text-slate-300">Self-Pay / Card</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <select
                                value={b.technicianId || ''}
                                onChange={(e) => onUpdateBookingStatus(b.id, b.status, e.target.value)}
                                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-orange-500 cursor-pointer"
                              >
                                <option value="">Unassigned</option>
                                {technicians.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <select
                                value={b.status}
                                onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as BookingAppointment['status'])}
                                className={`text-xs rounded-lg px-2.5 py-1 font-bold border focus:outline-none cursor-pointer ${
                                  b.status === 'completed'
                                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                                    : b.status === 'in_progress'
                                    ? 'bg-amber-950/80 text-amber-400 border-amber-700'
                                    : b.status === 'en_route'
                                    ? 'bg-blue-950/80 text-blue-400 border-blue-700'
                                    : b.status === 'cancelled'
                                    ? 'bg-red-950/80 text-red-400 border-red-700'
                                    : 'bg-slate-800 text-slate-200 border-slate-700'
                                }`}
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="en_route">En Route</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedBooking(b)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="View Full Booking Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to remove Order #${b.orderNumber}?`)) {
                                      onDeleteBooking(b.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PRICING & SERVICE RATES ================= */}
        {activeTab === 'pricing' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-500" />
                    <span>Live Service Rates & Pricing Engine</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Updates live pricing for rock chip repairs across the instant estimator and booking wizard.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Bullseye Rock Chip (Base Rate)
                    </label>
                    <div className="text-[11px] text-slate-500 mb-2">Single circular pit under 1 inch</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.pricing.baseBullseye}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, baseBullseye: Number(e.target.value) },
                          })
                        }
                        className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Starburst Break (Base Rate)
                    </label>
                    <div className="text-[11px] text-slate-500 mb-2">Radiating star crack legs under 1.5 inches</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.pricing.baseStarburst}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, baseStarburst: Number(e.target.value) },
                          })
                        }
                        className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Combination Break (Base Rate)
                    </label>
                    <div className="text-[11px] text-slate-500 mb-2">Deep crushed pit with radiating wings</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.pricing.baseCombination}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, baseCombination: Number(e.target.value) },
                          })
                        }
                        className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Short Linear Crack Fix (Up to 6")
                    </label>
                    <div className="text-[11px] text-slate-500 mb-2">Micro-drill relief pit + high-shear resin</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.pricing.baseSmallCrack}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, baseSmallCrack: Number(e.target.value) },
                          })
                        }
                        className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-white">Additional Chip Discount Rate</div>
                      <div className="text-[11px] text-slate-400">
                        Price charged for each subsequent chip on the same windshield (2nd or 3rd chip).
                      </div>
                    </div>
                    <div className="relative w-32 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.pricing.additionalChipRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing: { ...formData.pricing, additionalChipRate: Number(e.target.value) },
                          })
                        }
                        className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">$0 Deductible Insurance Repair Guarantee</div>
                      <div className="text-[11px] text-slate-400">
                        Displays 100% waived out-of-pocket comprehensive coverage badge on booking engine.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.pricing.waiveDeductibleWithInsurance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, waiveDeductibleWithInsurance: e.target.checked },
                        })
                      }
                      className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Pricing Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 4: FLEET & TECHNICIANS ================= */}
        {activeTab === 'technicians' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <span>Mobile Technician Fleet Management</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage active mobile vans, assign customer service zones, and update technician shift status.
                </p>
              </div>

              <button
                onClick={() => setShowAddTech(true)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Mobile Tech</span>
              </button>
            </div>

            {/* Add Tech Modal / Drawer */}
            {showAddTech && (
              <div className="bg-slate-900 border border-orange-500/40 rounded-2xl p-5 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <h3 className="font-bold text-white text-sm">Add New Mobile Technician to Fleet</h3>
                  <button
                    onClick={() => setShowAddTech(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateTechnician} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Technician Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Reed"
                      value={newTechName}
                      onChange={(e) => setNewTechName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Unit / Van ID</label>
                    <input
                      type="text"
                      placeholder="e.g. Zorro Mobile Unit 04"
                      value={newTechVan}
                      onChange={(e) => setNewTechVan(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Direct Van Phone</label>
                    <input
                      type="text"
                      placeholder="(555) 794-2450"
                      value={newTechPhone}
                      onChange={(e) => setNewTechPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Service Zone</label>
                    <input
                      type="text"
                      placeholder="e.g. North County Suburbs"
                      value={newTechLocation}
                      onChange={(e) => setNewTechLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddTech(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white cursor-pointer shadow-sm"
                    >
                      Register Technician
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Technicians List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-orange-400">
                          {tech.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{tech.name}</h3>
                          <div className="text-[11px] text-orange-400 font-mono font-bold">{tech.vanNumber}</div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          tech.activeStatus === 'on_route'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : tech.activeStatus === 'on_site'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : tech.activeStatus === 'available'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {tech.activeStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span className="truncate">{tech.currentLocationName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{tech.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/60">
                        <span>Jobs Today: <strong className="text-white">{tech.completedJobsToday}</strong></span>
                        <span>Rating: <strong className="text-amber-400">★ {tech.rating.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400">Change Status:</label>
                    <select
                      value={tech.activeStatus}
                      onChange={(e) =>
                        onUpdateTechnician({
                          ...tech,
                          activeStatus: e.target.value as MobileTechnician['activeStatus'],
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="available">Available / On Standby</option>
                      <option value="on_route">En Route to Customer</option>
                      <option value="on_site">On Site Repairing Windshield</option>
                      <option value="off_duty">Off Duty</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: WEBSITE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-orange-500" />
                    <span>Website & Business Profile Settings</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Control the business phone numbers, top announcement banner, and shop service hours.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Business Branding Name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Live ETA Announced on Site
                    </label>
                    <input
                      type="text"
                      value={formData.dispatchEtaMinutes}
                      onChange={(e) => setFormData({ ...formData, dispatchEtaMinutes: e.target.value })}
                      placeholder="e.g. 35–45 Min"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Dispatch Phone (Display Format)
                    </label>
                    <input
                      type="text"
                      value={formData.phoneDisplay}
                      onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Phone Number (Raw Digits for Click-To-Call)
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Dispatch Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.dispatchEmail}
                      onChange={(e) => setFormData({ ...formData, dispatchEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Mobile Fleet Radius (Miles)
                    </label>
                    <input
                      type="number"
                      value={formData.serviceRadiusMiles}
                      onChange={(e) => setFormData({ ...formData, serviceRadiusMiles: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Operating Service Hours
                    </label>
                    <input
                      type="text"
                      value={formData.serviceHours}
                      onChange={(e) => setFormData({ ...formData, serviceHours: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Top Alert Bar Announcement</div>
                        <div className="text-[11px] text-slate-400">
                          Controls the announcement marquee bar at the top of every page.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.announcementActive}
                        onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })}
                        className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.announcementText}
                      onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Admin Security & Master Passkey */}
                  <div className="sm:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Admin Master Passkey / Password</div>
                          <div className="text-[11px] text-slate-400">
                            Required to sign into this Admin Portal and view private work orders and customer details.
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                        Gate Active
                      </span>
                    </div>

                    <div className="relative max-w-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <KeyRound className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        value={formData.adminPassword || 'admin123'}
                        onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                        className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                        placeholder="Set master passkey"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                        title={showAdminPass ? 'Hide passkey' : 'Show passkey'}
                      >
                        {showAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Default passkey is <code className="text-orange-400 font-mono font-bold">admin123</code>. You can change it to any PIN or phrase here and click Save.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Website Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Selected Booking Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono font-black text-orange-400">{selectedBooking.orderNumber}</div>
                <h3 className="text-lg font-bold text-white">{selectedBooking.customerName}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Vehicle & Damage</div>
                <div className="text-white font-semibold">
                  {selectedBooking.vehicle.year} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model} ({selectedBooking.vehicle.bodyType})
                </div>
                <div className="text-slate-400">Glass Area: {selectedBooking.vehicle.glassLocation}</div>
                <div className="text-slate-400">Damage: {selectedBooking.damageType.replace(/_/g, ' ')} ({selectedBooking.chipCount} chip)</div>
                {selectedBooking.vehicle.vin && <div className="text-slate-500 font-mono text-[10px]">VIN: {selectedBooking.vehicle.vin}</div>}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Service Schedule & Location</div>
                <div className="text-white font-semibold">{selectedBooking.appointmentDate} · {selectedBooking.timeSlot}</div>
                <div className="text-slate-400">{selectedBooking.address}, {selectedBooking.city}, {selectedBooking.state} {selectedBooking.zipCode}</div>
                <div className="text-slate-400">Phone: {selectedBooking.customerPhone}</div>
                <div className="text-slate-400">Email: {selectedBooking.customerEmail}</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Payment & Claim</div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payment Method:</span>
                  <span className="font-bold text-white uppercase">{selectedBooking.paymentMethod}</span>
                </div>
                {selectedBooking.insuranceCarrier && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Carrier / Policy:</span>
                    <span className="font-semibold text-emerald-400">{selectedBooking.insuranceCarrier} ({selectedBooking.insurancePolicyNumber})</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm pt-1 border-t border-slate-800">
                  <span className="text-white font-bold">Estimated Cost:</span>
                  <span className="font-black text-orange-400 font-mono">${selectedBooking.estimatedCost}</span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 mb-1">Customer Notes:</div>
                  <p className="italic text-slate-300">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
