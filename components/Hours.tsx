interface ScheduleItem {
  day: string;
  time: string;
  highlight?: boolean;
  closed?: boolean;
}

interface HoursProps {
  schedule: ScheduleItem[];
  phone1: string;
  phone2: string;
  email: string;
}

export default function Hours({ schedule, phone1, phone2, email }: HoursProps) {
  return (
    <section className="section" id="hours">
      <div className="container">
        <h2 className="section-title fade-in">진료 안내</h2>
        <p className="section-subtitle fade-in">편리한 시간에 방문하세요</p>
        <div className="hours-wrapper">
          <div className="hours-table-wrap fade-in-left">
            <table className="hours-table">
              <thead>
                <tr>
                  <th>요일</th>
                  <th>진료시간</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, i) => (
                  <tr
                    key={i}
                    className={row.highlight ? "highlight" : row.closed ? "closed" : undefined}
                  >
                    <td>{row.day}</td>
                    <td>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="hours-contact fade-in-right">
            <h3>전화 예약</h3>
            <div className="hours-phone">
              <a href={`tel:${phone1}`}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                {phone1}
              </a>
              <a href={`tel:${phone2}`}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                {phone2}
              </a>
            </div>
            <p className="hours-phone-sub">* 목요일은 야간 21시까지 진료합니다</p>
            <div className="hours-contact-info">
              <p>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
