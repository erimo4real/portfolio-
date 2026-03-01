import { useEffect, useState } from "react";
import { getResume } from "../application/getResume.js";

export default function ResumeView() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const r = await getResume();
        setData(r);
        setStatus("succeeded");
      } catch {
        setStatus("failed");
      }
    })();
  }, []);

  if (status === "loading") return <div>Loading resume...</div>;
  if (status === "failed") return <div>Failed to load resume</div>;
  if (!data || !data.path) return <div>No resume available</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Resume</h2>
      <p>Version: {data.version || "N/A"}</p>
      <a href={data.path} download>Download PDF</a>
      <iframe title="resume" src={data.path} style={{ width: "100%", height: 600, border: "1px solid #ddd", marginTop: 12 }} />
    </div>
  );
}
