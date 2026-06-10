import React, { useEffect, useState } from 'react';
import { authService, User } from '../services/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function Profile() {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const fresh = await authService.getCurrentUser();
      if (fresh) {
        setUser(fresh);
        const parts = (fresh.name || '').split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setPhone((fresh as any).phone || '');
        const rawApi = (import.meta as any).env.VITE_API_URL || '';
        const base = rawApi.replace(/\/api\/?$/, '').replace(/\/$/, '');
        setAvatarPreview(fresh.avatar ? `${base}/${fresh.avatar}` : null);
      }
    })();
  }, []);

  useEffect(() => {
    if (!avatarFile) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(avatarFile);
  }, [avatarFile]);

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are not signed in.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setAvatarFile(f);
  };

  const onSave = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('firstName', firstName || '');
      fd.append('lastName', lastName || '');
      fd.append('phone', phone || '');
      if (avatarFile) fd.append('avatar', avatarFile);

      const updated = await authService.updateProfile(fd);
      setUser(updated);
      const rawApi = (import.meta as any).env.VITE_API_URL || '';
      const base = rawApi.replace(/\/api\/?$/, '').replace(/\/$/, '');
      setAvatarPreview(updated.avatar ? `${base}/${updated.avatar}` : null);
      toast.success('Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="col-span-1 flex flex-col items-center">
              <div className="mb-4">
                <Avatar>
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user.name?.slice(0,1) || '?'}</AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="w-full text-center">
                <Label className="mb-2">Profile Image</Label>
                <input className="w-full" type="file" accept="image/*" onChange={onFileChange} />
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <div>
                <Label>First Name</Label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>

              <div>
                <Label>Email</Label>
                <div className="p-2">{user.email}</div>
              </div>

              <div>
                <Label>Role</Label>
                <div className="p-2">{user.role}</div>
              </div>

              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} />
              </div>

              <div className="pt-4">
                <Button onClick={onSave} disabled={saving} variant="default">{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
