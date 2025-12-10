import React, { useState, useMemo, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const initialFormState = {
  fullname: '',
  email: '',
  phone: '',
  cedula: '',
  creditType: '', 
  monto: 0,
  plazo: 12,
  destino: '',
  empleador: '',
  cargo: '',
  ingresos: 0,
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP',
        minimumFractionDigits: 0 
    }).format(amount);
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCredits, setAvailableCredits] = useState([]);
  const [loadingCredits, setLoadingCredits] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "credits"));
            const creditsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setAvailableCredits(creditsList);
            
            if (creditsList.length > 0) {
                setFormData(prev => ({ ...prev, creditType: creditsList[0].name }));
            }
        } catch (error) {
            console.error("Error cargando tipos de crédito:", error);
            Swal.fire('Error', 'No se pudieron cargar los tipos de crédito', 'error');
        } finally {
            setLoadingCredits(false);
        }
    };
    fetchCredits();
  }, []);

  const cuotaMensual = useMemo(() => {
    const P = parseFloat(formData.monto);
    const n = parseInt(formData.plazo);
    
    const selectedCredit = availableCredits.find(c => c.name === formData.creditType);
    const tasaPorcentaje = selectedCredit ? selectedCredit.interestRate : 0; 
    const i = tasaPorcentaje / 100; 

    if (P > 0 && n > 0 && i > 0) {
      const cuota = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      return { cuota: Math.round(cuota), tasa: tasaPorcentaje };
    }
    return { cuota: 0, tasa: tasaPorcentaje };
    
  }, [formData.monto, formData.plazo, formData.creditType, availableCredits]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (e.target.required && value.trim() === '') {
        setErrors(prev => ({ ...prev, [name]: 'Este campo es obligatorio.' }));
    } else {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
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

    setIsSubmitting(true);

    try {
        const solicitudData = {
            ...formData,
            cuotaEstimada: cuotaMensual.cuota,
            fechaRegistro: new Date()
        };

        const docRef = await addDoc(collection(db, "solicitudes"), solicitudData);
        
        Swal.fire({
            icon: 'success',
            title: '¡Solicitud Guardada!',
            html: `<p>Tu solicitud ha sido registrada con el código: <b>${docRef.id}</b></p>`,
            confirmButtonText: 'Aceptar',
        });
        
        setFormData({
            ...initialFormState, 
            creditType: availableCredits.length > 0 ? availableCredits[0].name : ''
        });
        setErrors({});

    } catch (error) {
        console.error("Error registrando solicitud: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: 'No pudimos guardar tu solicitud.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleClear = () => {
    setFormData({
        ...initialFormState, 
        creditType: availableCredits.length > 0 ? availableCredits[0].name : ''
    });
    setErrors({});
  };
  
  return (
    <>
      <main className="container">
        <section className="form-section">
          <h3>Formulario de Solicitud de Crédito</h3>

          <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting || loadingCredits} style={{border: 'none'}}>
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

                  <div className="form-container">
                      <div className="form-header">
                          <h4>Datos del crédito</h4>
                          <div className="form-body">
                              <label htmlFor="credit-type">Tipo de crédito:</label>
                              {loadingCredits ? (
                                  <p>Cargando opciones...</p>
                              ) : (
                                  <select id="credit-type" name="creditType" required
                                     value={formData.creditType} onChange={handleInputChange}>
                                      {availableCredits.map(credit => (
                                          <option key={credit.id} value={credit.name}>{credit.name}</option>
                                      ))}
                                  </select>
                              )}

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
                  
                  <button type="submit" className="btn-submit" disabled={isSubmitting || loadingCredits}>
                      {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                  
                  <button type="button" onClick={handleClear} className="btn-clear" disabled={isSubmitting}>
                      Limpiar formulario
                  </button>
              
              </fieldset>
          </form>

        </section>
      </main>
    </>
  );
};