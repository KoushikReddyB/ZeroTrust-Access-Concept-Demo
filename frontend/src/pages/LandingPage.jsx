import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, Users, Server, Activity } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <Shield className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                  ZTNA
                </span>
              </motion.div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#security" className="nav-link">Security</a>
              <a href="#about" className="nav-link">About</a>
              <Link
                to="/login"
                className="nav-link"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 tracking-tight"
            >
              Zero Trust Network Access
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-400"
            >
              Secure your organization's digital assets with our advanced ZTNA solution.
              Protect your resources while maintaining complete visibility and control.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex justify-center gap-x-6"
            >
              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-md bg-slate-800 px-8 py-3 text-lg font-semibold text-slate-300 hover:bg-slate-700 transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-slate-100 sm:text-4xl"
            >
              Advanced Security Features
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg text-slate-400"
            >
              Everything you need to secure your organization's resources
            </motion.p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="feature-card"
            >
              <Shield className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-100">Device Authentication</h3>
              <p className="mt-2 text-slate-400">Secure device-level authentication for every access request.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="feature-card"
            >
              <Activity className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-100">Real-time Monitoring</h3>
              <p className="mt-2 text-slate-400">Monitor and track all access attempts in real-time.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="feature-card"
            >
              <Lock className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-100">Access Control</h3>
              <p className="mt-2 text-slate-400">Granular control over resource access permissions.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div id="security" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Enterprise-Grade Security</h2>
              <p className="mt-4 text-lg text-slate-400">
                Our ZTNA solution provides military-grade encryption and security protocols
                to ensure your data remains protected at all times.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Advanced encryption protocols',
                  'Multi-factor authentication',
                  'Real-time threat detection',
                  'Automated security updates'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-xl bg-slate-800/50 border border-slate-700 p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <Users className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="text-lg font-semibold text-slate-100">User Management</h4>
                    <p className="text-sm text-slate-400">Comprehensive user control and monitoring</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <Server className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="text-lg font-semibold text-slate-100">Resource Access</h4>
                    <p className="text-sm text-slate-400">Secure application and data access</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-slate-100">ZTNA</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Securing your digital assets with next-generation zero trust security.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-slate-300">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-slate-300">API Reference</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-slate-300">Guides</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-slate-300">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-slate-300">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-center text-sm text-slate-400">
              © {new Date().getFullYear()} ZTNA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;