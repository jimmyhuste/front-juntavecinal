// validarRut.js
const validarRut = (rut) => {
  // Si no hay rut, retornar falso
  if (!rut) return false;

  // Limpiar el RUT de puntos y guión
  const cleanedRut = rut.replace(/\./g, '').replace('-', '');

  // Verificar que el RUT tenga el largo correcto para persona natural (8 o 9 caracteres)
  if (cleanedRut.length < 8 || cleanedRut.length > 9) return false;

  // Verificar que sea un RUT de persona (primeros dígitos menores a 50 millones)
  const rutNumber = parseInt(cleanedRut.slice(0, -1));
  if (rutNumber >= 50000000) return false;

  // Verificar formato: 7-8 dígitos + dígito verificador
  if (!/^\d{7,8}[0-9Kk]$/i.test(cleanedRut)) return false;

  const body = cleanedRut.slice(0, -1);
  const dv = cleanedRut.slice(-1).toUpperCase();

  // Calcular dígito verificador
  let sum = 0;
  let factor = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * factor;
      factor = factor === 7 ? 2 : factor + 1;
  }

  const calculatedDv = 11 - (sum % 11);
  const finalDv = calculatedDv === 10 ? 'K' : calculatedDv === 11 ? '0' : calculatedDv.toString();

  return dv === finalDv;
};

// Función auxiliar para formatear RUT
export const formatearRut = (rut) => {
  if (!rut || !validarRut(rut)) return '';
  
  const cleanedRut = rut.replace(/\./g, '').replace('-', '');
  const body = cleanedRut.slice(0, -1);
  const dv = cleanedRut.slice(-1);
  
  // Formatear con puntos
  let formattedBody = '';
  for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
      formattedBody = body[i] + formattedBody;
      if (j === 2 && i !== 0) {
          formattedBody = '.' + formattedBody;
          j = -1;
      }
  }
  
  return `${formattedBody}-${dv}`;
};

export { validarRut };
export default validarRut;