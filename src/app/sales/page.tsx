"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import RootLayout from '../layout';


interface Product {
  codigo_producto: string;
  nombre_producto: string;
  precio: number;
  cantidad: number;
}

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

// Helper functions to manage "pedidos" (shopping carts) in local storage
const getPedidos = (): { [key: string]: PedidoData } => {
  try {
    const pedidosString = localStorage.getItem('pedidos');
    return pedidosString ? JSON.parse(pedidosString) : {};
  } catch (error) {
    console.error("Error retrieving pedidos from localStorage:", error);
    return {};
  }
};

const addPedido = (pedidoKey: string, pedidoData: PedidoData) => {
  try {
    const existingPedidos = getPedidos();
    const updatedPedidos = { ...existingPedidos, [pedidoKey]: pedidoData };
    localStorage.setItem('pedidos', JSON.stringify(updatedPedidos));
  } catch (error) {
    console.error("Error adding pedido to localStorage:", error);
  }
};

const SalesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const { toast } = useToast();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');


   useEffect(() => {
    // Load username from local storage on component mount
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
        router.push('/');
    }
  }, []);

    useEffect(() => {
    // Load phoneNumber from local storage on component mount
    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, []);

  useEffect(() => {
    // Load products from local storage on component mount
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  useEffect(() => {
    // Calculate the total whenever the cart changes
    const newTotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    setTotal(newTotal);
  }, [cart]);

    const recordMovement = (codigo_producto: string, nombre_producto: string, cantidad: number, tipo: 'Entrada' | 'Salida', usuario: string | null) => {
    const timestamp = new Date().toLocaleString();
    const newMovement = {
      timestamp,
      codigo_producto,
      nombre_producto,
      cantidad,
      tipo,
      usuario,
    };

    // Load existing movements from local storage
    const storedMovements = localStorage.getItem('movements');
    const existingMovements = storedMovements ? JSON.parse(storedMovements) : [];

    // Add the new movement to the existing movements
    const updatedMovements = [...existingMovements, newMovement];

    // Save the updated movements back to local storage
    localStorage.setItem('movements', JSON.stringify(updatedMovements));
  };

  const addProductToCart = () => {
    if (selectedProductId && quantity > 0) {
      const productToAdd = products.find(p => p.codigo_producto === selectedProductId);
      if (productToAdd) {
        const existingCartItemIndex = cart.findIndex(item => item.codigo_producto === selectedProductId);

        if (existingCartItemIndex !== -1) {
          // If the product is already in the cart, update the quantity
          const updatedCart = [...cart];
          updatedCart[existingCartItemIndex].cantidad += quantity;
          setCart(updatedCart);
        } else {
          // If the product is not in the cart, add it
          const newCartItem: CartItem = {
            codigo_producto: productToAdd.codigo_producto,
            nombre_producto: productToAdd.nombre_producto,
            precio: productToAdd.precio,
            cantidad: quantity,
          };
          setCart([...cart, newCartItem]);
        }

        // Reset selected product and quantity
        setSelectedProductId('');
        setQuantity(1);
          toast({
            title: "Product added to cart!",
            description: "The product has been added to the shopping cart.",
          });
      }
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please select a product and enter a quantity.",
          });
    }
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = cart.map(item => {
      if (item.codigo_producto === productId) {
        return { ...item, cantidad: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const removeProductFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.codigo_producto !== productId);
    setCart(updatedCart);
     toast({
            title: "Product removed from cart!",
            description: "The product has been removed from the shopping cart.",
          });
  };

  const processSale = () => {
    // Generate a unique key for the "pedido"
    const pedidoKey = `pedido_${new Date().getTime()}`;

    const pedidoData: PedidoData = {
      cartItems: cart,
      username: username,
      phoneNumber: phoneNumber,
    };

    // Save the current cart to local storage under the new key
    addPedido(pedidoKey, pedidoData);

    toast({
      title: "Tu solicitud de compra, se ha registrado exitosamente",
      description: "Espera que Dakny procese tu pedido ...",
    });

    setCart([]);
  };

  const printReceipt = () => {
    // Implement receipt printing logic here
    alert('Receipt printed!');
  };

  return (
    
      
      <div className="container mx-auto p-4">

       <Button onClick={() => router.push('/')} variant="outline" className="mb-4">
        Go to Home
      </Button>

        <h1 className="text-2xl font-semibold mb-4">Sales Processing</h1>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Add Product to Cart</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Select value={selectedProductId} onValueChange={(value) => setSelectedProductId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.codigo_producto} value={product.codigo_producto}>{product.nombre_producto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Quantity"
              value={String(quantity)}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button onClick={addProductToCart}>Add to Cart</Button>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Shopping Cart</CardTitle>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map(item => (
                    <TableRow key={item.codigo_producto}>
                      <TableCell>{item.nombre_producto}</TableCell>
                      <TableCell>{item.precio}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={String(item.cantidad)}
                          onChange={(e) => updateCartItemQuantity(item.codigo_producto, Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>{item.precio * item.cantidad}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => removeProductFromCart(item.codigo_producto)}>
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
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Total: ${total}</h2>
          <div>
            <Button onClick={processSale} className="mr-2">Process Sale</Button>
            <Button variant="secondary" onClick={printReceipt}>Print Receipt</Button>
          </div>
        </div>
      </div>
      
    
  );
};

export default SalesPage;
