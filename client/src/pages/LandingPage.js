import React from 'react';
import unicornLogo from '../../logo.svg';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-pastel-pink">
            <header className="bg-pastel-purple text-white py-4">
                <nav className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img src={unicornLogo} alt="doqa.io logo" className="h-12" />
                        <h1 className="text-2xl font-bold">doqa.io</h1>
                    </div>
                    <ul className="flex space-x-6">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/api" className="hover:underline">API</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </nav>
            </header>
            <main className="container mx-auto py-16">
                <section className="text-center">
                    <h2 className="text-5xl font-bold text-pastel-purple">Showcasing Excellence in QA</h2>
                    <p className="mt-4 text-gray-700 text-lg">
                        Explore how automated tests and quality assurance shape modern web apps.
                    </p>
                    <a href="/api" className="mt-6 inline-block bg-pastel-blue text-white py-3 px-6 rounded-lg shadow-lg hover:bg-pastel-blue-dark">
                        Explore the API
                    </a>
                </section>
                <section className="mt-16">
                    <div className="flex justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
                            <h3 className="text-3xl font-semibold text-pastel-purple mb-4">Why Quality Assurance Matters?</h3>
                            <p className="text-gray-600">
                                Quality Assurance helps ensure that products are built to the highest standards, providing end-users with seamless, reliable experiences. Dive into automated testing and see the impact of QA first-hand.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-pastel-purple text-white py-8 text-center">
                <p>&copy; {new Date().getFullYear()} doqa.io - Made with love for my two girls <span role="img" aria-label="heart">❤️</span></p>
            </footer>
        </div>
    );
};

export default LandingPage;
