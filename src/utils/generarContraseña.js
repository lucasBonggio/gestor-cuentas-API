

export default function generarcaracteres(longitud, usarNumeros = false,  usarLetras = true, usarEspeciales = false){
    
    let caracteres = "";
    
    if(usarNumeros){
        caracteres += "1234567890";
    }
    
    if(usarLetras){
        caracteres += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }
    
    if(usarEspeciales){
        caracteres += "!@#$%^&*()_+[]{}|;:,.<>?";
    }
    
    if(!caracteres){
        throw new Error('La contraseña debe tener caracteres. ');
    }

    let contraseña = "";
    for(let i = 0; i < longitud; i++){
        const indice = Math.floor(Math.random() * caracteres.length);
        contraseña += caracteres[indice];
    }
    return contraseña;
}