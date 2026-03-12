"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    alert("Thank you for your message! We will get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600">
            Have questions, or see a bug? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">eneojogoswill@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start space-x-4">
                <MessageSquare className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                  <p className="text-gray-600">
                    Our support team typically responds within 24-48 hours
                    during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
