import React from 'react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white py-4">
                <nav className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">doqa.io</h1>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/api" className="hover:underline">API</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </nav>
            </header>
            <main className="container mx-auto py-16">
                <section className="text-center">
                    <h2 className="text-4xl font-bold text-gray-800">Showcasing Excellence in QA</h2>
                    <p className="mt-4 text-gray-600">
                        Explore how automated tests and quality assurance shape modern web apps.
                    </p>
                    <a href="/api" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Explore the API
                    </a>
                </section>
            </main>
            <footer className="bg-gray-800 text-white py-4 text-center">
                <p>&copy; {new Date().getFullYear()} doqa.io</p>
            </footer>
        </div>
    );
};

export default LandingPage;
