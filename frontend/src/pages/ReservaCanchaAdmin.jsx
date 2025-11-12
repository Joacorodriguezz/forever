import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, Modal, Spinner, Alert } from 'react-bootstrap';
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

// Función helper para filtrar turnos pasados
const filtrarTurnosPasados = (turnos, diaSeleccionado) => {
  const ahora = new Date();
  const horaActual = ahora.getHours();
  const minutoActual = ahora.getMinutes();
  
  // Si es el día de hoy, filtrar turnos pasados
  const esHoy = diaSeleccionado.fecha.toDateString() === new Date().toDateString();
  
  if (!esHoy) {
    return turnos; // Si no es hoy, mostrar todos los turnos
  }
  
  return turnos.filter(turno => {
    const [hora, minuto] = turno.hora.split(':').map(Number);
    const horaTurno = hora * 60 + minuto; // Convertir a minutos
    const horaActualMinutos = horaActual * 60 + minutoActual;
    
    return horaTurno > horaActualMinutos; // Solo mostrar turnos futuros
  });
};

const ReservaCanchaAdmin = () => {
  const [diasDisponibles] = useState(obtenerDiasProximos());
  const [diaSeleccionado, setDiaSeleccionado] = useState(diasDisponibles[0]);
  const [deportes, setDeportes] = useState([]);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('');
  const [canchas, setCanchas] = useState([]);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [turnoEnProceso, setTurnoEnProceso] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoCanchas, setCargandoCanchas] = useState(false);
  const [error, setError] = useState(null);

  // Datos del socio
  const [dni, setDni] = useState('');
  const [socioEncontrado, setSocioEncontrado] = useState(null);
  const [buscandoSocio, setBuscandoSocio] = useState(false);
  const [errorSocio, setErrorSocio] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    fetchDeportes();
  }, []);

  // Cargar canchas cuando cambie el deporte
  useEffect(() => {
    if (deporteSeleccionado) {
      setCanchaSeleccionada('');
      setTurnosDisponibles([]);
      fetchCanchas();
    } else {
      setCanchaSeleccionada('');
      setCanchas([]);
      setTurnosDisponibles([]);
    }
  }, [deporteSeleccionado]);

  // Cargar turnos cuando cambie el deporte, cancha o fecha
  useEffect(() => {
    if (!canchaSeleccionada) {
      setTurnosDisponibles([]);
      return;
    }
    if (deporteSeleccionado && canchaSeleccionada && diaSeleccionado) {
      fetchTurnosDisponibles();
    }
  }, [deporteSeleccionado, canchaSeleccionada, diaSeleccionado]);

  // Obtener deportes desde el back
  const fetchDeportes = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${API_BASE}/reserva/admin/deportes`);
      if (!res.ok) throw new Error('Error al cargar deportes');
      const data = await res.json();
      setDeportes(data.deportes || []);
      // No seleccionar deporte por defecto
    } catch (error) {
      console.error('Error cargando deportes:', error);
      setError('Error al cargar deportes disponibles');
    } finally {
      setCargando(false);
    }
  };

  // Obtener canchas por deporte
  const fetchCanchas = async () => {
    try {
      setCargandoCanchas(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      // Obtener canchas directamente por deporte usando el nuevo endpoint
      const res = await fetch(`${API_BASE}/reserva/admin/canchas/${encodeURIComponent(deporteSeleccionado)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        console.error('Error cargando canchas:', res.status, res.statusText);
        throw new Error(`Error al cargar canchas: ${res.status}`);
      }
      
      const data = await res.json();
      setCanchas(data.canchas || []);
      // No seleccionar cancha por defecto; dejar placeholder
      
    } catch (error) {
      console.error('Error cargando canchas:', error);
      setError('Error al cargar canchas disponibles');
    } finally {
      setCargandoCanchas(false);
    }
  };

  // Obtener turnos disponibles desde el backend
  const fetchTurnosDisponibles = async () => {
    try {
      setCargando(true);
      const fecha = diaSeleccionado.fecha.toISOString().split('T')[0];
      const params = new URLSearchParams({
        deporte: deporteSeleccionado,
        cancha: canchaSeleccionada,
        fecha: fecha,
      });

      const res = await fetch(`${API_BASE}/reserva/admin/turnos?${params}`);
      if (!res.ok) throw new Error('Error al cargar turnos');
      const data = await res.json();
      
      // Filtrar turnos pasados antes de establecer el estado
      const turnosFiltrados = filtrarTurnosPasados(data.turnos || [], diaSeleccionado);
      setTurnosDisponibles(turnosFiltrados);
    } catch (error) {
      console.error('Error cargando turnos:', error);
      setError('Error al cargar turnos disponibles');
    } finally {
      setCargando(false);
    }
  };

  // Buscar socio por DNI
  const buscarSocio = async () => {
    if (!dni.trim()) {
      setErrorSocio('Por favor, ingresá un DNI');
      return;
    }

    try {
      setBuscandoSocio(true);
      setErrorSocio(null);
      setSocioEncontrado(null);

      const res = await fetch(`${API_BASE}/socios/dni/${dni}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Socio no encontrado');
        }
        throw new Error('Error al buscar socio');
      }

      const data = await res.json();
      setSocioEncontrado(data);
    } catch (error) {
      console.error('Error buscando socio:', error);
      setErrorSocio(error.message);
    } finally {
      setBuscandoSocio(false);
    }
  };

  const abrirModal = (hora) => {
    setTurnoEnProceso(hora);
    setMostrarModal(true);
    // Limpiar datos del socio al abrir modal
    setDni('');
    setSocioEncontrado(null);
    setErrorSocio(null);
  };

  const confirmarReserva = async () => {
    if (!socioEncontrado) {
      alert("Por favor, buscá y seleccioná un socio válido.");
      return;
    }

    try {
      setCargando(true);
      const fecha = diaSeleccionado.fecha.toISOString().split('T')[0];
      
      const reservaData = {
        deporte: deporteSeleccionado,
        cancha: canchaSeleccionada,
        fecha: fecha,
        hora: turnoEnProceso,
        socioId: socioEncontrado.id
      };

      const res = await fetch(`${API_BASE}/reserva/admin/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear reserva');
      }

      setMostrarModal(false);
      
      // Recargar turnos para actualizar disponibilidad
      await fetchTurnosDisponibles();
      
      alert('Reserva creada exitosamente');
    } catch (error) {
      console.error('Error creando reserva:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const cancelarReserva = async (hora) => {
    try {
      setCargando(true);
      
      // Buscar la reserva para este turno
      const reserva = turnosDisponibles.find(t => 
        t.hora === hora && t.reserva
      );
      
      if (reserva && reserva.reserva) {
        const res = await fetch(`${API_BASE}/reserva/admin/reservas/${reserva.reserva.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al cancelar reserva');
        }
        
        // Recargar turnos para actualizar disponibilidad
        await fetchTurnosDisponibles();
        
        alert('Reserva cancelada exitosamente');
      }
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Header />

      <Container className="my-4">
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Header className="bg-white border-bottom py-3 text-center rounded-top-4">
            <h3 className="mb-0 fw-bold text-success">
              <i className="me-2"></i>
              Reservar Cancha
            </h3>
          </Card.Header>

          <Card.Body className="p-4 bg-white">
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Selección de deporte y cancha */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <Row className="g-3 justify-content-center text-center">
                  <Col md={6}>
                    <Form.Label className="fw-semibold text-dark">Deporte</Form.Label>
                    {cargando ? (
                      <Spinner animation="border" />
                    ) : (
                      <Form.Select
                        value={deporteSeleccionado}
                        onChange={(e) => setDeporteSeleccionado(e.target.value)}
                      >
                        <option value="">Seleccionar deporte</option>
                        {deportes.map((dep) => (
                          <option key={dep} value={dep}>{dep}</option>
                        ))}
                      </Form.Select>
                    )}
                  </Col>

                  <Col md={6}>
                    <Form.Label className="fw-semibold text-dark">Cancha</Form.Label>
                    {cargandoCanchas ? (
                      <Spinner animation="border" />
                    ) : (
                      <Form.Select
                        value={canchaSeleccionada}
                        onChange={(e) => setCanchaSeleccionada(e.target.value)}
                        disabled={!deporteSeleccionado}
                      >
                        <option value="">Seleccionar cancha</option>
                        {canchas.map((c) => (
                          <option key={c.id} value={c.nombre}>{c.nombre}</option>
                        ))}
                      </Form.Select>
                    )}
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <h6 className="fw-semibold text-dark">
                    {deporteSeleccionado && canchaSeleccionada
                      ? `${deporteSeleccionado} - ${canchaSeleccionada}`
                      : 'Seleccioná un deporte y una cancha'}
                  </h6>
                </div>
              </Card.Body>
            </Card>

            {/* Días */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <Row className="g-2 mb-3">
                  {diasDisponibles.map((dia) => (
                    <Col key={dia.label}>
                      <Button
                        variant={dia.label === diaSeleccionado.label ? 'success' : 'outline-secondary'}
                        onClick={() => setDiaSeleccionado(dia)}
                        className="w-100 fw-semibold text-capitalize"
                      >
                        {dia.label}
                      </Button>
                    </Col>
                  ))}
                  <Col xs="auto">
                    <Button
                      variant="outline-dark"
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
                      const nuevoDia = {
                        dia: nuevaFecha.toLocaleDateString('es-AR', { weekday: 'long' }),
                        fecha: nuevaFecha,
                        label: nuevaFecha.toLocaleDateString('es-AR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        }),
                      };
                      setDiaSeleccionado(nuevoDia);
                    }}
                  />
                )}
              </Card.Body>
            </Card>

            {/* Turnos */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light border-bottom fw-semibold text-dark">
                Turnos disponibles
              </Card.Header>
              <Card.Body style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {!canchaSeleccionada ? (
                  <div className="text-center py-4">
                    <p className="text-dark mb-0">Seleccioná una cancha para ver turnos</p>
                  </div>
                ) : cargando ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" />
                    <span className="ms-2 text-dark">Cargando turnos...</span>
                  </div>
                ) : turnosDisponibles.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-dark mb-0">No hay turnos disponibles para esta fecha</p>
                  </div>
                ) : (
                  turnosDisponibles.map((turno, i) => {
                    const esReservado = !turno.disponible && turno.reserva;
                    return (
                      <Card
                        key={i}
                        className="mb-2 border-0 shadow-sm d-flex flex-row justify-content-between align-items-center px-3 py-3"
                      >
                        <span className="fw-semibold text-dark fs-6">{turno.hora} hs</span>
                        <Button
                          variant={
                            !turno.disponible
                              ? 'secondary'
                              : esReservado
                              ? 'danger'
                              : 'success'
                          }
                          size="lg"
                          className="fw-bold px-4"
                          onClick={() =>
                            esReservado
                              ? cancelarReserva(turno.hora)
                              : abrirModal(turno.hora)
                          }
                        >
                          {!turno.disponible && !esReservado
                            ? 'Reservado'
                            : esReservado
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

        {/* Modal de reserva */}
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
          <Modal.Header closeButton className="bg-light border-bottom">
            <Modal.Title className="fw-bold text-success">Registrar Reserva</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-dark">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">DNI del Socio</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ingresá el DNI"
                    disabled={buscandoSocio}
                  />
                  <Button
                    variant="success"
                    onClick={buscarSocio}
                    disabled={buscandoSocio || !dni.trim()}
                  >
                    {buscandoSocio ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Buscando...
                      </>
                    ) : (
                      'Buscar'
                    )}
                  </Button>
                </div>
                {errorSocio && (
                  <Alert variant="danger" className="mt-2">
                    {errorSocio}
                  </Alert>
                )}
              </Form.Group>

              {socioEncontrado && (
                <Card className="border-0 bg-light mb-3">
                  <Card.Body>
                    <h6 className="fw-bold text-success mb-1">Socio encontrado</h6>
                    <p className="mb-0 text-dark">
                      <strong>{socioEncontrado.nombre} {socioEncontrado.apellido}</strong>
                    </p>
                    <small className="text-dark">DNI: {socioEncontrado.dni}</small><br />
                    <small className="text-dark">{socioEncontrado.email}</small>
                  </Card.Body>
                </Card>
              )}

              <hr />
              <p className="text-dark mb-1"><strong>Deporte:</strong> {deporteSeleccionado}</p>
              <p className="text-dark mb-1"><strong>Cancha:</strong> {canchaSeleccionada}</p>
              <p className="text-dark mb-1"><strong>Fecha:</strong> {diaSeleccionado.label}</p>
              <p className="text-dark mb-1"><strong>Hora:</strong> {turnoEnProceso}</p>
              <p className="text-dark mb-0"><strong>Duración:</strong> 1 hora</p>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top">
            <Button
              variant="success"
              size="lg"
              className="fw-bold px-4"
              onClick={confirmarReserva}
              disabled={!socioEncontrado || cargando}
            >
              {cargando ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Reservando...
                </>
              ) : (
                'Confirmar Reserva'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ReservaCanchaAdmin;