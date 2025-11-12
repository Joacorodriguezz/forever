import { useState } from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Header from '../components/Header';
import '../styles/Contacto.css';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío exitoso
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setFormData({ nombre: '', email: '', mensaje: '' });
    }, 3000);
  };

  const enviarWhatsApp = (numero) => {
    const mensaje = formData.mensaje || '¡Hola! Me gustaría obtener más información sobre el club.';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Header />
      <div className="contacto-page">
        <div className="contacto-container">
          <div className="contacto-header">
            <h1>Contacto</h1>
            <p>Estamos aquí para ayudarte. Contactanos por el medio que prefieras.</p>
          </div>

          {/* Sección de WhatsApp */}
          <div className="whatsapp-section">
            <h2><WhatsAppIcon /> Contáctanos por WhatsApp</h2>
            <p className="whatsapp-subtitle">Escribinos directamente y te responderemos a la brevedad</p>
            <div className="whatsapp-buttons">
              <button 
                className="whatsapp-btn"
                onClick={() => enviarWhatsApp('542214266684')}
              >
                <PhoneIcon /> 221 426-6684
              </button>
              <button 
                className="whatsapp-btn"
                onClick={() => enviarWhatsApp('542215585761')}
              >
                <PhoneIcon /> 221 558-5761
              </button>
            </div>
          </div>

          {/* Formulario de Contacto Web */}
          <div className="formulario-section">
            <h2><EmailIcon /> Envíanos un Mensaje</h2>
            <form className="contacto-form" onSubmit={handleSubmit}>
              {enviado && (
                <div className="mensaje-exito">
                  ✓ ¡Mensaje enviado exitosamente! Te contactaremos pronto.
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              <button type="submit" className="submit-btn">
                <SendIcon /> Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Redes Sociales */}
          <div className="redes-section">
            <h2>Seguinos en Redes</h2>
            <div className="redes-grid">
              <a 
                href="https://share.google/aOjoodw0n41FFuXM3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="red-social instagram"
              >
                <InstagramIcon />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.facebook.com/ACyDUniversal/?locale=es_LA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="red-social facebook"
              >
                <FacebookIcon />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Mapa de Ubicación */}
          <div className="ubicacion-section">
            <h2><LocationOnIcon /> Encontranos</h2>
            <div className="mapa-container">
              <iframe 
                title="Mapa Club Universal"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.831111884651!2d-57.96506657563219!3d-34.93577237510814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e87e3ba5fa4f%3A0x985b898e98e583d3!2sAsociaci%C3%B3n%20Cultural%20y%20Deportiva%20Universal!5e0!3m2!1ses!2sar!4v1756912101971!5m2!1ses!2sar"
                width="100%" 
                height="400" 
                style={{ border: 0, borderRadius: '12px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contacto;
