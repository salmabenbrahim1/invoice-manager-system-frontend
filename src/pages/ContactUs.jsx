import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending message
    toast.success("Message sent successfully!");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto p-8 mt-12 bg-gradient-to-br from-purple-50 to-white shadow-xl rounded-2xl border border-purple-100">
      <h2 className="text-4xl font-bold text-purple-900 mb-8 text-center">
        Get in Touch
      </h2>
      
      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-100 rounded-full">
              <MapPin className="text-purple-600 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-800">Address</h4>
              <p className="text-gray-600">Invox HQ, 123 Finance St, Tunis, Tunisia</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-100 rounded-full">
              <Phone className="text-purple-600 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-800">Phone</h4>
              <p className="text-gray-600">+216 72 543 961</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-100 rounded-full">
              <Mail className="text-purple-600 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-800">Email</h4>
              <p className="text-gray-600">invox2025@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-800 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-800 mb-2">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="Your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20"
          >
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;