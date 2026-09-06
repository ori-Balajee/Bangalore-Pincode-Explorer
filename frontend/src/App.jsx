import { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, AlertCircle, Building2 } from 'lucide-react';

export default function App() {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setData(null);

    if (!pincode) {
      setError('Please enter a pincode.');
      return;
    }

    if (pincode.length !== 6 || !pincode.startsWith('560')) {
      setError('Please enter a valid 6-digit Bangalore pincode (starts with 560).');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/pincode/${pincode}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pincode details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Bangalore Pincode Explorer</h1>
            <p className="text-xs text-slate-500">Lookup areas by 6-digit PIN code</p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 560038"
              className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-slate-700 font-medium placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:bg-slate-300"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 text-center text-slate-500 animate-pulse text-sm">
            Searching Bangalore localities...
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-6 flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results List */}
        {data && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>FOUND {data.areas.length} LOCALITIES</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium">
                {data.source}
              </span>
            </div>

            <ul className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
              {data.areas.map((area, index) => (
                <li key={index} className="flex items-center gap-3 p-3 text-slate-700 hover:bg-slate-50 text-sm transition-colors">
                  <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}