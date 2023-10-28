import { useState, useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../HomePage';
import NotFound from '../NotFound';

export default function Main() {
    return (
        <main>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
    )
}