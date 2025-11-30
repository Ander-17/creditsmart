import React from 'react'
import { Hero } from '../components/Hero'
import { CreditCard } from '../components/CreditCard'
import { creditsData } from '../data/creditsData'


export const Home = () => {

  console.log('Datos de créditos', creditsData)

  return (
    <div>
      <Hero />

      <main className="container">
        <section className="credits-section">

          <h3>Nuestros productos</h3>
          
          <div className="credits-grid">

            {creditsData.map((credit) => {

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
