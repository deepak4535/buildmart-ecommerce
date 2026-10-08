import { useState } from "react";
import {
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { contactApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!formData.subject.trim()) {
      setErrorMessage("Please enter a subject.");
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage("Please enter your message.");
      return;
    }

    try {
      setSubmitting(true);

      const messageData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        userId: user?.id || null,
        createdAt: new Date().toISOString(),
        status: "New",
      };

      await contactApi.sendMessage(messageData);

      setSuccessMessage(
        "Your message has been sent successfully. Our team will get back to you soon."
      );

      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending contact message:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to send your message. Please make sure JSON Server is running and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-page-header">
        <div>
          <p className="contact-page-label">
            GET IN TOUCH
          </p>

          <h1>Contact Us</h1>

          <p>
            Have questions about construction materials,
            orders, delivery, or our services? We are here
            to help.
          </p>
        </div>
      </div>

      <div className="contact-layout">
        <div className="contact-information">
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <Phone size={22} />
            </div>

            <div>
              <span>Call Us</span>

              <strong>+91 98765 43210</strong>

              <p>
                Monday to Saturday, 9:00 AM – 6:00 PM
              </p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <Mail size={22} />
            </div>

            <div>
              <span>Email Us</span>

              <strong>
                support@constructionworkplace.com
              </strong>

              <p>
                We usually respond within one business day.
              </p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <MapPin size={22} />
            </div>

            <div>
              <span>Our Location</span>

              <strong>
                Construction Material Workplace
              </strong>

              <p>
                Hyderabad, Telangana, India
              </p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <Clock size={22} />
            </div>

            <div>
              <span>Business Hours</span>

              <strong>
                Monday – Saturday
              </strong>

              <p>
                9:00 AM – 6:00 PM
              </p>
            </div>
          </div>

          <div className="contact-help-card">
            <MessageSquare size={25} />

            <div>
              <h3>Need Help With an Order?</h3>

              <p>
                If you already placed an order, you can
                check its status from your Orders page.
              </p>

              <Link to="/orders">
                View My Orders
              </Link>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <div className="contact-form-header">
            <div className="contact-form-icon">
              <MessageSquare size={22} />
            </div>

            <div>
              <h2>Send Us a Message</h2>

              <p>
                Fill out the form below and our team will
                contact you.
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="contact-success-message">
              <CheckCircle size={19} />

              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="contact-error-message">
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="contact-form-grid">
              <div className="contact-form-group">
                <label htmlFor="contact-name">
                  Full Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-email">
                  Email Address
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="contact-form-grid">
              <div className="contact-form-group">
                <label htmlFor="contact-phone">
                  Phone Number
                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-subject">
                  Subject
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What can we help you with?"
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-message">
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="7"
              />
            </div>

            <button
              type="submit"
              className="contact-submit-button"
              disabled={submitting}
            >
              <Send size={18} />

              {submitting
                ? "Sending..."
                : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;