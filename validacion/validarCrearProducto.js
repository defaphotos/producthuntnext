export default function validarCrearProducto(valores){
    let errores ={};
    if(valores.nombre.trim() === ''){
        errores.nombre = "El Nombre es obligatorio";
    }
    if(valores.empresa.trim() === ''){
        errores.empresa = "La Empresa es obligatorio";
    }
    if(valores.url.trim() === ''){
        errores.url = "La URL es obligatorio";
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)    ){
        errores.url = "URL mal formateada";
    }
    
    if(valores.descripcion.trim() === ''){
        errores.descripcion = "La descripción es obligatorio";
    }

    return errores;

} 