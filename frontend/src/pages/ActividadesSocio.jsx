import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import Header from "../components/Header";
import axios from "axios";

function ActividadesSocio() {
  const [actividades, setActividades] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [socioId, setSocioId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const BACKURL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        setSocioId(usuario?.socio?.id ?? null);
      } catch (e) {
        console.error("Error parseando usuario de localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!socioId) return;

    const fetchAll = async () => {
      setCargando(true);
      setError(null);
      try {
        const [resActs, resInsc] = await Promise.all([
          axios.get(`${BACKURL}/api/actividades`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BACKURL}/api/actividadSocio/socio/${socioId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("Actividades (raw):", resActs.data);
        console.log("Inscripciones (raw):", resInsc.data);

        setActividades(resActs?.data?.actividades ?? []);
        setInscripciones(resInsc?.data ?? []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar las actividades.");
      } finally {
        setCargando(false);
      }
    };

    fetchAll();
  }, [socioId, token]);

  const idsInscripto = useMemo(() => {
    if (!Array.isArray(inscripciones)) return new Set();
    return new Set(inscripciones.map((i) => Number(i.actividadId)));
  }, [inscripciones]);

  const estaInscripto = (actividadId) => idsInscripto.has(Number(actividadId));

  const handleInscribirse = async (actividadId) => {
    try {
      const res = await axios.post(
        `${BACKURL}/api/actividadSocio`,
        { actividadId, socioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nuevaInscripcion = res?.data?.actividadSocio ?? res?.data;
      setInscripciones((prev) => [...prev, nuevaInscripcion]);
      alert("Te inscribiste correctamente");
    } catch (e) {
      console.error(e);
      alert("No se pudo inscribir");
    }
  };

  const handleBaja = async (actividadId) => {
    const insc = inscripciones.find(
      (i) => Number(i.actividadId) === Number(actividadId)
    );
    if (!insc) return;

    try {
      await axios.delete(`${BACKURL}/api/actividadSocio/${insc.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInscripciones((prev) => prev.filter((i) => i.id !== insc.id));
      alert("Te diste de baja correctamente");
    } catch (e) {
      console.error(e);
      alert("No se pudo dar de baja");
    }
  };

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
      <Container className="d-flex justify-content-center" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="w-100 p-4"
          style={{
            maxWidth: "900px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0, 26, 71, 0.25)",
            borderTop: "6px solid #001a47",
          }}
        >
          <h2 className="mb-4" style={{ color: "#001a47", fontWeight: 700 }}>
            Actividades
          </h2>

          {cargando ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : actividades.filter((a) => a.activo).length === 0 ? (
            <Alert variant="info">No hay actividades activas.</Alert>
          ) : (
            <Row className="gy-3">
              {actividades
                .filter((a) => a.activo)
                .map((actividad) => {
                  const inscripto = estaInscripto(actividad.id);
                  return (
                    <Col xs={12} key={actividad.id}>
                      <Card
                        className="shadow-sm border-0 rounded-4 p-3"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold fs-5">
                            {actividad.nombre}
                          </span>
                          {inscripto ? (
                            <Button
                              variant="danger"
                              onClick={() => handleBaja(actividad.id)}
                            >
                              Darse de baja
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleInscribirse(actividad.id)}
                              style={{
                                background: 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
                                border: 'none',
                                color: 'white'
                              }}
                            >
                              Inscribirme
                            </Button>
                          )}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          )}
        </div>
      </Container>
      </div>
    </>
  );
}

export default ActividadesSocio;
