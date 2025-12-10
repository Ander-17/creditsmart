import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard } from '../components/CreditCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const Simulador = () => {
  const [searchTerm, setSearchTerm] = useState('');   
  const [minAmount, setMinAmount] = useState('');   
  const [sortType, setSortType] = useState('tasa_asc'); 
  const [dbCredits, setDbCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "credits"));
        const creditsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDbCredits(creditsList);
      } catch (error) {
        console.error("Error cargando créditos en simulador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name-product') setSearchTerm(value);
    if (name === 'loan-amount') setMinAmount(value);
    if (name === 'sort-interest') setSortType(value); 
  };
  
  const handleClearFilters = () => {
    setSearchTerm(''); 
    setMinAmount('');   
    setSortType('tasa_asc'); 
  };
  
  const filteredAndSortedCredits = useMemo(() => {
    let results = dbCredits; 
    
    if (searchTerm) {
      results = results.filter(credit => 
        credit.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const amountFilter = parseFloat(minAmount);
    if (!isNaN(amountFilter) && amountFilter > 0) {
      results = results.filter(credit => {
          return amountFilter >= credit.minAmount && amountFilter <= credit.maxAmount;
      });
    }
    
    const sorted = [...results];
    if (sortType === 'tasa_asc') {
      sorted.sort((a, b) => a.interestRate - b.interestRate);
    } else if (sortType === 'tasa_desc') {
      sorted.sort((a, b) => b.interestRate - a.interestRate);
    }

    return sorted;
    
  }, [searchTerm, minAmount, sortType, dbCredits]); 

  return (
    <>
      
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

          {loading ? (
             <p style={{textAlign: 'center', fontSize: '1.2rem', color: '#3a89c9'}}>
                Cargando simulador...
             </p>
          ) : (
            <>
              <p>A continuación se muestran los {filteredAndSortedCredits.length} resultados que coinciden con tus filtros.</p>
              
              <div className="credits-grid">
                {filteredAndSortedCredits.length > 0 ? (
                  filteredAndSortedCredits.map((credit) => (
                    <CreditCard 
                      key={credit.id} 
                      credit={credit} 
                    />
                  ))
                ) : (
                  <p>
                    <strong>No hay créditos disponibles</strong> que coincidan con tu búsqueda y filtros. 
                    Intenta ajustar los parámetros.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
};