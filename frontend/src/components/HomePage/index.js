import React, { useEffect, useState, useRef } from 'react';
import Navigation from '../Navigation';
import PointForm from '../PointForm';
import PointExamples from '../PointExamples';
import Footer from '../Footer';
import './HomePage.css';

export default function HomePage() {
    return (
        <div>
            <Navigation />

            <div className='home-container'>
                <h1 className='home-header syne'>Welcome to my Fetch Challenge</h1>
                <h2>See how many points you could earn today!</h2>
            </div>

            <PointForm />

            <PointExamples />

            <Footer />
        </div>
    )
}