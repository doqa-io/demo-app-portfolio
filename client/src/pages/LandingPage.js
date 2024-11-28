import React from 'react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-blue-600 text-white py-4 sticky top-0 z-50 shadow-lg">
                <nav className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">doqa.io</h1>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/api" className="hover:underline">API</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </nav>
            </header>
            <main className="flex-grow">
                <section className="relative">
                    <img src="https://source.unsplash.com/random/1600x900" alt="Hero" className="w-full h-96 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
                        <h2 className="text-5xl font-bold mb-4 animate-fadeIn">Showcasing Excellence in QA</h2>
                        <p className="text-lg mb-6 animate-fadeIn">Explore how automated tests and quality assurance shape modern web apps.</p>
                        <a href="/api" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 animate-fadeIn">
                            Explore the API
                        </a>
                    </div>
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
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Continuous Integration</h4>
                            <p className="text-gray-600">Integrate testing into your CI/CD pipeline for seamless deployments.</p>
                        </div>
                        <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Expert QA Team</h4>
                            <p className="text-gray-600">Our team of experts ensures your applications meet the highest quality standards.</p>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-gray-800 text-white py-4 text-center">
                <p>&copy; {new Date().getFullYear()} doqa.io</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
