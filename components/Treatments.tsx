export default function Treatments() {
  const treatments = [
    { emoji: "\uD83E\uDDB7", title: "임플란트", desc: "덴티움 임플란트와 MYPLANT 3D 맞춤 보철로 자연치아 같은 결과를 만듭니다." },
    { emoji: "\uD83D\uDE01", title: "치아교정", desc: "투명교정, 데이몬교정, 자가결찰 브라켓 등 다양한 교정 방법을 제공합니다." },
    { emoji: "\u2728", title: "무통 스케일링", desc: "스위스 EMS 에어플로우 장비로 통증 없이 쾌적한 스케일링을 받으실 수 있습니다." },
    { emoji: "\uD83D\uDC8E", title: "치아미백", desc: "전문 미백과 자가 미백을 통해 밝고 환한 미소를 되찾아 드립니다." },
    { emoji: "\uD83C\uDFE5", title: "일반 치과", desc: "충치치료, 신경치료, 보존치료 등 전반적인 치과 진료를 꼼꼼하게 시행합니다." },
  ];

  return (
    <section className="section treatments" id="treatments">
      <div className="container">
        <h2 className="section-title fade-in">진료 분야</h2>
        <p className="section-subtitle fade-in">임플란트부터 교정, 미백까지 종합 치과 진료</p>
        <div className="treatments-grid">
          {treatments.map((t, i) => (
            <div key={i} className="treatment-card fade-in">
              <span className="treatment-emoji">{t.emoji}</span>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
