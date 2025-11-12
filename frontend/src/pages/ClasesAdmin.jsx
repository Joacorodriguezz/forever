import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { PlusCircle, Pencil, Trash } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';

function ClasesAdmin() {
  const { actividadId } = useParams();
  const [clases, setClases] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Modales
  const [mostrarModalClase, setMostrarModalClase] = useState(false);
  const [editarClaseId, setEditarClaseId] = useState(null);

  const [mostrarModalProfesor, setMostrarModalProfesor] = useState(false);
  const [formProfesorNuevo, setFormProfesorNuevo] = useState({ nombre: '', apellido: '', email: '' });

  // Formulario clase
  const [formClase, setFormClase] = useState({ diaSemana: '', horaInicio: '', horaFin: '', profesorId: null });

  const token = localStorage.getItem("token");
  const BACKURL = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!actividadId) return;

    const fetchData = async () => {
      try {
        const [resClases, resProfesores] = await Promise.all([
          axios.get(`${BACKURL}/api/clases/actividad/${actividadId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${BACKURL}/api/profesores`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        setClases(resClases.data.clases || []);
        setProfesores(resProfesores.data.profesores || []);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las clases o profesores.');
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [actividadId, token]);

  // Guardar o editar clase
  const handleGuardarClase = async () => {
    if (!formClase.diaSemana || !formClase.horaInicio || !formClase.horaFin) return;

    try {
      const claseData = { ...formClase };

      if (editarClaseId) {
        const res = await axios.put(
          `${BACKURL}/api/clases/${editarClaseId}`,
          claseData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClases(prev => prev.map(c => (c.id === editarClaseId ? res.data.clase : c)));
      } else {
        const res = await axios.post(
          `${BACKURL}/api/clases/actividad/${actividadId}`,
          claseData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClases(prev => [...prev, res.data.clase]);
      }

      setFormClase({ diaSemana: '', horaInicio: '', horaFin: '', profesorId: null });
      setEditarClaseId(null);
      setMostrarModalClase(false);
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar la clase.');
    }
  };

  // Guardar profesor
  const handleGuardarProfesor = async () => {
    if (!formProfesorNuevo.nombre || !formProfesorNuevo.apellido || !formProfesorNuevo.email) return;

    try {
      const res = await axios.post(
        `${BACKURL}/api/profesores`,
        formProfesorNuevo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfesores(prev => [...prev, res.data.profesor]);
      setFormProfesorNuevo({ nombre: '', apellido: '', email: '' });
      setMostrarModalProfesor(false);
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el profesor.');
    }
  };

  // Eliminar clase
  const handleEliminarClase = async (claseId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta clase?")) return;
    try {
      await axios.delete(`${BACKURL}/api/clases/${claseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClases(prev => prev.filter(c => c.id !== claseId));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la clase");
    }
  };

  // Abrir modal editar
  const abrirModalEditar = (clase) => {
    setFormClase({
      diaSemana: clase.diaSemana || '',
      horaInicio: clase.horaInicio || '',
      horaFin: clase.horaFin || '',
      profesorId: clase.profesorId || null,
    });
    setEditarClaseId(clase.id);
    setMostrarModalClase(true);
  };

  return (
    <>
      <Header />
      <Container className="mt-5 d-flex justify-content-center">
        <div className="w-100 p-4" style={{ maxWidth: '1000px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: '#198754', fontWeight: '700' }}>Clases</h2>
            <Button
              variant="success"
              className="d-flex align-items-center"
              onClick={() => {
                setFormClase({ diaSemana: '', horaInicio: '', horaFin: '', profesorId: null });
                setEditarClaseId(null);
                setMostrarModalClase(true);
              }}
            >
              <PlusCircle className="me-2" /> Agregar Clase
            </Button>
          </div>

          {cargando ? (
            <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : clases.length === 0 ? (
            <Alert variant="info">No hay clases disponibles.</Alert>
          ) : (
            <Row className="gy-4">
              {clases.map(clase => (
                <Col xs={12} key={clase.id}>
                  <Card className="shadow-sm border-0 rounded-4 p-3 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold fs-5">{clase.diaSemana} {clase.horaInicio} - {clase.horaFin}</span>
                      <div className="d-flex gap-2">
                        <Button variant="outline-success" onClick={() => abrirModalEditar(clase)}>
                          <Pencil /> Editar
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleEliminarClase(clase.id)}>
                          <Trash /> Eliminar
                        </Button>
                      </div>
                    </div>
                    <small>
                      Profesor asignado: {clase.profesor ? `${clase.profesor.nombre} ${clase.profesor.apellido}` : 'Sin asignar'}
                    </small>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Modal agregar/editar clase */}
          <Modal show={mostrarModalClase} onHide={() => setMostrarModalClase(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editarClaseId ? 'Editar Clase' : 'Agregar Clase'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Día de la semana</Form.Label>
                  <Form.Control
                    as="select"
                    value={formClase.diaSemana}
                    onChange={e => setFormClase({ ...formClase, diaSemana: e.target.value })}
                  >
                    <option value="">Selecciona día</option>
                    <option value="LUNES">Lunes</option>
                    <option value="MARTES">Martes</option>
                    <option value="MIERCOLES">Miércoles</option>
                    <option value="JUEVES">Jueves</option>
                    <option value="VIERNES">Viernes</option>
                    <option value="SABADO">Sábado</option>
                    <option value="DOMINGO">Domingo</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Hora de inicio</Form.Label>
                  <Form.Control
                    type="time"
                    value={formClase.horaInicio}
                    onChange={e => setFormClase({ ...formClase, horaInicio: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Hora de fin</Form.Label>
                  <Form.Control
                    type="time"
                    value={formClase.horaFin}
                    onChange={e => setFormClase({ ...formClase, horaFin: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Asignar Profesor existente</Form.Label>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      as="select"
                      value={formClase.profesorId || ''}
                      onChange={e => setFormClase({ ...formClase, profesorId: e.target.value ? Number(e.target.value) : null })}
                    >
                      <option value="">Selecciona profesor</option>
                      {profesores.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                      ))}
                    </Form.Control>
                    <Button variant="outline-success" onClick={() => setMostrarModalProfesor(true)}>Nuevo Profesor</Button>
                  </div>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleGuardarClase}>Guardar Clase</Button>
            </Modal.Footer>
          </Modal>

          {/* Modal crear profesor */}
          <Modal show={mostrarModalProfesor} onHide={() => setMostrarModalProfesor(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Crear Profesor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" value={formProfesorNuevo.nombre} onChange={e => setFormProfesorNuevo({ ...formProfesorNuevo, nombre: e.target.value })}/>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control type="text" value={formProfesorNuevo.apellido} onChange={e => setFormProfesorNuevo({ ...formProfesorNuevo, apellido: e.target.value })}/>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={formProfesorNuevo.email} onChange={e => setFormProfesorNuevo({ ...formProfesorNuevo, email: e.target.value })}/>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleGuardarProfesor}>Crear Profesor</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Container>
    </>
  );
}

export default ClasesAdmin;
