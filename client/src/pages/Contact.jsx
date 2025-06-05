import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="py-5 text-center" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white'
      }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Contact Us</h1>
          <p className="lead">We'd Love to Hear From You</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Contact Information */}
          <div className="col-lg-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h3 className="h4 mb-4">Get in Touch</h3>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-circle" style={{
                      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                      color: 'white'
                    }}>
                      <i className="bi bi-geo-alt"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>Our Location</h5>
                    <p className="text-muted mb-0">Trade Tower, Thapathali, Kathmandu</p>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-circle" style={{
                      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                      color: 'white'
                    }}>
                      <i className="bi bi-telephone"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>Phone Number</h5>
                    <p className="text-muted mb-0">01-5971616 / 9801101924</p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-circle" style={{
                      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                      color: 'white'
                    }}>
                      <i className="bi bi-envelope"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>Email Address</h5>
                    <p className="text-muted mb-0">info@revcar.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h4 mb-4">Send Us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <label htmlFor="phone">Phone Number</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={handleChange}
                          style={{ height: '150px' }}
                          required
                        ></textarea>
                        <label htmlFor="message">Your Message</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary btn-lg" style={{
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        border: 'none'
                      }}>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.9012128585375!2d85.32174761506268!3d27.69338798280065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f4b310f97de!2sThapathali%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1647887574714!5m2!1sen!2snp"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact; 