'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactUs() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<ContactFormData>();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitStatus('loading');
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - consider these emails as "blocked"
      const mockBlockedEmails = ['test@example.com', 'blocked@example.com'];
      
      if (mockBlockedEmails.includes(data.email.toLowerCase())) {
        setError('email', {
          type: 'manual',
          message: 'This email is temporarily blocked. Please use a different email.'
        });
        setSubmitStatus('idle');
        return;
      }

      // Mock validation - subject can't contain specific words
      const blockedSubjects = ['spam', 'test', 'demo'];
      if (blockedSubjects.some(word => data.subject.toLowerCase().includes(word))) {
        setError('subject', {
          type: 'manual',
          message: 'Please provide a valid subject'
        });
        setSubmitStatus('idle');
        return;
      }

      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);

    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Failed to send message. Please try again.'
      });
      setSubmitStatus('idle');
      console.error(error);
    }
  };

  return (
    <section className="py-16" data-testid="contact-section">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" data-testid="contact-title">Contact Us</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <p className="flex items-center" data-testid="contact-address">
                  <span className="mr-3">📍</span>
                  Tanke, Kwara State
                </p>
                <p className="flex items-center" data-testid="contact-email">
                  <span className="mr-3">📧</span>
                  info@hostelhub.ng
                </p>
                <p className="flex items-center" data-testid="contact-phone">
                  <span className="mr-3">📞</span>
                  +234 (0) 703 123 4567
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="h-[74px]">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border rounded-lg"
                  data-testid="name-input"
                  disabled={submitStatus === 'loading'}
                  {...register('name', { 
                    required: 'Name is required'
                  })}
                />
                {errors.name && 
                  <p className="mt-1 text-red-500 text-sm" data-testid="name-error">
                    {errors.name.message}
                  </p>
                }
              </div>
              <div className="h-[74px]">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border rounded-lg"
                  data-testid="email-input"
                  disabled={submitStatus === 'loading'}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && 
                  <p className="mt-1 text-red-500 text-sm" data-testid="email-error">
                    {errors.email.message}
                  </p>
                }
              </div>
              <div className="h-[74px]">
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full p-3 border rounded-lg"
                  data-testid="subject-input"
                  disabled={submitStatus === 'loading'}
                  {...register('subject', { 
                    required: 'Subject is required'
                  })}
                />
                {errors.subject && 
                  <p className="mt-1 text-red-500 text-sm" data-testid="subject-error">
                    {errors.subject.message}
                  </p>
                }
              </div>
              <div className="h-[148px]">
                <textarea
                  placeholder="Your Message"
                  className="w-full p-3 border rounded-lg h-32"
                  data-testid="message-input"
                  disabled={submitStatus === 'loading'}
                  {...register('message', { 
                    required: 'Message is required'
                  })}
                ></textarea>
                {errors.message && 
                  <p className="mt-1 text-red-500 text-sm" data-testid="message-error">
                    {errors.message.message}
                  </p>
                }
              </div>
              {submitStatus === 'success' && 
                <p className="text-green-600 text-sm" data-testid="success-message">
                  Message sent successfully!
                </p>
              }
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="submit-button"
                disabled={submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}