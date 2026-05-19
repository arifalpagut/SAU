import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">HR</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ERP HR Sistemi</h1>
          <p className="text-gray-500 mt-1">Hesabınıza giriş yapın</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="E-posta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@erp.local" required />
          <Input label="Parola" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
          <Button type="submit" loading={loading} className="w-full">Giriş Yap</Button>
        </form>
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p className="font-medium mb-1">Test Kullanıcıları:</p>
          <p>admin@erp.local / Admin123!</p>
          <p>hr@erp.local / Hr123456!</p>
          <p>employee@erp.local / Employee123!</p>
        </div>
      </div>
    </div>
  );
}
