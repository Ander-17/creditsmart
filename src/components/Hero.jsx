import React from 'react'

export const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-split-container">
        <div className="hero-text-box">
            <h2>Encuentra el mejor crédito para ti</h2>
            <p>
              Compara tasas, plazos y beneficios de las mejores opciones del mercado. 
              Toma el control de tus finanzas y haz realidad tus proyectos hoy mismo.
            </p>
        </div>
        
        <div className="hero-image-box">
          <img 
            src="../images/Banner.png" 
            alt="Finanzas inteligentes" 
            className="hero-image" 
            />

        </div>
      </div>
    </section>
  )
}