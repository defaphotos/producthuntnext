import React, { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {
  const [valores, guardarValores] = useState(stateInicial);
  const [errores, guardarErrores] = useState([]);
  const [submitForm, guardarSubmitForm] = useState(false);

  useEffect(() => {
    if (submitForm) {
      const tieneErrores = Object.keys(errores).length !== 0;

      if (!tieneErrores) {
        fn();
      }

      guardarSubmitForm(false);
    }
  }, [errores]);

  const cambiarValor = (e) => {
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
    guardarSubmitForm(true);
  };

  return {
    valores,
    errores,
    cambiarValor,
    enviarFormulario
  };
};

export default useValidacion;
