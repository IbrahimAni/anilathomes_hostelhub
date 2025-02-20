"use client";

import { useState, useEffect, useRef } from "react";

interface Testimonial {
    name: string;
    affiliation: string;
    quote: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Sarah Johnson",
        affiliation: "Student",
        quote: "HostelHub made finding accommodation so easy during my semester abroad. The detailed descriptions and reviews helped me make the perfect choice!"
    },
    {
        name: "Michael Chen",
        affiliation: "Student",
        quote: "I was worried about finding a good hostel in a new country, but HostelHub's platform made everything simple. The virtual tours were especially helpful."
    },
    {
        name: "Emma Thompson",
        affiliation: "Student",
        quote: "The booking process was seamless, and the hostel was exactly as described. I've recommended HostelHub to all my traveling friends!"
    },
    {
        name: "David Okonjo",
        affiliation: "Student",
        quote: "As a student on a budget, I appreciated the transparent pricing and the ability to compare different hostels easily. Great platform!"
    },
    {
        name: "Sophia Martinez",
        affiliation: "Student",
        quote: "The customer service was excellent when I needed to modify my booking. HostelHub really understands student needs!"
    }
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setTransitioning] = useState(false);
    const [slideWidth, setSlideWidth] = useState(100);
    const [containerWidth, setContainerWidth] = useState(100);
    const [autoSlide, setAutoSlide] = useState(true);
    const slideInterval = useRef<NodeJS.Timeout | null>(null);
    const transitionDuration = 500; // ms

    const startAutoSlide = () => {
        if (slideInterval.current) return;
        
        slideInterval.current = setInterval(() => {
            if (autoSlide) {
                setCurrent(prev => (prev + 1) % testimonials.length);
            }
        }, 5000);
    };

    const stopAutoSlide = () => {
        if (slideInterval.current) {
            clearInterval(slideInterval.current);
            slideInterval.current = null;
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        let resizeTimer: NodeJS.Timeout;
        let transitionFrame: number;

        const handleResize = () => {
            setTransitioning(false);
            const width = window.innerWidth;
            // Calculate number of slides based on screen size
            const slidesPerView = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
            setSlideWidth(100 / slidesPerView);
            setContainerWidth((testimonials.length + 2) * (100 / slidesPerView));

            transitionFrame = requestAnimationFrame(() => {
                setTransitioning(true);
            });
        };

        handleResize();
        startAutoSlide();

        const debouncedResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        };

        window.addEventListener("resize", debouncedResize);

        return () => {
            window.removeEventListener("resize", debouncedResize);
            clearTimeout(resizeTimer);
            cancelAnimationFrame(transitionFrame);
            stopAutoSlide();
        };
    }, []);

    useEffect(() => {
        if (current === testimonials.length) {
            setTimeout(() => {
                setTransitioning(false);
                setCurrent(0);
            }, transitionDuration);
        } else if (current === -1) {
            setTimeout(() => {
                setTransitioning(false);
                setCurrent(testimonials.length - 1);
            }, transitionDuration);
        }
    }, [current]);

    const handleNext = () => {
        stopAutoSlide();
        setTransitioning(true);
        setCurrent(prev => prev + 1);
        startAutoSlide();
    };

    const handlePrev = () => {
        stopAutoSlide();
        setTransitioning(true);
        setCurrent(prev => prev - 1);
        startAutoSlide();
    };

    return (
        <section className="py-16" data-testid="testimonial">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">
                    What Our Clients Say
                </h2>
                <div className="max-w-4xl mx-auto"> {/* Changed from max-w-6xl to max-w-4xl */}
                    <div className="overflow-hidden relative px-8"> {/* Reduced from px-12 to px-8 */}
                        <div
                            className={`flex ${
                                isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
                            }`}
                            style={{ 
                                transform: `translateX(-${current * slideWidth}%)`,
                                width: `${containerWidth}%`
                            }}
                            onMouseEnter={() => setAutoSlide(false)}
                            onMouseLeave={() => setAutoSlide(true)}
                        >
                            {/* Clone of last slide */}
                            <div className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-3"> {/* Reduced from p-4 to p-3 */}
                                <div className="bg-white p-5 rounded-lg shadow-md h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center mb-3"> {/* Reduced from mb-4 to mb-3 */}
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div> {/* Reduced from w-12 h-12 to w-10 h-10 */}
                                        <div className="ml-3"> {/* Reduced from ml-4 to ml-3 */}
                                            <h3 className="font-semibold">
                                                {testimonials[testimonials.length - 1].name}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {testimonials[testimonials.length - 1].affiliation}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">
                                        &quot;{testimonials[testimonials.length - 1].quote}&quot;
                                    </p>
                                </div>
                            </div>

                            {/* Main slides */}
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-3">
                                    <div className="bg-white p-5 rounded-lg shadow-md h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                            <div className="ml-3">
                                                <h3 className="font-semibold">{testimonial.name}</h3>
                                                <p className="text-gray-600 text-sm">
                                                    {testimonial.affiliation}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            &quot;{testimonial.quote}&quot;
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Clone of first slide */}
                            <div className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-3">
                                <div className="bg-white p-5 rounded-lg shadow-md h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="ml-3">
                                            <h3 className="font-semibold">{testimonials[0].name}</h3>
                                            <p className="text-gray-600 text-sm">
                                                {testimonials[0].affiliation}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">
                                        &quot;{testimonials[0].quote}&quot;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation Dots */}
                        <div className="flex justify-center mt-4 md:hidden">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        stopAutoSlide();
                                        setTransitioning(true);
                                        setCurrent(index);
                                        startAutoSlide();
                                    }}
                                    className={`h-2 w-2 rounded-full mx-1 transition-colors ${
                                        current === index ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Desktop Navigation Arrows */}
                        <div className="hidden md:block">
                            <button 
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white w-8 h-8 rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition-all flex items-center justify-center"
                                aria-label="Previous slide"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white w-8 h-8 rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition-all flex items-center justify-center"
                                aria-label="Next slide"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}