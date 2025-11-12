import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Image, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoUniversal from "../assets/forever.png";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fotoPerfil, setFotoPerfil] = useState(logoUniversal);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      setRol(usuario?.rol || usuario?.role || null);
    }
  }, []);

  const actualizarFoto = () => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      const fotoPath = usuario?.socio?.fotoCarnet;
      setFotoPerfil(fotoPath || logoUniversal);
    } else {
      setFotoPerfil(logoUniversal);
    }
  };

  useEffect(() => {
    actualizarFoto();
    window.addEventListener("profileUpdated", actualizarFoto);
    return () => window.removeEventListener("profileUpdated", actualizarFoto);
  }, []);

  const handleInicio = () => {
    if (rol === "SOCIO") navigate("/inicioSocio");
    else navigate("/inicio");
  };

  const handleContacto = () => navigate("/contacto");

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    navigate("/");
  };

  const enInicio = ["/inicio", "/inicioSocio"].includes(location.pathname);
  const enLogin = location.pathname === "/";

  return (
    <Navbar className="navbar-custom" expand="lg" collapseOnSelect>
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
          <Image src={logoUniversal} height="70" className="me-2" />
          <span className="d-none d-lg-inline">
            CLUB SOCIAL CULTURAL Y DEPORTIVO FOR EVER 
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-3 align-items-center">
            {rol === "SOCIO" && !enLogin && (
              <>
                {!enInicio && (
                  <Nav.Link as="span" onClick={handleInicio} style={{ cursor: "pointer" }}>
                    Inicio
                  </Nav.Link>
                )}
                <Nav.Link as="span" onClick={handleContacto} style={{ cursor: "pointer" }}>
                  Contacto
                </Nav.Link>
                <Nav.Link as={Link} to="/perfil">
                  Ver mi perfil
                </Nav.Link>
              </>
            )}

            {rol === "ADMINISTRATIVO" && !enLogin && (
              <>
                {!enInicio && (
                  <Nav.Link as="span" onClick={handleInicio} style={{ cursor: "pointer" }}>
                    Inicio
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/perfil">
                  Ver mi perfil
                </Nav.Link>
              </>
            )}

            {rol === "ADMIN" && !enLogin && (
              <>
                {!enInicio && (
                  <Nav.Link as="span" onClick={handleInicio} style={{ cursor: "pointer" }}>
                    Inicio
                  </Nav.Link>
                )}
              </>
            )}

            {!enLogin && (
              <NavDropdown
                title={
                  <Image
                    src={fotoPerfil}
                    alt="Perfil"
                    roundedCircle
                    className="header-avatar"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                }
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger fw-bold"
                >
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
