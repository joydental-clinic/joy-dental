import { urlFor } from "@/sanity/client";

interface Doctor {
  _id: string;
  name: string;
  title: string;
  tag: string;
  initial: string;
  image?: { asset: { _ref: string } };
  specialties: string[];
  order: number;
}

interface DoctorsProps {
  doctors: Doctor[];
}

export default function Doctors({ doctors }: DoctorsProps) {
  const tagLabel = (tag: string) => {
    if (tag === "implant") return "임플란트";
    if (tag === "ortho") return "교정";
    return "일반";
  };

  return (
    <section className="section" id="doctors">
      <div className="container">
        <h2 className="section-title fade-in">의료진 소개</h2>
        <p className="section-subtitle fade-in">각 분야 전문의가 책임지고 치료합니다</p>
        <div className="doctors-grid">
          {doctors.map((doc, i) => (
            <div
              key={doc._id}
              className={`doctor-card ${i === 0 ? "fade-in-left" : "fade-in-right"}`}
            >
              <div className="doctor-photo">
                {doc.image ? (
                  <img
                    src={urlFor(doc.image).width(600).url()}
                    alt={doc.name}
                    className="doctor-photo-img"
                  />
                ) : (
                  <div
                    className="doctor-photo-placeholder"
                    style={
                      doc.tag === "ortho"
                        ? { background: "linear-gradient(135deg, #9D174D, #EC4899)" }
                        : undefined
                    }
                  >
                    {doc.initial}
                  </div>
                )}
              </div>
              <div className="doctor-info">
                <span className={`doctor-tag ${doc.tag}`}>{tagLabel(doc.tag)}</span>
                <h3>{doc.name}</h3>
                <p
                  className="doctor-title"
                  style={doc.tag === "ortho" ? { color: "#9D174D" } : undefined}
                >
                  {doc.title}
                </p>
                <ul>
                  {doc.specialties.map((spec, j) => (
                    <li key={j}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
