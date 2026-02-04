import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Modal,
  Spinner,
  Alert,
} from 'react-bootstrap';
import Header from '../components/Header';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

function obtenerDiasProximos(cantidad = 4) {
  const dias = [];
  const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
  for (let i = 0; i < cantidad; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    dias.push({
      dia: fecha.toLocaleDateString('es-AR', { weekday: 'long' }),
      fecha,
      label: fecha.toLocaleDateString('es-AR', opciones),
    });
  }
  return dias;
}

// Generar turnos de 12:00 a 02:00 AM
function generarTurnosDelDia() {
  const turnos = [];
  // De 12:00 a 23:00
  for (let hora = 12; hora <= 23; hora++) {
    turnos.push(`${hora.toString().padStart(2, '0')}:00`);
  }
  // De 00:00 a 02:00 (madrugada del día siguiente)
  for (let hora = 0; hora <= 2; hora++) {
    turnos.push(`${hora.toString().padStart(2, '0')}:00`);
  }
  return turnos;
}

// Helper para filtrar turnos pasados
const filtrarTurnosPasados = (turnos, diaSeleccionado) => {
  const ahora = new Date();
  const esHoy = diaSeleccionado.fecha.toDateString() === ahora.toDateString();
  if (!esHoy) return turnos;
  const horaActualMin = ahora.getHours() * 60 + ahora.getMinutes();
  return turnos.filter(t => {
    const [h, m] = t.hora.split(':').map(Number);
    return h * 60 + m > horaActualMin;
  });
};

