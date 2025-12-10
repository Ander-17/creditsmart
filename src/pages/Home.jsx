import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { CreditCard } from '../components/CreditCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const Home = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const creditsCollection = collection(db, "credits");
        const querySnapshot = await getDocs(creditsCollection);

        const creditsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCredits(creditsList);
      } catch (err) {
        console.error("Error cargando créditos:", err);
        setError("Hubo un problema cargando los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  return (
    <div>
      <Hero />

      <main className="container">
        <section className="credits-section">
          <h3>Nuestros productos</h3>

          {loading && <p className="loading-msg">Cargando productos financieros...</p>}
          
          {error && <p className="error-msg">Error al cargar los productos financieros: {error}</p>}

          <div className="credits-grid">
            {!loading && !error && credits.map((credit) => {
              return (
                <CreditCard 
                  key={credit.id} 
                  credit={credit} 
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  )
}