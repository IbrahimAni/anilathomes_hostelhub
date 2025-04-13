"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '@/config/firebase';
import { UserService } from '@/services/user.service';
import { UserProfile } from '@/types/user';

export default function BusinessSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Remove the unused variable completely
  const [, setUserProfile] = useState<UserProfile | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Business-specific settings
  const [defaultCommissionRate, setDefaultCommissionRate] = useState(10);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [enableSmsNotifications, setEnableSmsNotifications] = useState(false);
  const [autoApproveBookings, setAutoApproveBookings] = useState(false);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState('NGN');
  const [taxRate, setTaxRate] = useState(7.5);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const profile = await UserService.getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
            // Set business settings from profile if they exist
            setDefaultCommissionRate(profile.defaultCommissionRate ?? 10);
            setEnableEmailNotifications(profile.enableEmailNotifications !== false);
            setEnableSmsNotifications(profile.enableSmsNotifications ?? false);
            setAutoApproveBookings(profile.autoApproveBookings ?? false);
            setPaymentReminders(profile.paymentReminders !== false);
            setDefaultCurrency(profile.defaultCurrency ?? 'NGN');
            setTaxRate(profile.taxRate ?? 7.5);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to load settings data');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const user = auth.currentUser;
      if (user) {
        await UserService.updateUserProfile(user.uid, {
          defaultCommissionRate,
          enableEmailNotifications,
          enableSmsNotifications,
          autoApproveBookings,
          paymentReminders,
          defaultCurrency,
          taxRate
        });
        
        setSuccessMessage('Business settings saved successfully');
      }
    } catch (error) {
      console.error('Error updating business settings:', error);
      setErrorMessage('Failed to save business settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]" data-testid="loading-spinner">
        <div className="w-8 h-8 border-t-2 border-indigo-600 rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" data-testid="business-settings-page">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Business Preferences</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure your business operation settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6" data-testid="settings-form">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert" data-testid="success-message">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert" data-testid="error-message">
              {errorMessage}
            </div>
          )}
          
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Commission Settings</h3>
            <div>
              <label htmlFor="defaultCommissionRate" className="block text-sm font-medium text-gray-700 mb-1">
                Default Agent Commission Rate (%)
              </label>
              <input
                type="number"
                id="defaultCommissionRate"
                min="0"
                max="100"
                step="0.5"
                value={defaultCommissionRate}
                onChange={(e) => setDefaultCommissionRate(Number(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                data-testid="commission-rate-input"
              />
              <p className="mt-1 text-xs text-gray-500">
                Default percentage agents will earn from successful bookings
              </p>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Financial Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Currency
                </label>
                <select
                  id="defaultCurrency"
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="currency-select"
                >
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  data-testid="tax-rate-input"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Applied to invoices (use 0 for tax exempt)
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Booking Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="autoApproveBookings"
                    type="checkbox"
                    checked={autoApproveBookings}
                    onChange={(e) => setAutoApproveBookings(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    data-testid="auto-approve-checkbox"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="autoApproveBookings" className="font-medium text-gray-700">Auto-approve bookings</label>
                  <p className="text-gray-500">Automatically approve booking requests without your manual review</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableEmailNotifications"
                    type="checkbox"
                    checked={enableEmailNotifications}
                    onChange={(e) => setEnableEmailNotifications(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    data-testid="email-notifications-checkbox"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableEmailNotifications" className="font-medium text-gray-700">Email notifications</label>
                  <p className="text-gray-500">Receive email alerts for new bookings, payments, and other important events</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableSmsNotifications"
                    type="checkbox"
                    checked={enableSmsNotifications}
                    onChange={(e) => setEnableSmsNotifications(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    data-testid="sms-notifications-checkbox"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableSmsNotifications" className="font-medium text-gray-700">SMS notifications</label>
                  <p className="text-gray-500">Receive SMS alerts for high-priority events (may incur additional charges)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="paymentReminders"
                    type="checkbox"
                    checked={paymentReminders}
                    onChange={(e) => setPaymentReminders(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    data-testid="payment-reminders-checkbox"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="paymentReminders" className="font-medium text-gray-700">Payment reminders</label>
                  <p className="text-gray-500">Send automated reminders to students about upcoming rent payments</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              data-testid="save-button"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}