import { Container } from 'react-bootstrap';
import { BsEnvelope, BsGithub } from 'react-icons/bs';
import '../css/about.css';

function About() {
    const developers = [
        {
            name: "Fiorellino Andrea",
            matricola: "1089150",
            email: "andrea.fiorellino@studio.unibo.it"
        },
        {
            name: "Po Leonardo",
            matricola: "1069156",
            email: "leonardo.po@studio.unibo.it"
        },
        {
            name: "Silvestri Luca",
            matricola: "1080369",
            email: "luca.silvestri9@studio.unibo.it"
        }
    ];

    return (
        <div className="auth-container">
            <Container fluid className="auth-box p-3 p-md-5">
                <div className="about-content text-center">
                    <h1 className="auth-title mb-4">Chi Siamo? 🤔</h1>

                    <div className="about-section mb-4 mb-md-5">
                        <h2 className="h4 text-danger mb-3">La Storia di Selfie 📚</h2>
                        <p>
                        Created by desperate students for desperate students, Selfie is the university 
                        buddy you always wanted to have (but probably don't deserve 😉).
                        </p>
                    </div>

                    <div className="about-section mb-4 mb-md-5">
                        <h2 className="h4 text-danger mb-3">What do we do? 🎯</h2>
                        <div className="feature-list">
                            <p>📅 <strong>Calendar:</strong> Because remembering deadlines Is overrated</p>
                            <p>📝 <strong>Notes:</strong> For all the notes you'll never reread</p>
                            <p>⏰ <strong>Pomodoro Timer:</strong> To appear to be productive</p>
                            <p>💬 <strong>Chat:</strong> To complain about the lecturers and organize the next aperitif 🍹</p>
                        </div>
                    </div>

                    <div className="about-section mb-4 mb-md-5">
                        <h2 className="h4 text-danger mb-3">Why Selfie? 🤳</h2>
                        <p>
                        Because just as a selfie captures a moment, we capture the chaos of university life
                        and turn it into... well, organized chaos!
                        </p>
                    </div>

                    <div className="about-section">
                        <h2 className="h4 text-danger mb-3">Technologies Used 🛠️</h2>
                        <p className="tech-stack">
                            React + TypeScript + Node.js + MongoDB + ☕ lots of coffee
                        </p>
                    </div>

                    <div className="about-section credits-section">
                        <h2 className="h4 text-danger mb-4">Developers 👨‍💻</h2>

                        <div className="developers-grid">
                            {developers.map((dev, index) => (
                                <div key={index} className="developer-card">
                                    <h3 className="developer-name">{dev.name}</h3>
                                    <p className="developer-matricola">Matricola: {dev.matricola}</p>
                                    <a
                                        href={`mailto:${dev.email}`}
                                        className="developer-email"
                                    >
                                        <BsEnvelope className="me-2" />
                                        {dev.email}
                                    </a>
                                </div>
                            ))}
                        </div>

                        <div className="github-section mt-4">
                            <a
                                href="https://github.com/aNdReA9111/Selfie.git"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="github-link"
                            >
                                <BsGithub className="me-2" />
                                See our repo on GitHub
                            </a>
                        </div>
                    </div>

                    <footer className="mt-5 pt-4 border-top">
                        <p className="text-muted">
                            Created with ❤️ (and a lot of desperation) for the "Tecnologie Web" course 2023/24
                        </p>
                        <p className="text-muted small">
                                No students were harmed during the development of this app*
                            <br />
                            <small>*maybe</small>
                        </p>
                    </footer>
                </div>
            </Container>
        </div>
    );
}

export default About;
