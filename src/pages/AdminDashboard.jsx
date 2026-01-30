import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, Activity, List, Calendar, Users, Settings, LogOut, Edit, Eye, CheckCircle, XCircle, Mail, Shield, Clock, BookMarked } from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [logs, setLogs] = useState([]);
    const [sevas, setSevas] = useState([]);
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [sevaBookings, setSevaBookings] = useState([]);
    const [roomBookings, setRoomBookings] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSevas: 0,
        totalEvents: 0,
        recentLogins: 0
    });
    const [newSeva, setNewSeva] = useState({ name: '', desc: '', donation: '' });
    const [newEvent, setNewEvent] = useState({ name: '', date: '', desc: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview' || activeTab === 'logs') {
                const logsData = await api.getAdminLogs().catch(() => []);
                setLogs(logsData || []);
            }
            if (activeTab === 'overview' || activeTab === 'sevas') {
                const sevasData = await api.getSevas().catch(() => []);
                setSevas(sevasData || []);
            }
            if (activeTab === 'overview' || activeTab === 'events') {
                const eventsData = await api.getEvents().catch(() => []);
                setEvents(eventsData || []);
            }
            if (activeTab === 'overview' || activeTab === 'seva-bookings') {
                const sevaBookingsData = await api.getSevaBookings().catch(() => []);
                setSevaBookings(sevaBookingsData || []);
            }
            if (activeTab === 'overview' || activeTab === 'room-bookings') {
                const roomBookingsData = await api.getRoomBookings().catch(() => []);
                setRoomBookings(roomBookingsData || []);
            }
            // Update stats
            setStats({
                totalUsers: users.length || 12,
                totalSevas: sevas.length || 8,
                totalEvents: events.length || 5,
                recentLogins: logs.length || 3
            });
        } catch (err) {
            console.error('Failed to load data:', err);
        }
        setLoading(false);
    };

    const handleAddSeva = async (e) => {
        e.preventDefault();
        await api.createSeva(newSeva);
        setNewSeva({ name: '', desc: '', donation: '' });
        loadData();
    };

    const handleDeleteSeva = async (id) => {
        if (window.confirm('Are you sure you want to delete this seva?')) {
            await api.deleteSeva(id);
            loadData();
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'sevas', label: 'Manage Sevas', icon: List },
        { id: 'events', label: 'Manage Events', icon: Calendar },
        { id: 'seva-bookings', label: 'Seva Bookings', icon: BookMarked },
        { id: 'room-bookings', label: 'Room Bookings', icon: BookMarked },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'logs', label: 'System Logs', icon: Clock },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Admin Dashboard</h1>
                            <p className="text-xs text-gray-400">Sri Sode Vadiraja Matha</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-300">Welcome, <strong>{user?.name || 'Admin'}</strong></span>
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center text-sm transition-all ${activeTab === tab.id
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Overview Tab */}
                {activeTab === 'overview' && !loading && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Users</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                                    </div>
                                    <Users className="w-10 h-10 text-blue-500 opacity-50" />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Active Sevas</p>
                                        <p className="text-3xl font-bold text-gray-800">{sevas.length}</p>
                                    </div>
                                    <List className="w-10 h-10 text-green-500 opacity-50" />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Upcoming Events</p>
                                        <p className="text-3xl font-bold text-gray-800">{events.length}</p>
                                    </div>
                                    <Calendar className="w-10 h-10 text-purple-500 opacity-50" />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Recent Activity</p>
                                        <p className="text-3xl font-bold text-gray-800">{logs.length}</p>
                                    </div>
                                    <Activity className="w-10 h-10 text-orange-500 opacity-50" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Access */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                    <List className="w-5 h-5 mr-2 text-orange-500" />
                                    Recent Sevas
                                </h3>
                                <div className="space-y-3">
                                    {sevas.slice(0, 4).map(seva => (
                                        <div key={seva.ID || seva.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700">{seva.name}</span>
                                            <span className="text-sm text-orange-600 font-bold">{seva.donation}</span>
                                        </div>
                                    ))}
                                    {sevas.length === 0 && <p className="text-gray-400 text-center py-4">No sevas found</p>}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-orange-500" />
                                    Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    {logs.slice(0, 4).map(log => (
                                        <div key={log.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                                            <Activity className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{log.action}</p>
                                                <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {logs.length === 0 && <p className="text-gray-400 text-center py-4">No recent activity</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logs Tab */}
                {activeTab === 'logs' && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-orange-500" />
                            System Logs
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Action</th>
                                        <th className="p-3">Details</th>
                                        <th className="p-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logs.length === 0 ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-gray-400">No logs found</td></tr>
                                    ) : (
                                        logs.map(log => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="p-3 text-sm text-gray-500">#{log.id}</td>
                                                <td className="p-3 text-sm font-medium text-gray-800">{log.action}</td>
                                                <td className="p-3 text-sm text-gray-600">{log.details}</td>
                                                <td className="p-3 text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Sevas Tab */}
                {activeTab === 'sevas' && !loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-green-500" />
                                Add New Seva
                            </h2>
                            <form onSubmit={handleAddSeva} className="space-y-4">
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Seva Name"
                                    value={newSeva.name}
                                    onChange={e => setNewSeva({ ...newSeva, name: e.target.value })}
                                    required
                                />
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Description"
                                    rows={3}
                                    value={newSeva.desc}
                                    onChange={e => setNewSeva({ ...newSeva, desc: e.target.value })}
                                />
                                <input
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Donation Amount (e.g. ₹500)"
                                    value={newSeva.donation}
                                    onChange={e => setNewSeva({ ...newSeva, donation: e.target.value })}
                                    required
                                />
                                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-colors">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Seva
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center">
                                <List className="w-5 h-5 mr-2 text-orange-500" />
                                Existing Sevas ({sevas.length})
                            </h2>
                            {sevas.map(seva => (
                                <div key={seva.ID || seva.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center group hover:shadow-md transition-shadow">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{seva.name}</h3>
                                        <p className="text-sm text-gray-500">{seva.desc}</p>
                                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full mt-2 inline-block">
                                            {seva.donation}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-blue-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSeva(seva.ID || seva.id)}
                                            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {sevas.length === 0 && (
                                <div className="bg-white p-8 rounded-xl text-center text-gray-400">
                                    No sevas found. Add your first seva!
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Events Tab */}
                {activeTab === 'events' && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                            Manage Events
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.map(event => (
                                <div key={event.ID || event.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-gray-800">{event.name}</h3>
                                    <p className="text-sm text-purple-600 font-medium mt-1">{event.date}</p>
                                    <p className="text-sm text-gray-500 mt-2">{event.desc}</p>
                                    <div className="flex space-x-2 mt-4">
                                        <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                            Edit
                                        </button>
                                        <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && (
                                <div className="col-span-full text-center text-gray-400 py-8">
                                    No events found
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-500" />
                            User Management
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                        <th className="p-3">User</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-orange-600 font-bold text-sm">A</span>
                                                </div>
                                                <span className="font-medium text-gray-800">Admin</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">8aborea@gmail.com</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Admin</span>
                                        </td>
                                        <td className="p-3">
                                            <span className="flex items-center text-green-600 text-sm">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Verified
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">View</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <Settings className="w-5 h-5 mr-2 text-gray-500" />
                            Settings
                        </h2>
                        <div className="space-y-6">
                            <div className="border-b pb-6">
                                <h3 className="font-semibold text-gray-800 mb-4">Email Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">SMTP Server</label>
                                        <input
                                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50"
                                            value="smtp-relay.brevo.com"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Sender Email</label>
                                        <input
                                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50"
                                            value="8aborea@gmail.com"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">Admin Emails</h3>
                                <p className="text-sm text-gray-500 mb-2">Users with these emails will automatically get admin access:</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">admin@sodematha.org</span>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">8aborea@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Seva Bookings Tab */}
                {activeTab === 'seva-bookings' && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                            <span className="flex items-center">
                                <BookMarked className="w-5 h-5 mr-2 text-orange-500" />
                                Seva Bookings ({sevaBookings.length})
                            </span>
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Seva</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Contact</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sevaBookings.length === 0 ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-gray-400">No bookings yet</td></tr>
                                    ) : (
                                        sevaBookings.map(booking => (
                                            <tr key={booking.id} className="hover:bg-gray-50">
                                                <td className="p-3 text-sm text-gray-500">#{booking.id}</td>
                                                <td className="p-3 text-sm font-medium text-gray-800">{booking.seva?.name || 'N/A'}</td>
                                                <td className="p-3 text-sm text-gray-700">{booking.name}</td>
                                                <td className="p-3 text-xs text-gray-600">
                                                    <div>{booking.email}</div>
                                                    <div>{booking.phone}</div>
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">{booking.date}</td>
                                                <td className="p-3">
                                                    <select
                                                        value={booking.status}
                                                        onChange={(e) => {
                                                            api.updateBookingStatus('seva', booking.id, e.target.value);
                                                            loadData();
                                                        }}
                                                        className={`px-2 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Delete this booking?')) {
                                                                api.deleteBooking('seva', booking.id);
                                                                loadData();
                                                            }
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Room Bookings Tab */}
                {activeTab === 'room-bookings' && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                            <span className="flex items-center">
                                <BookMarked className="w-5 h-5 mr-2 text-purple-500" />
                                Room Bookings ({roomBookings.length})
                            </span>
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Room</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Contact</th>
                                        <th className="p-3">Dates</th>
                                        <th className="p-3">Guests</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {roomBookings.length === 0 ? (
                                        <tr><td colSpan="8" className="p-8 text-center text-gray-400">No bookings yet</td></tr>
                                    ) : (
                                        roomBookings.map(booking => (
                                            <tr key={booking.id} className="hover:bg-gray-50">
                                                <td className="p-3 text-sm text-gray-500">#{booking.id}</td>
                                                <td className="p-3 text-sm font-medium text-gray-800">{booking.room?.type || 'N/A'}</td>
                                                <td className="p-3 text-sm text-gray-700">{booking.name}</td>
                                                <td className="p-3 text-xs text-gray-600">
                                                    <div>{booking.email}</div>
                                                    <div>{booking.phone}</div>
                                                </td>
                                                <td className="p-3 text-xs text-gray-600">
                                                    <div>In: {booking.checkInDate}</div>
                                                    <div>Out: {booking.checkOutDate}</div>
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">{booking.guests}</td>
                                                <td className="p-3">
                                                    <select
                                                        value={booking.status}
                                                        onChange={(e) => {
                                                            api.updateBookingStatus('room', booking.id, e.target.value);
                                                            loadData();
                                                        }}
                                                        className={`px-2 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Delete this booking?')) {
                                                                api.deleteBooking('room', booking.id);
                                                                loadData();
                                                            }
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
