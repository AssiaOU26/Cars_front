// client/src/components/ContactCrudModal.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ContactCrudModal({ isOpen, onClose, onSave, initialData }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('mechanic');
    const isEditing = Boolean(initialData);
    const { t } = useTranslation();

    useEffect(() => {
        // If we are editing, pre-fill the form with existing data
        if (isEditing) {
            setName(initialData.name);
            setPhone(initialData.phone);
            setEmail(initialData.email);
            setRole(initialData.role);
        } else {
            // If we are adding, reset the form
            setName('');
            setPhone('');
            setEmail('');
            setRole('mechanic');
        }
    }, [isOpen, initialData, isEditing]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({ name, phone, email, role });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="glass-effect rounded-lg p-6 shadow-2xl transform transition-all max-w-md w-full mx-4">
                <h3 className="text-lg font-bold text-white mb-4">{isEditing ? t('operator.edit', { defaultValue: 'Edit Operator' }) : t('operator.add', { defaultValue: 'Add New Operator' })}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields */}
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">{t('common.name', { defaultValue: 'Name' })}</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">{t('common.phone', { defaultValue: 'Phone' })}</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">{t('auth.email')}</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50">
                            <option value="mechanic">Mechanic</option>
                            <option value="towing">Towing</option>
                            <option value="emergency">Emergency</option>
                            <option value="support">Support</option>
                        </select>
                    </div> */}
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">{t('common.save', { defaultValue: 'Save' })}</button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">{t('modal.cancel')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ContactCrudModal;