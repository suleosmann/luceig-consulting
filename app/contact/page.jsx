"use client"
import React, { useState } from 'react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        subject: "",
        email: "",
        phone: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

    const validateForm = () => {
        // Ensure all fields have at least some content and aren't just whitespace
        const requiredFields = ['fullName', 'subject', 'email', 'phone', 'message'];
        for (const field of requiredFields) {
            if (!formData[field] || !formData[field].trim()) {
                setSubmitStatus({
                    type: "error",
                    message: `${field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)} is required`
                });
                return false;
            }
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setSubmitStatus({
                type: "error",
                message: "Please enter a valid email address"
            });
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: "", message: "" });

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Sanitize the data by trimming whitespace
        const sanitizedData = Object.keys(formData).reduce((acc, key) => ({
            ...acc,
            [key]: formData[key].trim()
        }), {});

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contact: sanitizedData,
                    recipientEmail: process.env.NEXT_RECIPIENT_EMAIL || "suleosman73@gmail.com"
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to send message');
            }

            setSubmitStatus({
                type: "success",
                message: "Message sent successfully!"
            });
            setFormData({
                fullName: "",
                subject: "",
                email: "",
                phone: "",
                message: ""
            });
        } catch (error) {
            console.error('Contact form submission error:', error);
            setSubmitStatus({
                type: "error",
                message: error.message || "Failed to send message. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#EFEFEF] py-8 md:py-16 font-satoshi relative">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Main Heading */}
                <h1 className="text-center text-2xl md:text-4xl lg:text-5xl font-bold text-mainColor italic mb-8 md:mb-16">
                    Let's Build Your Dream Team Together.
                </h1>

                {/* Centered Form Section - Positioned to overlap */}
                <div className="flex justify-center relative z-10" style={{marginBottom: '-100px'}}>
                    <div className="bg-[#1A1A1A] rounded-lg p-8 w-full max-w-2xl">
                        {/* Status Message */}
                        {submitStatus.message && (
                            <div className={`mb-4 p-3 rounded ${
                                submitStatus.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                {submitStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-white text-sm mb-2">*Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full p-3 rounded bg-[#A4A4A4] text-mainColor  border-none outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm mb-2">*Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Subject"
                                        className="w-full p-3 rounded bg-[#A4A4A4] text-mainColor border-none outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-white text-sm mb-2">*Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full p-3 rounded bg-[#A4A4A4] text-mainColor  border-none outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm mb-2">*Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full p-3 rounded bg-[#A4A4A4] text-mainColor  border-none outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-white text-sm mb-2">*Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Message"
                                    rows="6"
                                    className="w-full p-3 rounded bg-[#A4A4A4] text-mainColor  border-none outline-none resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#A4A4A4] text-white font-medium py-3 px-6 rounded transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="h-4 w-full bg-[#1A1A1A]"></div>
            <div className="h-[386px] w-full bg-[#C6C5C5] relative">

                <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold text-mainColor italic mb-4 pt-44">
                    Reach out Directly.
                </h1>
                <p className="text-center text-[24px] font-normal">
                    P: +44 2045113383 | E: info@luciegconsulting.co.uk |  W: https://luciegconsulting.co.uk
                </p>
            </div>
            <div className="bg-[#EFEFEF] pt-24">
                <p className="text-center w-[880px] h-[160px] italic mx-auto text-[18px]">We Look Forward to Connecting With You!<br/>
                    At Lucieg Consulting, every conversation is an opportunity to understand your vision<br/> and demonstrate how we can contribute to your success.
                    Don't hesitate to reach out – your next great hire is just a conversation away.</p>
            </div>
        </div>
    );
};

export default ContactSection;