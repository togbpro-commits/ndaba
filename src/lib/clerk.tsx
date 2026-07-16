'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClerkProvider as RealClerkProvider, 
  useAuth as useRealAuth, 
  useUser as useRealUser,
  UserButton as RealUserButton,
  useSignIn
} from '@clerk/nextjs';

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables");
  }
  return (
    <RealClerkProvider publishableKey={publishableKey}>
      {children}
    </RealClerkProvider>
  );
}

export function useAuth() {
  const { isSignedIn, userId, signOut } = useRealAuth();
  return {
    isSignedIn: !!isSignedIn,
    userId: userId || null,
    signOut: signOut
  };
}

export function useUser() {
  const { isSignedIn, user } = useRealUser();
  
  if (!user) {
    return {
      isSignedIn: false,
      user: null
    };
  }

  const email = user.primaryEmailAddress?.emailAddress || '';
  const role = (user.publicMetadata?.role as 'admin' | 'staff') || 
               (email === 'admin@ndabasattorneys.co.za' ? 'admin' : 'staff');

  return {
    isSignedIn: !!isSignedIn,
    user: {
      id: user.id,
      fullName: user.fullName || user.username || 'Clerk User',
      primaryEmailAddress: {
        emailAddress: email
      },
      publicMetadata: {
        role: role
      }
    }
  };
}

export function SignIn({ redirectUrl = '/admin' }: { redirectUrl?: string }) {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!signIn) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await signIn.password({
        identifier: email,
        password: password,
      });

      if (result.error) {
        setErrorMsg(result.error.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            const url = decorateUrl(redirectUrl);
            if (url.startsWith('http')) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      } else {
        setErrorMsg(`Sign-in status: ${signIn.status}. Additional verification required.`);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setErrorMsg(err?.message || err?.errors?.[0]?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-card border border-border/80 p-8 rounded-3xl shadow-lg relative overflow-hidden font-sans select-none">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full z-0"></div>
      
      <div className="relative z-10 space-y-6">
        <div className="space-y-1 text-center">
          <h2 className="font-serif text-2xl font-normal text-foreground">Sign In</h2>
          <p className="text-muted-foreground text-[10px] tracking-widest uppercase font-mono">AUTHORIZED PERSONNEL PORTAL</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-xl leading-relaxed text-center font-mono animate-fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
            <label className="uppercase">EMAIL ADDRESS</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ndabasattorneys.co.za" 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
            />
          </div>

          <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
            <label className="uppercase">PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
            />
          </div>

          <button 
            type="submit"
            disabled={loading || fetchStatus === 'fetching'}
            className="w-full bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In with Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function UserButton() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isSignedIn || !user) return null;

  return (
    <div className="flex items-center gap-3 bg-card border border-border py-1.5 pl-3 pr-4 rounded-full shadow-sm font-mono text-[10px] select-none text-muted-foreground">
      <div className="flex flex-col items-start leading-tight">
        <span className="text-foreground font-bold">{user.fullName}</span>
        <span className="text-[8px] uppercase tracking-wider text-primary">{user.publicMetadata?.role}</span>
      </div>
      <div className="h-4 w-[1px] bg-border"></div>
      <RealUserButton />
    </div>
  );
}
