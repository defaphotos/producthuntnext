import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useRouter } from "next/router";
import DetalleProducto from "../components/pagina/DetalleProducto";
import useProductos from "../hooks/useProductos";

const Buscar = () => {
  const {
    query: { q },
  } = useRouter();
  const { productos } = useProductos("votos");
  const [resultado,guardarResultado] = useState([]);
  useEffect(()=>{
    const busqueda = q.toLowerCase();
    const filtro = productos.filter(producto => producto.nombre.toLowerCase().includes(busqueda));
    guardarResultado(filtro);
  },[q,productos]);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {resultado.map((producto) => {
                return (
                  <DetalleProducto key={producto.id} producto={producto} />
                );
              })}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Buscar;
