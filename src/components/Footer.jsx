import React from "react";
import './Footer.css'

const FooterPage = () => {
  return (
    <footer>
      <div className="footers">
          <div className="footer-content">
              <div className="footer-opt">
                  <a className="footer-main">Principles</a>
              </div>
              <div className="footer-opt">
                  <a className="footer-main">Pricing</a>
                  <div className="sub-footer-content">
                      <a>Surge pricing</a>
                      <a>Upfront pricing</a>
                      <a>Route-based pricing</a>
                      <a>Driver promotions</a>
                      <a>Uber services fee</a>
                  </div>
              </div>
              <div className="footer-opt">
                  <a className="footer-main">Matching</a>
                  <div className="sub-footer-content">
                      <a>Shared rides</a>
                  </div>
              </div>
              <div className="footer-opt">
                  <a className="footer-main">Open marketplace</a>
                  <div className="sub-footer-content">
                      <a>Marketplace health</a>
                      <a>New product pilots</a>
                  </div>
              </div>
              <div className="footer-opt">
              </div>
          </div>
          <div className="find-us">
              <a className="footer-main">Latest news</a>
              <a className="footer-main">Careers</a>
              <a className="footer-main">Follow us</a>
              <div className="socmed">
                  <a><i className="fab fa-facebook-f"></i></a>
                  <a><i className="fab fa-twitter"></i></a>
                  <a><i className="fab fa-linkedin-in"></i></a>
                  <a><i className="fab fa-instagram"></i></a>
              </div>
          </div>
      </div>
      <div className="copyright">
          <p>© 2020 JoinTrip Technologies Inc.</p>
      </div>
    </footer>
  );
}

export default FooterPage;