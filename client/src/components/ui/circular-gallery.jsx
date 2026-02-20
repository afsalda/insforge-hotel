import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CircularGallery = React.forwardRef(
    ({ items, className = '', radius = 600, autoRotateSpeed = 0.02, ...props }, ref) => {
        const galleryRef = useRef(null);
        const itemRefs = useRef([]);
        const manualOffsetRef = useRef(0);
        const currentManualOffsetRef = useRef(0);
        const navigate = useNavigate();

        useEffect(() => {
            let currentRotation = 0;
            let isScrolling = false;
            let scrollTimeout = null;
            let reqId = null;

            const updateDOM = (rot) => {
                if (galleryRef.current) {
                    galleryRef.current.style.transform = `rotateY(${rot}deg)`;
                }
                const totalRotation = rot % 360;
                const anglePerItem = 360 / items.length;

                itemRefs.current.forEach((el, i) => {
                    if (!el) return;
                    const itemAngle = i * anglePerItem;
                    const relativeAngle = (itemAngle + totalRotation + 360) % 360;
                    let normalizedAngle = relativeAngle;
                    if (normalizedAngle > 180) normalizedAngle = 360 - normalizedAngle;

                    const opacity = Math.max(0.2, 1 - (normalizedAngle / 180));
                    el.style.opacity = opacity;
                });
            };

            const handleScroll = () => {
                isScrolling = true;
                if (scrollTimeout) clearTimeout(scrollTimeout);

                const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
                currentRotation = scrollProgress * 720;

                // Do not call updateDOM here as autoRotate loop handles it with lerp

                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 150);
            };

            const autoRotate = () => {
                if (!isScrolling) {
                    currentRotation += autoRotateSpeed;
                }

                // Smoothly interpolate manual offset
                currentManualOffsetRef.current += (manualOffsetRef.current - currentManualOffsetRef.current) * 0.1;

                updateDOM(currentRotation + currentManualOffsetRef.current);
                reqId = requestAnimationFrame(autoRotate);
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            reqId = requestAnimationFrame(autoRotate);

            // Initial call
            updateDOM(currentRotation + currentManualOffsetRef.current);

            return () => {
                window.removeEventListener('scroll', handleScroll);
                if (scrollTimeout) clearTimeout(scrollTimeout);
                if (reqId) cancelAnimationFrame(reqId);
            };
        }, [items.length, autoRotateSpeed]);

        const anglePerItem = 360 / items.length;

        const handleLeft = () => {
            manualOffsetRef.current -= anglePerItem;
        };

        const handleRight = () => {
            manualOffsetRef.current += anglePerItem;
        };

        return (
            <div
                ref={ref}
                role="region"
                aria-label="Circular 3D Gallery"
                className={`circular-gallery-wrapper ${className}`}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: '2000px',
                }}
                {...props}
            >
                <div
                    ref={galleryRef}
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        transformStyle: 'preserve-3d',
                        willChange: 'transform'
                    }}
                >
                    {items.map((item, i) => {
                        const itemAngle = i * anglePerItem;

                        return (
                            <div
                                key={item.id || i}
                                ref={(el) => (itemRefs.current[i] = el)}
                                role="group"
                                aria-label={item.common}
                                style={{
                                    position: 'absolute',
                                    width: '320px',
                                    height: '420px',
                                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                                    left: '50%',
                                    top: '50%',
                                    marginLeft: '-160px',
                                    marginTop: '-210px',
                                    opacity: 1, // Will be overridden by ref updates
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    if (item.id) navigate(`/room/${item.id}`);
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '16px',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(201, 169, 110, 0.3)', // var(--accent-gold)
                                        backgroundColor: '#ffffff'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <img
                                        src={item.photo.url}
                                        alt={item.photo.text}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: item.photo.pos || 'center'
                                        }}
                                    />

                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        padding: '24px 20px',
                                        paddingTop: '60px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
                                        color: '#ffffff'
                                    }}>
                                        <h2 style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '400',
                                            fontFamily: 'var(--font-heading)',
                                            margin: '0 0 4px 0',
                                            color: '#ffffff'
                                        }}>
                                            {item.common}
                                        </h2>
                                        <em style={{
                                            fontSize: '0.9rem',
                                            fontStyle: 'italic',
                                            color: 'var(--accent-gold)',
                                            opacity: 0.9,
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            {item.binomial}
                                        </em>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            opacity: 0.8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px'
                                        }}>
                                            <span>{item.photo.by}</span>
                                            <span>{item.photo.text}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Navigation Arrows ─── */}
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    display: 'flex',
                    gap: '24px',
                    zIndex: 40
                }}>
                    <button
                        onClick={handleLeft}
                        aria-label="Rotate Left"
                        style={{
                            width: '54px', height: '54px', borderRadius: '50%',
                            backgroundColor: '#ffffff', border: '1px solid rgba(201,169,110,0.5)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(201,169,110,0.2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                    >
                        <ChevronLeft color="var(--text-charcoal)" size={28} />
                    </button>
                    <button
                        onClick={handleRight}
                        aria-label="Rotate Right"
                        style={{
                            width: '54px', height: '54px', borderRadius: '50%',
                            backgroundColor: '#ffffff', border: '1px solid rgba(201,169,110,0.5)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(201,169,110,0.2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                    >
                        <ChevronRight color="var(--text-charcoal)" size={28} />
                    </button>
                </div>
            </div>
        );
    }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
