"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

interface CartItem {
  codigo_producto: string;
  nombre_producto: string;
  precio: number;
  cantidad: number;
}

interface PedidoData {
  cartItems: CartItem[];
  username: string;
  phoneNumber?: string;
}

const getPedidos = (): { [key: string]: PedidoData } => {
  try {
    const pedidosString = localStorage.getItem('pedidos');
    return pedidosString ? JSON.parse(pedidosString) : {};
  } catch (error) {
    console.error("Error retrieving pedidos from localStorage:", error);
    return {};
  }
};

const deletePedido = (pedidoKey: string) => {
  try {
    const existingPedidos = getPedidos();
    const { [pedidoKey]: pedidoToDelete, ...updatedPedidos } = existingPedidos;
    localStorage.setItem('pedidos', JSON.stringify(updatedPedidos));
    return true;
  } catch (error) {
    console.error("Error deleting pedido from localStorage:", error);
    return false;
  }
};

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState<{ [key: string]: PedidoData }>({});
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Load "pedidos" from local storage on component mount
    const storedPedidos = getPedidos();
    setPedidos(storedPedidos);
  }, []);

  const generateReceiptContent = (pedidoKey: string, pedidoData: PedidoData) => {
    const { cartItems, username, phoneNumber } = pedidoData;
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    let receiptContent = `
      <html>
      <head>
        <title>Receipt - ${pedidoKey}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          .receipt {
            width: 250px;
            padding: 10px;
            border: 1px solid #ccc;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
          }
          .details {
            margin-bottom: 10px;
          }
          .items {
            width: 100%;
            border-collapse: collapse;
          }
          .items th, .items td {
            border-bottom: 1px solid #eee;
            padding: 5px;
            text-align: left;
          }
          .total {
            text-align: right;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>VentaFacil</h2>
            <p>Receipt: ${pedidoKey}</p>
            <p>Date: ${formattedDate} ${formattedTime}</p>
          </div>
          <div class="details">
            <p>Customer: ${username}</p>
            ${phoneNumber ? `<p>Phone: ${phoneNumber}</p>` : ''}
            <p>Thank you for your purchase!</p>
          </div>
          <table class="items">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
    `;

    if (cartItems && Array.isArray(cartItems)) {
        cartItems.forEach(item => {
          receiptContent += `
              <tr>
                <td>${item.nombre_producto}</td>
                <td>${item.cantidad}</td>
                <td>${item.precio * item.cantidad}</td>
              </tr>
        `;
        });
    }

    const total = cartItems ? cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0) : 0;

    receiptContent += `
            </tbody>
          </table>
          <div class="total">
            Total: $${total}
          </div>
        </div>
      </body>
      </html>
    `;

    return receiptContent;
  };

  const handleProcessPedido = (pedidoKey: string) => {
    const pedidoData = pedidos[pedidoKey];
    if (!pedidoData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Pedido ${pedidoKey} not found.`,
      });
      return;
    }

    // Generate receipt content
    const receiptContent = generateReceiptContent(pedidoKey, pedidoData);

    // Open a new window with the receipt content
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.open();
      receiptWindow.document.write(receiptContent);
      receiptWindow.document.close();
      receiptWindow.print(); // Automatically trigger print
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open print window. Please check your browser settings.",
      });
      return;
    }

    // Update inventory
    if (pedidoData.cartItems && Array.isArray(pedidoData.cartItems)) {
      pedidoData.cartItems.forEach(cartItem => {
        // Load existing products from local storage
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          const products = JSON.parse(storedProducts) as Product[];

          // Find the product in the inventory
          const productIndex = products.findIndex(p => p.codigo_producto === cartItem.codigo_producto);

          if (productIndex !== -1) {
            // Update the quantity in the inventory
            products[productIndex].cantidad -= cartItem.cantidad;

            // Record movement
            const username = localStorage.getItem('username');
            recordMovement(cartItem.codigo_producto, cartItem.nombre_producto, cartItem.cantidad, 'Salida', username);

            // Save the updated products back to local storage
            localStorage.setItem('products', JSON.stringify(products));
          }
        }
      });
    }

    toast({
      title: "Pedido processed!",
      description: `Pedido ${pedidoKey} processed!`,
    });
    handleDeletePedido(pedidoKey);
  };


  const handleDeletePedido = (pedidoKey: string) => {
    // Delete the pedido from local storage
    const deleted = deletePedido(pedidoKey);
    if (deleted) {
      // Update the state to remove the deleted pedido
      const updatedPedidos = { ...pedidos };
      delete updatedPedidos[pedidoKey];
      setPedidos(updatedPedidos);
      toast({
        title: "Pedido deleted!",
        description: `Pedido ${pedidoKey} deleted!`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete pedido ${pedidoKey}.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Pedidos (Shopping Carts)</h1>

       <Button onClick={() => router.push('/')} variant="outline" className="mb-4">
        Go to Home
      </Button>

      {Object.keys(pedidos).length === 0 ? (
        <p>No pedidos saved.</p>
      ) : (
        Object.entries(pedidos).map(([pedidoKey, pedidoData]) => (
          <Card key={pedidoKey} className="mb-4">
            <CardHeader>
              <CardTitle>Pedido: {pedidoKey}</CardTitle>
              <CardTitle>Customer: {pedidoData.username} {pedidoData.phoneNumber ? `(${pedidoData.phoneNumber})` : ''}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidoData.cartItems && Array.isArray(pedidoData.cartItems) ? (
                      pedidoData.cartItems.map(item => (
                        <TableRow key={item.codigo_producto}>
                          <TableCell>{item.nombre_producto}</TableCell>
                          <TableCell>{item.precio}</TableCell>
                          <TableCell>{item.cantidad}</TableCell>
                          <TableCell>{item.precio * item.cantidad}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>No items in this pedido.</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={3} className="font-bold text-right">Total:</TableCell>
                      <TableCell className="font-bold">
                        ${pedidoData.cartItems ? pedidoData.cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0) : 0}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="flex justify-end mt-4">
                <Button onClick={() => handleProcessPedido(pedidoKey)} className="mr-2">
                  Process Sale
                </Button>
                <Button variant="outline" onClick={() => handleDeletePedido(pedidoKey)}>
                  Delete Pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PedidosPage;
