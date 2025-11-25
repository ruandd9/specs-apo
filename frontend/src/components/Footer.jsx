import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Apostilas Online. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;