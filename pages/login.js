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
import validarIniciarSesion from "../validacion/validarIniciarSesion";
import firebase from '../firebase';


const STATE_INICIAL = {
  email: "",
  password: "",
};

const Login = () => {


    const iniciarSesion = async() => {
      try {
        await firebase.iniciarSesion(email,password);
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
    } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);
    const {email, password } = valores;

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
              Iniciar Sesión
            </h1>
            <Formulario onSubmit={enviarFormulario} noValidate>
              
  
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
              <InputSubmit type="submit" value="Iniciar Sesión" />
            </Formulario>
          </>
        </Layout>
      </div>
    );
  };

export default Login;