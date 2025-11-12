import '../styles/HomePage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function HomePageAdmin() {
  const navigate = useNavigate();
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const role = usuario?.rol || usuario?.role || null;

  console.log("Rol detectado:", role);

  // Lista base de opciones (todas)
  const opcionesBase = [
    { texto: 'Cuotas', ruta: '/cuotas-admin' },
    { texto: 'Reserva Canchas', ruta: '/canchas' },
    { texto: 'Reservas de Socios', ruta: '/misReservasAdmin' },
    { texto: 'Eventos', ruta: '/eventos' },
    { texto: 'Actividades', ruta: '/actividades' },
    { texto: 'Administrativos', ruta: '/administrativos', requiereAdmin: true },
    { texto: 'Socios', ruta: '/socios' },
    { texto: 'Profesores', ruta: '/profesores', requiereAdmin: true },
    { texto: 'Canchas', ruta: '/gestionCanchas' },
  ];

  // Filtrar según rol
  const opcionesVisibles = opcionesBase.filter(opcion => {
    // Si requiere ser admin, solo lo ve si el rol es ADMIN
    if (opcion.requiereAdmin && role !== "ADMIN") return false;
    return true;
  });

  const [tabActivo, setTabActivo] = useState(0);

  // Agrupar opciones por categorías
  const categorias = [
    {
      nombre: 'Gestión Deportiva',
      opciones: opcionesVisibles.filter(op => 
        ['Reserva Canchas', 'Reservas de Socios', 'Canchas'].includes(op.texto)
      )
    },
    {
      nombre: 'Eventos y Actividades',
      opciones: opcionesVisibles.filter(op => 
        ['Eventos', 'Actividades'].includes(op.texto)
      )
    },
    {
      nombre: 'Administración',
      opciones: opcionesVisibles.filter(op => 
        ['Cuotas', 'Socios', 'Administrativos', 'Profesores'].includes(op.texto)
      )
    }
  ];

  return (
    <>
      <Header />
      <div className="home-background">
        <div className="home-container">
          <div className="home-header">
            <h3 className="home-title">Panel de Administración</h3>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            {categorias.map((cat, index) => (
              <button
                key={cat.nombre}
                className={`tab-button ${tabActivo === index ? 'active' : ''}`}
                onClick={() => setTabActivo(index)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Contenido del tab activo */}
          <div className="tab-content">
            <div className="options-grid">
              {categorias[tabActivo].opciones.map(opcion => (
                <div
                  key={opcion.texto}
                  className="option-card"
                  onClick={() => navigate(opcion.ruta)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && navigate(opcion.ruta)}
                >
                  <div className="option-card-content">
                    <h4>{opcion.texto}</h4>
                    <div className="option-card-arrow">→</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePageAdmin;
