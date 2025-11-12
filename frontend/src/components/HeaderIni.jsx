import '../styles/Header.css';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import logo from '../assets/forever.png';


function Header() {
  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container>
        <Navbar.Brand className="d-flex align-items-center gap-2">
          <Image src={logo} height="70" />
          <span>CLUB SOCIAL CULTURAL Y DEPORTIVO FOR EVER </span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;