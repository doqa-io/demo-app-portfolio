import React from 'react';
import logo from '../logo_doqa.webp'; 
import { Link } from 'react-router-dom';


const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-blue-600 text-white py-4 sticky top-0 z-50 shadow-lg">
                <nav className="container mx-auto flex justify-between items-center">
                    <img src={logo} alt="doqa.io" className="w-12 h-12" /> 
                    <h1 className="text-2xl font-bold">doqa.io</h1>
                    <ul className="flex space-x-4">
                        <li><Link to="/" className="hover:underline">Home</Link></li>
                        <li><a href="/api" className="hover:underline">API</a></li>
                        <li><Link to="/resources" className="hover:underline">Resources</Link></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </nav>
            </header>
            <main className="flex-grow">
                <section className="relative flex justify-center items-center bg-blue-600 h-96">
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
                        <h2 className="text-5xl font-bold mb-4 animate-fadeIn">Showcasing Excellence in QA</h2>
                        <p className="text-lg mb-6 animate-fadeIn">Explore how automated tests and quality assurance shape modern web apps.</p>
                        <a href="/api" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 animate-fadeIn">
                            Explore the API
                        </a>
                    </div>
                </section>
                <section className="container mx-auto py-16 text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">CRUD Resources</h3>
                    <p className="text-gray-600 mb-8">Manage resources with create, read, update, and delete functionality.</p>
                    <Link
                        to="/resources"
                        className="inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                    >
                        Go to CRUD Resources
                    </Link>
                </section>
                <section className="container mx-auto py-16 text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h3>
                    <p className="text-gray-600 mb-8">We provide top-notch quality assurance services to ensure your web applications are robust and reliable.</p>
                    <div className="flex justify-center space-x-8">
                        <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Automated Testing</h4>
                            <p className="text-gray-600">Leverage automated tests to catch bugs early and ensure consistent quality.</p>
                        </div>
                        <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Manual Testing</h4>
                            <p className="text-gray-600">Our experts perform thorough manual testing to cover edge cases and ensure a seamless user experience.</p>
                        </div>
                        <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Performance Testing</h4>
                            <p className="text-gray-600">We conduct performance testing to ensure your application can handle high traffic and perform well under stress.</p>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 doqa.io. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
