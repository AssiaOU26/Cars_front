// client/src/components/AdminCrudModal.js
import React, { useState, useEffect } from 'react';

function AdminCrudModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({});
    const isEditing = Boolean(initialData);

    useEffect(() => {
        // If editing, pre-fill with data, otherwise use defaults for a new admin
        const defaults = {
            name: '',
            username: '',
            email: '',
            phone: '',
            level: 'admin',
            status: 'active',
        };
        setFormData(isEditing ? initialData : defaults);
    }, [isOpen, initialData, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="glass-effect rounded-lg p-6 shadow-2xl transform transition-all max-w-md w-full mx-4">
                <h3 className="text-lg font-bold text-white mb-4">{isEditing ? 'Edit Admin' : 'Add New Admin'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields */}
                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Full Name" required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white" />
                    <input type="text" name="username" value={formData.username || ''} onChange={handleChange} placeholder="Username" required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white" />
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white" />
                    <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Phone" required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white" />
                    <select name="level" value={formData.level} onChange={handleChange} required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white">
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                    <select name="status" value={formData.status} onChange={handleChange} required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminCrudModal;