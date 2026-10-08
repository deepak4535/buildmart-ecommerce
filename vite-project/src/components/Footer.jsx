function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3>Construction Material Workplace</h3>
          <p>
            Your trusted online marketplace for quality construction
            materials at affordable prices.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <p>Cement</p>
          <p>Steel & TMT Bars</p>
          <p>Bricks & Blocks</p>
          <p>Tiles</p>
          <p>Tools & Hardware</p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 support@constructionworkplace.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Andhra Pradesh, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Construction Material Workplace. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;