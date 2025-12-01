import { Link, useLocation} from 'react-router-dom';

import React from 'react'

export const Navbar = () => {

    const location = useLocation();

    const    isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    }

  return (
    <nav className='navbar'>
        <div className='container'>
            
        <div className="brand">
          <h1 className="logo">CreditSmart</h1>
        </div>

        <ul className='menu'>
            <li>
                <Link to='/' className={isActive('/')}>
                    Inicio
                </Link>
            </li>
            <li>
                <Link to='/simulador' className={isActive('/simulador')}>
                    Simulador
                </Link>
            </li>
            <li>
                <Link to='/solicitud' className={isActive('/solicitud')}>
                    Solicitud Crédito
                </Link>
            </li>
        </ul>
        </div>
    </nav>
  )
}
