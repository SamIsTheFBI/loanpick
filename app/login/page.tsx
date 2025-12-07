"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Vault } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await authClient.signUp.email({
          email,
          password,
          name,
        });
      } else {
        result = await authClient.signIn.email({
          email,
          password,
        });
      }

      if (result.error) {
        toast.error(result.error.message || "Authentication failed");
        return;
      }

      toast.success(isSignUp ? "Account created successfully!" : "Signed in successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result?.error) {
        toast.error(result.error.message || "Google sign-in failed");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Link href="/" className="p-4 flex items-center mx-auto w-min">
          <h1 className="flex gap-2 items-center text-xl font-bold">
            <Vault />
            LoanPick
          </h1>
        </Link>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Sign up to get started" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              Continue with Google
            </Button>

            <Button
              variant="link"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
