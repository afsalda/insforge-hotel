const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'client/src/pages/ListingDetailPage.jsx');
let content = fs.readFileSync(file, 'utf8');

const marker = 'export default function ListingDetailPage() {';

const newComponentCode = `export default function ListingDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const listing = getListingDetail(id);

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guestsCount, setGuestsCount] = useState(1);
    const [activePicker, setActivePicker] = useState(null);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return null;
        const [y, m, d] = dateStr.split('-');
        return \`\${m}/\${d}/\${y}\`;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const calcNights = (inDate, outDate) => {
        if (!inDate || !outDate) return 0;
        const diff = new Date(outDate) - new Date(inDate);
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const nights = calcNights(checkIn, checkOut);
    const subtotal = listing.price * nights;
    const total = subtotal + listing.cleaningFee + listing.serviceFee;

    const handleReserve = (e) => {
        if(e) e.stopPropagation();
        if (!checkIn || !checkOut || nights < 1) {
            setShowBottomSheet(true);
            if (!checkIn) setActivePicker('in');
            else if (!checkOut) setActivePicker('out');
            return;
        }
        try {
            navigate(\`/checkout/\${id}\`, {
                state: { checkIn, checkOut, guestsCount, nights, total, subtotal }
            });
        } catch (err) {
            console.error('Navigation failed:', err);
            alert('Navigation failed: ' + err.message);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: listing.title,
            text: \`Check out this amazing stay at Al Baith: \${listing.title}\`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                } catch (copyErr) {}
            }
        }
    };

    const handleSave = () => setIsSaved(!isSaved);

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        const index = Math.round(scrollLeft / width);
        setActiveImgIndex(index);
    };

    return (
        <>
            <div className="detail-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="detail-header-compact">
                    <h1 className="detail-title">{listing.title}</h1>
                    <div className="detail-meta">
                        <div className="detail-meta-left">
                            <Star size={14} fill="#FF385C" stroke="#FF385C" className="rating-star" />
                            <strong>{listing.rating}</strong>
                            <span className="hide-mobile">·</span>
                            <span className="hide-mobile" style={{ textDecoration: 'underline', cursor: 'pointer' }}>{listing.reviews} reviews</span>
                            <span className="hide-mobile">·</span>
                            <span className="hide-mobile">{listing.location}</span>
                        </div>
                        <div className="detail-actions">
                            <button className="detail-action-btn" onClick={handleShare}>
                                <Share2 size={16} /> <span className="hide-mobile">Share</span>
                            </button>
                            <button
                                className={\`detail-action-btn \${isSaved ? 'saved' : ''}\`}
                                onClick={handleSave}
                            >
                                <Heart size={16} fill={isSaved ? '#FF385C' : 'transparent'} color={isSaved ? '#FF385C' : 'currentColor'} />
                                <span className="hide-mobile">{isSaved ? 'Saved' : 'Save'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="detail-gallery-container">
                    <div className="detail-gallery" onScroll={handleScroll}>
                        {listing.images.map((img, i) => (
                            <img key={i} src={img} alt="" className={i === 0 ? 'main-img' : ''} />
                        ))}
                    </div>
                    <div className="gallery-dots">
                        {listing.images.map((_, i) => (
                            <div key={i} className={\`gallery-dot \${i === activeImgIndex ? 'active' : ''}\`} />
                        ))}
                    </div>
                </div>

                <div className="detail-body">
                    <div className="detail-info">
                        <div className="host-row">
                            <div className="host-text">
                                <h2>Entire home hosted by {listing.host.name}</h2>
                                <p>{listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.baths} baths</p>
                            </div>
                            <img src={listing.host.image} alt="" className="host-avatar" />
                        </div>

                        <div className="highlight-list hide-mobile">
                            {listing.host.superhost && (
                                <div className="highlight-item">
                                    <div className="highlight-icon"><Award size={28} /></div>
                                    <div>
                                        <h4>{listing.host.name} is a Superhost</h4>
                                        <p>Superhosts are experienced, highly rated hosts committed to providing great stays.</p>
                                    </div>
                                </div>
                            )}
                            <div className="highlight-item hide-mobile">
                                <div className="highlight-icon"><KeyRound size={28} /></div>
                                <div>
                                    <h4>Great check-in experience</h4>
                                    <p>95% of recent guests gave the check-in process a 5-star rating.</p>
                                </div>
                            </div>
                        </div>

                        <div className="desc-section">
                            <p className={\`desc-text \${!showFullDesc ? 'collapsed' : ''}\`}>
                                {listing.description}
                                {listing.description}
                                {listing.description}
                            </p>
                            {!showFullDesc && (
                                <button className="show-more-btn" onClick={() => setShowFullDesc(true)}>
                                    Read more <ChevronRight size={16} />
                                </button>
                            )}
                        </div>

                        <div className="amenities-section">
                            <h3>What this place offers</h3>
                            <div className="amenities-grid">
                                {listing.amenities.slice(0, 6).map((a, idx) => (
                                    <div className="amenity-row" key={idx}>
                                        {a.icon}
                                        <span>{a.label}</span>
                                    </div>
                                ))}
                            </div>
                            {listing.amenities.length > 6 && (
                                <button className="show-amenities-btn" onClick={() => setShowAllAmenities(true)}>
                                    Show all {listing.amenities.length} amenities
                                </button>
                            )}
                        </div>

                        {showAllAmenities && (
                            <div className="amenities-modal-overlay" onClick={() => setShowAllAmenities(false)}>
                                <div className="amenities-modal-container" onClick={e => e.stopPropagation()}>
                                    <div className="amenities-modal-header">
                                        <button className="modal-close-btn" onClick={() => setShowAllAmenities(false)}>
                                            <X size={24} />
                                        </button>
                                        <h2>What this place offers</h2>
                                    </div>
                                    <div className="amenities-modal-list">
                                        {listing.amenities.map((a, idx) => (
                                            <div className="amenity-modal-item" key={idx}>
                                                <div className="amenity-icon">{a.icon}</div>
                                                <div className="amenity-info">
                                                    <span className="amenity-label">{a.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={\`booking-container \${showBottomSheet ? 'sheet-open' : ''}\`}>
                        <div className="bottom-sheet-overlay" onClick={() => setShowBottomSheet(false)} />
                        
                        <div className="booking-card">
                            <div className="sheet-drag-handle" onClick={() => setShowBottomSheet(false)}>
                                <div className="drag-bar" />
                            </div>
                            
                            <div className="booking-price-row hide-mobile-sheet">
                                <div className="booking-price">₹{listing.price} <span>night</span></div>
                                <div className="booking-rating">
                                    <Star size={12} fill="black" /> {listing.rating} · {listing.reviews} reviews
                                </div>
                            </div>

                            <div className="booking-fields">
                                <div className="booking-dates">
                                    <div
                                        className={\`booking-field \${activePicker === 'in' ? 'active' : ''}\`}
                                        onClick={() => setActivePicker(activePicker === 'in' ? null : 'in')}
                                        style={{ cursor: 'pointer', position: 'relative' }}
                                    >
                                        <label>CHECK-IN</label>
                                        <div className={\`date-display \${!checkIn ? 'placeholder' : ''}\`}>
                                            {formatDisplayDate(checkIn) || 'Add date'}
                                        </div>
                                        {activePicker === 'in' && (
                                            <div className="calendar-popover" onClick={e => e.stopPropagation()}>
                                                <div className="mobile-calendar-header hide-desktop" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center'}}>
                                                    <h3 style={{margin:0}}>Select check-in</h3>
                                                    <button onClick={() => setActivePicker(null)} style={{background:'none', border:'none', padding:0}}><X /></button>
                                                </div>
                                                <BookingCalendar
                                                    selectedDate={checkIn}
                                                    onSelect={(date) => {
                                                        setCheckIn(date);
                                                        setActivePicker('out');
                                                    }}
                                                    minDate={toDateStr(new Date())}
                                                />
                                                <button className="calendar-confirm-btn hide-desktop" onClick={() => setActivePicker('out')}>Next</button>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className={\`booking-field \${activePicker === 'out' ? 'active' : ''}\`}
                                        onClick={() => setActivePicker(activePicker === 'out' ? null : 'out')}
                                        style={{ cursor: 'pointer', position: 'relative' }}
                                    >
                                        <label>CHECKOUT</label>
                                        <div className={\`date-display \${!checkOut ? 'placeholder' : ''}\`}>
                                            {formatDisplayDate(checkOut) || 'Add date'}
                                        </div>
                                        {activePicker === 'out' && (
                                            <div className="calendar-popover align-right" onClick={e => e.stopPropagation()}>
                                                <div className="mobile-calendar-header hide-desktop" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center'}}>
                                                    <h3 style={{margin:0}}>Select checkout</h3>
                                                    <button onClick={() => setActivePicker(null)} style={{background:'none', border:'none', padding:0}}><X /></button>
                                                </div>
                                                <BookingCalendar
                                                    selectedDate={checkOut}
                                                    onSelect={(date) => {
                                                        setCheckOut(date);
                                                        setActivePicker(null);
                                                    }}
                                                    minDate={checkIn}
                                                />
                                                <button className="calendar-confirm-btn hide-desktop" onClick={() => setActivePicker(null)}>Confirm</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="booking-field">
                                    <label>GUESTS</label>
                                    <select
                                        value={guestsCount}
                                        onChange={e => setGuestsCount(Number(e.target.value))}
                                    >
                                        {Array.from({ length: listing.guests }, (_, i) => i + 1).map(n => (
                                            <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button className="reserve-btn" onClick={handleReserve} style={{background: 'var(--accent-gold)'}}>Reserve</button>
                            <div className="no-charge" style={{marginBottom: checkIn && checkOut ? '16px' : '0'}}>You won't be charged yet</div>

                            {nights > 0 && checkIn && checkOut && (
                                <div className="price-breakdown">
                                    <div className="price-row underline">
                                        <span>₹{listing.price} x {nights} nights</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="price-row underline">
                                        <span>Cleaning fee</span>
                                        <span>₹{listing.cleaningFee}</span>
                                    </div>
                                    <div className="price-row underline">
                                        <span>Al Baith service fee</span>
                                        <span>₹{listing.serviceFee}</span>
                                    </div>
                                    <div className="price-total">
                                        <span>Total before taxes</span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-bottom-bar" onClick={() => setShowBottomSheet(true)}>
                <div className="detail-bottom-price">
                    <strong>₹{listing.price}</strong> <span style={{color: '#717171', fontSize: '0.9rem', fontWeight: 400}}>night</span>
                    {(!checkIn || !checkOut) && (
                        <div style={{fontSize: '0.8rem', textDecoration: 'underline'}}>Select dates</div>
                    )}
                </div>
                <button className="detail-bottom-reserve" onClick={handleReserve} style={{background: 'var(--accent-gold)'}}>Reserve</button>
            </div>
        </>
    );
}`;

