export default function validarIniciarSesion (valores){
    let errores ={};

    if(valores.email.trim() === ''){
        errores.email = "El Email es obligatorio";
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email = "Email no valido";
    }

    if(valores.password.trim() === ''){
        errores.password = "El Password es obligatorio";
    }else if(valores.password.length < 6){
        errores.password = "El Password debe ser mayor a 6 caracteres";
    }
    return errores;
}