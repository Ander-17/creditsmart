import React, { useState, useMemo } from 'react';
// Asumimos que estos componentes están disponibles en las rutas definidas
import { Hero } from '../components/Hero'; 
import { CreditCard } from '../components/CreditCard';
import { creditsData } from '../data/creditsData'; 


export const Simulador = () => {
  // 1. Estados para controlar los inputs del formulario
  const [searchTerm, setSearchTerm] = useState('');   
  const [minAmount, setMinAmount] = useState('');   
  const [sortType, setSortType] = useState('tasa_asc'); 

  // Handler para actualizar el estado de los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name-product') setSearchTerm(value);
    if (name === 'loan-amount') setMinAmount(value);
    if (name === 'sort-interest') setSortType(value); 
  };
  
  // Función para limpiar la búsqueda y filtros
  const handleClearFilters = () => {
    setSearchTerm(''); // Limpia el término de búsqueda
    setMinAmount('');   // Limpia el monto
    setSortType('tasa_asc'); // Restablece el ordenamiento
  };
  
  // 2. Lógica de Filtrado y Ordenamiento usando useMemo
  const filteredAndSortedCredits = useMemo(() => {
    let results = creditsData;
    
    // A. Búsqueda (.filter()) por Nombre (Tiempo Real)
    if (searchTerm) {
      results = results.filter(credit => 
        credit.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // B. Filtro (.filter()) por Monto (Rango)
    const amountFilter = parseFloat(minAmount);
    if (!isNaN(amountFilter) && amountFilter > 0) {
      results = results.filter(credit => {
          return amountFilter >= credit.minAmount && amountFilter <= credit.maxAmount;
      });
    }
    
    // C. Ordenamiento (.sort()) (Tasa de Interés)
    const sorted = [...results];
    if (sortType === 'tasa_asc') {
      sorted.sort((a, b) => a.interestRate - b.interestRate);
    } else if (sortType === 'tasa_desc') {
      sorted.sort((a, b) => b.interestRate - a.interestRate);
    }

    return sorted;
    
  }, [searchTerm, minAmount, sortType]); 

  return (
    <>
      <Hero /> 
      
      <main className="container">
        <section className="simulator-section">
          <div className="simulator-container">
            <div className="simulator-header">
              <h4>Busca el crédito que mejor se adapte a tus necesidades</h4>
              <div className="simulator-body">
                
                <form onSubmit={e => e.preventDefault()}> 
                    
                  <label htmlFor="name-product">Nombre de producto:</label>
                  <input 
                    type="text" 
                    id="name-product" 
                    name="name-product"
                    value={searchTerm} 
                    onChange={handleInputChange}
                    placeholder="Ej: Crédito de Vehículo"
                  />
                  
                  <label htmlFor="loan-amount">Monto mínimo que necesitas:</label>
                  <input 
                    type="number" 
                    id="loan-amount" 
                    name="loan-amount"
                    value={minAmount} 
                    onChange={handleInputChange}
                    placeholder="Ej: 5000000"
                  />

                  <label htmlFor="sort-interest">Ordenar por Tasa de Interés:</label>
                  <select
                      id="sort-interest"
                      name="sort-interest"
                      value={sortType} 
                      onChange={handleInputChange}
                  >
                      <option value="tasa_asc">Menor a mayor (Tasa más baja)</option>
                      <option value="tasa_desc">Mayor a menor (Tasa más alta)</option>
                  </select>

                </form>
                
                {/* Botón para Limpiar Búsqueda, usando solo className */}
                <button 
                    onClick={handleClearFilters}
                    className="btn-clear" 
                >
                    Limpiar Búsqueda y Filtros
                </button>
                
              </div>
            </div>
          </div>
        </section>

        <section className="results-section">
          <h3>Resultados de la búsqueda</h3>
          <p>A continuación se muestran los {filteredAndSortedCredits.length} resultados que coinciden con tus filtros.</p>
          
          <div className="credits-grid">
            {/* Renderizado (.map()) */}
            {filteredAndSortedCredits.length > 0 ? (
              filteredAndSortedCredits.map((credit) => (
                <CreditCard 
                  key={credit.id} 
                  credit={credit} 
                />
              ))
            ) : (
              // Requisito 2: Mostrar "No hay créditos disponibles"
              <p>
                <strong>No hay créditos disponibles</strong> que coincidan con tu búsqueda y filtros. 
                Intenta ajustar los parámetros.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};