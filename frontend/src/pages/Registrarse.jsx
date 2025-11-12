import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Col, Row, Card, InputGroup } from 'react-bootstrap';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form" ;
import { yupResolver } from "@hookform/resolvers/yup" ;
import RegistroSchema from '../validations/registroSchema';

function Registrarse() {
  //const [validated, setValidated] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  // const [nombre, setNombre] = useState('');
  // const [apellido, setApellido] = useState('');
  // const [dni, setDni] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [fechaNacimiento, setFechaNacimiento] = useState('');
  // const [sexo, setSexo] = useState('');
  // const [pais, setPais] = useState('');
  // const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(RegistroSchema),
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        role: 'SOCIO',
        socio: {
          nombre: data.nombre,
          apellido: data.apellido,
          dni: Number(data.dni),
          fechaNacimiento: data.fechaNacimiento,
          sexo: data.sexo,
          pais: data.pais,
          fotoCarnet: null,
        }
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, payload);

      if (response.data.success) {
        alert('¡Registro exitoso!');
        navigate('/socios');
      } else {
        setError("root", {
          type: "manual",
          message: response.data.message || 'Error en el registro',
        });
      }
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || 'No se pudo completar el registro',
      });
    }
  };

  return (
    <>
      <Header />
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="p-4 shadow" style={{ borderRadius: '15px' }}>
            <h3 className="text-center mb-4 text-success">Registrar Socio</h3>

            {errors.root?.message && (
              <div className="alert alert-danger" role="alert">
                {errors.root?.message}
              </div>
            )}

            <Form noValidate onSubmit={handleSubmit (onSubmit)}>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese su nombre"
                    {...register("nombre")}
                  />
                  {errors.nombre && <small className="text-danger">{errors.nombre.message}</small>}
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationApellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese su apellido"
                    {...register("apellido")}
                  />
                  {errors.apellido && <small className="text-danger">{errors.apellido.message}</small>}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationDNI">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese su DNI"
                    {...register("dni")}
                  />
                  {errors.dni && <small className="text-danger">{errors.dni.message}</small>}
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Ingrese su email"
                    {...register("email")}
                  />
                  {errors.email && <small className="text-danger">{errors.email.message}</small>}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationFechaNacimiento">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    {...register("fechaNacimiento")}
                  />
                  {errors.fechaNacimiento && <small className="text-danger">{errors.fechaNacimiento.message}</small>}
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationSexo">
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select
                    {...register("sexo")}
                  >
                    <option value="">Seleccione</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="OTRO">Otro</option>
                  </Form.Select>
                  {errors.sexo && <small className="text-danger">{errors.sexo.message}</small>}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationPais">
                  <Form.Label>País</Form.Label>
                  <Form.Select
                    {...register("pais")}
                  >
                    <option value="">Seleccione un país</option>
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
                  {errors.pais && <small className="text-danger">{errors.pais.message}</small>}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      required
                      type={mostrarPassword ? 'text' : 'password'}
                      placeholder="Defina su contraseña"
                      {...register("password")}   
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                    >
                      {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                    </Button>
                  </InputGroup>
                  {errors.password && (   
                    <small className="text-danger">{errors.password.message}</small>
                  )}
                </Form.Group>
              </Row>


              <Button type="submit" disabled={isSubmitting} className="w-100" style={{ backgroundColor: '#198754' }}>
                {isSubmitting ? 'Registrando...' : 'Registrarme'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Registrarse;
