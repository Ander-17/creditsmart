import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Hero } from '../components/Hero';
import Swal from 'sweetalert2';

export const MisSolicitudes = () => {
  const [emailToSearch, setEmailToSearch] = useState('');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true); // Empieza cargando al inicio

  // 1. EFECTO DE CARGA INICIAL (Cargar las últimas 5 sin filtro)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const q = query(
          collection(db, "solicitudes"),
          orderBy("fechaRegistro", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSolicitudes(docs);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // --- FUNCIÓN BUSCAR (Filtra por email) ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!emailToSearch) return;

    setLoading(true);
    // Limpiamos la lista actual para dar feedback de búsqueda
    setSolicitudes([]);

    try {
      const q = query(
        collection(db, "solicitudes"), 
        where("email", "==", emailToSearch),
        orderBy("fechaRegistro", "desc"),
        limit(5) 
      );

      const querySnapshot = await getDocs(q);
      
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSolicitudes(docs);

    } catch (error) {
      console.error("Error consultando solicitudes:", error);
      if(error.message.includes("index")) {
          Swal.fire({
            title: 'Falta Índice',
            text: 'Firebase requiere un índice. Revisa la consola (F12) y abre el enlace proporcionado.',
            icon: 'warning',
            customClass: { confirmButton: 'swal-btn-normal' },
            buttonsStyling: false
          });
      }
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN ELIMINAR ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'swal-btn-danger',
            cancelButton: 'swal-btn-normal'
        },
        buttonsStyling: false 
    });

    if (result.isConfirmed) {
        try {
            await deleteDoc(doc(db, "solicitudes", id));
            setSolicitudes(prev => prev.filter(solicitud => solicitud.id !== id));
            
            Swal.fire({
                title: 'Eliminado',
                text: 'La solicitud ha sido eliminada.',
                icon: 'success',
                customClass: { confirmButton: 'swal-btn-normal' },
                buttonsStyling: false
            });
        } catch (error) {
            console.error("Error eliminando:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar la solicitud.',
                icon: 'error',
                customClass: { confirmButton: 'swal-btn-normal' },
                buttonsStyling: false
            });
        }
    }
  };

  // --- FUNCIÓN EDITAR ---
  const handleEdit = async (solicitud) => {
    const { value: formValues } = await Swal.fire({
        title: 'Actualizar Solicitud',
        html:
            `<label>Monto:</label>
             <input id="swal-input1" type="number" class="swal2-input" value="${solicitud.monto}">` +
            `<label>Plazo (Meses):</label>
             <input id="swal-input2" type="number" class="swal2-input" value="${solicitud.plazo}">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'swal-btn-normal',
            cancelButton: 'swal-btn-danger'
        },
        buttonsStyling: false,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ]
        }
    });

    if (formValues) {
        const [newMonto, newPlazo] = formValues;
        
        if (newMonto < 100000) {
            return Swal.fire({
                title: 'Error',
                text: 'El monto mínimo es $100.000',
                icon: 'error',
                customClass: { confirmButton: 'swal-btn-normal' },
                buttonsStyling: false
            });
        }

        try {
            const docRef = doc(db, "solicitudes", solicitud.id);
            
            // Recálculo simple de la cuota (usando tasa fija 1.5% para simplificar actualización)
            const tasa = 1.5 / 100; 
            const n = parseInt(newPlazo);
            const P = parseFloat(newMonto);
            const nuevaCuota = Math.round(P * (tasa * Math.pow(1 + tasa, n)) / (Math.pow(1 + tasa, n) - 1));

            await updateDoc(docRef, {
                monto: P,
                plazo: n,
                cuotaEstimada: nuevaCuota
            });

            setSolicitudes(prev => prev.map(item => 
                item.id === solicitud.id 
                ? { ...item, monto: P, plazo: n, cuotaEstimada: nuevaCuota } 
                : item
            ));

            Swal.fire({
                title: 'Actualizado',
                text: 'La solicitud se actualizó correctamente',
                icon: 'success',
                customClass: { confirmButton: 'swal-btn-normal' },
                buttonsStyling: false
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar',
                icon: 'error',
                customClass: { confirmButton: 'swal-btn-normal' },
                buttonsStyling: false
            });
        }
    }
  };

  const formatCurrency = (val) => {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);
  };

  return (
    <>
      <Hero />
      <main className="container">
        <section className="form-section mis-solicitudes-section">
          <h3>Panel de Solicitudes Recientes</h3>
          <p>A continuación se muestran las últimas solicitudes registradas en el sistema.</p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="form-container">
                <div className="form-body">
                    <label>Buscar por Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={emailToSearch}
                        onChange={(e) => setEmailToSearch(e.target.value)}
                        placeholder="ejemplo@correo.com"
                    />
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Filtrar'}
                </button>
            </div>
          </form>

          <div className="results-area">
            {loading && <p>Cargando datos...</p>}

            {!loading && solicitudes.length === 0 && (
                <p>No hay solicitudes registradas aún.</p>
            )}

            <div className="credits-grid">
                {solicitudes.map((solicitud) => (
                    <div key={solicitud.id} className="credit-card">
                        <div className="card-header">
                            <h4>{solicitud.creditType}</h4>
                        </div>
                        <div className="card-body">
                            {/* DATOS COMPLETOS (Excepto Cédula) */}
                            <p><strong>Solicitante:</strong> {solicitud.fullname}</p>
                            <p><strong>Email:</strong> {solicitud.email}</p>
                            <p><strong>Teléfono:</strong> {solicitud.phone}</p>
                            
                            <hr style={{margin: '10px 0', borderTop: '1px dashed #ccc'}}/>
                            
                            <p><strong>Empresa:</strong> {solicitud.empleador}</p>
                            <p><strong>Cargo:</strong> {solicitud.cargo}</p>
                            <p><strong>Ingresos:</strong> {formatCurrency(solicitud.ingresos)}</p>
                            
                            <hr style={{margin: '10px 0', borderTop: '1px dashed #ccc'}}/>

                            <p><strong>Monto Solicitado:</strong> {formatCurrency(solicitud.monto)}</p>
                            <p><strong>Plazo:</strong> {solicitud.plazo} meses</p>
                            <p><strong>Destino:</strong> {solicitud.destino}</p>
                            
                            <p className="status-text">
                                Cuota Aprox: {formatCurrency(solicitud.cuotaEstimada)}
                            </p>
                            <p style={{fontSize: '0.8rem', color: '#888'}}>
                                Fecha: {solicitud.fechaRegistro?.toDate().toLocaleDateString()}
                            </p>
                        </div>
                        
                        <div className="card-actions">
                            <button 
                                onClick={() => handleEdit(solicitud)}
                                className="btn-action btn-edit"
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(solicitud.id)}
                                className="btn-action btn-delete"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};