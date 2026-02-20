"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronRight } from "lucide-react";
import BookingForm from "../components/BookingForm";

export default function HomePage() {
  const mainRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ── Page Load Curtain ──
    const curtain = document.querySelector('.page-curtain');
    const curtainLogo = document.querySelector('.curtain-logo');
    if (curtain && curtainLogo) {
      const tl = gsap.timeline({ onComplete: () => { curtain.style.display = 'none'; } });
      tl.to(curtainLogo, { opacity: 1, duration: 0.5, ease: 'power2.out', force3D: true })
        .to(curtainLogo, { opacity: 0, duration: 0.3, delay: 0.3, force3D: true })
        .to(curtain, { yPercent: -100, duration: 1.2, ease: 'power4.inOut', force3D: true }, '-=0.1');
    }

    // ── Hero Entry ──
    gsap.fromTo('.hero-arabic-label',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 1.6, ease: 'power2.out', force3D: true }
    );
    gsap.fromTo('.hero-word',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 1.8, force3D: true }
    );
    gsap.fromTo('.hero-booking-form',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 2.2, force3D: true }
    );

    // ── matchMedia — Desktop vs Mobile ──
    const mm = gsap.matchMedia();

    // Room cards (desktop)
    mm.add("(min-width: 769px)", () => {
      gsap.fromTo(".room-card",
        { opacity: 0, x: -120 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: "power2.out", stagger: 0.2, force3D: true,
          scrollTrigger: { trigger: ".rooms-section", start: "top 80%", once: true, fastScrollEnd: true }
        }
      );
    });

    // Room cards (mobile)
    mm.add("(max-width: 768px)", () => {
      gsap.fromTo('.room-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, force3D: true,
          scrollTrigger: { trigger: '.rooms-section', start: 'top 85%', once: true, fastScrollEnd: true }
        }
      );
    });

  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="relative bg-[#F5F0E8] min-h-screen text-[#2C2C2C]">
      {/* ── Page Load Curtain ── */}
      <div className="page-curtain fixed inset-0 z-[100] bg-[#162118] flex items-center justify-center">
        <span className="curtain-logo text-[#C9A96E] font-serif text-3xl tracking-[0.2em] uppercase opacity-0">
          AL BAITH
        </span>
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-6 transition-all duration-500 ${scrolled ? "bg-[#162118]/95 backdrop-blur-md py-4 shadow-lg" : "bg-transparent"
        }`}>
        <div className="flex items-center gap-4">
          <span className="text-xl font-serif text-[#C9A96E]">
            {scrolled ? "AL BAITH" : <span className="font-arabic text-2xl">البيت</span>}
          </span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-sm font-semibold tracking-wider text-[#F5F0E8]/90 uppercase">
          <a href="#rooms" className="hover:text-[#C9A96E] transition-colors">Rooms</a>
          <a href="#reviews" className="hover:text-[#C9A96E] transition-colors">Reviews</a>
          <a href="/admin" className="text-[#A68B5B] hover:text-[#C9A96E] transition-colors">Admin</a>
        </div>
        <button className="hidden md:block border border-[#C9A96E] text-[#C9A96E] px-6 py-2 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-[#C9A96E] hover:text-[#162118] transition-colors">
          Book Now
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative h-screen flex items-center overflow-hidden bg-[#162118]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80"
            alt="Luxury hotel lobby"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#162118]/80 to-transparent" />
          <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-[#162118] to-transparent" />
        </div>

        <div className="absolute left-[8%] font-arabic text-[30vh] text-[#C9A96E] opacity-5 select-none -translate-x-12 translate-y-12 whitespace-nowrap">
          مرحباً
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-12 flex flex-col md:flex-row items-center pt-[80px]">
          <div className="max-w-3xl">
            <span className="hero-arabic-label block font-arabic text-xl text-[#C9A96E] mb-6 tracking-wide">
              فندق البيت الفاخر
            </span>
            <h1 className="font-serif text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[1.05] text-[#F5F0E8] mb-8 font-light tracking-tight flex flex-wrap gap-x-4">
              {'Book Your Comfort Room Today!'.split(' ').map((word, i) => (
                <span className="overflow-hidden inline-block" key={i}>
                  <span className="hero-word block">{word}</span>
                </span>
              ))}
            </h1>
            <p className="text-[#F5F0E8]/70 text-lg md:text-xl max-w-xl mb-12 font-sans font-light leading-relaxed">
              Immerse yourself in the harmony of Arabian heritage and modern serenity.
              Every room tells a story of timeless luxury.
            </p>
            <div className="flex items-center gap-6">
              <a href="#rooms" className="hero-arabic-label bg-[#C9A96E] text-[#162118] px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-sm hover:scale-105 transition-transform">
                Explore Rooms
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-sm ml-auto mt-12 md:mt-0 opacity-0 hero-booking-form">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* ── Rooms Section ── */}
      <section className="rooms-section bg-[#F5F0E8] py-24 px-8 md:px-12 relative z-20" id="rooms">
        <div className="text-center mb-16">
          <span className="font-arabic text-xl text-[#C9A96E] mb-2 block">اختر غرفتك</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C2C2C] mb-4">Choose the Best Room for Your Perfect Stay!</h2>
          <p className="text-[#666666] max-w-2xl mx-auto">Experience the art of comfort and luxury. Designed to embrace you in elegance.</p>
        </div>

        <div className="rooms-grid max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Room Cards Data Mapping */}
          {[
            {
              title: "Standard Room", price: "₹1,500 / night",
              desc: "A cozy retreat with all essentials — WiFi, AC, smart TV, and garden views. Perfect for solo travelers or couples.",
              amenities: ["WiFi", "AC", "Garden View"],
              img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"
            },
            {
              title: "Deluxe Room", price: "₹1,800 / night", badge: "Popular",
              desc: "Spacious king bed retreat with premium furnishings, city views, and optional extra bed for small families.",
              amenities: ["King Bed", "City View", "Extra Bed"],
              img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80"
            },
            {
              title: "Suite Room", price: "Contact for pricing", badge: "Premium",
              desc: "Luxury suite with separate lounge, mini kitchen, jacuzzi, and panoramic skyline views. 550 sq ft of elegance.",
              amenities: ["Mini Kitchen", "Jacuzzi", "550 sq ft"],
              img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80"
            },
            {
              title: "Apartments", price: "Extended stay available", badge: "Featured",
              desc: "Fully furnished private apartments in 1BHK, 2BHK and 3BHK layouts — complete kitchen, living room, parking, and luxury amenities.",
              amenities: ["1BHK", "2BHK", "3BHK"],
              img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
              isApt: true
            }
          ].map((room, i) => (
            <div
              key={i}
              className="room-card group relative bg-white rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300 transform hover:scale-[1.03] flex flex-col"
            >
              {room.badge && (
                <div className="absolute top-[18px] right-[14px] z-10 bg-[#C9A96E] text-[#162118] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase clip-octagon w-[68px] h-[68px] flex items-center justify-center text-center leading-tight animate-[badgePulse_3s_ease-in-out_infinite]">
                  {room.badge}
                </div>
              )}

              <div className="relative w-full h-[260px] overflow-hidden clip-horseshoe">
                <img src={room.img} alt={room.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif text-2xl text-[#2C2C2C] mb-1">{room.title}</h3>
                <p className="text-sm font-semibold text-[#C9A96E] mb-3">{room.price}</p>
                <p className="text-sm text-[#666666] mb-4 leading-relaxed flex-1">{room.desc}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {room.amenities.map((am, j) => (
                    <span key={j} className="text-[11px] font-semibold tracking-wide uppercase text-[#2C2C2C] bg-[#F5F0E8] border border-[#C9A96E]/30 rounded-full px-3 py-1">
                      {am}
                    </span>
                  ))}
                </div>

                {room.isApt ? (
                  <a href="/apartments" className="mt-auto group/btn relative flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold tracking-widest uppercase text-[#C9A96E] border border-[#C9A96E] rounded-full transition-colors hover:text-[#162118] overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">Explore Apartments <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" /></span>
                    <div className="absolute inset-0 bg-[#C9A96E] opacity-0 group-hover/btn:opacity-100 transition-opacity z-0" />
                  </a>
                ) : (
                  <button className="mt-auto group/btn relative flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold tracking-widest uppercase text-[#C9A96E] border border-[#C9A96E] rounded-full transition-colors hover:text-[#162118] overflow-hidden">
                    <span className="relative z-10">View Room</span>
                    <div className="absolute inset-0 bg-[#C9A96E] opacity-0 group-hover/btn:opacity-100 transition-opacity z-0" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
