import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Image, Card } from 'react-bootstrap';
import Header from '../components/Header';

function MiPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const BACKURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BACKURL}/api/users/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUsuario(data.data || data);
          // Actualizar localStorage
          if (data.data || data) {
            localStorage.setItem("usuario", JSON.stringify(data.data || data));
          }
        } else {
          // Fallback a localStorage
          const usuarioStr = localStorage.getItem("usuario");
          setUsuario(usuarioStr ? JSON.parse(usuarioStr) : null);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        // Fallback a localStorage
        const usuarioStr = localStorage.getItem("usuario");
        setUsuario(usuarioStr ? JSON.parse(usuarioStr) : null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, BACKURL]);

  if (loading) return <p>Cargando...</p>;
  if (!usuario) return <p>No hay usuario logueado</p>;

  const { role, deportista, administrativo, email } = usuario;

  const formatearFecha = (fechaNac) => {
    if (!fechaNac) return '';
    const datePart = fechaNac.toString().split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const nombre = role === "DEPORTISTA" ? deportista?.nombre : administrativo?.nombre;
  const apellido = role === "DEPORTISTA" ? deportista?.apellido : administrativo?.apellido;
  const dni = role === "DEPORTISTA" ? deportista?.dni : administrativo?.dni;
  const fechaNacimiento = role === "DEPORTISTA" ? deportista?.fechaNacimiento : null;
  const sexo = role === "DEPORTISTA" ? deportista?.sexo : null;
  const fotoActualURL = role === "DEPORTISTA" ? deportista?.fotoCarnet || null : null;

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
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div style={{
                padding: '2rem',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 26, 71, 0.25)',
                borderTop: '6px solid #001a47'
              }}>
                <h3 style={{
                  marginBottom: '2rem',
                  textAlign: 'center',
                  color: '#001a47',
                  fontWeight: '700',
                  fontSize: '2rem'
                }}>Mi Perfil</h3>
              <Row>
                <Col md={7}>
                  <Card body style={{ 
                    background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)", 
                    margin: "0.5rem 0",
                    borderLeft: "4px solid #001a47",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                    color: "#001a47"
                  }}>
                    {nombre} {apellido}
                  </Card>

                  <Form.Label style={{ marginTop: "1rem", fontWeight: "600", color: "#001a47" }}>Email</Form.Label>
                  <Card body style={{ 
                    border: "2px solid #e3f2fd", 
                    borderRadius: "0.5rem", 
                    margin: "0.5rem 0",
                    background: "#f8f9fa"
                  }}>
                    {email}
                  </Card>

                  <Form.Label style={{ marginTop: "1rem", fontWeight: "600", color: "#001a47" }}>DNI</Form.Label>
                  <Card body style={{ 
                    border: "2px solid #e3f2fd", 
                    borderRadius: "0.5rem", 
                    margin: "0.5rem 0",
                    background: "#f8f9fa"
                  }}>
                    {dni}
                  </Card>

                  {role === "DEPORTISTA" && (
                    <>
                      <Form.Label style={{ marginTop: "1rem", fontWeight: "600", color: "#001a47" }}>Fecha de Nacimiento</Form.Label>
                      <Card body style={{ 
                        border: "2px solid #e3f2fd", 
                        borderRadius: "0.5rem", 
                        margin: "0.5rem 0",
                        background: "#f8f9fa"
                      }}>
                        {formatearFecha(fechaNacimiento)}
                      </Card>

                      <Form.Label style={{ marginTop: "1rem", fontWeight: "600", color: "#001a47" }}>Sexo</Form.Label>
                      <Card body style={{ 
                        border: "2px solid #e3f2fd", 
                        borderRadius: "0.5rem", 
                        margin: "0.5rem 0",
                        background: "#f8f9fa"
                      }}>
                        {sexo}
                      </Card>
                    </>
                  )}
                </Col>

                <Col md={5} className="d-flex flex-column align-items-center justify-content-start">
                  {role === "DEPORTISTA" && (
                    <>
                      <div className="mb-3 w-100">
                        <Form.Label style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          fontWeight: "600",
                          color: "#001a47",
                          fontSize: "1.125rem"
                        }}>Foto Carnet</Form.Label>
                      </div>
                      {fotoActualURL ? (
                        <Image
                          src={fotoActualURL}
                          alt="Foto carnet"
                          rounded
                          fluid
                          style={{
                            width: 220,
                            height: 220,
                            objectFit: "cover",
                            border: "3px solid #001a47",
                            background: "#f8f9fa",
                            boxShadow: "0 4px 12px rgba(0, 26, 71, 0.2)"
                          }}
                        />
                      ) : (
                        <div className="text-muted mt-2" style={{
                          fontSize: "0.95rem",
                          border: "3px dashed #001a47",
                          width: 220,
                          height: 220,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)",
                          borderRadius: "0.5rem",
                          color: "#001a47",
                          fontWeight: "500",
                          textAlign: "center",
                          padding: "1rem"
                        }}>
                          No se ha cargado foto
                        </div>
                      )}
                    </>
                  )}

                  <Button
                    href={'/modDatos'}
                    style={{ 
                      marginTop: "1.5rem",
                      background: "linear-gradient(135deg, #001a47 0%, #002d6b 100%)",
                      border: "none",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      fontWeight: "600",
                      boxShadow: "0 4px 12px rgba(0, 26, 71, 0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 16px rgba(0, 26, 71, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0, 26, 71, 0.3)";
                    }}
                  >
                    Modificar Mi Perfil
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default MiPerfil;
