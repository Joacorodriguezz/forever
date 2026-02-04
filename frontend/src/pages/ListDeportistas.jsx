import React, { useEffect, useState } from "react";
import { Table, Button, Alert, Spinner, Card, Modal, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

function ListDeportistas() {
  const [deportistas, setDeportistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const role = usuario?.rol || usuario?.role || null;

  const fetchDeportistas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/deportistas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeportistas(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error al cargar deportistas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeportistas();
  }, []);

  // Dar de baja/alta
  const toggleEstado = async (deportista) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${deportista.id}`,
        { deportista: { estado: deportista.deportista.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDeportistas();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar estado");
    }
  };

  // Eliminar
  const deleteDeportista = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este deportista?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeportistas();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar deportista");
    }
  };

  const verSusCuotas = (id) => {
    navigate(`/cuotas-admin`, { state: { defId: id } });
  };

  // Ver detalles
  const handleVerDetalles = (deportista) => {
    setModalData(deportista);
    setIsEdit(false);
    setShowModal(true);
  };

  // Editar deportista
  const handleEditar = (deportista) => {
    setModalData(deportista);
    setIsEdit(true);
    setShowModal(true);
  };

  // Guardar cambios desde modal
  const handleGuardarCambios = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${modalData.id}`,
        { deportista: modalData.deportista },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchDeportistas();
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios");
    }
  };

  // Filtro búsqueda
  const deportistasFiltrados = deportistas.filter((s) =>
    `${s.deportista?.nombre} ${s.deportista?.apellido} ${s.deportista?.dni}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container mt-4">
        <Card className="p-4 shadow-sm border-0 rounded-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="text-success fw-bold">Gestión de Deportistas</h2>
            <Button variant="success" onClick={() => navigate("/registro")}>
              Registrar Deportista
            </Button>
          </div>

          {/* Buscador */}
          <InputGroup className="mb-4">
            <Form.Control
              type="text"
              placeholder="Buscar deportista por nombre, apellido o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearch("")}>
              Limpiar
            </Button>
          </InputGroup>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {deportistasFiltrados.length > 0 ? (
                  deportistasFiltrados.map((s, index) => (
                    <tr key={s.id}>
                      <td>{index + 1}</td>
                      <td>{s.deportista?.nombre}</td>
                      <td>{s.deportista?.apellido}</td>
                      <td>{s.deportista?.dni}</td>
                      <td>{s.email}</td>
                      <td>
                        {s.deportista?.estado === "ACTIVO" ? (
                          <span className="text-success fw-semibold">Activo</span>
                        ) : (
                          <span className="text-danger fw-semibold">Inactivo</span>
                        )}
                      </td>
                      <td className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleVerDetalles(s)}
                        >
                          Ver
                        </Button>

                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleEditar(s)}
                        >
                          Editar
                        </Button>

                        <Button
                          variant={s.deportista?.estado === "ACTIVO" ? "outline-danger" : "outline-success"}
                          size="sm"
                          onClick={() => toggleEstado(s)}
                        >
                          {s.deportista?.estado === "ACTIVO"
                            ? "Dar de Baja"
                            : "Reactivar"}
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => verSusCuotas(s.deportista.id)}
                        >
                          Ver Cuotas
                        </Button>
                        {role === "ADMIN" && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteDeportista(s.id)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No se encontraron deportistas registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </div>

      {/* Modal Detalles / Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-success">
            {isEdit ? "Editar Deportista" : "Detalles del Deportista"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <>
              {isEdit ? (
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      value={modalData.deportista.nombre}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          deportista: { ...modalData.deportista, nombre: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      value={modalData.deportista.apellido}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          deportista: { ...modalData.deportista, apellido: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>DNI</Form.Label>
                    <Form.Control
                      value={modalData.deportista.dni}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          deportista: { ...modalData.deportista, dni: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>País</Form.Label>
                    <Form.Control
                      value={modalData.deportista.pais}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          deportista: { ...modalData.deportista, pais: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Sexo</Form.Label>
                    <Form.Control
                      value={modalData.deportista.sexo}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          deportista: { ...modalData.deportista, sexo: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              ) : (
                <div className="text-dark">
                  <p><b>Nombre:</b> {modalData.deportista.nombre}</p>
                  <p><b>Apellido:</b> {modalData.deportista.apellido}</p>
                  <p><b>DNI:</b> {modalData.deportista.dni}</p>
                  <p><b>Email:</b> {modalData.email}</p>
                  <p><b>Fecha Nacimiento:</b> {modalData.deportista.fechaNacimiento?.split("T")[0]}</p>
                  <p><b>País:</b> {modalData.deportista.pais}</p>
                  <p><b>Sexo:</b> {modalData.deportista.sexo}</p>
                  <p><b>Estado:</b> {modalData.deportista.estado}</p>
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
    </>
  );
}

export default ListDeportistas;
