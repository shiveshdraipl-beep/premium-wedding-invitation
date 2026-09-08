import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays, Clock3, MapPin, Navigation, Share2, Copy, Volume2, VolumeX,
  Heart, ChevronDown, Instagram, MessageCircle, Check, X, Menu
} from "lucide-react";
import { WEDDING } from "./config";
import "./styles.css";

const placeholder = "https://images.unsplash.com/";

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return WEDDING.weddingDate;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

function Countdown() {
  const target = useMemo(() => new Date(WEDDING.countdownTarget).getTime(), []);
  const [left, setLeft] = useState(Math.max(target - Date.now(), 0));

  useEffect(() => {
    const timer = setInterval(() => setLeft(Math.max(target - Date.now(), 0)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  const days = Math.floor(left / 86400000);
  const hours = Math.floor(left / 3600000) % 24;
  const minutes = Math.floor(left / 60000) % 60;
  const seconds = Math.floor(left / 1000) % 60;

  return (
    <div className="countdown" aria-label="Countdown to wedding">
      {[["Days", days], ["Hours", hours], ["Minutes", minutes], ["Seconds", seconds]].map(([label, val]) => (
        <div className="countdown-cell" key={label}>
          <strong>{String(val).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Ornament() {
  return <div className="ornament" aria-hidden="true"><span>✦</span><i></i><span>❧</span><i></i><span>✦</span></div>;
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title reveal">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      <Ornament />
    </div>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(true);
  const [gallery, setGallery] = useState(null);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add("visible"));
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [opened]);

  const share = async () => {
    const data = { title: `${WEDDING.bride} & ${WEDDING.groom}`, text: "You're invited to our wedding!", url: location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch {}
    } else {
      await navigator.clipboard?.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const whatsapp = () => {
    const number = WEDDING.rsvpWhatsapp.replace(/\D/g, "");
    const message = encodeURIComponent(`Hello! I’m ${WEDDING.rsvpGuestName || "[GUEST NAME]"}. I would like to RSVP for ${WEDDING.bride} & ${WEDDING.groom}'s wedding.`);
    window.open(`https://wa.me/${number}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  if (!opened) {
    return (
      <main className="cover">
        <div className="cover-pattern"></div>
        <div className="cover-floral floral-a">❧</div>
        <div className="cover-floral floral-b">❧</div>
        <div className="cover-inner">
          <div className="monogram">{WEDDING.bride[0]} <span>&</span> {WEDDING.groom[0]}</div>
          <p className="cover-small">TOGETHER WITH THEIR FAMILIES</p>
          <div className="cover-line"></div>
          <h1>{WEDDING.bride}<br /><em>&</em><br />{WEDDING.groom}</h1>
          <p className="cover-script">invite you to celebrate their</p>
          <div className="cover-title">SHUBH VIVAH</div>
          <p className="cover-date">{WEDDING.weddingDate}</p>
          <button className="gold-button open-button" onClick={() => setOpened(true)}>
            Open Invitation <ChevronDown size={17} />
          </button>
          <p className="cover-note">A little celebration of a lifetime of love</p>
        </div>
      </main>
    );
  }

  return (
    <main className="site">
      <header className="topbar">
        <a href="#home" className="brand">{WEDDING.bride[0]} & {WEDDING.groom[0]}</a>
        <nav className={menu ? "nav open" : "nav"}>
          {["home","story","events","couple","gallery","venue","rsvp"].map(x =>
            <a key={x} href={`#${x}`} onClick={() => setMenu(false)}>{x}</a>
          )}
        </nav>
        <button className="icon-button mobile-menu" onClick={() => setMenu(v => !v)} aria-label="Menu">
          {menu ? <X size={20}/> : <Menu size={20}/>}
        </button>
        <button className="share-button" onClick={share}>
          {copied ? <Check size={16}/> : <Share2 size={16}/>} <span>{copied ? "Copied" : "Share"}</span>
        </button>
      </header>

      <section id="home" className="hero section">
        <div className="hero-glow"></div>
        <div className="hero-copy reveal">
          <span className="eyebrow">A NEW CHAPTER BEGINS</span>
          <h1>{WEDDING.bride}<br /><em>&</em><br />{WEDDING.groom}</h1>
          <p>{WEDDING.invitationMessage}</p>
          <div className="date-pill"><CalendarDays size={17}/> {WEDDING.weddingDate} · {WEDDING.weddingTime}</div>
        </div>
        <div className="hero-photo frame reveal">
          <img src={WEDDING.couplePhoto} alt="Couple placeholder" />
          <div className="photo-tag">OUR FOREVER</div>
        </div>
        <button className="scroll-cue" onClick={() => document.querySelector("#story")?.scrollIntoView({behavior:"smooth"})} aria-label="Scroll down">
          <span>SCROLL TO EXPLORE</span><ChevronDown />
        </button>
      </section>

      <section id="story" className="section paper-section">
        <SectionTitle eyebrow="OUR STORY" title="Two hearts, one beautiful beginning." text={WEDDING.storyIntro} />
        <div className="story-grid">
          {WEDDING.story.map((item, i) => (
            <article className="story-card reveal" key={item.year}>
              <span>{item.year}</span><h3>{item.title}</h3><p>{item.text}</p>
              {i < WEDDING.story.length - 1 && <div className="story-dot">✦</div>}
            </article>
          ))}
        </div>
      </section>

      <section id="events" className="section events-section">
        <SectionTitle eyebrow="THE CELEBRATIONS" title="Join us for every joyful moment." text="Mark your calendar and come celebrate with our families." />
        <div className="events-grid">
          {WEDDING.events.map((event) => (
            <article className="event-card reveal" key={event.name}>
              <div className="event-icon">{event.icon}</div>
              <span className="event-type">{event.type}</span>
              <h3>{event.name}</h3>
              <div className="event-meta"><CalendarDays size={15}/>{event.date}</div>
              <div className="event-meta"><Clock3 size={15}/>{event.time}</div>
              <div className="event-meta"><MapPin size={15}/>{event.venue}</div>
              <p>{event.description}</p>
            </article>
          ))}
        </div>
        <div className="countdown-wrap reveal">
          <span className="eyebrow">THE COUNTDOWN</span>
          <Countdown />
        </div>
      </section>

      <section id="couple" className="section couple-section">
        <SectionTitle eyebrow="THE COUPLE" title="Meet the two behind this celebration." />
        <div className="couple-grid">
          <div className="person reveal">
            <div className="portrait frame"><img src={WEDDING.bridePhoto} alt={`${WEDDING.bride} placeholder`} /></div>
            <span className="role">THE BRIDE</span><h3>{WEDDING.bride}</h3>
            <p>{WEDDING.brideIntro}</p>
            <small>Daughter of {WEDDING.brideParents}</small>
          </div>
          <div className="heart-mark">♡</div>
          <div className="person reveal">
            <div className="portrait frame"><img src={WEDDING.groomPhoto} alt={`${WEDDING.groom} placeholder`} /></div>
            <span className="role">THE GROOM</span><h3>{WEDDING.groom}</h3>
            <p>{WEDDING.groomIntro}</p>
            <small>Son of {WEDDING.groomParents}</small>
          </div>
        </div>
      </section>

      <section id="gallery" className="section gallery-section">
        <SectionTitle eyebrow="MEMORIES" title="A few moments before forever." />
        <div className="gallery-grid">
          {WEDDING.gallery.map((src, i) => (
            <button className={`gallery-item reveal gallery-${i+1}`} key={src} onClick={() => setGallery(src)}>
              <img src={src} alt={`Wedding gallery placeholder ${i+1}`} loading="lazy" />
              <span>VIEW</span>
            </button>
          ))}
        </div>
      </section>

      <section id="venue" className="section venue-section">
        <div className="venue-card reveal">
          <div>
            <span className="eyebrow">WHERE WE CELEBRATE</span>
            <h2>{WEDDING.venue}</h2>
            <p>{WEDDING.venueAddress}</p>
            <div className="venue-date"><CalendarDays size={17}/> {WEDDING.weddingDate}</div>
            <a className="gold-button" href={WEDDING.mapsLink} target="_blank" rel="noreferrer"><Navigation size={17}/> Get Directions</a>
          </div>
          <div className="map-art" aria-hidden="true">
            <div className="map-pin"><MapPin size={25}/></div>
            <span>YOUR<br/>CELEBRATION<br/>AWAITS</span>
          </div>
        </div>
      </section>

      <section id="rsvp" className="section rsvp-section">
        <SectionTitle eyebrow="KINDLY RSVP" title="Will you celebrate with us?" text="Your presence is the most precious gift. Please let us know if we can count on you." />
        {!rsvpSent ? (
          <form className="rsvp-form reveal" onSubmit={(e) => {e.preventDefault(); setRsvpSent(true);}}>
            <label>Your Name<input required placeholder="[GUEST NAME]" /></label>
            <label>Will you attend?
              <select required><option value="">Please choose</option><option>Joyfully attending</option><option>Sorry, cannot attend</option></select>
            </label>
            <label>Number of guests<input type="number" min="1" max="20" defaultValue="1" /></label>
            <label>A little message<textarea placeholder="Write a note for the couple…"></textarea></label>
            <button className="gold-button" type="submit"><Heart size={17}/> Send RSVP</button>
          </form>
        ) : (
          <div className="success-box reveal"><Check size={32}/><h3>Thank you!</h3><p>Your RSVP has been recorded on this device. For a real guest list, connect this form to your preferred backend.</p></div>
        )}
        <div className="whatsapp-divider"><span>OR</span></div>
        <button className="whatsapp-button" onClick={whatsapp}><MessageCircle size={18}/> RSVP on WhatsApp</button>
      </section>

      <section className="final-section">
        <div className="final-pattern"></div>
        <div className="reveal">
          <span className="eyebrow">WITH ALL OUR LOVE</span>
          <h2>We look forward to<br/><em>celebrating with you.</em></h2>
          <Ornament />
          <p>{WEDDING.bride} & {WEDDING.groom}<br/>{WEDDING.weddingDate}</p>
        </div>
      </section>

      <footer className="footer">
        <span>Made with love for {WEDDING.bride} & {WEDDING.groom}</span>
        <button onClick={() => setMuted(v => !v)} aria-label="Toggle music">
          {muted ? <VolumeX size={16}/> : <Volume2 size={16}/>} Music
        </button>
      </footer>

      <button className="floating-music" onClick={() => setMuted(v => !v)} aria-label="Mute or unmute background music">
        {muted ? <VolumeX/> : <Volume2/>}
      </button>

      {gallery && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setGallery(null)}>
          <button className="lightbox-close" onClick={() => setGallery(null)}><X/></button>
          <img src={gallery} alt="Expanded wedding gallery placeholder" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <audio src={WEDDING.musicUrl} loop autoPlay={!muted} muted={muted} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
