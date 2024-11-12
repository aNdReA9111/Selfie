import { Container } from 'react-bootstrap';
import '../css/auth.css';
import '../css/about.css';
import { BsGithub, BsEnvelope } from 'react-icons/bs';

function About() {
    const developers = [
        {
            name: "Fiorellino Andrea",
            matricola: "0001089150",
            email: "andrea.fiorellino@studio.unibo.it"
        },
        {
            name: "Po Leonardo",
            matricola: "0001069156",
            email: "leonardo.po@studio.unibo.it"
        },
        {
            name: "Silvestri Luca",
            matricola: "0001080369",
            email: "luca.silvestri9@studio.unibo.it"
        }
    ];

    return (
        <div className="auth-container">
            <Container className="auth-box p-5">
                <div className="about-content text-center">
                    <h1 className="auth-title mb-4">Chi Siamo? 🤔</h1>
                    
                    <div className="about-section mb-5">
                        <h2 className="h4 text-danger mb-3">La Storia di Selfie 📚</h2>
                        <p>
                            Nato da studenti disperati per studenti disperati, Selfie è il tuo compagno 
                            di università che avresti sempre voluto avere (ma che probabilmente non ti meriti 😉).
                        </p>
                    </div>

                    <div className="about-section mb-5">
                        <h2 className="h4 text-danger mb-3">Cosa Facciamo? 🎯</h2>
                        <div className="feature-list">
                            <p>📅 <strong>Calendario:</strong> Perché ricordarsi le scadenze è sopravvalutato</p>
                            <p>📝 <strong>Note:</strong> Per tutti gli appunti che non rileggerai mai</p>
                            <p>⏰ <strong>Pomodoro Timer:</strong> Per fingere di essere produttivi</p>
                            <p>💬 <strong>Chat:</strong> Per lamentarsi dei professori e organizzare il prossimo aperitivo 🍹</p>
                        </div>
                    </div>

                    <div className="about-section mb-5">
                        <h2 className="h4 text-danger mb-3">Perché Selfie? 🤳</h2>
                        <p>
                            Perché come un selfie cattura un momento, noi catturiamo il caos della vita universitaria 
                            e lo trasformiamo in... beh, caos organizzato!
                        </p>
                    </div>

                    <div className="about-section">
                        <h2 className="h4 text-danger mb-3">Tecnologie Utilizzate 🛠️</h2>
                        <p className="tech-stack">
                            React + TypeScript + Node.js + MongoDB + ☕ Tanto caffè
                        </p>
                    </div>

                    <div className="about-section credits-section">
                        <h2 className="h4 text-danger mb-4">Gli Sviluppatori 👨‍💻</h2>
                        
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
                                Visita la repository su GitHub
                            </a>
                        </div>
                    </div>

                    <footer className="mt-5 pt-4 border-top">
                        <p className="text-muted">
                            Creato con ❤️ (e tanta disperazione) per il corso di Tecnologie Web 2023/24
                        </p>
                        <p className="text-muted small">
                            Nessuno studente è stato maltrattato durante lo sviluppo di questa app*
                            <br/>
                            <small>*forse</small>
                        </p>
                    </footer>
                </div>
            </Container>
        </div>
    );
}

export default About;