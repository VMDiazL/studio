'use client';

import {Button} from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PedidosPage = () => {
    const router = useRouter();
    const [pedidos, setPedidos] = useState({});

    useEffect(() => {
        // Load pedidos from local storage on component mount
        const storedPedidos = localStorage.getItem('pedidos');
        if (storedPedidos) {
            try {
                setPedidos(JSON.parse(storedPedidos));
            } catch (error) {
                console.error("Error parsing pedidos from localStorage:", error);
            }
        }
    }, []);

    const generateReceiptContent = (pedidoData) => {
        if (!pedidoData || !pedidoData.cartItems) {
            return "No hay datos de carrito para generar el recibo.";
        }

        let receiptContent = `
      --------------------------------
              VentaFacil - Receipt
      --------------------------------
      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}
      Username: ${pedidoData.username}
      Phone Number: ${pedidoData.phoneNumber}
      --------------------------------
      Products:
      `;

        pedidoData.cartItems.forEach(item => {
            receiptContent += `
        ${item.nombre_producto}
        Price: ${item.precio} x Qty: ${item.cantidad} = ${item.precio * item.cantidad}
        `;
        });

        receiptContent += `
      --------------------------------
      Total: ${pedidoData.cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)}
      --------------------------------
    `;

        return receiptContent;
    };


    const handleProcessPedido = (pedidoId) => {
        // Get the pedido data from local storage
        const pedidoData = JSON.parse(localStorage.getItem(pedidoId));

        // Generate the receipt content
        const receiptContent = generateReceiptContent(pedidoData);

        // Open a new window with the receipt content
        const receiptWindow = window.open('', '_blank');
        receiptWindow.document.open();
        receiptWindow.document.write(`<pre>${receiptContent}</pre>`);
        receiptWindow.document.close();

        // Eliminar el pedido del localStorage
        let pedidos = JSON.parse(localStorage.getItem('pedidos') || '{}');
        delete pedidos[pedidoId];
        localStorage.setItem('pedidos', JSON.stringify(pedidos));

        // Eliminar el pedido individual del localStorage
        localStorage.removeItem(pedidoId);

        // Actualizar el estado local
        setPedidos(pedidos);
    };

    const getPedidoDetails = (pedidoId) => {
        try {
            const pedidoData = JSON.parse(localStorage.getItem(pedidoId));

            if (!pedidoData || !pedidoData.cartItems) {
                return <p>No hay datos de carrito para mostrar.</p>;
            }

            return (
                <ScrollArea className="h-[200px] w-full rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedidoData.cartItems.map(item => (
                                <TableRow key={item.codigo_producto}>
                                    <TableCell>{item.nombre_producto}</TableCell>
                                    <TableCell>{item.precio}</TableCell>
                                    <TableCell>{item.cantidad}</TableCell>
                                    <TableCell>{item.precio * item.cantidad}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            );
        } catch (error) {
            console.error("Error parsing or rendering pedido details:", error);
            return <p>Error al mostrar los detalles del pedido.</p>;
        }
    };


    return (
        <div className="container mx-auto p-4">
            <Button onClick={() => router.push('/home')} variant="outline" className="mb-4">
                Go to Home
            </Button>

            <h1 className="text-2xl font-semibold mb-4">Pedidos</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] w-full rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pedido ID</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Detalles del Pedido</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(pedidos).map(([pedidoId, pedidoData]) => (
                                    <TableRow key={pedidoId}>
                                        <TableCell>{pedidoId}</TableCell>
                                        <TableCell>{pedidoData.username}</TableCell>
                                        <TableCell>{pedidoData.phoneNumber}</TableCell>
                                        <TableCell>{getPedidoDetails(pedidoId)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button onClick={() => handleProcessPedido(pedidoId)}>
                                                Process Pedido
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {Object.keys(pedidos).length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No hay pedidos pendientes.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default PedidosPage;
