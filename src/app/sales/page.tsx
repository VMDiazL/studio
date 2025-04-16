"use client";

import {Button} from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";
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

const SalesPage = () => {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const {toast} = useToast();
    const [username, setUsername] = useState('');

  useEffect(() => {
        // Load username from local storage on component mount
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

    // Load products from local storage on component mount
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.codigo_producto === product.codigo_producto);
            if (existingItem) {
                return prevCart.map(item =>
                    item.codigo_producto === product.codigo_producto ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, cantidad: 1 }];
            }
        });
    };

    const removeFromCart = (codigo_producto) => {
        setCart(prevCart => prevCart.filter(item => item.codigo_producto !== codigo_producto));
    };

    const clearCart = () => {
        setCart([]);
    };

    useEffect(() => {
        // Calculate total whenever the cart changes
        const newTotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        setTotal(newTotal);
    }, [cart]);

      const processSale = async () => {
        // Generate a unique ID for the order
        const orderId = `pedido_${Date.now()}`;

        // Get username and phone number from local storage
        const username = localStorage.getItem('username') || 'Unknown User';
        const phoneNumber = localStorage.getItem('phoneNumber') || 'N/A';

        // Save the cart items to local storage under the new order ID
        const pedido = {
          username: username,
          phoneNumber: phoneNumber,
          cartItems: cart
        };
        localStorage.setItem(orderId, JSON.stringify(pedido));

        // Retrieve existing pedidos from localStorage
        let pedidos = JSON.parse(localStorage.getItem('pedidos') || '{}');

        // Add the new pedido to the pedidos object
        pedidos[orderId] = pedido;

        // Save the updated pedidos object back to localStorage
        localStorage.setItem('pedidos', JSON.stringify(pedidos));

          // Update the inventory
        cart.forEach(item => {
            const productIndex = products.findIndex(p => p.codigo_producto === item.codigo_producto);
            if (productIndex !== -1) {
                const updatedProducts = [...products];
                updatedProducts[productIndex].cantidad -= item.cantidad;
                setProducts(updatedProducts);
                localStorage.setItem('products', JSON.stringify(updatedProducts)); // Save updated products
            }
        });


        // Clear the cart
        clearCart();

        toast({
            title: "Pedido Registrado",
            description: "Tu solicitud de compra se ha registrado exitosamente, espera que Dakny procese tu pedido ...",
        });
    };


  return (
    <>
      <Button onClick={() => router.push('/home')} variant="outline" className="mb-4">
        Go to Home
      </Button>
        {username && (
           <div className="text-sm ml-4">Logged in as: {username}</div>
        )}

      <h1 className="text-2xl font-semibold mb-4">Sales</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.codigo_producto}>
                                <TableCell>{product.nombre_producto}</TableCell>
                                <TableCell>{product.precio}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => addToCart(product)}>
                                        Add to Cart
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                         {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No products in inventory.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cart</CardTitle>
          </CardHeader>
          <CardContent>
               <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cart.map(item => (
                            <TableRow key={item.codigo_producto}>
                                <TableCell>{item.nombre_producto}</TableCell>
                                <TableCell>{item.precio}</TableCell>
                                <TableCell>{item.cantidad}</TableCell>
                                <TableCell>{item.precio * item.cantidad}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.codigo_producto)}>
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                         {cart.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No products in the cart.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
            <div className="mt-4 flex justify-between">
              <span className="text-xl">Total: ${total}</span>
              <div>
                <Button className="mr-2" variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button onClick={processSale}>Process Sale</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SalesPage;
