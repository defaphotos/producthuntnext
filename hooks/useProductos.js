import React, { useState,useEffect } from 'react';
import firebase from "../firebase";
const useProductos = (orden) => {

    const [productos,guardarProductos] = useState([]);

    useEffect(() => {
        firebase.db
          .collection("productos")
          .orderBy(orden, "desc")
          .onSnapshot(manejarSnapshot);
      }, []);
    
      function manejarSnapshot(snapshot) {
        const productos = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
    
        guardarProductos(productos);
      }


    return {
        productos
    }
};

export default useProductos;

