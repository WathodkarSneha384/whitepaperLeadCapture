import React, { useState, type JSX, useRef } from "react";
import './style.css';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

type FormState = {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  company: "",
  jobTitle: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function App(): JSX.Element {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [downloadVisible, setDownloadVisible] = useState(false);
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [downloaded, setDownloaded] = useState(false);  // New state to track if downloaded

  // Ref to the summary section to capture in PDF
  const pdfRef = useRef<HTMLDivElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  }

  function validate(values: FormState) {
    const err: Partial<FormState> = {};
    if (!values.fullName.trim()) err.fullName = "Full name is required.";
    if (!values.email.trim()) err.email = "Email is required.";
    else if (!EMAIL_REGEX.test(values.email)) err.email = "Enter a valid email.";
    if (!values.company.trim()) err.company = "Company is required.";
    if (!values.jobTitle.trim()) err.jobTitle = "Job title is required.";
    return err;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmittedOnce(true);
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDownloadVisible(true);
      setForm(initialForm);
      setDownloaded(false);  // Reset downloaded state on new submission
    }, 700);
  }
//https://drive.google.com/drive/folders/1NktsoFip0h6B6-mbS6AeEcwMf-Khggy5?usp=sharing
  // Generate styled PDF using html2canvas + jsPDF
  const generatePDF = async () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;

    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      scale: 2,           // increase resolution
      useCORS: true,      // handle external images
    });
    const imgData = canvas.toDataURL("image/png");

    // Create jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("whitepaper.pdf");
    setDownloaded(true);  // Disable the button after download
  };

  return (
    <div className="page">
      <main className="layout" role="main">
        <section className="summary" aria-labelledby="summary-heading" ref={pdfRef}>
          <h1 id="summary-heading">Edge AI: Executive Brief</h1>
          <p className="lead">
            This white paper explores how Edge AI is changing product architectures by moving machine learning inference
            closer to devices. Benefits include lower latency, improved privacy, reduced bandwidth costs, and more
            resilient offline experiences. The paper covers deployment patterns, model optimisation techniques, and
            monitoring strategies for production.
          </p>

          <h2>Why read this white paper?</h2>
          <ul>
            <li>Understand trade-offs between cloud and edge inference</li>
            <li>Practical model optimization patterns (quantization, pruning)</li>
            <li>Operational guidance for updates & observability</li>
            <li>Business ROI examples and measurement approach</li>
          </ul>

          <h2>Key Concepts in Edge AI</h2>
          <p>
            Edge AI refers to the deployment of artificial intelligence algorithms directly on edge devices, such as smartphones, IoT sensors, and embedded systems, rather than relying on centralized cloud servers. This paradigm shift enables real-time processing, minimizes data transmission, and enhances user privacy by keeping sensitive information local.
          </p>
          <p>
            Core components include model compression techniques like quantization (reducing model precision), pruning (removing unnecessary parameters), and knowledge distillation (transferring knowledge from larger models to smaller ones). These methods ensure that AI models can run efficiently on resource-constrained devices without sacrificing accuracy.
          </p>

          <h2>Deployment Patterns</h2>
          <ul>
            <li><strong>On-Device Inference:</strong> Models run entirely on the device, ideal for offline scenarios like voice assistants or autonomous drones.</li>
            <li><strong>Hybrid Approaches:</strong> Combine edge processing with cloud fallback for complex tasks, balancing performance and cost.</li>
            <li><strong>Federated Learning:</strong> Train models across multiple devices without sharing raw data, preserving privacy in distributed environments.</li>
          </ul>

          <h2>Challenges and Solutions</h2>
          <p>
            Implementing Edge AI comes with challenges such as limited computational power, battery constraints, and security risks. Solutions include hardware accelerators (e.g., TPUs, NPUs), secure enclaves for data protection, and continuous model updates via over-the-air (OTA) mechanisms.
          </p>
          <p>
            Monitoring and observability are crucial for production deployments. Techniques like edge-side logging, anomaly detection, and performance metrics help maintain model reliability and user trust.
          </p>

          <h2>Business Impact and ROI</h2>
          <p>
            Organizations adopting Edge AI report significant benefits, including up to 50% reduction in latency for real-time applications and substantial savings on cloud bandwidth. Case studies from industries like healthcare (remote diagnostics), manufacturing (predictive maintenance), and retail (personalized shopping experiences) demonstrate measurable ROI through improved efficiency and customer satisfaction.
          </p>
          <p>
            To measure success, track metrics such as inference speed, energy consumption, and user engagement. This white paper provides a framework for evaluating Edge AI investments and scaling implementations across enterprises.
          </p>

          <h2>Future Trends</h2>
          <p>
            As 5G and beyond networks expand, Edge AI will integrate with advanced connectivity for seamless device-to-device communication. Emerging technologies like neuromorphic computing and AI chips promise even greater efficiency. Stay ahead by exploring these trends in the full white paper.
          </p>
        </section>

        <aside className="formPanel" aria-labelledby="form-heading">
          <h2 id="form-heading">Get the Full White Paper</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "err-fullName" : undefined}
                required
              />
              {errors.fullName && <div id="err-fullName" className="error">{errors.fullName}</div>}
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
                required
              />
              {errors.email && <div id="err-email" className="error">{errors.email}</div>}
            </div>

            <div className="field">
              <label htmlFor="company">Company Name</label>
              <input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Acme, Inc."
                aria-invalid={!!errors.company}
                aria-describedby={errors.company ? "err-company" : undefined}
                required
              />
              {errors.company && <div id="err-company" className="error">{errors.company}</div>}
            </div>

            <div className="field">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                id="jobTitle"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="Product Manager"
                aria-invalid={!!errors.jobTitle}
                aria-describedby={errors.jobTitle ? "err-jobTitle" : undefined}
                required
              />
              {errors.jobTitle && <div id="err-jobTitle" className="error">{errors.jobTitle}</div>}
            </div>

            <div className="actions">
              <button type="submit" className="btn" disabled={submitting}>
                {submitting ? "Preparing..." : "Get the White Paper"}
              </button>
            </div>
          </form>

          {submittedOnce && !downloadVisible && Object.keys(errors).length > 0 && (
            <div className="form-note" role="alert" aria-live="polite">
              Please fix the highlighted fields to continue.
            </div>
          )}

          {downloadVisible && (
            <div className="downloadPanel" role="status" aria-live="polite">
              <p className="success">Thanks! Your download is ready.</p>
              <button className="downloadLink" onClick={generatePDF} disabled={downloaded}>
                {downloaded ? "Downloaded" : "Download White Paper (Styled PDF)"}
              </button>
            </div>
          )}
        </aside>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} EdgeAI Research • Frontend-only demo</small>
      </footer>
    </div>
  );
}
