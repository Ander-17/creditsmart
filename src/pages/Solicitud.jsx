import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2'; 
// Importamos los datos para obtener la tasa de interés dinámicamente
import { creditsData } from '../data/creditsData'; 


// NOTA: La tasa base fija se elimina. La obtenemos de creditsData.


// Objeto de estado inicial para el formulario
// Usamos el nombre del crédito del array de datos para que coincida con el <select>
const initialFormState = {
  fullname: '',
  email: '',
  phone: '',
  cedula: '',
  creditType: creditsData[0] ? creditsData[0].name : 'Crédito de libre inversión', // Tasa por defecto (el primer crédito)
  monto: 0,
  plazo: 12,
  destino: '',
  empleador: '',
  cargo: '',
  ingresos: 0,
};

// Función auxiliar para formatear la moneda
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP',
        minimumFractionDigits: 0 
    }).format(amount);
};

// Función auxiliar para la validación del formulario
const validateForm = (formData) => {
    let newErrors = {};
    if (formData.fullname.trim().length < 5) newErrors.fullname = "Nombre demasiado corto.";
    if (!formData.email.includes('@')) newErrors.email = "Email no válido.";
    if (parseFloat(formData.monto) < 100000) newErrors.monto = "El monto debe ser superior a $100.000.";
    
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
};


