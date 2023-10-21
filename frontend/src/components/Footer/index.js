import { useLanguage } from '../../LanguageContext';
import { englishContent, spanishContent } from './content';
import { Link } from 'react-router-dom';
import logo from '../../assets/icons/logo-footer.png';
import './Footer.css';

export default function Footer() {
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const content = currentLanguage === 'english' ? englishContent : spanishContent;

    const scrollToSection = (sectionId) => {
        const sectionElement = document.getElementById(sectionId);
        sectionElement.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className='footer-container' id='footer' >
            <div className='footer-section'>
                <section className='logo-section'>
                    <img src={logo} className='big-logo' alt="Big Sin Fronteras Logo" onClick={() => scrollToTop()} />
                </section>

                <section className='second-footer-section'>
                    <ul className='footer-options-container'>
                        <li className='footer-heading'>
                            Fetch Challenge
                        </li>
                        <div className='footer-options'>
                            <li>
                                <a href="https://www.isaiahxs.com/" target='_blank' rel='noopener noreferrer'>
                                    <div className='footer-icon-container'>
                                        <p className='footer-icon-description'>
                                            Portfolio
                                        </p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href='https://www.linkedin.com/in/isaiahxs/' target='_blank' rel='noopener noreferrer'>
                                    <div className='footer-icon-container'>
                                        <p className='footer-icon-description'>
                                            LinkedIn
                                        </p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href='https://github.com/isaiahxs' target='_blank' rel='noopener noreferrer'>
                                    <div className='footer-icon-container'>
                                        <p className='footer-icon-description'>
                                            GitHub
                                        </p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href='https://wellfound.com/u/isaiahxs' target='_blank' rel='noopener noreferrer'>
                                    <div className='footer-icon-container'>
                                        <p className='footer-icon-description'>
                                            Wellfound
                                        </p>
                                    </div>
                                </a>
                            </li>
                        </div>
                    </ul>
                </section>
            </div >
            <div className='credits-container'>
                <p className='credits-created-by'>Created by:</p>
                <a href='https://www.isaiahxs.com/' target='_blank' rel='noopener noreferrer' className='isaiah'>
                    Isaiah Sinnathamby
                </a>
            </div>
        </footer >
    )
}
