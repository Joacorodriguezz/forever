import '../styles/HomePageUser.css';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function HomePageUser() {
  const navigate = useNavigate();
  const opciones = [
    {
      texto: 'Pagar cuota',
      ruta: '/cuotas-table',
      subtitulo: '(ver mis cuotas, subir comprobante o pagar online)',
    },
    {
      texto: 'Historial de Pagos',
      ruta: '/historial-pagos',
      subtitulo: '(ver todos mis pagos realizados)',
    },
    {
      texto: 'Mi Perfil',
      ruta: '/perfil',
      subtitulo: '(ver y modificar mi perfil)',
    },
  ];
  const nom = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")).socio.nombre : "";
  return (
    <>
      <Header></Header>
      <div className="home-background">
        <div className="home-container">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h3 className="home-title" style={{ color: '#001a47' }}>¡Bienvenido, {nom}!</h3>
            <p style={{ color: '#757575', fontSize: '1.1rem' }}>
              Club Social, Cultural y Deportivo For Ever
            </p>
          </div>
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
