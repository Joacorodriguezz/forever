import React, { useEffect, useState } from "react";
import { Table, Button, Alert, Spinner, Card, Modal, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import Header from "../components/Header";

function ListProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfesor, setNewProfesor] = useState({ nombre: "", apellido: "", email: "" });

  const token = localStorage.getItem("token");

  // 🔹 Cargar Profesores
  const fetchProfesores = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profesores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfesores(response.data.profesores);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error al cargar profesores");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  // 🔹 Activar/Inactivar Profesor
  const toggleActivo = async (profesor) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profesores/${profesor.id}`,
        { activo: !profesor.activo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProfesores();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar estado");
    }
  };

  // 🔹 Eliminar Profesor
  const deleteProfesor = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este profesor?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/profesores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfesores();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar profesor");
    }
  };

  // 🔹 Ver detalles
  const handleVerDetalles = (profesor) => {
    setModalData(profesor);
    setIsEdit(false);
    setShowModal(true);
  };

  // 🔹 Editar profesor
  const handleEditar = (profesor) => {
    setModalData(profesor);
    setIsEdit(true);
    setShowModal(true);
  };

  // 🔹 Guardar cambios desde modal editar
  const handleGuardarCambios = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profesores/${modalData.id}`,
        {
          nombre: modalData.nombre,
          apellido: modalData.apellido,
          email: modalData.email,
          activo: modalData.activo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchProfesores();
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios");
    }
  };

  // 🔹 Crear nuevo profesor
  const handleCrearProfesor = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profesores`,
        newProfesor,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCreateModal(false);
      setNewProfesor({ nombre: "", apellido: "", email: "" });
      fetchProfesores();
    } catch (err) {
      console.error(err);
      alert("Error al crear profesor");
    }
  };

  // 🔹 Filtro de búsqueda
  const profesoresFiltrados = profesores.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container mt-4">
        <Card className="p-4 shadow">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Profesores</h2>
            <Button variant="success" onClick={() => setShowCreateModal(true)}>
              Registrar Profesor
            </Button>
          </div>

          {/* Buscador */}
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Buscar profesor por nombre, apellido o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesoresFiltrados.length > 0 ? (
                  profesoresFiltrados.map((p, index) => (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td>{p.nombre}</td>
                      <td>{p.apellido}</td>
                      <td>{p.email}</td>
                      <td>
                        {p.activo ? (
                          <span className="text-success">Activo</span>
                        ) : (
                          <span className="text-danger">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleVerDetalles(p)}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditar(p)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={p.activo ? "danger" : "success"}
                          size="sm"
                          className="me-2"
                          onClick={() => toggleActivo(p)}
                        >
                          {p.activo ? "Dar de baja" : "Reactivar"}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteProfesor(p.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay profesores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </div>

      {/* Modal Detalles / Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Editar Profesor" : "Detalles del Profesor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <>
              {isEdit ? (
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      value={modalData.nombre}
                      onChange={(e) =>
                        setModalData({ ...modalData, nombre: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      value={modalData.apellido}
                      onChange={(e) =>
                        setModalData({ ...modalData, apellido: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={modalData.email}
                      onChange={(e) =>
                        setModalData({ ...modalData, email: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form>
              ) : (
                <div>
                  <p><b>Nombre:</b> {modalData.nombre}</p>
                  <p><b>Apellido:</b> {modalData.apellido}</p>
                  <p><b>Email:</b> {modalData.email}</p>
                  <p><b>Estado:</b> {modalData.activo ? "Activo" : "Inactivo"}</p>
                  <p><b>Fecha Registro:</b> {new Date(modalData.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEdit && (
            <Button variant="success" onClick={handleGuardarCambios}>
              Guardar Cambios
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Crear Profesor */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Profesor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={newProfesor.nombre}
                onChange={(e) => setNewProfesor({ ...newProfesor, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                value={newProfesor.apellido}
                onChange={(e) => setNewProfesor({ ...newProfesor, apellido: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newProfesor.email}
                onChange={(e) => setNewProfesor({ ...newProfesor, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCrearProfesor}>
            Crear Profesor
          </Button>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ListProfesores;
