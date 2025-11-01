import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Building2, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [step, setStep] = useState<'login' | '2fa'>('login');

  const handleLogin = () => {
    setStep('2fa');
  };

  const handle2FA = () => {
    onLogin();
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

          {step === 'login' ? (
            <Card className="shadow-xl border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                <p className="text-slate-500 text-center text-sm">Sign in to your account to continue</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.lk"
                      className="pl-10"
                      defaultValue="ravindu@company.lk"
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
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Button variant="link" className="text-[#1A2B4A] p-0">
                    Forgot Password?
                  </Button>
                </div>

                <Button 
                  className="w-full bg-[#1A2B4A] hover:bg-[#0F1729] btn-hover"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHub
                  </Button>
                </div>

                <p className="text-center text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Button variant="link" className="text-[#1A2B4A] p-0">
                    Sign up
                  </Button>
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Two-Factor Authentication</CardTitle>
                <p className="text-slate-500 text-center text-sm">Enter the 6-digit code from your authenticator app</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl"
                    />
                  ))}
                </div>

                <Button 
                  className="w-full bg-[#1A2B4A] hover:bg-[#0F1729] btn-hover"
                  onClick={handle2FA}
                >
                  Verify & Continue
                </Button>

                <Button variant="link" className="w-full text-[#1A2B4A]" onClick={() => setStep('login')}>
                  Back to Login
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Didn't receive a code?{' '}
                  <Button variant="link" className="text-[#1A2B4A] p-0">
                    Resend
                  </Button>
                </p>
              </CardContent>
            </Card>
          )}

          <p className="text-center text-xs text-slate-500 mt-8">
            © 2024 BizManage. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
