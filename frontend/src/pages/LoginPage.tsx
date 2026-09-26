import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Lock, Mail, Building, Briefcase, Key, CheckCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('demo@h2safe.io');
  const [password, setPassword] = useState('demo123');
  const [fullName, setFullName] = useState('Alex Mercer');
  const [workerId, setWorkerId] = useState('WRK-108');
  const [organization, setOrganization] = useState('Industrial Safety Corp');
  const [department, setDepartment] = useState('Chemical Operations & Refining');
  const [workplace, setWorkplace] = useState('Refinery Plant Unit 4');
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Save state to localStorage for demo persistence
    localStorage.setItem('h2safe_user', JSON.stringify({
      email,
      full_name: fullName,
      worker_id: workerId,
      organization,
      department,
      workplace
    }));

    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const fillDemoData = () => {
    setEmail('alex.mercer@refinery.io');
    setPassword('demo123');
    setFullName('Alex Mercer');
    setWorkerId('WRK-108');
    setOrganization('PetroChem Industrial Ltd');
    setDepartment('Hazardous Gas Division');
    setWorkplace('Sulfur Recovery Unit 2');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 text-center space-y-3 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 mx-auto flex items-center justify-center text-white shadow-lg">
            <ShieldAlert size={30} className="text-emerald-300" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {isSignup ? 'Create Safety Account' : 'Worker Safety Portal'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignup ? 'Register your wristband & exposure profile' : 'Sign in to access H₂S exposure history & scanner'}
          </p>
        </div>

        {/* Demo Preset Callout */}
        <div className="bg-brand-50 border-b border-brand-100 p-3 px-6 flex items-center justify-between text-xs">
          <span className="text-brand-800 font-semibold flex items-center gap-1.5">
            <CheckCircle size={15} className="text-brand-600" />
            Evaluation Mode Active
          </span>
          <button
            type="button"
            onClick={fillDemoData}
            className="text-brand-700 hover:text-brand-900 font-extrabold underline transition"
          >
            Auto-fill Demo Worker
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    placeholder="Alex Mercer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Worker ID</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={workerId}
                      onChange={(e) => setWorkerId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                      placeholder="WRK-108"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Organization</label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                      placeholder="PetroChem Inc"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department & Workplace</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    placeholder="Chemical Refining Unit 4"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder="alex.mercer@refinery.io"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing Authentication...' : isSignup ? 'Create Account & Access Dashboard' : 'Sign In to Dashboard'}
          </button>

          <div className="pt-2 text-center text-xs">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-brand-600 font-bold hover:underline"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Create Signup Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
