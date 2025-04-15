"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const SalesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Mock product data - replace with actual data fetching
  useEffect(() => {
    // This is dummy data. In a real app, you would fetch this from a database.
    const mockProducts: Product[] = [
      { id: '1', name: 'Product A', price: 20, quantity: 10 },
      { id: '2', name: 'Product B', price: 30, quantity: 5 },
      { id: '3', name: 'Product C', price: 15, quantity: 12 },
    ];
    setProducts(mockProducts);
  }, []);

  useEffect(() => {
    // Calculate the total whenever the cart changes
    const newTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  const addProductToCart = () => {
    if (selectedProductId && quantity > 0) {
      const productToAdd = products.find(p => p.id === selectedProductId);
      if (productToAdd) {
        const existingCartItemIndex = cart.findIndex(item => item.productId === selectedProductId);

        if (existingCartItemIndex !== -1) {
          // If the product is already in the cart, update the quantity
          const updatedCart = [...cart];
          updatedCart[existingCartItemIndex].quantity += quantity;
          setCart(updatedCart);
        } else {
          // If the product is not in the cart, add it
          const newCartItem: CartItem = {
            productId: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            quantity: quantity,
          };
          setCart([...cart, newCartItem]);
        }

        // Reset selected product and quantity
        setSelectedProductId('');
        setQuantity(1);
      }
    }
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = cart.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const removeProductFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
  };

  const processSale = () => {
    // Implement sale processing logic here.
    // This might involve updating inventory, recording the sale, etc.
    alert('Sale processed!');
    setCart([]); // Clear the cart after processing the sale
  };

  const printReceipt = () => {
    // Implement receipt printing logic here
    alert('Receipt printed!');
  };

  return (
    <div className="container mx-auto p-4">
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
                <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
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
                  <TableRow key={item.productId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={String(item.quantity)}
                        onChange={(e) => updateCartItemQuantity(item.productId, Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>{item.price * item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => removeProductFromCart(item.productId)}>
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
