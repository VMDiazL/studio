"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RootLayout from './layout';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if username exists in local storage on component mount
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      if (storedUsername === 'Dakny') {
        router.push('/inventory');
      } else {
        router.push('/sales');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username === 'Dakny' && password === 'Mosqueda2008') {
      localStorage.setItem('username', username);
      setIsLoggedIn(true);
      router.push('/inventory');
    } else if (username && phoneNumber) {
      // Basic validation for name and phone number
      if (phoneNumber.length >= 8) {
        localStorage.setItem('username', username);
        setIsLoggedIn(true);
        router.push('/sales'); // Redirect other users to the sales page
      } else {
        setError('Invalid phone number');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <>
        <div className="flex items-center justify-center h-screen bg-secondary">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-2xl text-center">VentaFacil Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <p className="text-red-500">{error}</p>}
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {username === 'Dakny' ? (
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                ) : (
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                )}
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/80">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
    </>
  );
}
