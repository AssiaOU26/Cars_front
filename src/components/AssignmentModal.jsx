import React, { useState, useEffect } from 'react';
import { submitAssignment } from '../api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function AssignmentModal({ isOpen, onClose, requestId, contacts, users, onAssignmentSuccess }) {
    const [operatorId, setOperatorId] = useState('');
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('assigned');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();

    // Reset state when the modal is closed or the requestId changes
    useEffect(() => {
        if (!isOpen) {
            setOperatorId('');
            setUserId('');
            setStatus('assigned');
        }
    }, [isOpen]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!operatorId || !userId) {
            toast.error(t('error.assignment_select_both', { defaultValue: 'Please select both an operator and a user.' }));
            return;
        }
        setIsSubmitting(true);
        try {
            await submitAssignment({
                requestId,
                operatorId,
                userId,
                status
            });
            toast.success(t('toast.assignment_success', { defaultValue: 'Assignment successful!' }));
            onAssignmentSuccess();
            onClose();
        } catch (error) {
            toast.error(t('error.assignment_failed', { defaultValue: 'Assignment failed.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // We wrap the content in another component to handle the mount/unmount transition
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className={`glass-effect rounded-lg p-6 shadow-2xl transform transition-all duration-300 max-w-md w-full mx-4 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">{t('modal.assignment.title')}</h3>
                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="assignment-contact" className="block text-sm font-medium text-white/90 mb-1">{t('modal.assignment.select_operator')}</label>
                        <select
                            id="assignment-contact"
                            value={operatorId}
                            onChange={(e) => setOperatorId(e.target.value)}
                            className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                            required
                        >
                            <option value="">{t('modal.assignment.choose_operator')}</option>
                            {contacts.map(contact => (
                                <option key={contact.id} value={contact.id}>{contact.name} ({contact.role})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="assignment-user" className="block text-sm font-medium text-white/90 mb-1">{t('modal.assignment.select_user')}</label>
                        <select
                            id="assignment-user"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                            required
                        >
                            <option value="">{t('modal.assignment.choose_user')}</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username} ({user.role})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500 transition-colors">
                            {isSubmitting ? t('modal.assignment.assigning') : t('modal.assignment.assign')}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            {t('modal.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssignmentModal;