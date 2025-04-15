"use client";

import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from '@/components/ui/menubar';
import {Home, Plus, Settings, ShoppingCart, PackagePlus} from "lucide-react";
import { Icons } from '@/components/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


interface RootLayoutProps {
  children: React.ReactNode;
  username?: string;
}

export default function RootLayout({
  children,
  username,
}: RootLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);


  useEffect(() => {
    // Check if username exists in local storage on component mount
    const storedUsername = localStorage.getItem('username');
    setIsLoggedIn(!!storedUsername);
    setCurrentUsername(storedUsername);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setCurrentUsername(null);
    router.push('/');
  };


  return (
    
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isLoggedIn && (
          <header className="bg-secondary p-4">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <a href="/">Dashboard</a>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <a href="/inventory">Inventory</a>
                  </MenubarItem>
                  <MenubarItem>
                    <a href="/sales">Sales</a>
                  </MenubarItem>
                  <MenubarItem>
                    <a href="/pedidos">Pedidos</a>
                  </MenubarItem>
                  <MenubarItem>
                    <a href="/compras">Compras</a>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Profile</MenubarItem>
                  <MenubarItem>Preferences</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            {currentUsername && (
              <div className="flex items-center justify-between">
                <div className="text-sm ml-4">Logged in as: {currentUsername}</div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </header>
        )}
        {children}
      </body>
    
  );
}

