import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, Clock, BookOpen, Video, Heart, Home, Menu, X, Image, Users, Bell, Share2, ChevronRight, Check, Hotel, Mail, Lock, Settings } from 'lucide-react';
import { api } from './services/api';
import AdminDashboard from './pages/AdminDashboard';

// Import Images
import heroImg from './assets/images/hero.png';
import panchaImg from './assets/images/pancha_vrindavana.png';
import hayagrivaImg from './assets/images/hayagriva_samudra.png';
import ramaImg from './assets/images/rama_trivikrama.png';
import dhavalaImg from './assets/images/dhavala_ganga.png';
import bhoothaImg from './assets/images/bhootharaja.png';
import vaddirajaImg from './assets/images/vadiraja_portrait.png';
import manuscriptImg from './assets/images/ancient_manuscript.png';
import structureImg from './assets/images/matha_structure.png';

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-xl z-50 flex items-center animate-fade-in-up">
    <span className="mr-2">ℹ️</span>
    {message}
  </div>
);

const LoginScreen = ({ onLogin, showToast, toastMessage, setToastMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const [step, setStep] = useState('input'); // 'input' or 'verify'
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!isLogin && !name.trim()) {
      showToast('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      const result = await api.sendEmailOTP(email, name);
      setLoading(false);
      setStep('verify');

      if (result.debug_otp) {
        setDebugOtp(result.debug_otp);
        showToast(`OTP sent! (Debug: ${result.debug_otp})`);
      } else {
        showToast(`OTP sent to ${email}`);
      }
    } catch (err) {
      setLoading(false);
      showToast('Failed to send OTP: ' + err.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.verifyEmailOTP(email, otp, name, password);
      setLoading(false);
      onLogin(result);
      showToast(isLogin ? 'Welcome back! 🙏' : 'Account verified successfully! 🙏');
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 transform rotate-3 hover:rotate-6 transition-transform">
            <span className="text-4xl text-white">🕉️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Devotee</h1>
          <p className="text-sm text-gray-500 mt-2">
            {step === 'verify' ? 'Verify your email' : (isLogin ? 'Sign in to' : 'Create account for')} Sri Sode Vadiraja Matha
          </p>
        </div>

        {step === 'input' ? (
          <form onSubmit={handleSendOTP} className="space-y-5 animate-fade-in-up">
            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative mt-1">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  placeholder="devotee@example.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required={!isLogin}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>{isLogin ? 'Send OTP to Login' : 'Send Verification OTP'}</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5 animate-fade-in-up">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">OTP sent to <span className="font-bold">{email}</span></p>
              {debugOtp && <p className="text-xs text-green-600 mt-1 font-mono bg-green-50 px-2 py-1 rounded">Debug OTP: {debugOtp}</p>}
              <button type="button" onClick={() => { setStep('input'); setOtp(''); setDebugOtp(''); }} className="text-xs text-orange-600 font-semibold hover:underline mt-2">Change Email</button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Enter 6-Digit OTP</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all tracking-[0.5em] text-2xl font-bold text-center"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Verify & {isLogin ? 'Login' : 'Create Account'}</span>
                  <Check className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Resend OTP
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setStep('input'); setOtp(''); setDebugOtp(''); }}
            className="text-sm text-orange-600 font-semibold hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        {/* Admin Login - separate direct login */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={async () => {
              const adminEmail = prompt('Enter Admin Email:', 'admin@sodematha.org');
              const adminPassword = prompt('Enter Admin Password:');
              if (adminEmail && adminPassword) {
                try {
                  const result = await api.adminLogin(adminEmail, adminPassword);
                  onLogin(result);
                  showToast('Welcome Administrator! 🛡️');
                } catch (err) {
                  showToast(err.message || 'Invalid admin credentials');
                }
              }
            }}
            className="w-full text-center text-xs text-gray-400 hover:text-orange-600 font-medium py-2"
          >
            🔐 Admin Login
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

const PaymentGatewayModal = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment process
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        setSuccess(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Secure Payment</h3>
          <p className="text-blue-100 text-sm mt-1">Sode Matha Seva Portal</p>
        </div>

        <div className="p-8">
          {!success ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm uppercase font-bold tracking-widest">Amount to Pay</p>
                <p className="text-4xl font-extrabold text-gray-800 mt-1">{amount}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Merchant</span>
                  <span className="font-bold text-gray-800">Sri Sode Matha</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-gray-700">TXN{Math.floor(Date.now() / 1000)}</span>
                </div>
              </div>

              <button
                disabled={processing}
                onClick={handlePay}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-500/20"
              >
                {processing ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>Pay Securely</span>
                )}
              </button>

              <button
                disabled={processing}
                onClick={onClose}
                className="w-full text-gray-400 text-sm font-medium hover:text-gray-600"
              >
                Cancel Transaction
              </button>
            </div>
          ) : (
            <div className="py-10 text-center animate-bounce-short">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
              <p className="text-gray-500 mt-2">Generating your booking receipt...</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 flex items-center justify-center gap-4 border-t border-gray-100">
          <span className="bg-gray-200 h-[1px] flex-grow"></span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure 256-bit SSL</span>
          <span className="bg-gray-200 h-[1px] flex-grow"></span>
        </div>
      </div>
    </div>
  );
};

const BookingModal = ({ isOpen, onClose, seva, onConfirm }) => {
  const [date, setDate] = useState('');
  const [devoteeName, setDevoteeName] = useState('');
  const [gothra, setGothra] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const finalizeBooking = () => {
    setShowPayment(false);
    onConfirm(date, devoteeName, gothra);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-scale-up">
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Book {seva?.name}</h3>
          <p className="text-gray-600 text-sm mb-4">Complete your offering of {seva?.donation}</p>

          <form className="space-y-4" onSubmit={handleBookingSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">DEVOTEE NAME</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your name"
                required
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">NAKSHATRA / GOTHRA</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Optional"
                value={gothra}
                onChange={(e) => setGothra(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">DATE</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-shadow">
              Proceed to Pay {seva?.donation}
            </button>
          </form>
        </div>
      </div>

      <PaymentGatewayModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={seva?.donation}
        onPaymentSuccess={finalizeBooking}
      />
    </>
  );
};

const LiteratureModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const works = [
    {
      category: 'Magnum Opus (Philosophy)',
      items: [
        { title: 'Yukti Mallika', desc: 'A colossal work of 5,379 verses divided into 5 chapters (Saurabhas). It logically establishes the supremacy of Dvaita Vedanta and refutes other schools of thought with razor-sharp logic.' }
      ]
    },
    {
      category: 'Mahakavya (Poetry)',
      items: [
        { title: 'Rukminisha Vijaya', desc: 'A Sanskrit Mahakavya of 19 cantos that narrates the story of Lord Krishna, highlighting his marriage to Rukmini. It is considered equal to Magha’s Shishupala Vadha in literary merit.' }
      ]
    },
    {
      category: 'Travelogue & Geography',
      items: [
        { title: 'Tirtha Prabandha', desc: 'A unique travelogue describing his pilgrimage to holy centers across India. It provides historical and geographical details of temples from the Himalayas to Kanyakumari.' }
      ]
    },
    {
      category: 'Devotional Songs (Dasa Sahitya)',
      items: [
        { title: 'Lakshmi Shobhane', desc: 'A famous auspicious song sung during marriages. It narrates the story of Samudra Manthana and the wedding of Goddess Lakshmi with Lord Narayana.' },
        { title: 'Dashavatara Stuti', desc: 'Verified songs in Kannada praising the ten incarnations of Lord Vishnu, emphasizing the saving grace of the Lord.' }
      ]
    },
    {
      category: 'Mystical Works',
      items: [
        { title: 'Swapna Vrindavanakhyana', desc: 'A mystical work revealed in dreams to a devotee, detailing the glory of the Vrindavana and the presence of the Lord within it.' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative animate-scale-up max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center mb-6 flex-shrink-0">
          <div className="bg-orange-100 p-3 rounded-full mr-3">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Literary Contributions</h3>
            <p className="text-xs text-gray-500">By Sri Vadiraja Teertha</p>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-grow">
          {works.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-orange-700 text-xs uppercase tracking-wider mb-2 border-b border-orange-100 pb-1">{section.category}</h4>
              <div className="space-y-3">
                {section.items.map((work, wIdx) => (
                  <div key={wIdx} className="bg-orange-50/50 rounded-xl p-3 border border-orange-100 hover:bg-orange-50 transition-colors">
                    <h5 className="font-bold text-gray-800 text-sm">{work.title}</h5>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{work.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100 flex-shrink-0">
          <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const RenovationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-scale-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-full mr-3">
            <Home className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Renovation Project</h3>
            <p className="text-xs text-gray-500">Restoring Heritage</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Project Status</span>
              <span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-1 rounded-full">In Progress</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-gray-500">45% Completed • Target: Dec 2026</p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-bold text-gray-800 text-sm mb-3">Bank Details for Donation</h4>
            <div className="bg-gray-50 p-3 rounded-xl space-y-2 text-sm text-gray-700 font-mono">
              <p><span className="text-gray-400">Account Name:</span> Sri Sode Vadiraja Matha</p>
              <p><span className="text-gray-400">Bank:</span> Syndicate Bank, Sode</p>
              <p><span className="text-gray-400">A/C No:</span> 0000 0000 0123 4567</p>
              <p><span className="text-gray-400">IFSC:</span> SYNB0001234</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-bold text-gray-800 text-sm mb-3">UPI Donation</h4>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="font-mono text-gray-800 font-medium">sodematha@upi</span>
              <button className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-800">Copy</button>
            </div>
          </div>
        </div>

        <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors" onClick={onClose}>
          Close Details
        </button>
      </div>
    </div>
  );
};

// Room Booking Modal Component
const RoomBookingModal = ({ isOpen, onClose, room, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createRoomBooking({
        roomId: room.id,
        ...formData
      });

      onConfirm();
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        checkInDate: '',
        checkOutDate: '',
        guests: 1,
        specialRequests: ''
      });
    } catch (error) {
      alert(error.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative animate-scale-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center mb-4">
          <div className="bg-purple-100 p-3 rounded-full mr-3">
            <Hotel className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Book {room?.type}</h3>
            <p className="text-xs text-gray-500">{room?.price} per day</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">FULL NAME *</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your full name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL *</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your.email@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">PHONE NUMBER *</label>
            <input
              type="tel"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="+91 XXXXX XXXXX"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">CHECK-IN *</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">CHECK-OUT *</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">NUMBER OF GUESTS *</label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">SPECIAL REQUESTS (Optional)</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows="3"
              placeholder="Any special requirements or requests..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Confirm Booking
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          You will receive a confirmation email shortly after booking.
        </p>
      </div>
    </div>
  );
};

const RoomSelectionModal = ({ isOpen, onClose, roomTypes = [], onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative animate-scale-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center mb-6">
          <div className="bg-purple-100 p-3 rounded-full mr-3">
            <Hotel className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Select Room Type</h3>
            <p className="text-sm text-gray-500">Choose your accommodation</p>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
          {roomTypes.map((room, idx) => (
            <div key={idx} className="bg-white border border-purple-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:border-purple-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-800 text-base">{room.type}</h4>
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold mt-1">
                    {room.price}
                  </span>
                </div>
                {/* Icon based on room type */}
                <div className="bg-gray-50 p-2 rounded-lg">
                  {room.type.toLowerCase().includes('deluxe') ? '✨' :
                    room.type.toLowerCase().includes('semi') ? '🛏️' : '🛖'}
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {room.desc}
              </p>

              <button
                onClick={() => onSelect(room)}
                className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors flex items-center justify-center active:scale-95 shadow-purple-200 shadow-lg"
              >
                Book This Room
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}

          {roomTypes.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Loading room types...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AccommodationModal = ({ isOpen, onClose, roomTypes = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-scale-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center mb-4 flex-shrink-0">
          <div className="bg-indigo-100 p-3 rounded-full mr-3">
            <Hotel className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Accommodation</h3>
            <p className="text-xs text-gray-500">Stay at Sri Sode Matha</p>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-bold text-blue-800 text-xs uppercase tracking-wider mb-3">Room Categories</h4>
            <div className="space-y-3">
              {roomTypes.map((room, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl shadow-sm border border-blue-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-800 text-sm">{room.type}</span>
                    <span className="text-xs font-bold text-green-600">{room.price}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">{room.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-2">Booking Policies</h4>
            <ul className="text-[11px] text-gray-600 space-y-2 list-disc pl-4">
              <li>Check-in/Check-out: <span className="font-semibold text-gray-800">24-hour cycle</span>.</li>
              <li>Advance booking recommended for festivals.</li>
              <li>Identity proof mandatory for all guests.</li>
              <li>Consumption of non-veg and alcohol strictly prohibited.</li>
            </ul>
          </div>

          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
            <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider mb-2">Primary Contacts</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-700">Sonda Main Desk</span>
                <a href="tel:+919483357005" className="text-xs font-bold text-amber-700 hover:underline">+91 9483357005</a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-700">Udupi Branch</span>
                <a href="tel:+918202524004" className="text-xs font-bold text-amber-700 hover:underline">+91 820 2524004</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100 flex-shrink-0">
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors" onClick={onClose}>
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

const SodeMathaApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [toastMessage, setToastMessage] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSeva, setSelectedSeva] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [literatureOpen, setLiteratureOpen] = useState(false);
  const [renovationOpen, setRenovationOpen] = useState(false);
  const [accommodationOpen, setAccommodationOpen] = useState(false);
  const [roomBookingOpen, setRoomBookingOpen] = useState(false);
  const [roomSelectionOpen, setRoomSelectionOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  const [darshanTimings, setDarshanTimings] = useState([]);
  const [events, setEvents] = useState([]);
  const [sevaOptions, setSevaOptions] = useState([]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, e, s, v, r] = await Promise.all([
          api.getTimings().catch(() => []),
          api.getEvents().catch(() => []),
          api.getSevas().catch(() => []),
          api.getVideos().catch(() => []),
          api.getRooms().catch(() => [])
        ]);
        if (t.length) setDarshanTimings(t);
        if (e.length) setEvents(e);
        if (s.length) setSevaOptions(s);
        if (v.length) setVideoCategories(v);
        if (r.length) setRoomTypes(r);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  // Recent updates for notifications
  const recentUpdates = [
    { id: 1, text: "Special Aradhana on upcoming Kartika Month", time: "2h ago", icon: "🙏" },
    { id: 2, text: "Virtual Darshan now available on our website", time: "5h ago", icon: "📸" },
    { id: 3, text: "Room booking available - Call for reservations", time: "1d ago", icon: "🏨" }
  ];

  const toggleNotifications = () => {
    if (!notificationOpen) {
      setNotifications(0); // Mark all as read
    }
    setNotificationOpen(!notificationOpen);
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setIsLoggedIn(true);
      // Check if admin
      if (profile.mobile === '9999999999') {
        // Is Admin
      }
    }
  }, []);

  const handleLogin = (profile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUserProfile(profile);
    setIsLoggedIn(true);

    // DATABASE LOGIC: Save user to local "Database"
    // 1. Get existing users
    const existingUsers = JSON.parse(localStorage.getItem('db_users') || '[]');
    // 2. Check if this email already exists
    const userExists = existingUsers.some(u => u.email === profile.email);

    if (!userExists && profile.role !== 'admin') {
      const newUser = {
        ...profile,
        joined: new Date().toISOString()
      };
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('db_users', JSON.stringify(updatedUsers));
    }

    if (profile.role === 'admin') {
      showToast('Welcome Administrator! 🛡️');
      setActiveTab('admin');
    } else {
      showToast(`Namaste, ${profile.name}! 🙏`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    setIsLoggedIn(false);
    setUserProfile(null);
    showToast('Logged out successfully');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBooking = (seva) => {
    setSelectedSeva(seva);
    setBookingModalOpen(true);
  };

  const confirmBooking = (bookingDate, devoteeName, gothra) => {
    setBookingModalOpen(false);
    const formattedDate = new Date(bookingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    const newBooking = {
      id: Date.now(),
      sevaName: selectedSeva.name,
      devotee: devoteeName,
      gothra: gothra,
      donation: selectedSeva.donation,
      date: formattedDate,
      status: 'Confirmed'
    };
    setMyBookings(prev => [newBooking, ...prev]);
    showToast(`Booking confirmed for ${devoteeName}! 🙏`);
    setNotifications(prev => prev + 1);
  };

  // Tabs configuration
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'darshan', icon: Clock, label: 'Darshan' },
    { id: 'history', icon: BookOpen, label: 'History' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'media', icon: Video, label: 'Media' },
    { id: 'seva', icon: Heart, label: 'Seva' },
  ];

  if (userProfile?.mobile === '9999999999') {
    tabs.push({ id: 'admin', icon: Users, label: 'Admin' });
  }

  const locations = [
    { name: 'Sonda (Main)', phone: '+91 9483357005' },
    { name: 'Udupi', phone: '+91 820 2524004' },
    { name: 'Gokarna', phone: '+91 9449640074' },
    { name: 'Kumbhasi', phone: '+91 9141348548' },
    { name: 'Hoovinakere', phone: '+91 9448216430' },
  ];

  // Loaded from API

  // Loaded from API

  // Loaded from API

  // Loaded from API

  // Screen Components
  const HomeScreen = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-6 text-white overflow-hidden shadow-orange-200 shadow-xl h-64 flex flex-col justify-end">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={heroImg} alt="Sode Matha" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-4 text-white shadow-sm border border-white/30">
              <span className="text-3xl">🕉️</span>
            </div>
            <h1 className="text-2xl font-bold">Namaste, {userProfile?.name ? userProfile.name.split(' ')[0] : 'Devotee'}</h1>
          </div>
        </div>
        <p className="text-sm opacity-95 leading-relaxed text-gray-100 line-clamp-2">
          One of the sacred Ashta Mathas established by Sri Madhvacharya, blessed by the divine presence of Sri Vadiraja Teertha
        </p>
      </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('darshan')}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-left hover:shadow-lg transition-all active:scale-95"
        >
          <Clock className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-800">Darshan Times</h3>
          <p className="text-xs text-gray-600 mt-1">View timings</p>
        </button>

        <button
          onClick={() => setActiveTab('seva')}
          className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-2xl text-left hover:shadow-lg transition-all active:scale-95"
        >
          <Heart className="w-8 h-8 text-rose-600 mb-2" />
          <h3 className="font-semibold text-gray-800">Book Seva</h3>
          <p className="text-xs text-gray-600 mt-1">Online booking</p>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-2xl text-left hover:shadow-lg transition-all active:scale-95"
        >
          <Calendar className="w-8 h-8 text-amber-600 mb-2" />
          <h3 className="font-semibold text-gray-800">Events</h3>
          <p className="text-xs text-gray-600 mt-1">Festival calendar</p>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl text-left hover:shadow-lg transition-all active:scale-95"
        >
          <BookOpen className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-800">History</h3>
          <p className="text-xs text-gray-600 mt-1">Learn more</p>
        </button>
      </div>

      {/* Room Booking Section */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mr-3">
              <Hotel className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Room Booking</h3>
              <p className="text-sm text-purple-100">Stay at Sri Sode Matha</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-purple-100 mb-4 leading-relaxed">
          Book comfortable accommodation at our matha. Choose from General, Semi-Deluxe, or Deluxe rooms.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (roomTypes.length > 0) {
                setRoomSelectionOpen(true);
              } else {
                showToast('Loading room information...');
              }
            }}
            className="bg-white text-purple-600 py-3 rounded-xl font-bold text-sm hover:bg-purple-50 transition-all active:scale-95 flex items-center justify-center"
          >
            <Hotel className="w-4 h-4 mr-2" />
            Book Now
          </button>
          <button
            onClick={() => setAccommodationOpen(true)}
            className="bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-all active:scale-95 border border-white/30"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Live Updates */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
        <div className="flex items-center mb-3">
          <Bell className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="font-semibold text-gray-800">Latest Updates</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex items-center"><span className="mr-2">🙏</span> Special Aradhana on upcoming Kartika Month</p>
          <p className="flex items-center"><span className="mr-2">📸</span> Virtual Darshan now available on our website</p>
          <div
            onClick={() => {
              window.location.href = 'tel:+919483357005';
              showToast('Calling accommodation desk...');
            }}
            className="flex items-center cursor-pointer hover:text-orange-600 transition-colors p-1"
          >
            <span className="mr-2">🏨</span> Room booking available - Call now
          </div>
        </div>
      </div>

      {/* Sacred Sites */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-gray-800">Sacred Sites in Matha</h3>
        <div className="space-y-2">
          {[
            '🏛️ Pancha Vrindavans - Five sacred tombs',
            '⛲ Hayagriva Samudra - Holy lake',
            '🕉️ Rama Trivikrama Temple',
            '👻 Bhootharaja Temple',
            '💧 Dhavala Ganga & Sheethala Ganga tanks'
          ].map((site, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center hover:bg-gray-50 transition-colors">
              <span className="text-sm">{site}</span>
            </div>
          ))}
        </div>
      </div>
    </div >
  );

  const DarshanScreen = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg">
        <Clock className="w-12 h-12 mb-3" />
        <h2 className="text-2xl font-bold mb-2">Darshan Timings</h2>
        <p className="text-sm opacity-90">Plan your visit to the holy Matha</p>
      </div>

      <div className="space-y-4">
        {darshanTimings.map((timing, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{timing.title}</h3>
                <p className="text-2xl font-bold text-orange-600">{timing.time}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${timing.type === 'morning' ? 'bg-blue-100 text-blue-700' :
                  timing.type === 'evening' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                  {timing.type === 'morning' ? 'Morning' :
                    timing.type === 'evening' ? 'Evening' : 'Prasadam'}
                </span>
              </div>
              <Clock className="w-8 h-8 text-orange-500 opacity-30" />
            </div>
          </div>
        ))}
      </div>


    </div>
  );

  const HistoryScreen = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <BookOpen className="w-12 h-12 mb-3" />
          <h2 className="text-2xl font-bold mb-2">History & Heritage</h2>
          <p className="text-sm opacity-90">Legacy of Sri Vadiraja Teertha</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="h-48 overflow-hidden relative">
          <img src={vaddirajaImg} alt="Sri Vadiraja Teertha" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <h3 className="text-white font-bold text-xl">About Sode Matha</h3>
          </div>
        </div>
        <div className="p-5 space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Located 281 km north of Mangalore, <span className="font-semibold text-orange-600">Sode</span> (also known as Sodha, Sonda, or Swadi) is the headquarters of the Sode Matha, one of the Ashta Mathas established by Sri Madhvacharya.
          </p>
          <div className="flex items-start p-3 bg-green-50 rounded-xl border border-green-100 italic text-green-800 my-2">
            <span className="text-2xl mr-3 opacity-50">❝</span>
            <p>Blessed by the divine presence of Sri Vadiraja Teertha, a saint, poet, and philosopher of the 16th century.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm relative">
        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
          <span className="bg-orange-100 p-2 rounded-lg text-orange-600 mr-3">🏛️</span>
          The Matha Complex
        </h3>
        <img src={structureImg} alt="Matha Structure" className="w-full h-40 object-cover rounded-xl mb-4 shadow-sm" />
        <div className="space-y-4">
          <div className="flex relative pl-6 pb-4 border-l-2 border-orange-200 last:border-0 last:pb-0">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">First Stage</h4>
              <p className="text-xs text-gray-500 mt-1">Dhwaja Stamba & Rama Trivikrama Temple</p>
            </div>
          </div>
          <div className="flex relative pl-6 pb-4 border-l-2 border-orange-200 last:border-0 last:pb-0">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Second Stage</h4>
              <p className="text-xs text-gray-500 mt-1">Rajangana, Antaraganga & Sheetalaganga wells</p>
            </div>
          </div>
          <div className="flex relative pl-6 border-l-2 border-transparent">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Third Stage</h4>
              <p className="text-xs text-gray-500 mt-1">Dhavala Ganga tank & The Pancha Vrindavans</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-800">Literary Heritage</h3>
            <p className="text-xs text-gray-500">Dasa Sahitya & Manuscripts</p>
          </div>
          <img src={manuscriptImg} alt="Manuscripts" className="w-16 h-16 rounded-lg object-cover shadow-sm transform -rotate-6 border-2 border-white" />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Sri Vadiraja Teertha composed numerous works in Sanskrit and Kannada. His contribution to Dasa Sahitya through "Lakshmi Shobhane" and other songs is immense.
        </p>
        <button
          onClick={() => setLiteratureOpen(true)}
          className="mt-3 w-full py-2 bg-white text-orange-700 font-bold text-xs rounded-lg shadow-sm border border-orange-100 hover:bg-orange-50"
        >
          View Major Works
        </button>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Renovation Project</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-700 mb-2">
            A grand renovation is underway with an estimated cost of <span className="font-bold text-green-600">₹30 Crores</span>.
          </p>
          <p className="text-xs text-gray-500">
            Over 520 devotees have already contributed. Join this divine cause.
          </p>
          <button
            onClick={() => setRenovationOpen(true)}
            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors"
          >
            View Renovation Details
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Educational Institutions</h3>
        <div className="space-y-4">
          {[
            { name: 'Shri Madhwa Vadiraja Institute of Technology', desc: 'Engineering Your Career & Character with Care' },
            { name: 'Niramaya College of Nursing', desc: 'Empowering Healthcare Education' },
            { name: 'S.V.H Pre University College', desc: 'Quality teaching with holistic growth' },
            { name: 'S.V.S English Medium School', desc: 'Nurturing character and empowering futures' }
          ].map((inst, idx) => (
            <div key={idx} className="border-l-2 border-orange-200 pl-3">
              <h4 className="font-semibold text-sm text-gray-800">{inst.name}</h4>
              <p className="text-xs text-gray-500">{inst.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div >
  );

  const EventsScreen = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
        <Calendar className="w-12 h-12 mb-3" />
        <h2 className="text-2xl font-bold mb-2">Events & Festivals</h2>
        <p className="text-sm opacity-90">Annual celebrations and daily rituals</p>
      </div>

      <div className="space-y-4">
        {events.map((event, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-800 text-lg mb-2">{event.name}</h3>
            <p className="text-purple-600 font-semibold text-sm mb-2">📅 {event.date}</p>
            <p className="text-sm text-gray-700">{event.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">📢 Stay Updated</h3>
        <p className="text-sm text-blue-800 mb-3">
          Subscribe to receive notifications about upcoming events, special poojas, and swamiji's visit schedules.
        </p>
        <button
          onClick={() => showToast('Notifications enabled for events! 🔔')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Enable Notifications
        </button>
      </div>
    </div>
  );

  const SevaScreen = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg">
        <Heart className="w-12 h-12 mb-3" />
        <h2 className="text-2xl font-bold mb-2">Seva & Donations</h2>
        <p className="text-sm opacity-90">Serve the divine with devotion</p>
      </div>

      {myBookings.length > 0 && (
        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 animate-fade-in">
          <h3 className="font-bold text-lg text-orange-900 mb-3 flex items-center">
            <span className="mr-2">🕉️</span> My Bookings
          </h3>
          <div className="space-y-3">
            {myBookings.map(booking => (
              <div key={booking.id} className="bg-white p-3 rounded-xl shadow-sm border border-orange-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{booking.sevaName}</p>
                  <p className="text-xs text-orange-600 font-medium">For: {booking.devotee} {booking.gothra && `(${booking.gothra})`}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{booking.date} • {booking.donation}</p>
                </div>
                <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-lg border border-green-100">
                  <Check className="w-3 h-3 mr-1" />
                  <span className="text-[10px] font-bold uppercase">{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      <div className="grid gap-4">
        {sevaOptions.map((seva, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{seva.name}</h3>
                <p className="text-sm text-gray-600">{seva.desc}</p>
              </div>
              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
                {seva.donation}
              </span>
            </div>
            <button
              onClick={() => handleBooking(seva)}
              className="w-full bg-rose-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>



      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-3">📞 Contact for Seva Booking</h3>
        <div className="space-y-2">
          {locations.slice(0, 3).map((loc, idx) => (
            <div key={idx} className="bg-white rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                window.location.href = `tel:${loc.phone.split(',')[0]}`;
                showToast(`Calling ${loc.name}...`);
              }}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{loc.name}</p>
                <p className="text-xs text-gray-600">{loc.phone}</p>
              </div>
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );



  const MediaScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('Daily Darshan');
    const currentVideos = videoCategories.find(cat => cat.name === selectedCategory)?.videos || [];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-6 text-white shadow-lg">
          <Video className="w-12 h-12 mb-3" />
          <h2 className="text-2xl font-bold mb-2">Media Gallery</h2>
          <p className="text-sm opacity-90">Watch videos from our YouTube channel</p>
        </div>

        {/* YouTube Channel Banner */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-5 border-2 border-red-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mr-3">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Sode Sri Vadiraja Matha</h3>
                <p className="text-sm text-gray-600">Official YouTube Channel</p>
              </div>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@SriSodeVadirajaMatha"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">▶️</span> Visit Channel
          </a>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {videoCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.name
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-red-50'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="space-y-4">
          {currentVideos.map((video, idx) => (
            <div key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => {
                const query = encodeURIComponent(`Sri Sode Vadiraja Matha ${video.title}`);
                window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                showToast(`Opening ${video.title} on YouTube...`);
              }}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-red-400 to-orange-500 h-48 flex items-center justify-center">
                  <span className="text-6xl animate-pulse">{video.thumbnail}</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                    <div className="w-0 h-0 border-l-8 border-l-red-600 border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-1">{video.title}</h4>
                <p className="text-xs text-gray-500">Sri Sode Vadiraja Matha</p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Gallery */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
            <Image className="w-5 h-5 mr-2 text-orange-600" />
            Photo Gallery
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { img: panchaImg, label: 'Pancha Vrindavana', icon: '🏛️' },
              { img: hayagrivaImg, label: 'Hayagriva Samudra', icon: '🌊' },
              { img: ramaImg, label: 'Rama Trivikrama', icon: '⛩️' },
              { img: null, label: 'Dhwaja Stamba', icon: '🚩' }, // Placeholder for now
              { img: dhavalaImg, label: 'Dhavala Ganga', icon: '💧' },
              { img: bhoothaImg, label: 'Bhootharaja', icon: '🙏' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  if (!item.img) {
                    const query = encodeURIComponent(`Sode Matha ${item.label}`);
                    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
                  } else {
                    setSelectedImage(item);
                    setLightboxOpen(true);
                  }
                }}
              >
                {item.img ? (
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex flex-col items-center justify-center">
                    <span className="text-3xl mb-1">{item.icon}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium text-xs bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">View</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <span className="text-[10px] font-semibold text-white truncate block">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && selectedImage && (
          <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightboxOpen(false)}>
            <button className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="max-w-4xl w-full max-h-[80vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <img src={selectedImage.img} alt={selectedImage.label} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
              <h3 className="text-white text-xl font-bold mt-4">{selectedImage.label}</h3>
              <p className="text-gray-400 text-sm mt-1">Sri Sode Vadiraja Matha</p>
            </div>
          </div>
        )}
      </div >
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'darshan': return <DarshanScreen />;
      case 'history': return <HistoryScreen />;
      case 'events': return <EventsScreen />;
      case 'media': return <MediaScreen />;
      case 'seva': return <SevaScreen />;
      case 'admin': return <AdminDashboard user={userProfile} onLogout={handleLogout} />;
      default: return <HomeScreen />;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} showToast={showToast} toastMessage={toastMessage} setToastMessage={setToastMessage} />;
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🕉️</span>
            <div>
              <h1 className="font-bold text-lg">Sri Sode Vadiraja Matha</h1>
              <p className="text-xs opacity-90">Spiritual Heritage App</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 relative">
            <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors" onClick={toggleNotifications}>
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-scale-up">
                <div className="bg-orange-50 p-3 border-b border-orange-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                  <button onClick={() => setNotificationOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recentUpdates.map(update => (
                    <div key={update.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start">
                      <span className="text-xl mr-3">{update.icon}</span>
                      <div>
                        <p className="text-sm text-gray-800 font-medium leading-tight">{update.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{update.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                  <button className="text-xs font-bold text-orange-600 hover:text-orange-700">Mark all as read</button>
                </div>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-white/10 rounded-full transition-colors z-50">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Side Menu */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuOpen(false)}>
        <div className={`absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="p-6 pt-20">
            <h2 className="font-bold text-xl text-gray-800 mb-6">Menu</h2>
            <div className="space-y-2">
              {[
                { icon: MapPin, text: 'All Locations', action: () => { showToast('Showing all branch locations...'); setMenuOpen(false); setActiveTab('seva'); } },
                { icon: Video, text: 'Live Darshan', action: () => { setMenuOpen(false); setActiveTab('media'); showToast('Switched to Live Darshan'); } },
                { icon: Image, text: 'Photo Gallery', action: () => { setMenuOpen(false); setActiveTab('media'); showToast('Opening Gallery...'); } },
                { icon: Users, text: 'Guru Parampara', action: () => { setMenuOpen(false); setActiveTab('history'); showToast('Viewing Guru Parampara'); } },
                { icon: Share2, text: 'Share App', action: () => { setMenuOpen(false); showToast('App link copied to clipboard! 🔗'); } },
                ...(userProfile?.role === 'admin' ? [{ icon: Settings, text: 'Admin Dashboard', action: () => { setMenuOpen(false); setActiveTab('admin'); } }] : []),
                { icon: X, text: 'Logout', action: () => { setMenuOpen(false); handleLogout(); } }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full text-left p-3 rounded-xl hover:bg-orange-50 active:bg-orange-100 flex items-center justify-between transition-colors group"
                >
                  <span className="flex items-center text-gray-700 group-hover:text-orange-700">
                    <item.icon className="w-5 h-5 mr-3 text-orange-500 group-hover:text-orange-600" />
                    <span className="font-medium">{item.text}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-400" />
                </button>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 left-0 w-full text-center text-xs text-gray-400">
            Version 1.0.1
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 min-h-[calc(100vh-80px)]">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] max-w-md mx-auto z-30">
        <div className="flex justify-around items-center p-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'text-orange-600 bg-orange-50 translate-y-[-5px]'
                  : 'text-gray-400 hover:text-orange-400 hover:bg-gray-50'
                  }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Overlay Components */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} seva={selectedSeva} onConfirm={confirmBooking} />
      <LiteratureModal isOpen={literatureOpen} onClose={() => setLiteratureOpen(false)} />
      <RenovationModal isOpen={renovationOpen} onClose={() => setRenovationOpen(false)} />
      <AccommodationModal isOpen={accommodationOpen} onClose={() => setAccommodationOpen(false)} roomTypes={roomTypes} />

      <RoomSelectionModal
        isOpen={roomSelectionOpen}
        onClose={() => setRoomSelectionOpen(false)}
        roomTypes={roomTypes}
        onSelect={(room) => {
          setRoomSelectionOpen(false);
          setSelectedRoomForBooking(room);
          setRoomBookingOpen(true);
        }}
      />

      <RoomBookingModal
        isOpen={roomBookingOpen}
        onClose={() => setRoomBookingOpen(false)}
        room={selectedRoomForBooking}
        onConfirm={() => {
          showToast('Room booking request submitted successfully! 🎉');
          setRoomBookingOpen(false);
        }}
      />
    </div>
  );
};

export default SodeMathaApp;
