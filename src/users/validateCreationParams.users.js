const validateCreationParams = (params) => {
    const validationRules = [
      { key: 'first_name', message: 'El campo "first_name" debe ser una cadena de texto y no debe estar vacío.' },
      { key: 'last_name', message: 'El campo "last_name" debe ser una cadena de texto y no debe estar vacío.' },
      { key: 'Nage', message: 'El campo "age" debe ser un número.' },
      { key: 'email', message: 'El campo "email" debe ser una cadena de texto y no debe estar vacío.' },
      { key: 'password', message: 'El campo "password" debe ser una cadena de texto y no debe estar vacío.' },
    ];
  
    for (const rule of validationRules) {
      const paramValue = params?.[rule.key];
      if (paramValue === undefined) {
        continue;
      }
  
      if (typeof paramValue === 'string' && paramValue.trim() === '') {
        return { isValid: false, message: rule.message };
      }
  
      if (
        (rule.key === 'Nage') &&
        (typeof paramValue !== 'number' || isNaN(paramValue))
      ) {
        return { isValid: false, message: rule.message };
      }
    }
  
    return { isValid: true };
};

export default validateCreationParams;