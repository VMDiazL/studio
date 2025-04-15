"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Product {
  codigo_producto: string;
  nombre_producto: string;
  precio: number;
  cantidad: number;
}

const InventoryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [codigo_producto, setCodigoProducto] = useState('');
  const [nombre_producto, setNombreProducto] = useState('');
  const [precio, setPrecio] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load products from local storage on component mount
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  useEffect(() => {
    // Save products to local storage whenever the products state changes
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = () => {
    if (codigo_producto && nombre_producto && precio > 0 && cantidad > 0) {
      const newProduct: Product = {
        codigo_producto,
        nombre_producto,
        precio,
        cantidad,
      };
      setProducts([...products, newProduct]);
      setCodigoProducto('');
      setNombreProducto('');
      setPrecio(0);
      setCantidad(0);
      toast({
        title: "Product added!",
        description: "The product has been added to the inventory.",
      });
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
    }
  };

  const deleteProduct = (codigo_producto: string) => {
    setProducts(products.filter((product) => product.codigo_producto !== codigo_producto));
     toast({
        title: "Product deleted!",
        description: "The product has been deleted from the inventory.",
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Inventory Management</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
            <Input
                type="text"
                placeholder="Product Code"
                value={codigo_producto}
                onChange={(e) => setCodigoProducto(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Product Name"
                value={nombre_producto}
                onChange={(e) => setNombreProducto(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Price"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
              <Button onClick={addProduct}>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.codigo_producto}>
                    <TableCell className="font-medium">{product.codigo_producto}</TableCell>
                    <TableCell className="font-medium">{product.nombre_producto}</TableCell>
                    <TableCell>{product.precio}</TableCell>
                    <TableCell>{product.cantidad}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => deleteProduct(product.codigo_producto)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No products in inventory.
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

export default InventoryPage;
