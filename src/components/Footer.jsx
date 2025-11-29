import React from 'react'

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-content">
        
        <img 
          src="public/images/Logo.png" 
          alt="logo" 
          width="60" 
          height="60" 
          className="brand-footer" 
        />
        
        <div className="footer-section contact-info">
          <h4>Contacto</h4>
          <p>
            Email: <a href="mailto:credito.smart@example.com">credito.smart@example.com</a>
          </p>
          <p>Teléfono: +57 (604) 555-1234</p>
        </div>

        <div className="footer-section social-links">
          <h4>Síguenos</h4>
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram"
          >
            <span className="social-icon"></span>Instagram: @creditsmart_oficial
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>
            &copy; 2025 CreditSmart &reg; | Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}