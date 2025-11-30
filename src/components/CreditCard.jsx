import React from 'react'



export const CreditCard = ({ credit }) => {

    const { name,
        description,
        minAmount,
        maxAmount,
        interestRate,
        maxTerm,
        requirements,
        icon
    } = credit;

  return (
    <div className="credit-card"> 
      <div className="card-header">
        <span className="icon">{icon}</span>
        <h4>{name}</h4>
      </div>
      <p>{description}</p>
      
      <div className="card-body">
        <div className="detail-item">
          <span className="label">Tasa de interés:</span>
          <span className="value">Desde {interestRate}% mensual</span>
        </div>

        <div className="detail-item">
          <span className="label">Monto:</span>
          <span className="value"> Desde {minAmount} Hasta {maxAmount}</span>
        </div>

        <div className="detail-item">
          <span className="label">Plazo Máximo:</span>
          <span className="value">Hasta {maxTerm} meses</span>
        </div>
      </div>


      <div className="card-footer">
        <p>{requirements}</p>
      </div>
      
      <a href="/solicitud"> 
        <button className="btn-primary">Solicitar ahora</button>
      </a>
    </div>
  );
}
