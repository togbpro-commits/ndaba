'use client';

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4 select-none">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <div className="space-y-1 text-center">
        <span className="font-mono text-[9px] tracking-[0.25em] text-primary font-bold block">SECURE GATEWAY</span>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">Completing Secure Authentication...</p>
      </div>
      <AuthenticateWithRedirectCallback 
        signInForceRedirectUrl="/admin"
        signUpForceRedirectUrl="/onboard"
      />
    </div>
  );
}
