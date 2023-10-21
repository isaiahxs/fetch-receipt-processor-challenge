import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../LanguageContext';
import { englishContent, spanishContent } from './content';
import { Link, useLocation } from 'react-router-dom';
import black_dog from '../../assets/icons/black-dog.png';
import logo_footer from '../../assets/icons/logo-footer.png';
import hamburger from '../../assets/icons/hamburger.png';
import './Navigation.css'

export default function Navigation() {
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const content = currentLanguage === 'english' ? englishContent : spanishContent;
    const [lastScrollPos, setLastScrollPos] = useState(0);
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const location = useLocation();

    const navRef = useRef();
    const [isNavOpen, setIsNavOpen] = useState(false);


    const toggleLanguage = () => {
        setCurrentLanguage(currentLanguage === 'english' ? 'spanish' : 'english');
    };

    const toggleNavOpen = () => {
        setIsNavOpen(!isNavOpen);
    }

    useEffect(() => {
        if (isNavOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isNavOpen]);

    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (isNavOpen && navRef.current && !navRef.current.contains(e.target)) {
                setIsNavOpen(false);
            }
        };

        document.addEventListener("mousedown", checkIfClickedOutside);

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [isNavOpen]);


    const scrollToSection = (sectionId) => {
        setIsNavOpen(false);

        const sectionElement = document.getElementById(sectionId);
        if (sectionId === 'footer') {
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            const yOffset = -90;
            const topOffset = sectionElement.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: topOffset, behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className='nav-bar'>
            <div className='nav-options'>
                <div className='nav-logo-container'>
                    <img src={black_dog} className='small-logo' alt="Black Dog Logo" onClick={() => scrollToTop()} />
                </div>

                <div className='nav-name'>
                    Fetch Challenge
                </div>

                <div className='nav-logo-container'>
                    <img src={hamburger} className='small-logo hamburger-menu' alt='Hamburger Menu' onClick={toggleNavOpen} />
                </div>

                {isNavOpen && <div className='backdrop'></div>}

                <div ref={navRef} className={`nav-panel ${isNavOpen ? 'nav-open' : ''}`}>
                    <button className='x-button' onClick={toggleNavOpen}>X</button>

                    <div className='panel-buttons'>
                        <div>
                            <a href="https://www.isaiahxs.com/" target='_blank' rel='noopener noreferrer'>
                                <button className='nav-button panel-button'>
                                    <div>
                                        <p className='footer-icon-description'>
                                            Portfolio
                                        </p>
                                    </div>
                                </button>
                            </a>
                        </div>

                        <div>
                            <a href='https://www.linkedin.com/in/isaiahxs/' target='_blank' rel='noopener noreferrer'>
                                <button className='nav-button panel-button'>
                                    <div>
                                        <p className='footer-icon-description'>
                                            LinkedIn
                                        </p>
                                    </div>
                                </button>
                            </a>
                        </div>

                        <div>
                            <a href='https://github.com/isaiahxs' target='_blank' rel='noopener noreferrer'>
                                <button className='nav-button panel-button'>
                                    <div >
                                        <p className='footer-icon-description'>
                                            GitHub
                                        </p>
                                    </div>
                                </button>
                            </a>
                        </div>

                        <div>
                            <a href='https://wellfound.com/u/isaiahxs' target='_blank' rel='noopener noreferrer'>
                                <button className='nav-button panel-button'>
                                    <div >
                                        <p className='footer-icon-description'>
                                            Wellfound
                                        </p>
                                    </div>
                                </button>
                            </a>
                        </div>

                        {/* <div>
                            <button className='language-toggle-button panel-language-button' onClick={toggleLanguage}>
                                {currentLanguage === 'english' ? 'Español' : 'English'}
                            </button>
                        </div> */}

                        <div className='nav-logo-container'>
                            <img src={logo_footer} className='big-logo panel-logo' alt="Fetch Rewards Logo" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
