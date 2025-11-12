import '../styles/HomePageUser.css';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function HomePageUser() {
  const navigate = useNavigate();
  const opciones = [
    {
      texto: 'Reservar Cancha',
      ruta: '/canchasSocio',
      subtitulo: '(consultar disponibilidad y reservar turno)',
    },
    {
      texto: 'Mis Reservas',
      ruta: '/misReservas',
      subtitulo: '(ver mis reservas de canchas)',
    },
    {
      texto: 'Mis entradas',
      ruta: '/entradasSocio',
      subtitulo: '(ver mis entradas, comprar entradas, ver próximos eventos)',
    },
    {
      texto: 'Pagar cuota',
      ruta: '/cuotas-table',
      subtitulo: '(ver mis cuotas, subir comprobante o pagar online)',
    },
    {
      texto: 'Actividades',
      ruta: '/actividadesSocio',
      subtitulo: '(ver actividades e inscribirme)',
    },
  ];
  const nom = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")).socio.nombre : "";
  return (
    <>
    <Header></Header>
    <div className="home-background">
      <div className="home-container">
        <h3 className="home-title">¡Hola {nom}!</h3>
        <Row className="g-4">
          {opciones.map((opcion) => (
            <Col key={opcion.texto} xs={12} sm={6} md={4}>
              <div 
                className="home-card-square"
                onClick={() => navigate(opcion.ruta)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && navigate(opcion.ruta)}
              >
                <h4>{opcion.texto}</h4>
                {opcion.subtitulo && (
                  <p className="card-subtitle">{opcion.subtitulo}</p>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
    </>
  );
}

export default HomePageUser;
