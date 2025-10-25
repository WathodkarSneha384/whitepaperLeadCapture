import React, { useState, useRef, useEffect, type JSX } from "react";
import "./style.css";
import "./App.css";
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
  const [downloaded, setDownloaded] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Responsive: detect if screen is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      setDownloaded(false);
    }, 700);
  }

 const generatePDF = async () => {
  const element = pdfRef.current;
  if (!element) return;

  // Temporarily hide the form (TypeScript-safe)
  const forms = document.querySelectorAll(".formPanel");
  forms.forEach(f => {
    (f as HTMLElement).style.display = "none";
  });

  try {
    // Capture the content as canvas
    const canvas = await html2canvas(element, {
      scale: 2,          // higher scale = better resolution
      useCORS: true,     // for external images
      scrollY: -window.scrollY,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Save the PDF
    pdf.save("EdgeAI_Whitepaper.pdf");
  } catch (err) {
    console.error("Error generating PDF:", err);
  } finally {
    // Restore the form display after PDF generation
    forms.forEach(f => {
      (f as HTMLElement).style.display = "";
    });
  }
};





  // Shared Form Component
  const LeadForm = (
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
            required
          />
          {errors.fullName && <div className="error">{errors.fullName}</div>}
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
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="field">
          <label htmlFor="company">Company Name</label>
          <input
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Acme, Inc."
            required
          />
          {errors.company && <div className="error">{errors.company}</div>}
        </div>

        <div className="field">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            id="jobTitle"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="Product Manager"
            required
          />
          {errors.jobTitle && <div className="error">{errors.jobTitle}</div>}
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
            {downloaded ? "Downloaded" : "Download White Paper"}
          </button>
        </div>
      )}
    </aside>
  );

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

          {/* Show the form here on mobile screens */}
          {isMobile && LeadForm}

          <h2>Why Read This White Paper?</h2>
          <ul>
            <li>Understand trade-offs between cloud and edge inference</li>
            <li>Learn model optimization techniques like pruning and quantization</li>
            <li>See operational guidance for monitoring and observability</li>
            <li>Explore real-world business ROI examples</li>
          </ul>

          <h2>Key Concepts in Edge AI</h2> <p> Edge AI refers to the deployment of artificial intelligence algorithms directly on edge devices, such as smartphones, IoT sensors, and embedded systems, rather than relying on centralized cloud servers. This paradigm shift enables real-time processing, minimizes data transmission, and enhances user privacy by keeping sensitive information local. </p> <p> Core components include model compression techniques like quantization (reducing model precision), pruning (removing unnecessary parameters), and knowledge distillation (transferring knowledge from larger models to smaller ones). These methods ensure that AI models can run efficiently on resource-constrained devices without sacrificing accuracy. </p> <h2>Deployment Patterns</h2> <ul> <li><strong>On-Device Inference:</strong> Models run entirely on the device, ideal for offline scenarios like voice assistants or autonomous drones.</li> <li><strong>Hybrid Approaches:</strong> Combine edge processing with cloud fallback for complex tasks, balancing performance and cost.</li> <li><strong>Federated Learning:</strong> Train models across multiple devices without sharing raw data, preserving privacy in distributed environments.</li> </ul> <h2>Challenges and Solutions</h2> <p> Implementing Edge AI comes with challenges such as limited computational power, battery constraints, and security risks. Solutions include hardware accelerators (e.g., TPUs, NPUs), secure enclaves for data protection, and continuous model updates via over-the-air (OTA) mechanisms. </p> <p> Monitoring and observability are crucial for production deployments. Techniques like edge-side logging, anomaly detection, and performance metrics help maintain model reliability and user trust. </p> <h2>Business Impact and ROI</h2> <p> Organizations adopting Edge AI report significant benefits, including up to 50% reduction in latency for real-time applications and substantial savings on cloud bandwidth. Case studies from industries like healthcare (remote diagnostics), manufacturing (predictive maintenance), and retail (personalized shopping experiences) demonstrate measurable ROI through improved efficiency and customer satisfaction. </p> <p> To measure success, track metrics such as inference speed, energy consumption, and user engagement. This white paper provides a framework for evaluating Edge AI investments and scaling implementations across enterprises. </p> <h2>Future Trends</h2> <p> As 5G and beyond networks expand, Edge AI will integrate with advanced connectivity for seamless device-to-device communication. Emerging technologies like neuromorphic computing and AI chips promise even greater efficiency. Stay ahead by exploring these trends in the full white paper. </p> </section>

        {/* Show the form on the right side for desktop */}
        {!isMobile && LeadForm}
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} EdgeAI Research • Frontend-only demo</small>
      </footer>
    </div>
  );
}
