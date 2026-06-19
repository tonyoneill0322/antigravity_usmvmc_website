import React, { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceBranch: '',
    bikeInfo: '',
    message: ''
  })
  const [feedback, setFeedback] = useState({ text: '', type: '' })
  const containerRef = useRef(null)
  const formRef = useRef(null)
  const reqBoxRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    )

    gsap.fromTo(reqBoxRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    )
  }, { scope: containerRef })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      setFeedback({
        text: 'Please fill out all required fields.',
        type: 'error'
      })
      return
    }

    setFeedback({
      text: 'APPLICATION SUBMITTED SUCCESSFULLY. A club officer will review your details and contact you shortly. Ride Safe.',
      type: 'success'
    })

    // Reset form
    setFormData({
      name: '',
      email: '',
      serviceBranch: '',
      bikeInfo: '',
      message: ''
    })
  }

  return (
    <div ref={containerRef}>
      <section className="section">
        <div className="contact-grid">
          {/* Form Section */}
          <div ref={formRef}>
            <h2>Contact & Application</h2>
            <p style={{ marginBottom: '2rem' }}>
              To contact a local officer or begin the prospecting process to join the USMV MC, please fill out the form below. For membership applications, ensure you meet the requirements on the right.
            </p>

            <form onSubmit={handleSubmit} id="join-form">
              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="John 'Slick' Doe"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              {/* Service Branch */}
              <div className="form-group">
                <label htmlFor="service-branch">Military Service Branch</label>
                <select
                  id="service-branch"
                  name="serviceBranch"
                  value={formData.serviceBranch}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">-- Select Branch (If applying to join) --</option>
                  <option value="army">U.S. Army</option>
                  <option value="navy">U.S. Navy</option>
                  <option value="marines">U.S. Marine Corps</option>
                  <option value="airforce">U.S. Air Force</option>
                  <option value="coastguard">U.S. Coast Guard</option>
                  <option value="spaceforce">U.S. Space Force</option>
                  <option value="active_duty">Active Duty (Any Branch)</option>
                  <option value="other">Non-Vet (Supporter Interest)</option>
                </select>
              </div>

              {/* Motorcycle details */}
              <div className="form-group">
                <label htmlFor="bike-info">Motorcycle Brand & Displacement</label>
                <input
                  type="text"
                  id="bike-info"
                  name="bikeInfo"
                  value={formData.bikeInfo}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., Harley-Davidson Softail (1690cc)"
                />
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="message">Message / Application Statement *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Tell us about yourself, your service background, and why you want to ride with USMV MC..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                id="submit-contact"
              >
                Submit Application
              </button>

              {/* Success/Error Message container */}
              {feedback.text && (
                <div 
                  id="form-feedback" 
                  className={`form-feedback ${feedback.type}`}
                  style={{ display: 'block' }}
                >
                  {feedback.text}
                </div>
              )}
            </form>
          </div>

          {/* Requirements Block */}
          <div ref={reqBoxRef}>
            <div className="requirements-box">
              <h3 id="req-heading">Membership Requirements</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                USMV MC is a traditional MC. Prospecting is a process built on commitment, honor, and time on the road. The minimum entry standards are:
              </p>
              <ul className="requirements-list">
                <li>
                  <strong>Military Service</strong>: Must be a current active-duty service member or a veteran discharged
                  honorably (DD-214 verification required).
                </li>
                <li>
                  <strong>Cruiser Bike</strong>: Must own and ride a cruiser-style motorcycle with an engine capacity of 750cc
                  or greater.
                </li>
                <li>
                  <strong>License & Insurance</strong>: Must possess a valid motorcycle license (with proper state
                  endorsement) and valid liability insurance.
                </li>
                <li>
                  <strong>Brotherhood</strong>: Willingness to pledge loyalty to the club, participate in weekly meetings,
                  and attend charity support runs.
                </li>
                <li>
                  <strong>Drug Policy</strong>: We adhere to clean and sober riding standards; respect for road safety is
                  absolute.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
