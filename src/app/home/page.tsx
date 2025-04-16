"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [inventoryCount, setInventoryCount] = useState(0);
  const [dailySalesCount, setDailySalesCount] = useState(0);
  const [dailySalesAmount, setDailySalesAmount] = useState(0);
    const router = useRouter();

  useEffect(() => {
    // Load products from local storage on component mount
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setInventoryCount(JSON.parse(storedProducts).length);
    }

    // Load sales from local storage
      const storedPedidos = localStorage.getItem('pedidos');
      if (storedPedidos) {
        try {
          const pedidos = JSON.parse(storedPedidos);
          // Calculate daily sales count and amount
          let salesCount = 0;
          let salesAmount = 0;
          const today = new Date().toLocaleDateString();

          for (const key in pedidos) {
            if (pedidos.hasOwnProperty(key)) {
              const pedido = pedidos[key];
              // Check if pedido was made today
              const pedidoDate = new Date(parseInt(key.split('_')[1])).toLocaleDateString();
              if (pedidoDate === today) {
                salesCount++;
                if (pedido.cartItems && Array.isArray(pedido.cartItems)) {
                  salesAmount += pedido.cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
                }
              }
            }
          }

          setDailySalesCount(salesCount);
          setDailySalesAmount(salesAmount);
        } catch (error) {
          console.error("Error parsing pedidos from localStorage:", error);
        }
      }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

       <Button onClick={() => router.push('/')} variant="outline" className="mb-4">
        Logout
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{inventoryCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{dailySalesCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">${dailySalesAmount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
