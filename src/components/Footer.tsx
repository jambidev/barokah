import React from 'react';
import { Printer, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, ShoppingBag } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const services = [
    'Service & Perbaikan Printer',
    'Refill Tinta Original',
    'Reset Printer Error',
    'Instalasi Driver',
    'Konsultasi Gratis',
    'Antar Jemput Service'
  ];

  const printerBrands = [
    'Canon', 'Epson', 'HP', 'Brother', 'Fuji Xerox'
  ];

  const quickLinks = [
    { name: 'Beranda', id: 'home' },
    { name: 'Layanan', id: 'services' },
    { name: 'Booking', id: 'booking' },
    { name: 'Testimoni', id: 'testimonials' },
    { name: 'Kontak', id: 'contact' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="bg-transparent p-1 rounded-lg">
                <img 
                  src="barokah.png"
                  alt="Barokah Printer Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full border-2 border-gradient-to-r from-green-400 via-yellow-400 via-blue-400 to-purple-500"
                  style={{
                    background: 'linear-gradient(45deg, #10b981, #fbbf24, #3b82f6, #8b5cf6, #ec4899)',
                    borderRadius: '50%',
                    padding: '2px'
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">Barokah Printer</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Service Printer Terpercaya</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Solusi terpercaya untuk semua masalah printer Anda. Melayani service printer 
              segala merk dengan garansi resmi dan teknisi berpengalaman.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                <span className="text-gray-300 text-sm sm:text-base">+62853-6814-8449</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                <span className="text-gray-300 text-sm sm:text-base break-all">barokahprint22@gmail.com</span>
              </div>
              <div className="flex items-start justify-center lg:justify-start space-x-2 sm:space-x-3">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">Jl. Depati Parbo No.rt 17, Pematang Sulur, Kec. Telanaipura, Kota Jambi, Jambi 36361, Indonesia</span>
              </div>
              <div className="flex items-start justify-center lg:justify-start space-x-2 sm:space-x-3">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Jam Layanan:</p>
                  <p className="text-xs sm:text-sm">🍁 Senin - Sabtu : 08:00 - 17:00</p>
                  <p className="text-xs sm:text-sm">🍁 Minggu : 09:00 - 16:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="text-center lg:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Layanan Kami</h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-gray-300 hover:text-white transition-colors text-left text-sm sm:text-base"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Printer Brands */}
          <div className="text-center lg:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Merk Printer</h4>
            <ul className="space-y-2 sm:space-y-3">
              {printerBrands.map((brand, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    Service {brand}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('services')}
              className="text-blue-400 hover:text-blue-300 transition-colors mt-3 sm:mt-4 font-medium text-sm sm:text-base"
            >
              Lihat Semua Merk →
            </button>
          </div>

          {/* Quick Links & CTA */}
          <div className="text-center lg:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Menu Cepat</h4>
            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="bg-blue-600 rounded-lg p-3 sm:p-4">
              <h5 className="font-semibold mb-2 text-sm sm:text-base">Butuh Service Cepat?</h5>
              <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4">
                Hubungi kami sekarang untuk konsultasi gratis
              </p>
              <button
                onClick={() => onNavigate('booking')}
                className="w-full bg-yellow-400 text-blue-900 py-2 px-3 sm:px-4 rounded font-medium hover:bg-yellow-300 transition-colors text-sm sm:text-base"
              >
                Booking Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-3 sm:mb-4 md:mb-0 text-center md:text-left">
              <p className="text-gray-400 text-xs sm:text-sm">
                © 2025 Barokah Printer Jambi. All rights reserved.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
              <span className="text-gray-400 text-xs sm:text-sm text-center">Follow us:</span>
              <div className="flex space-x-2 sm:space-x-3">
                <button className="bg-blue-600 p-1.5 sm:p-2 rounded-lg hover:bg-blue-500 transition-colors" title="Facebook">
                  <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 sm:p-2 rounded-lg hover:from-purple-400 hover:to-pink-400 transition-all" title="Instagram">
                  <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button className="bg-sky-500 p-1.5 sm:p-2 rounded-lg hover:bg-sky-400 transition-colors" title="Twitter">
                  <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button 
                  onClick={() => window.open('https://t.me/barokahprinter', '_blank')}
                  className="bg-blue-500 p-1.5 sm:p-2 rounded-lg hover:bg-blue-400 transition-colors" 
                  title="Telegram"
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => window.open('https://tokopedia.com/barokahprinter', '_blank')}
                  className="bg-green-600 p-1.5 sm:p-2 rounded-lg hover:bg-green-500 transition-colors" 
                  title="Tokopedia"
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </button>
                <button className="bg-orange-600 p-1.5 sm:p-2 rounded-lg hover:bg-orange-500 transition-colors" title="Shopee">
                  <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button className="bg-red-600 p-1.5 sm:p-2 rounded-lg hover:bg-red-500 transition-colors" title="YouTube">
                  <Youtube className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;