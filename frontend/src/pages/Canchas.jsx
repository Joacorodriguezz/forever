import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Card,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { PlusCircle, Pencil, Trash, InfoCircle } from "react-bootstrap-icons";
import Header from "../components/Header";
import AdminPageWrapper from "../components/AdminPageWrapper";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Schema de validación
const canchaSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "Mínimo 2 caracteres"),
  descripcion: yup.string().optional(),
});

function Canchas() {
  const [actividades, setActividades] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);
  const [rol, setRol] = useState(null);
  const [mostrarModalCanchas, setMostrarModalCanchas] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cargandoCanchas, setCargandoCanchas] = useState(false);

  const token = localStorage.getItem("token");
  const BACKURL = import.meta.env.VITE_API_URL

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(canchaSchema),
  });

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      setRol(usuario?.rol || usuario?.role || null);
    }
  }, []);

  // Cargar actividades
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await axios.get(`${BACKURL}/api/actividades`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActividades(response.data.actividades || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las actividades.");
      } finally {
        setCargando(false);
      }
    };
    fetchActividades();
  }, [token]);

  // Cargar canchas por actividad
  const cargarCanchas = async (actividadId) => {
    if (!actividadId) return;
    setCargandoCanchas(true);
    try {
      const response = await axios.get(
        `${BACKURL}/api/canchas/actividad/${actividadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCanchas(response.data.canchas || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las canchas.");
    } finally {
      setCargandoCanchas(false);
    }
  };

  const handleVerCanchas = (actividad) => {
    setActividadSeleccionada(actividad);
    cargarCanchas(actividad.id);
    setMostrarModalCanchas(true);
  };

  // Crear cancha
  const onSubmitCrear = async (data) => {
    if (!actividadSeleccionada) return;
    try {
      await axios.post(
        `${BACKURL}/api/canchas`,
        { ...data, actividadId: actividadSeleccionada.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await cargarCanchas(actividadSeleccionada.id);
      setMostrarModalCrear(false);
      reset();
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la cancha.");
    }
  };

  // Editar cancha
  const onSubmitEditar = async (data) => {
    if (!canchaSeleccionada) return;
    try {
      await axios.put(
        `${BACKURL}/api/canchas/${canchaSeleccionada.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await cargarCanchas(actividadSeleccionada?.id);
      setMostrarModalEditar(false);
      reset();
    } catch (err) {
      console.error(err);
      setError("No se pudo editar la cancha.");
    }
  };

  // Eliminar cancha (solo admin)
  const handleEliminar = async (canchaId) => {
    if (rol !== "ADMIN") return; 
    if (!window.confirm("¿Estás seguro de eliminar esta cancha?")) return;
    try {
      await axios.delete(`${BACKURL}/api/canchas/${canchaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await cargarCanchas(actividadSeleccionada?.id);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la cancha.");
    }
  };

  const handleVerDetalles = (cancha) => {
    setCanchaSeleccionada(cancha);
    setMostrarModalDetalles(true);
  };

  const handleEditar = (cancha) => {
    setCanchaSeleccionada(cancha);
    setValue("nombre", cancha.nombre);
    setValue("descripcion", cancha.descripcion || "");
    setMostrarModalEditar(true);
  };

  const actividadesActivas = actividades.filter((a) => a.activo);

  return (
    <>
      <Header />
      <AdminPageWrapper>
      <Container className="d-flex justify-content-center">
        <div
          className="w-100 p-4"
          style={{
            maxWidth: "1000px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0, 26, 71, 0.25)",
            borderTop: "6px solid #001a47",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: "#001a47", fontWeight: "700" }}>Gestión de Canchas</h2>
            <p className="text-muted mb-0">Seleccioná una actividad para gestionar sus canchas</p>
          </div>

          {cargando ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : actividadesActivas.length === 0 ? (
            <Alert variant="info">No hay actividades activas.</Alert>
          ) : (
            <Row className="gy-4">
              {actividadesActivas.map((actividad) => (
                <Col xs={12} key={actividad.id}>
                  <Card className="shadow-sm border-0 rounded-4 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold fs-5">{actividad.nombre}</span>
                      <Button
                        onClick={() => handleVerCanchas(actividad)}
                        className="d-flex align-items-center"
                        style={{
                          background: 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
                          border: 'none',
                          color: 'white'
                        }}
                      >
                        Gestionar Canchas
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Modal de canchas */}
          <Modal show={mostrarModalCanchas} onHide={() => setMostrarModalCanchas(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Canchas de {actividadSeleccionada?.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {cargandoCanchas ? (
                <div className="d-flex justify-content-center py-3">
                  <Spinner animation="border" />
                </div>
              ) : canchas.length === 0 ? (
                <Alert variant="info">No hay canchas registradas para esta actividad.</Alert>
              ) : (
                <Row className="gy-3">
                  {canchas.map((cancha) => (
                    <Col xs={12} key={cancha.id}>
                      <Card className="border-0 shadow-sm">
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{cancha.nombre}</h6>
                              <div className="text-muted small">
                                {cancha.descripcion || "Sin descripción"}
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <Button variant="outline-info" size="sm" onClick={() => handleVerDetalles(cancha)}>
                                <InfoCircle />
                              </Button>
                              <Button variant="outline-warning" size="sm" onClick={() => handleEditar(cancha)}>
                                <Pencil />
                              </Button>
                              {rol === "ADMIN" && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleEliminar(cancha.id)}
                                >
                                  <Trash />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  reset();
                  setMostrarModalCrear(true);
                }}
                className="d-flex align-items-center"
              >
                <PlusCircle className="me-2" />
                Agregar Cancha
              </Button>
              <Button variant="secondary" onClick={() => setMostrarModalCanchas(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal crear */}
          <Modal show={mostrarModalCrear} onHide={() => setMostrarModalCrear(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Agregar Cancha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit(onSubmitCrear)}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control {...register("nombre")} placeholder="Ej: Cancha Principal" />
                  {errors.nombre && <p className="text-danger small">{errors.nombre.message}</p>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción (opcional)</Form.Label>
                  <Form.Control as="textarea" rows={3} {...register("descripcion")} />
                </Form.Group>
                <Button variant="success" type="submit">
                  Crear Cancha
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Modal editar */}
          <Modal show={mostrarModalEditar} onHide={() => setMostrarModalEditar(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Editar Cancha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit(onSubmitEditar)}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control {...register("nombre")} />
                  {errors.nombre && <p className="text-danger small">{errors.nombre.message}</p>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control as="textarea" rows={3} {...register("descripcion")} />
                </Form.Group>
                <Button variant="success" type="submit">
                  Guardar Cambios
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Modal detalles */}
          <Modal show={mostrarModalDetalles} onHide={() => setMostrarModalDetalles(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Detalles de la Cancha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {canchaSeleccionada && (
                <>
                  <h5>{canchaSeleccionada.nombre}</h5>
                  <p className="mt-3">
                    <strong>Descripción:</strong>{" "}
                    {canchaSeleccionada.descripcion || "Sin descripción"}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <Badge bg={canchaSeleccionada.activa ? "success" : "danger"} className="ms-2">
                      {canchaSeleccionada.activa ? "Activa" : "Inactiva"}
                    </Badge>
                  </p>
                </>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </Container>
      </AdminPageWrapper>
    </>
  );
}

export default Canchas;
