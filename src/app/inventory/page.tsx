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

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
    const router = useRouter();
  const [newProduct, setNewProduct] = useState({
    codigo_producto: '',
    nombre_producto: '',
    precio: 0,
    cantidad: 0,
  });

    const {toast} = useToast()

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevProduct => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const addProduct = () => {
    if (newProduct.nombre_producto && newProduct.precio > 0 && newProduct.cantidad > 0) {
      const codigo_producto = uuidv4();
      setProducts(prevProducts => [...prevProducts, { ...newProduct, codigo_producto }]);
      setNewProduct({
        codigo_producto: '',
        nombre_producto: '',
        precio: 0,
        cantidad: 0,
      });
            toast({
                title: "Producto Agregado",
                description: "El producto se agregó correctamente al inventario.",
            })
    }
  };

  const deleteProduct = (codigo_producto) => {
    setProducts(prevProducts => prevProducts.filter(product => product.codigo_producto !== codigo_producto));
        toast({
            title: "Producto Eliminado",
            description: "El producto se eliminó correctamente del inventario.",
        })
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => router.push('/home')} variant="outline" className="mb-4">
        Go to Home
      </Button>

      <h1 className="text-2xl font-semibold mb-4">Inventory Management</h1>

      <div className="mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nombre_producto">Product Name</Label>
                <Input
                  type="text"
                  id="nombre_producto"
                  name="nombre_producto"
                  value={newProduct.nombre_producto}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                />
              </div>
              <div>
                <Label htmlFor="precio">Price</Label>
                <Input
                  type="number"
                  id="precio"
                  name="precio"
                  value={newProduct.precio}
                  onChange={handleInputChange}
                  placeholder="Price"
                />
              </div>
              <div>
                <Label htmlFor="cantidad">Quantity</Label>
                <Input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={newProduct.cantidad}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                />
              </div>
              <Button onClick={addProduct} className="bg-primary text-primary-foreground hover:bg-primary/80">
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
        <Card>
            <CardHeader>
                <CardTitle>
                    Product List
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Código</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.codigo_producto}>
                                    <TableCell className="font-medium">{product.codigo_producto}</TableCell>
                                    <TableCell>{product.nombre_producto}</TableCell>
                                    <TableCell>{product.precio}</TableCell>
                                    <TableCell>{product.cantidad}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.codigo_producto)}>
                                            Eliminar
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