export const Solicitud = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // 1. CÁLCULO DE CUOTA MENSUAL ESTIMADA (Dinámico con la Tasa del Data)
  const cuotaMensual = useMemo(() => {
    const P = parseFloat(formData.monto);
    const n = parseInt(formData.plazo);
    
    // Buscar el objeto de crédito seleccionado para obtener la tasa
    const selectedCredit = creditsData.find(c => c.name === formData.creditType);

    // Obtener la tasa de interés (en porcentaje) y convertirla a decimal (ej: 1.5 -> 0.015)
    // Usamos la tasa del data o 1.5% como fallback si no se encuentra
    const tasaPorcentaje = selectedCredit ? selectedCredit.interestRate : 1.5; 
    const i = tasaPorcentaje / 100; // Tasa mensual en decimal

    // Fórmula de Amortización (Cuota Fija)
    if (P > 0 && n > 0 && i > 0) {
      const cuota = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      return { cuota: Math.round(cuota), tasa: tasaPorcentaje };
    }
    // Retorna 0 y la tasa por defecto si no se puede calcular
    return { cuota: 0, tasa: tasaPorcentaje };
    
  }, [formData.monto, formData.plazo, formData.creditType]); // Dependencia clave: creditType

  // Handler para inputs y validación en tiempo real
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación básica en tiempo real
    if (e.target.required && value.trim() === '') {
        setErrors(prev => ({ ...prev, [name]: 'Este campo es obligatorio.' }));
    } else {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Manejo del Envío del Formulario (SweetAlert2)
  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateForm(formData);
    setErrors(validationErrors);
    
    if (!isValid) {
      Swal.fire({
          icon: 'error',
          title: 'Error de Validación',
          text: 'Por favor, completa todos los campos requeridos correctamente.',
      });
      return;
    }
    
    // Notificación de Éxito de SweetAlert2 (ACTUALIZADO para usar la cuota calculada)
    Swal.fire({
      icon: 'success',
      title: '¡Solicitud Recibida!',
      html: `
        <p>Gracias por confiar en nosotros ${formData.fullname}. Tu solicitud de <b>${formatCurrency(formData.monto)}</b> ha sido enviada para revisión.</p>
        <hr class="swal-separator">
        <p class="summary-label">Tu cuota mensual estimada es:</p>
        <h2 class="summary-value">${formatCurrency(cuotaMensual.cuota)}</h2>
        <p class="summary-details">Tasa de referencia: ${cuotaMensual.tasa.toFixed(1)}% mensual.</p>
      `,
      confirmButtonText: 'Aceptar',
    });
    
    // Limpiar formulario automáticamente (Requisito 3)
    setFormData(initialFormState);
    setErrors({});
  };
  
  // Limpiar formulario con botón
  const handleClear = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  
  return (
    <>
      <main className="container">
        <section className="form-section">
          <h3>Formulario de Solicitud de Crédito</h3>

          <form onSubmit={handleSubmit}>
              {/* === 1. DATOS PERSONALES === */}
              <div className="form-container">
                  <div className="form-header">
                      <h4>Datos personales</h4>
                      <div className="form-body">
                          <label htmlFor="fullname">Nombre completo:</label>
                          <input type="text" id="fullname" name="fullname" required 
                             value={formData.fullname} onChange={handleInputChange} />
                          {errors.fullname && <p className="error-message">{errors.fullname}</p>}
                          
                          <label htmlFor="email">Correo electrónico:</label>
                          <input type="email" id="email" name="email" required 
                             value={formData.email} onChange={handleInputChange} />
                          {errors.email && <p className="error-message">{errors.email}</p>}


                          <label htmlFor="phone">Número de teléfono:</label>
                          <input type="tel" id="phone" name="phone" required 
                             value={formData.phone} onChange={handleInputChange} />

                          <label htmlFor="cedula">Cédula:</label>
                          <input type="number" id="cedula" name="cedula" required 
                             value={formData.cedula} onChange={handleInputChange} />
                      </div>
                  </div>
              </div>

              {/* === 2. DATOS DEL CRÉDITO (ACTUALIZADO) === */}
              <div className="form-container">
                  <div className="form-header">
                      <h4>Datos del crédito</h4>
                      <div className="form-body">
                          {/* Generamos las opciones del select dinámicamente desde creditsData */}
                          <label htmlFor="credit-type">Tipo de crédito:</label>
                          <select id="credit-type" name="creditType" required
                             value={formData.creditType} onChange={handleInputChange}>
                              {creditsData.map(credit => (
                                  <option key={credit.id} value={credit.name}>{credit.name}</option>
                              ))}
                          </select>

                          <label htmlFor="monto">Monto solicitado:</label>
                          <input type="number" id="monto" name="monto" required 
                             value={formData.monto} onChange={handleInputChange} min="100000"/>
                          {errors.monto && <p className="error-message">{errors.monto}</p>}


                          <label htmlFor="plazo">Plazo (meses):</label>
                          <select name="plazo" id="plazo" required
                             value={formData.plazo} onChange={handleInputChange}>
                              <option value="12">12 meses</option>
                              <option value="24">24 meses</option>
                              <option value="36">36 meses</option>
                              <option value="48">48 meses</option>
                              <option value="60">60 meses</option>
                          </select>

                          <label htmlFor="destino">Destino del Crédito:</label>
                          <textarea id="destino" name="destino" required 
                             value={formData.destino} onChange={handleInputChange} />
                      </div>
                  </div>
              </div>
              
              {/* === RESUMEN DEL CÁLCULO (ACTUALIZADO) === */}
              {cuotaMensual.cuota > 0 && (
                  <div className="form-container summary-box">
                      <div className="form-header">
                          <h4>Cuota Mensual Estimada</h4>
                          <p>Monto: <strong>{formatCurrency(formData.monto)}</strong> a {formData.plazo} meses</p>
                          <h3>Cuota Estimada: 
                              <span className="summary-amount">{formatCurrency(cuotaMensual.cuota)}</span>
                          </h3>
                          <p className="summary-details">Tasa de referencia: {cuotaMensual.tasa.toFixed(1)}% mensual.</p>
                      </div>
                  </div>
              )}


              {/* === 3. DATOS LABORALES === */}
              <div className="form-container">
                  <div className="form-header">
                      <h4>Datos laborales</h4>
                      <div className="form-body">
                          <label htmlFor="empleador">Empresa donde trabaja:</label>
                          <input type="text" id="empleador" name="empleador" required
                             value={formData.empleador} onChange={handleInputChange} />

                          <label htmlFor="cargo">Cargo que ocupa:</label>
                          <input type="text" id="cargo" name="cargo" required
                             value={formData.cargo} onChange={handleInputChange} />

                          <label htmlFor="ingresos">Ingresos mensuales:</label>
                          <input type="number" id="ingresos" name="ingresos" required
                             value={formData.ingresos} onChange={handleInputChange} min="0"/>
                      </div>
                  </div>
              </div>
              
              {/* === BOTONES DE ACCIÓN === */}
              <button type="submit" className="btn-submit">Enviar solicitud</button>
              <button type="button" onClick={handleClear} className="btn-clear">Limpiar formulario</button>
          </form>

        </section>
      </main>
    </>
  );
};