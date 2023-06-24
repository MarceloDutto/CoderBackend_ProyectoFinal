const validateCreationParams = (params) => {
    const validationRules = [
      { key: 'name', message: 'El campo "name" debe ser una cadena de texto y no debe estar vacío.' },
      { key: 'description', message: 'El campo "description" debe ser una cadena de texto y no debe estar vacío.' },
      { key: 'category', message: 'El campo "category" debe ser una cadena de texto y no debe estar vacío.' },
      { key: 'code', message: 'El campo "code" debe ser una cadena de texto y no debe estar vacío.' },
      { key: 'Nprice', message: 'El campo "price" debe ser un número.' },
      { key: 'Nstock', message: 'El campo "stock" debe ser un número.' }
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
        (rule.key === 'Nprice' || rule.key === 'Nstock') &&
        (typeof paramValue !== 'number' || isNaN(paramValue))
      ) {
        return { isValid: false, message: rule.message };
      }
    }
  
    return { isValid: true };
};

export default validateCreationParams;