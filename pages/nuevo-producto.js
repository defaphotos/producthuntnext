import React, { useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import FileUploader from "react-firebase-file-uploader";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
import { css } from "@emotion/core";
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import firebase, { FirebaseContext } from "../firebase";
import Error404 from "../components/pagina/404";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  url: "",
  descripcion: "",
};

const NuevoProducto = () => {
  const [nombreImagen, guardarNombreImagen] = useState("");
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlImagen, guardarUrlImagen] = useState("");

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  };

  const handleProgress = (progreso) => {
    guardarProgreso({ progreso });
  };
  const handleUploadError = (error) => {
    guardarSubiendo(error);
    console.log(error);
  };

  const handleUploadSuccess = (nombre) => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombreImagen(nombre);
    firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then((url) => guardarUrlImagen(url));
  };

  const router = useRouter();
  const { usuario } = useContext(FirebaseContext);

  const crearProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }

    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: { id: usuario.uid, nombre: usuario.displayName },
      haVotado:[]
    };

    firebase.db.collection("productos").add(producto);
    return router.push("/");
  };

  const { valores, errores, cambiarValor, enviarFormulario } = useValidacion(
    STATE_INICIAL,
    validarCrearProducto,
    crearProducto
  );

  const { nombre, empresa, url, descripcion } = valores;

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo Producto
            </h1>

            <Formulario onSubmit={enviarFormulario} noValidate>
              <fieldset>
                <legend>Información General</legend>
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del Producto"
                    name="nombre"
                    onChange={cambiarValor}
                    value={nombre}
                  />
                </Campo>
                {errores.nombre && <Error>{errores.nombre}</Error>}
                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre Empresa"
                    name="empresa"
                    onChange={cambiarValor}
                    value={empresa}
                  />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    placeholder="URL"
                    name="url"
                    onChange={cambiarValor}
                    value={url}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>
              <fieldset>
                <legend>Sobre tu Producto</legend>
                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    placeholder="Descripción del Producto"
                    name="descripcion"
                    onChange={cambiarValor}
                    value={descripcion}
                  />
                </Campo>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>

              <InputSubmit type="submit" value="Crear Producto" />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
};

export default NuevoProducto;