content = content.substring(0, content.indexOf(marker)) + newComponentCode;
fs.writeFileSync(file, content);

// CSS updating logic
const cssFile = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssFile, 'utf8');

// Find and replace the entire @media (max-width: 900px) block that relates to .detail-gallery etc...
// Actually, it's safer to just remove all gallery overrides and re-inject a unified one
// We'll read the CSS, find the first occurrence of @media (max-width: 900px) and truncate everything after it.
// The user added @media (max-width: 900px) block at line ~2086
const media900Index = css.indexOf('@media (max-width: 900px) {');
if (media900Index !== -1) {
    const endOfMedia900 = css.indexOf('.modal-header {', media900Index);
    if (endOfMedia900 !== -1) {
        css = css.substring(0, media900Index) + css.substring(endOfMedia900);
    }
}

// Same for what was previously added at EOF:
const media768Index = css.lastIndexOf('@media (max-width: 768px) {');
if (media768Index !== -1) {
    const detailGalleryInd = css.indexOf('.detail-gallery', media768Index);
    if (detailGalleryInd !== -1) {
        // Just let it be, we'll append more !important overrides at the real end
    }
}

const newCss = `
.hide-desktop {
  display: none !important;
}
.calendar-confirm-btn {
  display: none;
}
.detail-header-compact {
  margin-bottom: 24px;
}
.gallery-dots {
  display: none;
}
.desc-text.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bottom-sheet-overlay { display: none; }
.sheet-drag-handle { display: none; }
.detail-gallery-container { position: relative; }

@media (max-width: 900px) {
  .detail-gallery {
    display: flex !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    gap: 0 !important;
    border-radius: 0 !important;
    margin-left: -16px !important;
    margin-right: -16px !important;
    padding: 0 !important;
    scrollbar-width: none !important;
    grid-template-columns: unset !important;
    grid-template-rows: unset !important;
  }
  .detail-gallery::-webkit-scrollbar {
    display: none !important;
  }
  .detail-gallery > img {
    flex: 0 0 100% !important;
    scroll-snap-align: center !important;
    height: 250px !important;
    object-fit: cover !important;
    display: block !important;
    border-radius: 0 !important;
  }
  
  .detail-title {
    font-size: 24px !important;
    margin-bottom: 8px;
  }
  .detail-meta {
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
  }
  .hide-mobile {
    display: none !important;
  }
  .detail-actions {
    display: flex;
    gap: 12px;
  }
  .detail-action-btn {
    padding: 0;
    gap: 4px;
    background: none;
    border: none;
    font-weight: 500;
  }
  
  .gallery-dots {
    display: flex !important;
    justify-content: center;
    gap: 6px;
    position: absolute;
    bottom: 12px;
    left: 0;
    width: 100%;
  }
  .gallery-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
  }
  .gallery-dot.active {
    background: white;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
  }
  .amenity-row {
    gap: 12px !important;
  }
  
  .booking-container {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    z-index: 1002 !important;
    transform: translateY(100%) !important;
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1) !important;
  }
  .booking-container.sheet-open {
    transform: translateY(0) !important;
  }
  .bottom-sheet-overlay {
    display: block !important;
    position: fixed !important;
    inset: 0 !important;
    background: rgba(0,0,0,0.5) !important;
    z-index: -1 !important;
    opacity: 0 !important;
    pointer-events: none !important;
    transition: opacity 0.3s !important;
    height: 100vh !important;
    top: 0 !important;
  }
  .booking-container.sheet-open .bottom-sheet-overlay {
    opacity: 1 !important;
    pointer-events: auto !important;
  }
  .booking-card {
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    width: 100% !important;
    margin: 0 !important;
    border-radius: 20px 20px 0 0 !important;
    max-height: 90vh !important;
    overflow-y: auto !important;
    padding: 24px 16px 48px 16px !important;
    border: none !important;
    box-shadow: 0 -4px 16px rgba(0,0,0,0.1) !important;
    top: 0 !important;
  }
  .sheet-drag-handle {
    display: flex !important;
    justify-content: center !important;
    padding-bottom: 24px !important;
  }
  .drag-bar {
    width: 40px !important;
    height: 4px !important;
    background: #DDDDDD !important;
    border-radius: 2px !important;
  }
  .hide-mobile-sheet {
    display: none !important;
  }
  
  .calendar-popover {
    position: fixed !important;
    inset: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    transform: none !important;
    border-radius: 0 !important;
    padding: 24px 16px !important;
    display: flex !important;
    flex-direction: column !important;
    background: white !important;
    z-index: 2000 !important;
  }
  .hide-desktop {
    display: flex !important;
  }
  .calendar-confirm-btn {
    display: block !important;
    width: 100% !important;
    padding: 14px !important;
    background: var(--accent-gold) !important;
    color: white !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 8px !important;
    margin-top: 16px !important;
  }
  
  .detail-info {
    margin-bottom: 80px !important;
  }

  .detail-bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    padding: 16px 24px;
    border-top: 1px solid #EBEBEB;
    z-index: 1000;
  }
  .detail-bottom-reserve {
    background: var(--accent-gold);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
  }
}
`;

fs.writeFileSync(cssFile, css + newCss);
