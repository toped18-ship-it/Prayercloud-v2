import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, HeartHandshake, Shield, Globe, Mail, Phone, Lock, CheckCircle } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [country, setCountry] = useState(currentUser?.country || '');
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      bio,
      phoneNumber,
      country
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl shadow-xl flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg">
          {currentUser.fullName.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{currentUser.fullName}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
              {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-blue-200 mt-1">
            {currentUser.email} · Based in {currentUser.country} · Member since {new Date(currentUser.joinedAt).getFullYear()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs text-slate-400 uppercase font-semibold">Prayers Offered</div>
          <div className="text-3xl font-bold font-mono-data text-blue-600 dark:text-blue-400 mt-1">
            {currentUser.prayersOfferedCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Spiritual agreements recorded</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs text-slate-400 uppercase font-semibold">Credential Status</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Verified Worker
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Full Missionary Hub Access</div>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Missionary profile updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Profile Details</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio / Missional Calling</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
