import React, { useState } from "react";
import Router from 'next/router';
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
import { css } from "@emotion/core";
import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";
import firebase from '../firebase';


const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: "",
};

const CrearCuenta = () => {

  const crearCuenta = async() => {
    try {
      await firebase.registrar(nombre,email,password);
      Router.push("/");
    } catch (error) {
     guardarError(error.message);
    }
  };

  const {
    valores,
    errores,
    cambiarValor,
    enviarFormulario,
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);
  
  const { nombre, email, password } = valores;
  const [error, guardarError] = useState('');

  

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Crear cuenta
          </h1>
          <Formulario onSubmit={enviarFormulario} noValidate>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu Nombre"
                name="nombre"
                onChange={cambiarValor}
                value={nombre}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}

            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Tu Email"
                name="email"
                onChange={cambiarValor}
                value={email}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}

            <Campo>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu Password"
                name="password"
                onChange={cambiarValor}
                value={password}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error!=='' && <Error>{error}</Error> }
            <InputSubmit type="submit" value="Crear Cuenta" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default CrearCuenta;
