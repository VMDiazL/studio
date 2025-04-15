"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useRouter } from 'next/navigation';

interface Movement {
  timestamp: string;
  codigo_producto: string;
  nombre_producto: string;
  cantidad: number;
  tipo: 'Entrada' | 'Salida';
  usuario: string | null;
}

const MovimientosPage = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
    const router = useRouter();

  useEffect(() => {
    // Load movements from local storage on component mount
    const storedMovements = localStorage.getItem('movements');
    if (storedMovements) {
      setMovements(JSON.parse(storedMovements));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Inventory Movements</h1>

       <Button onClick={() => router.push('/')} variant="outline" className="mb-4">
        Go to Home
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Movement Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement, index) => (
                  <TableRow key={index}>
                    <TableCell>{movement.timestamp}</TableCell>
                    <TableCell>{movement.codigo_producto}</TableCell>
                    <TableCell>{movement.nombre_producto}</TableCell>
                    <TableCell>{movement.cantidad}</TableCell>
                    <TableCell>{movement.tipo}</TableCell>
                    <TableCell>{movement.usuario}</TableCell>
                  </TableRow>
                ))}
                {movements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No movements recorded.
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

export default MovimientosPage;