const ReservaCancha = () => {
  const [diasDisponibles] = useState(obtenerDiasProximos());
  const [diaSeleccionado, setDiaSeleccionado] = useState(diasDisponibles[0]);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [turnoEnProceso, setTurnoEnProceso] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario
  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioData) setUsuario(usuarioData);
  }, []);

  // Cargar turnos cuando cambia el día
  useEffect(() => {
    if (diaSeleccionado) {
      fetchTurnosDisponibles();
    }
  }, [diaSeleccionado]);

  const fetchTurnosDisponibles = async () => {
    try {
      setCargando(true);
      const fecha = diaSeleccionado.fecha.toISOString().split('T')[0];
      const params = new URLSearchParams({
        fecha,
        deportistaId: usuario?.deportista?.id,
      });
      const res = await fetch(`${API_BASE}/reserva/deportista/turnos?${params}`);
      const data = await res.json();

      // Si no hay datos del backend, usar turnos generados localmente
      let turnosBase = data.turnos && data.turnos.length > 0 ? data.turnos : [];

      // Si no hay turnos del backend, generar la lista completa de 12:00 a 02:00
      if (turnosBase.length === 0) {
        const horasGeneradas = generarTurnosDelDia();
        turnosBase = horasGeneradas.map(hora => ({
          hora,
          disponible: true,
          esMiReserva: false
        }));
      }

      setTurnosDisponibles(filtrarTurnosPasados(turnosBase, diaSeleccionado));
    } catch {
      // En caso de error, mostrar turnos generados localmente
      const horasGeneradas = generarTurnosDelDia();
      const turnosBase = horasGeneradas.map(hora => ({
        hora,
        disponible: true,
        esMiReserva: false
      }));
      setTurnosDisponibles(filtrarTurnosPasados(turnosBase, diaSeleccionado));
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (hora) => {
    setTurnoEnProceso(hora);
    setMostrarModal(true);
  };

  const confirmarReserva = async () => {
    try {
      setCargando(true);
      const fecha = diaSeleccionado.fecha.toISOString().split('T')[0];
      const reservaData = {
        fecha,
        hora: turnoEnProceso,
        deportistaId: usuario?.deportista?.id,
      };
      const res = await fetch(`${API_BASE}/reserva/deportista/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData),
      });
      if (!res.ok) throw new Error();
      setMostrarModal(false);
      await fetchTurnosDisponibles();
      alert('Reserva creada exitosamente');
    } catch {
      alert('Error al crear la reserva');
    } finally {
      setCargando(false);
    }
  };

  const cancelarReserva = async (hora) => {
    try {
      setCargando(true);
      const reserva = turnosDisponibles.find(
        (t) => t.hora === hora && t.esMiReserva && t.reserva
      );
      if (!reserva) return;
      const res = await fetch(`${API_BASE}/reserva/deportista/reservas/${reserva.reserva.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      await fetchTurnosDisponibles();
      alert('Reserva cancelada exitosamente');
    } catch {
      alert('Error al cancelar la reserva');
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #f5f5f5 50%, #e3f2fd 100%)',
        minHeight: '100vh',
        padding: '2rem 0',
        position: 'relative'
      }}>
        <div style={{
          content: '',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 15% 25%, rgba(0, 26, 71, 0.02) 0%, transparent 50%),
                      radial-gradient(circle at 85% 75%, rgba(74, 144, 226, 0.03) 0%, transparent 50%)`,
          pointerEvents: 'none'
        }}></div>
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Card style={{
            boxShadow: '0 8px 24px rgba(0, 26, 71, 0.25)',
            border: 'none',
            borderRadius: '16px',
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
              borderBottom: 'none',
              padding: '1.5rem',
              textAlign: 'center',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h3 className="mb-0 fw-bold" style={{ color: '#ffffff' }}>Reservar Cancha</h3>
            </Card.Header>

            <Card.Body className="p-4 bg-white">
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Días */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <Row className="g-2 mb-3">
                  {diasDisponibles.map((dia) => (
                    <Col key={dia.label}>
                      <Button
                        style={{
                          background: dia.label === diaSeleccionado.label ? 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)' : 'transparent',
                          border: dia.label === diaSeleccionado.label ? 'none' : '2px solid #001a47',
                          color: dia.label === diaSeleccionado.label ? '#ffffff' : '#001a47'
                        }}
                        onClick={() => setDiaSeleccionado(dia)}
                        className="w-100 fw-semibold text-capitalize"
                      >
                        {dia.label}
                      </Button>
                    </Col>
                  ))}
                  <Col xs="auto">
                    <Button
                      style={{
                        background: 'transparent',
                        border: '2px solid #001a47',
                        color: '#001a47'
                      }}
                      onClick={() => setMostrarCalendario(!mostrarCalendario)}
                    >
                      <i className="bi bi-calendar3"></i>
                    </Button>
                  </Col>
                </Row>

                {mostrarCalendario && (
                  <Form.Control
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const nuevaFecha = new Date(e.target.value);
                      setDiaSeleccionado({
                        dia: nuevaFecha.toLocaleDateString('es-AR', { weekday: 'long' }),
                        fecha: nuevaFecha,
                        label: nuevaFecha.toLocaleDateString('es-AR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        }),
                      });
                    }}
                  />
                )}
              </Card.Body>
            </Card>

            {/* Turnos */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
                borderBottom: '2px solid #001a47',
                fontWeight: '600',
                color: '#001a47'
              }}>
                Turnos disponibles
              </Card.Header>
              <Card.Body style={{ maxHeight: '450px', overflowY: 'auto' }}>
                {cargando ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" style={{ color: '#001a47' }} />
                    <span className="ms-2" style={{ color: '#001a47' }}>Cargando turnos...</span>
                  </div>
                ) : turnosDisponibles.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-dark mb-0">No hay turnos disponibles</p>
                  </div>
                ) : (
                  turnosDisponibles.map((turno, i) => {
                    const esReservadoPorUsuario = turno.esMiReserva;
                    return (
                      <Card
                        key={i}
                        className="mb-2 border-0 shadow-sm d-flex flex-row justify-content-between align-items-center px-3 py-3"
                      >
                        <span className="fw-semibold text-dark fs-6">{turno.hora} hs</span>
                        <Button
                          style={{
                            background: !turno.disponible && !esReservadoPorUsuario
                              ? '#6c757d'
                              : esReservadoPorUsuario
                              ? '#d32f2f'
                              : 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
                            border: 'none',
                            color: '#ffffff'
                          }}
                          size="lg"
                          className="fw-bold px-4"
                          disabled={!turno.disponible && !esReservadoPorUsuario}
                          onClick={() => {
                            if (esReservadoPorUsuario) {
                              cancelarReserva(turno.hora);
                            } else if (turno.disponible) {
                              abrirModal(turno.hora);
                            }
                          }}
                        >
                          {!turno.disponible && !esReservadoPorUsuario
                            ? 'Reservado'
                            : esReservadoPorUsuario
                            ? 'Cancelar'
                            : 'Reservar'}
                        </Button>
                      </Card>
                    );
                  })
                )}
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>

          {/* Modal */}
          <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
            <Modal.Header closeButton style={{ background: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
              <Modal.Title className="fw-bold" style={{ color: '#001a47' }}>Confirmar Reserva</Modal.Title>
            </Modal.Header>
          <Modal.Body className="text-dark">
            <p><strong>Fecha:</strong> {diaSeleccionado.label}</p>
            <p><strong>Hora:</strong> {turnoEnProceso}</p>
            <p><strong>Duración:</strong> 1 hora</p>
            {usuario?.deportista && (
              <p><strong>Deportista:</strong> {usuario.deportista.nombre} {usuario.deportista.apellido}</p>
            )}
          </Modal.Body>
            <Modal.Footer style={{ background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
              <Button
                style={{
                  background: 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
                  border: 'none',
                  color: '#ffffff'
                }}
                size="lg"
                className="fw-bold px-4"
                onClick={confirmarReserva}
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" style={{ borderColor: '#ffffff transparent transparent transparent' }} />
                    Reservando...
                  </>
                ) : (
                  'Confirmar Reserva'
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </>
  );
};

export default ReservaCancha;
