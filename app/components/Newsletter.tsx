'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type NewsletterFormData = {
  email: string;
};

export default function Newsletter() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<NewsletterFormData>();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      setSubmitStatus('loading');
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For testing purposes, consider these emails as "already subscribed"
      const mockExistingEmails = ['test@example.com', 'existing@example.com'];
      
      if (mockExistingEmails.includes(data.email.toLowerCase())) {
        setError('email', {
          type: 'manual',
          message: 'This email is already subscribed'
        });
        setSubmitStatus('idle');
        return;
      }

      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);

    } catch (error) {
      setError('email', {
        type: 'manual',
        message: 'Failed to subscribe. Please try again.'
      });
      setSubmitStatus('idle');
      console.error(error);
    }
  };

  return (
    <section className="py-16 bg-primary relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="newsletter-title">
            Get Exclusive Deals
          </h2>
          <p className="text-white/90 mb-8">
            Subscribe to our newsletter and never miss out on special offers and updates
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 justify-center items-start w-full">
            <div className="w-full sm:w-auto sm:flex-1 max-w-md h-[74px]">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 rounded-lg w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                  <p className="absolute mt-1 text-red-200 text-sm text-left" data-testid="email-error">
                    {errors.email.message}
                  </p>
                }
                {submitStatus === 'success' && 
                  <p className="absolute mt-1 text-green-200 text-sm text-left" data-testid="success-message">
                    Successfully subscribed!
                  </p>
                }
              </div>
            </div>
            <button
              type="submit"
              className="self-start w-full sm:w-auto px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="subscribe-button"
              disabled={submitStatus === 'loading'}
            >
              {submitStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}