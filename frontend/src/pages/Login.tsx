import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Building2, Lock, Mail } from 'lucide-react';
import { authService } from '../services/auth';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@bizmanage.lk');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      await authService.login({ email, password });
      toast.success('Login successful!');
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex luxury-gradient p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4E5B0] rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-[#1A2B4A]" />
            </div>
            <div>
              <h2 className="text-xl">BizManage</h2>
              <p className="text-sm text-white/80">Pro Edition</p>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl mb-4">
              Premium Business Management for Modern Companies
            </h1>
            <p className="text-white/90 text-lg">
              Streamline your invoicing, manage VAT compliance, and grow your business with our luxury management platform.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <h3 className="text-lg mb-1">Automated VAT Compliance</h3>
              <p className="text-white/80 text-sm">Stay compliant with Sri Lankan VAT regulations effortlessly</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <h3 className="text-lg mb-1">Professional Invoicing</h3>
              <p className="text-white/80 text-sm">Create, send, and track invoices with ease</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <h3 className="text-lg mb-1">Real-time Analytics</h3>
              <p className="text-white/80 text-sm">Get insights into your business performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4E5B0] rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-[#1A2B4A]" />
            </div>
            <div>
              <h2 className="text-xl text-[#1A2B4A]">BizManage</h2>
              <p className="text-sm text-slate-600">Pro Edition</p>
            </div>
          </div>

          <Card className="shadow-xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <p className="text-slate-500 text-center text-sm">Sign in to your account to continue</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.lk"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Button variant="link" className="text-[#1A2B4A] p-0" type="button">
                    Forgot Password?
                  </Button>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#1A2B4A] hover:bg-[#0F1729] btn-hover"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Test Credentials</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <p><strong>Admin:</strong> admin@bizmanage.lk / Admin@123</p>
                  <p><strong>Accountant:</strong> accountant@bizmanage.lk / Accountant@123</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-slate-500 mt-8">
            © 2024 BizManage. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
