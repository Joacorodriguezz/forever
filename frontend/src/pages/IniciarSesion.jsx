import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Card, Tabs, Tab } from 'react-bootstrap';
import logo from '../assets/forever.png';
import { setAuth } from '../helpers/auth';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginSchema from "../validations/loginSchema.js";
import registroSchema from "../validations/registroSchema.js";
import '../styles/Auth.css';

function Login() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarPasswordRegistro, setMostrarPasswordRegistro] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const BACKURL = import.meta.env.VITE_API_URL;

  // Form para Login
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin },
    setError: setErrorLogin,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Form para Registro
  const {
    register: registerRegistro,
    handleSubmit: handleSubmitRegistro,
    formState: { errors: errorsRegistro, isSubmitting: isSubmittingRegistro },
    setError: setErrorRegistro,
    reset: resetRegistro,
  } = useForm({
    resolver: yupResolver(registroSchema),
  });

  // Handler para Login
  const onSubmitLogin = async (data) => {
    try {
      const res = await fetch(`${BACKURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseBody = await res.json();

      if (!res.ok) throw new Error(responseBody.message || "Credenciales inválidas");

      const { user, token } = responseBody.data || {};

      if (token && user) {
        setAuth(token, user.role, user);

        switch (user.role) {
          case 'ADMINISTRATIVO':
          case 'ADMIN':
            navigate('/inicio');
            break;
          case 'SOCIO':
            navigate('/inicioSocio');
            break;
          default:
            throw new Error("Rol desconocido");
        }
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setErrorLogin("root", {
        type: "manual",
        message: err.message || "Credenciales inválidas",
      });
    }
  };

  // Handler para Registro
  const onSubmitRegistro = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        role: 'SOCIO',
        socio: {
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          fechaNacimiento: data.fechaNacimiento,
          sexo: data.sexo,
          pais: data.pais,
        }
      };

      const res = await fetch(`${BACKURL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody = await res.json();

      if (!res.ok) {
        throw new Error(responseBody.message || "Error en el registro");
      }

      // Registro exitoso, cambiar a tab de login
      resetRegistro();
      setActiveTab('login');
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
    } catch (err) {
      console.error("❌ Error en registro:", err);
      setErrorRegistro("root", {
        type: "manual",
        message: err.message || "Error en el registro",
      });
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-layout">
        {/* Columna Izquierda - Logo y Nombre */}
        <div className="auth-branding">
          <div className="auth-logo-container">
            <img src={logo} alt="Club For Ever" className="auth-logo" />
            <h1 className="auth-club-name">CLUB SOCIAL CULTURAL Y DEPORTIVO FOR EVER</h1>
          </div>
        </div>

        {/* Columna Derecha - Formularios */}
        <div className="auth-forms">
          <Card className="auth-card">

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="auth-tabs mb-4"
            >
              {/* TAB LOGIN */}
              <Tab eventKey="login" title="Inicia sesión">
                {errorsLogin.root?.message && (
                  <div className="auth-alert auth-alert-danger">
                    {errorsLogin.root.message}
                  </div>
                )}

                <Form noValidate onSubmit={handleSubmitLogin(onSubmitLogin)} className="auth-form">
                  <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese su email o DNI"
                      {...registerLogin("emailOdni")}
                      isInvalid={!!errorsLogin.emailOdni}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errorsLogin.emailOdni?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <div className="auth-input-group">
                      <Form.Control
                        type={mostrarPassword ? 'text' : 'password'}
                        placeholder="Ingrese su contraseña"
                        {...registerLogin("password")}
                        isInvalid={!!errorsLogin.password}
                      />
                      <button
                        type="button"
                        className="btn-toggle"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                      >
                        {mostrarPassword ? '👁️ Ocultar' : '👁️ Mostrar'}
                      </button>
                    </div>
                    {errorsLogin.password && (
                      <div className="invalid-feedback d-block">
                        {errorsLogin.password.message}
                      </div>
                    )}
                  </Form.Group>

                  <div className="auth-help-link mb-3">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingLogin}
                    className="auth-btn auth-btn-primary"
                  >
                    {isSubmittingLogin ? (
                      <>
                        <span className="auth-spinner"></span>
                        Ingresando...
                      </>
                    ) : (
                      'Ingresar'
                    )}
                  </button>

                  <div className="auth-help-text mt-3">
                    ¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('registro'); }}>Registrarse</a>
                  </div>
                </Form>
              </Tab>

              {/* TAB REGISTRO */}
              <Tab eventKey="registro" title="Registrarse">
                {errorsRegistro.root?.message && (
                  <div className="auth-alert auth-alert-danger">
                    {errorsRegistro.root.message}
                  </div>
                )}

                <Form noValidate onSubmit={handleSubmitRegistro(onSubmitRegistro)} className="auth-form">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese su nombre"
                          {...registerRegistro("nombre")}
                          isInvalid={!!errorsRegistro.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errorsRegistro.nombre?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese su apellido"
                          {...registerRegistro("apellido")}
                          isInvalid={!!errorsRegistro.apellido}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errorsRegistro.apellido?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>DNI</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="12345678"
                      {...registerRegistro("dni")}
                      isInvalid={!!errorsRegistro.dni}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errorsRegistro.dni?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email@ejemplo.com"
                      {...registerRegistro("email")}
                      isInvalid={!!errorsRegistro.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errorsRegistro.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                          type="date"
                          {...registerRegistro("fechaNacimiento")}
                          isInvalid={!!errorsRegistro.fechaNacimiento}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errorsRegistro.fechaNacimiento?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Sexo</Form.Label>
                        <Form.Select
                          {...registerRegistro("sexo")}
                          isInvalid={!!errorsRegistro.sexo}
                        >
                          <option value="">Seleccione...</option>
                          <option value="MASCULINO">Masculino</option>
                          <option value="FEMENINO">Femenino</option>
                          <option value="OTRO">Otro</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errorsRegistro.sexo?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>País</Form.Label>
                    <Form.Select
                      {...registerRegistro("pais")}
                      isInvalid={!!errorsRegistro.pais}
                    >
                      <option value="">Seleccione su país...</option>
                      <option value="ARGENTINA">Argentina</option>
                      <option value="BOLIVIA">Bolivia</option>
                      <option value="BRASIL">Brasil</option>
                      <option value="CHILE">Chile</option>
                      <option value="COLOMBIA">Colombia</option>
                      <option value="COSTA_RICA">Costa Rica</option>
                      <option value="CUBA">Cuba</option>
                      <option value="ECUADOR">Ecuador</option>
                      <option value="EL_SALVADOR">El Salvador</option>
                      <option value="GUATEMALA">Guatemala</option>
                      <option value="HONDURAS">Honduras</option>
                      <option value="MEXICO">México</option>
                      <option value="NICARAGUA">Nicaragua</option>
                      <option value="PANAMA">Panamá</option>
                      <option value="PARAGUAY">Paraguay</option>
                      <option value="PERU">Perú</option>
                      <option value="PUERTO_RICO">Puerto Rico</option>
                      <option value="REPUBLICA_DOMINICANA">República Dominicana</option>
                      <option value="URUGUAY">Uruguay</option>
                      <option value="VENEZUELA">Venezuela</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errorsRegistro.pais?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <div className="auth-input-group">
                      <Form.Control
                        type={mostrarPasswordRegistro ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        {...registerRegistro("password")}
                        isInvalid={!!errorsRegistro.password}
                      />
                      <button
                        type="button"
                        className="btn-toggle"
                        onClick={() => setMostrarPasswordRegistro(!mostrarPasswordRegistro)}
                      >
                        {mostrarPasswordRegistro ? '👁️ Ocultar' : '👁️ Mostrar'}
                      </button>
                    </div>
                    {errorsRegistro.password && (
                      <div className="invalid-feedback d-block">
                        {errorsRegistro.password.message}
                      </div>
                    )}
                  </Form.Group>

                  <button
                    type="submit"
                    disabled={isSubmittingRegistro}
                    className="auth-btn auth-btn-primary"
                  >
                    {isSubmittingRegistro ? (
                      <>
                        <span className="auth-spinner"></span>
                        Registrando...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>
                </Form>
              </Tab>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
