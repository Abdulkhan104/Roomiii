import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mahesh from "../assets/hero/mahesh.mp4";
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineVerified, MdSecurity, MdLocationOn } from "react-icons/md";
import { FaWifi, FaStar, FaMapMarkerAlt, FaQuoteLeft, FaArrowRight, FaPhoneAlt } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoBedOutline } from "react-icons/io5";
import { BsShieldCheck, BsLightningChargeFill } from "react-icons/bs";

/* ─── DATA ─────────────────────────────────────────── */
const fakeSlides = [
  { image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", title: "Spacious Rooms", desc: "Fully furnished rooms that fit your budget.", badge: "From ₹5,000/mo" },
  { image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", title: "Luxury Apartments", desc: "Modern flats with world-class amenities.", badge: "From ₹18,000/mo" },
  { image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80", title: "Premium Hostels", desc: "Safe hostels in Hyderabad's academic hub.", badge: "From ₹3,500/mo" }
];

const stats = [
  { value: "2,400+", label: "Verified Listings" },
  { value: "18K+", label: "Happy Tenants" },
  { value: "50+", label: "Neighbourhoods" },
  { value: "4.8★", label: "Avg. Rating" }
];

const categories = [
  { label: "Rooms", emoji: "🛏️", desc: "PG & single rooms for students and working professionals", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80" },
  { label: "Hostels", emoji: "🏠", desc: "Budget-friendly shared living with all basic amenities", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80" },
  { label: "Flats", emoji: "🏢", desc: "1BHK to 4BHK flats in Hyderabad's prime locations", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80" },
  { label: "Hotels", emoji: "🏨", desc: "Comfortable hotels for short-term and extended stays", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
  { label: "Restaurants", emoji: "🍽️", desc: "Local eateries & mess near your accommodation", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80" }
];

const features = [
  { icon: <MdOutlineVerified size={28}/>, title: "100% Verified Listings", desc: "Every property is physically inspected by our field team before listing. No fake photos, no surprises." },
  { icon: <BsShieldCheck size={26}/>, title: "Safe & Secure", desc: "Background-checked landlords, digital agreements, and 24/7 tenant support for peace of mind." },
  { icon: <BsLightningChargeFill size={24}/>, title: "Instant Booking", desc: "Found your spot? Book it in minutes with zero brokerage and transparent pricing." },
  { icon: <FaWifi size={24}/>, title: "Smart Amenity Filter", desc: "Filter by Wi-Fi, AC, parking, meals, laundry, and 20+ more amenities in one click." },
  { icon: <HiOutlineBuildingOffice2 size={26}/>, title: "Prime Locations", desc: "Listings across HITEC City, Gachibowli, Madhapur, Kondapur, Kukatpally & more." },
  { icon: <MdSecurity size={26}/>, title: "Tenant First Policy", desc: "Dispute resolution, rent receipts, and legal assistance — we've got you covered." }
];

const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer, HITEC City", text: "Found my flat in 2 days. The filters are spot on and no broker nonsense. Roomiii is genuinely the best in Hyderabad.", avatar: "https://randomuser.me/api/portraits/women/44.jpg", stars: 5 },
  { name: "Rahul Nair", role: "Student, BITS Pilani Hyderabad", text: "As a student from Kerala, I was nervous about finding a hostel. Roomiii had verified options near campus and the team was super helpful.", avatar: "https://randomuser.me/api/portraits/men/32.jpg", stars: 5 },
  { name: "Aisha Khan", role: "MBA Graduate, ISB", text: "The photos actually match what you see! That alone makes Roomiii miles ahead of every other platform I've tried.", avatar: "https://randomuser.me/api/portraits/women/68.jpg", stars: 5 },
  { name: "Vikram Rao", role: "IT Consultant, Gachibowli", text: "Switched cities for a new job and needed a flat ASAP. Had three options shortlisted within an hour. Booked the next morning.", avatar: "https://randomuser.me/api/portraits/men/75.jpg", stars: 5 }
];

const howItWorks = [
  { step: "01", title: "Search Your Area", desc: "Type your preferred locality, college, or office — our smart engine surfaces the best matches instantly." },
  { step: "02", title: "Filter & Compare", desc: "Use 20+ filters to narrow by budget, amenities, property type, and gender preference." },
  { step: "03", title: "Schedule a Visit", desc: "Book a free in-person tour or take a live virtual walkthrough from anywhere in the world." },
  { step: "04", title: "Move In, Sorted", desc: "Sign digitally, pay securely, get your keys. No broker. No hidden charges. Zero stress." }
];

const neighborhoods = [
  { name: "HITEC City", count: "340+ listings", img: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=400&q=80" },
  { name: "Gachibowli", count: "280+ listings", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80" },
  { name: "Madhapur", count: "210+ listings", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=400&q=80" },
  { name: "Kondapur", count: "190+ listings", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80" },
  { name: "Kukatpally", count: "170+ listings", img: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?auto=format&fit=crop&w=400&q=80" },
  { name: "Banjara Hills", count: "150+ listings", img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80" }
];

/* ─── COMPONENT ─────────────────────────────────────── */
const Hero = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [slideIdx, setSlideIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Rooms");
  const [loaded, setLoaded] = useState(false);
  const [visibleSects, setVisibleSects] = useState(new Set());

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const t = urlParams.get("searchTerm");
    if (t) setSearchTerm(t);
  }, [location.search]);

  useEffect(() => {
    if (window.google && inputRef.current) {
      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"], componentRestrictions: { country: "in" }
      });
      ac.addListener("place_changed", () => {
        const p = ac.getPlace();
        if (p.formatted_address) setSearchTerm(p.formatted_address);
      });
    }
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setSlideIdx(p => (p + 1) % fakeSlides.length), 3500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisibleSects(s => new Set([...s, e.target.dataset.section]));
      });
    }, { threshold: 0.1 });
    document.querySelectorAll("[data-section]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loaded]);

  const sv = (id) => visibleSects.has(id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;0,800;1,700&family=Syne:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{--brand:#dc4a11;--brand-light:#ff7b45;--dark:#080503;--dark2:#100d0a;--mid:#181310;--cream:#f5f0eb;--muted:#8a8078;}
        /* Hide scrollbar for all browsers */
        html, body, #root {
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important; /* IE and Edge */
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
          display: none !important; /* Chrome, Safari, Opera */
        }

        /* Fonts */
        .fd{font-family:'Cormorant Garamond',serif;}
        .fu{font-family:'Syne',sans-serif;}
        .fb{font-family:'Lato',sans-serif;}

        /* Hero */
        .hero-sec{position:relative;height:100vh;min-height:580px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}
        .hero-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;}
        .hero-ov{position:absolute;inset:0;z-index:1;background:linear-gradient(155deg,rgba(0,0,0,.78) 0%,rgba(0,0,0,.32) 50%,rgba(8,3,0,.85) 100%);}
        .hero-cnt{position:relative;z-index:10;width:100%;padding:0 20px;display:flex;flex-direction:column;align-items:center;text-align:center;}

        /* Glass */
        .glass{background:rgba(12,8,5,.55);backdrop-filter:blur(20px) saturate(160%);-webkit-backdrop-filter:blur(20px) saturate(160%);border:1px solid rgba(255,255,255,.09);}

        /* Slide card */
        .sc{background:rgba(10,6,3,.72);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(220,74,17,.3);border-radius:16px;transition:transform .3s,box-shadow .3s;}
        .sc:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(220,74,17,.22);}

        /* Search */
        .si{font-family:'Lato',sans-serif;background:rgba(255,255,255,.97);border:2.5px solid transparent;transition:border-color .3s,box-shadow .3s;font-size:15px;color:#222;}
        .si:focus{border-color:var(--brand);box-shadow:0 0 0 5px rgba(220,74,17,.14);outline:none;}
        .si::placeholder{color:#888;}
        input[type=search]::-webkit-search-cancel-button{display:none;}

        /* Category tab */
        .ct{font-family:'Syne',sans-serif;font-weight:600;font-size:13px;color:rgba(255,255,255,.6);border-bottom:2.5px solid transparent;padding-bottom:3px;transition:color .2s,border-color .2s;cursor:pointer;background:none;border-top:none;border-left:none;border-right:none;letter-spacing:.02em;}
        .ct:hover,.ct.on{color:var(--brand);border-bottom-color:var(--brand);}

        /* Scroll in */
        .sect{opacity:0;transform:translateY(36px);transition:opacity .75s ease,transform .75s ease;}
        .sect.vis{opacity:1;transform:translateY(0);}

        /* Hero fade */
        .hf{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease;}
        .hf.in{opacity:1;transform:translateY(0);}
        .d1{transition-delay:.08s}.d2{transition-delay:.2s}.d3{transition-delay:.34s}
        .d4{transition-delay:.48s}.d5{transition-delay:.62s}.d6{transition-delay:.76s}

        /* Stat strip */
        .stat-strip{background:linear-gradient(90deg,var(--dark2),#150c07,var(--dark2));border-top:1px solid rgba(220,74,17,.2);border-bottom:1px solid rgba(220,74,17,.2);}
        .sv{font-family:'Cormorant Garamond',serif;font-weight:800;font-size:clamp(26px,4vw,46px);color:var(--brand);line-height:1;}
        .sl{font-family:'Syne',sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-top:5px;}

        /* Sections */
        .s-dark{background:var(--dark2);}
        .s-darker{background:var(--dark);}
        .s-mid{background:var(--mid);}

        /* Section label */
        .sec-lbl{font-family:'Syne',sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:.18em;color:var(--brand);font-weight:700;margin-bottom:12px;}
        .sec-ttl{font-family:'Cormorant Garamond',serif;font-weight:800;line-height:1.08;color:#f5f0eb;}
        .sec-sub{font-family:'Lato',sans-serif;font-weight:300;color:var(--muted);line-height:1.75;}
        .gw{color:var(--brand);text-shadow:0 0 40px rgba(220,74,17,.4);}

        /* Cat card */
        .cc{position:relative;border-radius:14px;overflow:hidden;cursor:pointer;transition:transform .35s,box-shadow .35s;border:1px solid rgba(220,74,17,.15);}
        .cc:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 22px 55px rgba(220,74,17,.25);}
        .cc img{width:100%;height:210px;object-fit:cover;display:block;transition:transform .5s;}
        .cc:hover img{transform:scale(1.07);}
        .cc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.15) 60%,transparent 100%);}
        .cc-ct{position:absolute;bottom:0;left:0;right:0;padding:16px 18px;}

        /* Feature card */
        .fc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:26px 22px;transition:background .3s,border-color .3s,transform .3s;}
        .fc:hover{background:rgba(220,74,17,.07);border-color:rgba(220,74,17,.3);transform:translateY(-4px);}

        /* Step card */
        .stc{position:relative;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:30px 22px 22px;overflow:hidden;transition:border-color .3s,background .3s;}
        .stc:hover{border-color:rgba(220,74,17,.35);background:rgba(220,74,17,.05);}
        .stn{font-family:'Cormorant Garamond',serif;font-size:70px;font-weight:800;line-height:1;color:rgba(220,74,17,.13);position:absolute;top:-8px;left:-6px;}

        /* Testi card */
        .tc{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:26px;transition:border-color .3s,transform .3s;}
        .tc:hover{border-color:rgba(220,74,17,.3);transform:translateY(-4px);}

        /* Nbr card */
        .nc{position:relative;border-radius:12px;overflow:hidden;cursor:pointer;transition:transform .35s,box-shadow .35s;border:1px solid rgba(220,74,17,.12);}
        .nc:hover{transform:translateY(-5px);box-shadow:0 18px 48px rgba(220,74,17,.2);}
        .nc img{width:100%;height:155px;object-fit:cover;transition:transform .5s;}
        .nc:hover img{transform:scale(1.08);}
        .nc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.84) 0%,transparent 55%);}
        .nc-ct{position:absolute;bottom:0;left:0;right:0;padding:14px;}

        /* CTA */
        .cta-sec{background:linear-gradient(135deg,#180a04 0%,#0c0602 40%,#1c0c05 100%);position:relative;overflow:hidden;}
        .cta-glow{position:absolute;width:550px;height:550px;border-radius:50%;background:radial-gradient(circle,rgba(220,74,17,.17) 0%,transparent 70%);top:-180px;left:50%;transform:translateX(-50%);pointer-events:none;}

        /* Buttons */
        .bp{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;letter-spacing:.04em;background:var(--brand);color:#fff;border:none;border-radius:999px;padding:13px 30px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .25s,transform .2s,box-shadow .25s;box-shadow:0 8px 28px rgba(220,74,17,.35);}
        .bp:hover{background:#b83a0c;transform:translateY(-2px);box-shadow:0 14px 40px rgba(220,74,17,.45);}
        .bo{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;letter-spacing:.04em;background:transparent;color:var(--brand);border:2px solid var(--brand);border-radius:999px;padding:12px 28px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .25s,color .25s,transform .2s;}
        .bo:hover{background:var(--brand);color:#fff;transform:translateY(-2px);}

        /* Misc */
        @keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 rgba(220,74,17,.6)}50%{box-shadow:0 0 0 7px rgba(220,74,17,0)}}
        .dp{animation:pulse-dot 2s infinite;}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .fl{animation:float 4s ease-in-out infinite;}
        @keyframes prog{from{width:0%}to{width:100%}}
        .pb{animation:prog 3.5s linear;}
        @keyframes bounce-d{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
        .bd{animation:bounce-d 2s ease-in-out infinite;}
        .stars{color:#f5a623;letter-spacing:2px;font-size:13px;}

        /* Pill */
        .pill{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.13);backdrop-filter:blur(8px);border-radius:999px;padding:5px 13px;color:#d0c8c0;font-family:'Syne',sans-serif;font-size:12px;font-weight:500;}

        /* Footer */
        .footer{background:var(--dark);border-top:1px solid rgba(220,74,17,.18);padding:60px 24px 32px;}

        /* Responsive */
        @media(max-width:640px){.hide-m{display:none!important;}}
        .divider{width:52px;height:3px;background:linear-gradient(90deg,var(--brand),var(--brand-light));border-radius:2px;margin:0 auto 20px;}
      `}</style>

      {/* ══════════════════════════════════════
          §1  HERO — full viewport
      ══════════════════════════════════════ */}
      <section className="hero-sec">
        <video src={mahesh} autoPlay loop muted playsInline className="hero-vid" />
        <div className="hero-ov" />

        {/* Dot nav left */}
        <div className="hide-m" style={{ position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",zIndex:30,display:"flex",flexDirection:"column",gap:16 }}>
          {fakeSlides.map((_,i) => (
            <button key={i} onClick={() => setSlideIdx(i)} aria-label={`Slide ${i+1}`}
              className={i===slideIdx?"dp":""}
              style={{ width:10,height:10,borderRadius:"50%",border:"1px solid rgba(255,255,255,.5)",background:i===slideIdx?"var(--brand)":"rgba(255,255,255,.2)",cursor:"pointer",transition:"all .3s",transform:i===slideIdx?"scale(1.3)":"scale(1)" }} />
          ))}
        </div>

        {/* Slide card top-right */}
        <div className={`sc hf d1 ${loaded?"in":""}`} style={{ position:"absolute",top:22,right:22,zIndex:30,padding:16,maxWidth:285 }}>
          <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
            <div style={{ position:"relative",flexShrink:0 }}>
              <img src={fakeSlides[slideIdx].image} alt="" style={{ width:62,height:62,borderRadius:10,objectFit:"cover",border:"1.5px solid rgba(220,74,17,.4)" }} />
              <span className="fl fu" style={{ position:"absolute",top:-8,right:-8,background:"var(--brand)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:999 }}>NEW</span>
            </div>
            <div>
              <p className="fu" style={{ fontWeight:700,fontSize:14,color:"var(--brand)",marginBottom:3 }}>{fakeSlides[slideIdx].title}</p>
              <p className="fb" style={{ fontSize:12,color:"rgba(255,255,255,.62)",lineHeight:1.5 }}>{fakeSlides[slideIdx].desc}</p>
              <span className="fu" style={{ display:"inline-block",marginTop:8,background:"rgba(220,74,17,.14)",border:"1px solid rgba(220,74,17,.3)",color:"#ff8c5a",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:999 }}>{fakeSlides[slideIdx].badge}</span>
            </div>
          </div>
          <div style={{ marginTop:12,height:2,background:"rgba(255,255,255,.08)",borderRadius:2,overflow:"hidden" }}>
            <div key={slideIdx} className="pb" style={{ height:"100%",background:"var(--brand)",borderRadius:2 }} />
          </div>
        </div>

        {/* Location badge bottom-left */}
        <div className={`glass hf d6 ${loaded?"in":""} hide-m`} style={{ position:"absolute",bottom:70,left:22,zIndex:30,display:"flex",alignItems:"center",gap:8,padding:"7px 16px",borderRadius:999 }}>
          <span style={{ width:8,height:8,borderRadius:"50%",background:"#4ade80",display:"inline-block" }} />
          <MdLocationOn style={{ color:"var(--brand)",fontSize:14 }} />
          <span className="fu" style={{ fontSize:12,color:"rgba(255,255,255,.72)" }}>Hyderabad, Telangana</span>
        </div>

        {/* Main content */}
        <div className="hero-cnt">
          {/* Trust badge */}
          <div className={`glass hf d1 ${loaded?"in":""}`} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 20px",borderRadius:999,border:"1px solid rgba(220,74,17,.3)",marginBottom:20 }}>
            <MdOutlineVerified style={{ color:"var(--brand)",fontSize:15 }} />
            <span className="fu" style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:"var(--brand)" }}>Hyderabad's #1 Rental Platform</span>
          </div>

          {/* Headline */}
          <h1 className={`fd hf d2 ${loaded?"in":""}`}
            style={{ fontSize:"clamp(34px,6.5vw,80px)",fontWeight:800,color:"#f5f0eb",lineHeight:1.07,marginBottom:16,textShadow:"0 4px 40px rgba(0,0,0,.6)",maxWidth:860 }}>
            Find Your Ideal{" "}
            <em className="gw" style={{ fontStyle:"italic" }}>Home Away</em>
            <br />From Home
          </h1>

          {/* Subline */}
          <p className={`fb hf d3 ${loaded?"in":""}`}
            style={{ fontWeight:300,fontSize:"clamp(14px,2vw,20px)",color:"rgba(255,255,255,.62)",marginBottom:26,maxWidth:560 }}>
            Verified rooms, flats, hostels & hotels across Hyderabad — hand-checked, zero brokerage, instant booking.
          </p>

          {/* Category tabs */}
          <div className={`hf d4 ${loaded?"in":""}`} style={{ display:"flex",gap:"clamp(12px,3vw,30px)",marginBottom:20,flexWrap:"wrap",justifyContent:"center" }}>
            {categories.map(({ label, emoji }) => (
              <button key={label} className={`ct ${activeCategory===label?"on":""}`}
                onClick={() => { setActiveCategory(label); navigate("/main"); }}>
                <span style={{ marginRight:5 }}>{emoji}</span>{label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className={`hf d5 ${loaded?"in":""}`} style={{ position:"relative",width:"100%",display:"flex",justifyContent:"center",marginBottom:22 }}>
            <form onSubmit={handleSubmit} style={{ width:"100%",display:"flex",justifyContent:"center" }}>
              <div style={{ position:"relative",width:"min(92%,610px)" }}>
                <FaMapMarkerAlt style={{ position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",color:"var(--brand)",fontSize:15,zIndex:10 }} />
                <input ref={inputRef} type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="si"
                  style={{ width:"100%",padding:"15px 52px 15px 46px",borderRadius:999 }}
                  placeholder="Area, Address, City, House Name or Flat No..." />
                <button type="submit"
                  style={{ position:"absolute",right:5,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"var(--brand)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(220,74,17,.45)",transition:"background .2s,transform .2s" }}>
                  <BiSearchAlt style={{ color:"#fff",fontSize:20 }} />
                </button>
              </div>
            </form>
          </div>

          {/* Amenity pills */}
          <div className={`hf d6 ${loaded?"in":""}`} style={{ display:"flex",flexWrap:"wrap",justifyContent:"center",gap:8 }}>
            {[{i:<FaWifi/>,l:"Free Wi-Fi"},{i:<MdSecurity/>,l:"24/7 Security"},{i:<IoBedOutline/>,l:"Furnished"},{i:<MdOutlineVerified/>,l:"Verified"},{i:<BsShieldCheck/>,l:"Zero Brokerage"},{i:<FaStar/>,l:"Top Rated"}].map(({i,l}) => (
              <span key={l} className="pill"><span style={{ color:"var(--brand)" }}>{i}</span>{l}</span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="bd" style={{ position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:30,display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
          <span className="fu" style={{ fontSize:10,textTransform:"uppercase",letterSpacing:".15em",color:"rgba(255,255,255,.35)" }}>Scroll</span>
          <div style={{ width:1,height:34,background:"linear-gradient(to bottom,rgba(220,74,17,.55),transparent)" }} />
        </div>
      </section>

      {/* ══════════════════════════════════════
          §2  STATS STRIP
      ══════════════════════════════════════ */}
      <div className={`stat-strip sect ${sv("s")?"vis":""}`} data-section="s"
        style={{ display:"flex",justifyContent:"center",padding:"38px 24px" }}>
        <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"center",maxWidth:820,width:"100%" }}>
          {stats.map((s,i) => (
            <div key={i} style={{ flex:"1 1 150px",textAlign:"center",padding:"10px 22px",borderRight:i<stats.length-1?"1px solid rgba(255,255,255,.08)":"none" }}>
              <div className="sv">{s.value}</div>
              <div className="sl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          §3  BROWSE CATEGORIES
      ══════════════════════════════════════ */}
      <section className={`s-dark sect ${sv("c")?"vis":""}`} data-section="c" style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <div className="sec-lbl">Browse By Type</div>
            <h2 className="sec-ttl" style={{ fontSize:"clamp(32px,5vw,60px)",marginBottom:14 }}>
              Every Kind of <span className="gw">Stay</span>, Sorted
            </h2>
            <p className="sec-sub" style={{ maxWidth:500,margin:"0 auto",fontSize:16 }}>
              From student PGs to executive apartments — find exactly what you need, where you need it.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:18 }}>
            {categories.map(({ label, emoji, desc, img }) => (
              <div key={label} className="cc" onClick={() => navigate("/main")}>
                <img src={img} alt={label} />
                <div className="cc-ov" />
                <div className="cc-ct">
                  <div style={{ fontSize:22,marginBottom:5 }}>{emoji}</div>
                  <p className="fu" style={{ fontWeight:700,fontSize:16,color:"#fff",marginBottom:5 }}>{label}</p>
                  <p className="fb" style={{ fontSize:12,color:"rgba(255,255,255,.58)",lineHeight:1.55 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §4  WHY ROOMIII
      ══════════════════════════════════════ */}
      <section className={`s-darker sect ${sv("f")?"vis":""}`} data-section="f" style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:52 }}>
            <div className="sec-lbl">Why Roomiii</div>
            <h2 className="sec-ttl" style={{ fontSize:"clamp(30px,5vw,58px)",marginBottom:14 }}>
              Renting, <span className="gw">Reimagined</span>
            </h2>
            <p className="sec-sub" style={{ maxWidth:480,margin:"0 auto",fontSize:16 }}>
              We built the platform we wished existed when we moved to Hyderabad.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:20 }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="fc">
                <div style={{ color:"var(--brand)",marginBottom:14 }}>{icon}</div>
                <h3 className="fu" style={{ fontWeight:700,fontSize:17,color:"#f0ebe5",marginBottom:10 }}>{title}</h3>
                <p className="fb" style={{ fontSize:14,color:"#7a736d",lineHeight:1.72 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §5  HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className={`s-mid sect ${sv("h")?"vis":""}`} data-section="h" style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:1060,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:52 }}>
            <div className="sec-lbl">Simple Process</div>
            <h2 className="sec-ttl" style={{ fontSize:"clamp(30px,5vw,58px)",marginBottom:14 }}>
              Move In <span className="gw">4 Steps</span>
            </h2>
            <p className="sec-sub" style={{ maxWidth:440,margin:"0 auto",fontSize:16 }}>No guesswork. No brokers. Just find, visit, sign and move in.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:22 }}>
            {howItWorks.map(({ step, title, desc }) => (
              <div key={step} className="stc">
                <span className="stn">{step}</span>
                <h3 className="fu" style={{ fontWeight:700,fontSize:16,color:"#f0ebe5",marginBottom:10,paddingTop:30 }}>{title}</h3>
                <p className="fb" style={{ fontSize:14,color:"#6e6760",lineHeight:1.72 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §6  NEIGHBOURHOODS
      ══════════════════════════════════════ */}
      <section className={`s-darker sect ${sv("n")?"vis":""}`} data-section="n" style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <div className="sec-lbl">Hyderabad</div>
            <h2 className="sec-ttl" style={{ fontSize:"clamp(30px,5vw,58px)",marginBottom:14 }}>
              Explore <span className="gw">Neighbourhoods</span>
            </h2>
            <p className="sec-sub" style={{ maxWidth:460,margin:"0 auto",fontSize:16 }}>Find your ideal area — near your office, campus, or wherever life takes you.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:16 }}>
            {neighborhoods.map(({ name, count, img }) => (
              <div key={name} className="nc" onClick={() => navigate("/main")}>
                <img src={img} alt={name} />
                <div className="nc-ov" />
                <div className="nc-ct">
                  <p className="fu" style={{ fontWeight:700,fontSize:14,color:"#fff",marginBottom:2 }}>{name}</p>
                  <p className="fb" style={{ fontSize:12,color:"rgba(220,74,17,.88)" }}>{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §7  TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className={`s-dark sect ${sv("t")?"vis":""}`} data-section="t" style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:1060,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:52 }}>
            <div className="sec-lbl">Real Stories</div>
            <h2 className="sec-ttl" style={{ fontSize:"clamp(30px,5vw,56px)",marginBottom:14 }}>
              Loved by <span className="gw">18,000+</span> Tenants
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:20 }}>
            {testimonials.map(({ name, role, text, avatar, stars }) => (
              <div key={name} className="tc">
                <FaQuoteLeft style={{ color:"var(--brand)",opacity:.45,fontSize:20,marginBottom:12 }} />
                <p className="fb" style={{ fontSize:14,color:"#c0b8b0",lineHeight:1.78,marginBottom:20 }}>{text}</p>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <img src={avatar} alt={name} style={{ width:44,height:44,borderRadius:"50%",border:"2px solid rgba(220,74,17,.3)" }} />
                  <div>
                    <p className="fu" style={{ fontWeight:700,fontSize:14,color:"#f0ebe5" }}>{name}</p>
                    <p className="fb" style={{ fontSize:12,color:"#8a8078" }}>{role}</p>
                    <div className="stars">{"★".repeat(stars)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          §8  CTA BANNER
      ══════════════════════════════════════ */}
      <section className={`cta-sec sect ${sv("cta")?"vis":""}`} data-section="cta" style={{ padding:"90px 24px",textAlign:"center" }}>
        <div className="cta-glow" />
        <div style={{ position:"relative",zIndex:2,maxWidth:680,margin:"0 auto" }}>
          <div className="sec-lbl" style={{ marginBottom:16 }}>Get Started Today</div>
          <h2 className="sec-ttl" style={{ fontSize:"clamp(28px,5vw,60px)",marginBottom:18 }}>
            Your Perfect Room is{" "}
            <span className="gw">One Search Away</span>
          </h2>
          <p className="sec-sub" style={{ fontSize:16,marginBottom:36 }}>
            Join thousands of happy tenants who found their ideal home in Hyderabad — without brokers, without stress.
          </p>
          <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap" }}>
            <button className="bp" onClick={() => navigate("/main")}>Browse Listings <FaArrowRight /></button>
            <button className="bo"><FaPhoneAlt style={{ fontSize:13 }} /> Talk to Us</button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="footer">
        <div style={{ maxWidth:1060,margin:"0 auto" }}>
          <div style={{ display:"flex",flexWrap:"wrap",gap:40,justifyContent:"space-between",marginBottom:48 }}>
            {/* Brand */}
            <div style={{ maxWidth:280 }}>
              <h3 className="fd" style={{ fontSize:34,fontWeight:800,color:"var(--brand)",marginBottom:10 }}>Roomiii</h3>
              <p className="fb" style={{ fontSize:14,color:"#6e6760",lineHeight:1.72 }}>Hyderabad's most trusted rental platform. Verified listings, zero brokerage, and a team that actually cares.</p>
            </div>
            {/* Explore */}
            <div>
              <h4 className="fu" style={{ fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:".12em",color:"#f0ebe5",marginBottom:16 }}>Explore</h4>
              {["Rooms","Hostels","Flats","Hotels","Restaurants"].map(l => (
                <p key={l} className="fb" onClick={() => navigate("/main")} style={{ fontSize:14,color:"#6e6760",marginBottom:10,cursor:"pointer" }}
                  onMouseEnter={e=>e.target.style.color="var(--brand)"} onMouseLeave={e=>e.target.style.color="#6e6760"}>{l}</p>
              ))}
            </div>
            {/* Areas */}
            <div>
              <h4 className="fu" style={{ fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:".12em",color:"#f0ebe5",marginBottom:16 }}>Top Areas</h4>
              {["HITEC City","Gachibowli","Madhapur","Kondapur","Banjara Hills"].map(l => (
                <p key={l} className="fb" onClick={() => navigate("/main")} style={{ fontSize:14,color:"#6e6760",marginBottom:10,cursor:"pointer" }}
                  onMouseEnter={e=>e.target.style.color="var(--brand)"} onMouseLeave={e=>e.target.style.color="#6e6760"}>{l}</p>
              ))}
            </div>
            {/* Contact */}
            <div>
              <h4 className="fu" style={{ fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:".12em",color:"#f0ebe5",marginBottom:16 }}>Contact</h4>
              {[{e:"📍",t:"Hyderabad, Telangana"},{e:"📞",t:"+91 9356956798"},{e:"✉️",t:"abdulkhan333c@gmail.com"}].map(({e,t}) => (
                <p key={t} className="fb" style={{ fontSize:14,color:"#6e6760",marginBottom:10 }}>{e} {t}</p>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:24,textAlign:"center" }}>
            <p className="fb" style={{ fontSize:13,color:"#4e4844" }}>
              &copy; {new Date().getFullYear()} <span style={{ color:"var(--brand)",fontWeight:700 }}>Roomiii</span> — Developed by Abdul Khan · All rights reserved
            </p>
          </div>
        </div>
      </footer>

    </>
  );
};

export default Hero;