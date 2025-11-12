import React, { useEffect, useState } from "react";
import { Button, Card, Badge, Row, Col, Alert, Form, InputGroup } from "react-bootstrap";
import Header from "../components/Header";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function MisReservasAdmin() {
  const [dni, setDni] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [socio, setSocio] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargandoReservas, setCargandoReservas] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
  const token = localStorage.getItem("token");

  const formatearFecha = (fecha) => {
    const fechaStr = fecha.split("T")[0];
    const [y, m, d] = fechaStr.split("-");
    const fechaObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return fechaObj.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEstadoBadge = () => <Badge bg="success">Activa</Badge>;

  const buscarSocio = async () => {
    if (!dni.trim()) {
      setError("Ingresá un DNI");
      return;
    }
    setError(null);
    setSocio(null);
    setReservas([]);
    try {
      setBuscando(true);
      const res = await fetch(`${API_BASE}/socios/dni/${dni}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("Socio no encontrado");
        throw new Error("Error al buscar socio");
      }
      const data = await res.json();
      setSocio(data);
      await fetchReservasActivas(data.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setBuscando(false);
    }
  };

  const fetchReservasActivas = async (socioId) => {
    try {
      setCargandoReservas(true);
      // Usar endpoint que ya filtra en backend: activas y desde hoy inclusive
      const url = `${API_BASE}/reserva/socio/reservas-activas?socioId=${socioId}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Error al cargar reservas");
      const data = await res.json();
      setReservas(data.reservas || data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargandoReservas(false);
    }
  };

  const cancelarReserva = async (reservaId) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;
    try {
      const res = await fetch(`${API_BASE}/reserva/admin/reservas/${reservaId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al cancelar reserva");
      }
      setReservas((prev) => prev.filter((r) => r.id !== reservaId));
    } catch (e) {
      alert(e.message);
    }
  };

  // Permitir Enter para buscar
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        buscarSocio();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dni]);

  return (
    <>
      <Header />
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #f5f5f5 50%, #e3f2fd 100%)',
        minHeight: '100vh',
        padding: '2rem 1rem',
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
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="contenido-cuadro container">
          <section className="mb-4">
            <h4 className="mb-3">
              <i className="bi bi-search me-2"></i>
              Buscar reservas por DNI
            </h4>
            <InputGroup className="mb-2" style={{ maxWidth: 420 }}>
              <InputGroup.Text>
                <i className="bi bi-person-vcard"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="DNI del socio"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
              />
              <Button onClick={buscarSocio} disabled={buscando} style={{
                background: 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
                border: 'none',
                color: 'white'
              }}>
                {buscando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Buscando
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-1"></i>
                    Buscar
                  </>
                )}
              </Button>
            </InputGroup>
            {error && (
              <Alert variant="danger" className="mt-2" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}
          </section>

          {socio && (
            <section className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <i className="bi bi-people me-2 text-success"></i>
                  Socio: {socio.nombre} {socio.apellido}
                </h5>
                <Button
                  size="sm"
                  onClick={() => fetchReservasActivas(socio.id)}
                  disabled={cargandoReservas}
                  style={{
                    background: 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
                    border: 'none',
                    color: 'white'
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Actualizar
                </Button>
              </div>

              {cargandoReservas ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando reservas...</p>
                </div>
              ) : reservas.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  No tiene reservas activas.
                </Alert>
              ) : (
                <Row className="g-3">
                  {reservas.map((reserva) => (
                    <Col key={reserva.id} xs={12} md={6} lg={4}>
                      <Card className="h-100 entrada-card shadow-sm">
                        <Card.Body className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{reserva.deporte}</h6>
                            {getEstadoBadge(reserva)}
                          </div>
                          <div className="mb-3">
                            <small className="text-muted d-block">
                              <i className="bi bi-geo-alt me-1"></i>
                              Cancha: {reserva.cancha}
                            </small>
                            <small className="text-muted d-block">
                              <i className="bi bi-calendar3 me-1"></i>
                              {formatearFecha(reserva.fecha)}
                            </small>
                            <small className="text-muted d-block">
                              <i className="bi bi-clock me-1"></i>
                              {reserva.hora}hs
                            </small>
                          </div>
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <small className="text-muted">Duración: 1 hora</small>
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => cancelarReserva(reserva.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancelar
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </section>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

