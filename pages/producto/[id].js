import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "../../firebase";
import Error404 from "../../components/pagina/404";
import Layout from "../../components/layout/Layout";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Spinner from "../../components/ui/Spinner";
import Boton from "../../components/ui/Boton";
import { FirebaseContext } from "../../firebase";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarConsultarDB] = useState(true);
  const {
    query: { id },
  } = useRouter();

  const router = useRouter();

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const productoGet = await productoQuery.get();

        if (productoGet.exists) {
          guardarError(false);
          guardarProducto(productoGet.data());
          guardarConsultarDB(false);
        } else {
          guardarError(true);
          guardarConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  const { usuario } = useContext(FirebaseContext);

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlImagen,
    votos,
    creador,
    haVotado,
  } = producto;

  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }

    if (haVotado.includes(usuario.uid)) {
      return;
    }

    const hanVotado = [...haVotado, usuario.uid];

    const totalVotos = votos + 1;

    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: totalVotos, haVotado: hanVotado });

    guardarProducto({
      ...producto,
      votos: totalVotos,
      haVotado: hanVotado,
    });
    guardarConsultarDB(true);
  };

  const cambiarValor = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  const guardarComentarionNuevo = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    const nuevosComentarios = [...comentarios, comentario];
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ comentarios: nuevosComentarios });

    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
    guardarConsultarDB(true);
  };

  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    } else {
      return false;
    }
  };

  const puedeBorrar = () => {
    if (!usuario) return false;

    if (creador.id === usuario.uid) {
      return true;
    } else {
      return false;
    }
  };

  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }

    if (creador.id !== usuario.uid) {
      return router.push("/");
    }

    try {
        await firebase.db.collection('productos').doc(id).delete();
        router.push("/");
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <Layout>
      {Object.keys(producto).length === 0 && !error ? (
        <Spinner />
      ) : error ? (
        <Error404 />
      ) : (
        <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {nombre}
          </h1>
          <ContenedorProducto>
            <div>
              <p>
                Publicado hace: {formatDistanceToNow(creado, { locale: es })}
              </p>
              <p>
                Por: {creador.nombre} de {empresa}
              </p>

              <img src={urlImagen} />
              <p>{descripcion}</p>

              {usuario && (
                <>
                  <h2>Agrega tu comentario</h2>

                  <form onSubmit={guardarComentarionNuevo}>
                    <Campo>
                      <input
                        onChange={cambiarValor}
                        type="text"
                        name="mensaje"
                      />
                    </Campo>
                    <InputSubmit type="submit" value="Agregar Comentario" />
                  </form>
                </>
              )}

              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comentarios
              </h2>
              {comentarios.length === 0 ? (
                "Aun no hay comentarios"
              ) : (
                <ul>
                  {comentarios.map((comentario, index) => {
                    return (
                      <li
                        key={`${comentario.usuarioId}-${index}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {" "}
                            {comentario.usuarioNombre}
                          </span>{" "}
                        </p>
                        {esCreador(comentario.usuarioId) ? (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <aside>
              <Boton target="_blank" bgColor="true" href={url}>
                Visitar URL
              </Boton>
              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                <p
                  css={css`
                    text-align: center;
                  `}
                >
                  {votos} Votos
                </p>
                {usuario ? <Boton onClick={votarProducto}>Votar</Boton> : null}
              </div>
            </aside>
          </ContenedorProducto>
          {puedeBorrar() && (
            <Boton onClick={eliminarProducto}>Eliminar producto</Boton>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Producto;
