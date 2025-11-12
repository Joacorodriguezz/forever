import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Image, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const paisesLatam = [
  { value: "ARGENTINA", label: "Argentina" },
  { value: "BOLIVIA", label: "Bolivia" },
  { value: "BRASIL", label: "Brasil" },
  { value: "CHILE", label: "Chile" },
  { value: "COLOMBIA", label: "Colombia" },
  { value: "COSTA_RICA", label: "Costa Rica" },
  { value: "CUBA", label: "Cuba" },
  { value: "ECUADOR", label: "Ecuador" },
  { value: "EL_SALVADOR", label: "El Salvador" },
  { value: "GUATEMALA", label: "Guatemala" },
  { value: "HONDURAS", label: "Honduras" },
  { value: "MEXICO", label: "México" },
  { value: "NICARAGUA", label: "Nicaragua" },
  { value: "PANAMA", label: "Panamá" },
  { value: "PARAGUAY", label: "Paraguay" },
  { value: "PERU", label: "Perú" },
  { value: "PUERTO_RICO", label: "Puerto Rico" },
  { value: "REPUBLICA_DOMINICANA", label: "República Dominicana" },
  { value: "URUGUAY", label: "Uruguay" },
  { value: "VENEZUELA", label: "Venezuela" }
];

const sexos = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" }
];

function ModificarDatos() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    fechaNacimiento: "",
    pais: "",
    sexo: "",
    fotoCarnet: ""
  });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) {
      setError("Usuario no encontrado. Inicia sesión nuevamente.");
      return;
    }

    const usuario = JSON.parse(usuarioStr);
    setRole(usuario.role);

    if (usuario.role === "SOCIO" && usuario.socio) {
      const socio = usuario.socio;
      setForm({
        nombre: socio.nombre || "",
        apellido: socio.apellido || "",
        dni: socio.dni || "",
        email: usuario.email || "",
        fechaNacimiento: socio.fechaNacimiento?.split("T")[0] || "",
        pais: socio.pais || "",
        sexo: socio.sexo || "",
        fotoCarnet: socio.fotoCarnet || ""
      });
    } else if (usuario.role === "ADMINISTRATIVO" && usuario.administrativo) {
      const adm = usuario.administrativo;
      setForm({
        nombre: adm.nombre || "",
        apellido: adm.apellido || "",
        dni: adm.dni || "",
        email: usuario.email || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const formData = new FormData();

    formData.append("email", form.email);

    if (role === "SOCIO") {
      formData.append("role", "SOCIO");
      formData.append("socio[nombre]", form.nombre);
      formData.append("socio[apellido]", form.apellido);
      formData.append("socio[dni]", form.dni);
      formData.append("socio[fechaNacimiento]", form.fechaNacimiento);
      formData.append("socio[pais]", form.pais);
      formData.append("socio[sexo]", form.sexo);
      if (foto) {
        formData.append("foto", foto);
      }
    } else if (role === "ADMINISTRATIVO") {
      formData.append("role", "ADMINISTRATIVO");
      formData.append("administrativo[nombre]", form.nombre);
      formData.append("administrativo[apellido]", form.apellido);
      formData.append("administrativo[dni]", form.dni);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${usuario.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data.data;
      localStorage.setItem("usuario", JSON.stringify(updatedUser));

      if (updatedUser.socio?.fotoCarnet) {
        setForm((prev) => ({
          ...prev,
          fotoCarnet: updatedUser.socio.fotoCarnet,
        }));
      }

      setFotoPreview(null);
      alert("Datos guardados correctamente");
      navigate("/inicio");
    } catch (err) {
      console.error("❌ Error al actualizar usuario:", err);
      alert("Error al guardar los cambios.");
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="mb-4 text-center">
            Modificar datos de {role === "SOCIO" ? "socio" : "administrativo"}
          </h3>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control name="apellido" value={form.apellido} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control name="dni" value={form.dni} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" type="email" value={form.email} onChange={handleChange} required />
                </Form.Group>

                {role === "SOCIO" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Nacimiento</Form.Label>
                      <Form.Control type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>País</Form.Label>
                      <Form.Select name="pais" value={form.pais} onChange={handleChange} required>
                        <option value="">Seleccionar país</option>
                        {paisesLatam.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Sexo</Form.Label>
                      <Form.Select name="sexo" value={form.sexo} onChange={handleChange} required>
                        <option value="">Seleccionar sexo</option>
                        {sexos.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </>
                )}

                <Button variant="success" type="submit">Guardar cambios</Button>
              </Col>

              {role === "SOCIO" && (
                <Col md={5} className="d-flex flex-column align-items-center">
                  <Form.Label>Foto carnet</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                  {(fotoPreview || form.fotoCarnet) ? (
                    <Image
                      src={fotoPreview || form.fotoCarnet}
                      alt="Foto carnet"
                      rounded
                      fluid
                      style={{
                        width: 220,
                        height: 220,
                        objectFit: "cover",
                        marginTop: "1rem",
                        border: "1px solid #ccc",
                        background: "#f8f9fa"
                      }}
                    />
                  ) : (
                    <div className="text-muted mt-2" style={{
                      fontSize: "0.95rem",
                      width: 220,
                      height: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed #ccc",
                      borderRadius: "0.25rem"
                    }}>
                      No hay foto seleccionada
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
}

export default ModificarDatos;
