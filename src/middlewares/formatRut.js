// formatRut.js
export const formatRut = (rut) => {
    if (!rut) return '';
    
    // Limpiar el RUT de puntos y guión
    const rutClean = rut.replace(/[.-]/g, '');
    
    // Obtener el dígito verificador
    const dv = rutClean.slice(-1);
    
    // Obtener el cuerpo del RUT
    const rutBody = rutClean.slice(0, -1);
    
    // Formatear el cuerpo del RUT con puntos
    const rutFormated = rutBody
        .split('')
        .reverse()
        .reduce((acc, digit, i) => {
            if (i > 0 && i % 3 === 0) {
                return digit + '.' + acc;
            }
            return digit + acc;
        }, '');
    
    // Retornar RUT formateado con guión y dígito verificador
    return `${rutFormated}-${dv}`;
};

export const cleanRut = (rut) => {
    return rut.replace(/[.-]/g, '');
};