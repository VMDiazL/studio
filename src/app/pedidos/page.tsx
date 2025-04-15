"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  codigo_producto: string;
  nombre_producto: string;
  precio: number;
  cantidad: number;
}

const getPedidos = (): { [key: string]: CartItem[] } => {
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
  const [pedidos, setPedidos] = useState<{ [key: string]: CartItem[] }>({});
  const { toast } = useToast();

  useEffect(() => {
    // Load "pedidos" from local storage on component mount
    const storedPedidos = getPedidos();
    setPedidos(storedPedidos);
  }, []);

  const handleProcessPedido = (pedidoKey: string) => {
    // Implement logic to "process" the sale here
    alert(`Pedido ${pedidoKey} processed!`);
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

      {Object.keys(pedidos).length === 0 ? (
        <p>No pedidos saved.</p>
      ) : (
        Object.entries(pedidos).map(([pedidoKey, cartItems]) => (
          <Card key={pedidoKey} className="mb-4">
            <CardHeader>
              <CardTitle>Pedido: {pedidoKey}</CardTitle>
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
                    {cartItems.map(item => (
                      <TableRow key={item.codigo_producto}>
                        <TableCell>{item.nombre_producto}</TableCell>
                        <TableCell>{item.precio}</TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell>{item.precio * item.cantidad}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-bold text-right">Total:</TableCell>
                      <TableCell className="font-bold">
                        ${cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)}
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
