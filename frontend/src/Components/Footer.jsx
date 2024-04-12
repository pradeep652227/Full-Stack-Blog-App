import React from "react";
export default function Footer() {
  let footer_img_styles = {
    width: "50px",
    height: "50px",
  };
  let footer_right_headings_classes="block mb-2 text-xl text-gray-400";
  return (
    <footer id="main-footer" className="border-t-2 py-2">
      <div style={{ width: "98vw" }} className="mx-auto flex flex-wrap justify-around md:justify-between">
        <div id="footer-logo">
          <img
            style={footer_img_styles}
            src="https://cdn.pixabay.com/photo/2014/04/02/10/16/fire-303309_1280.png"
          />
        </div>
        <div id="footer-right" className="grid gap-x-12 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div>
                <span id="footer-list-heading" className={footer_right_headings_classes}>Company</span>
                <ul>
                    <li className="mb-1">Features</li>
                    <li className="mb-1">Pricing</li>
                    <li className="mb-1">Affiliate Program</li>
                    <li>Press Kit</li>
                </ul>
            </div>
            <div>
            <span id="footer-list-heading" className={footer_right_headings_classes}>Support</span>
                <ul>
                    <li className="mb-1">Account</li>
                    <li className="mb-1">Help</li>
                    <li className="mb-1">Contact Us</li>
                    <li>Customer Support</li>
                </ul>
            </div>
            <div>
            <span id="footer-list-heading" className={footer_right_headings_classes}>Legals</span>
                <ul>
                    <li className="mb-1">Terms & Conditions</li>
                    <li className="mb-1">Privacy Policy</li>
                    <li>Licensing</li>
                </ul>
            </div>
        </div>
      </div>
    </footer>
  );
}
