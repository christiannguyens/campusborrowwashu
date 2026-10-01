import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, MapPin, Star, Plus, X, Check, GraduationCap, Laptop, Home,
  Dumbbell, Wrench, Package, ChevronDown, ArrowLeft, Clock, Sparkles,
  Inbox, PackageCheck, CircleSlash, Calendar,
} from "lucide-react";

/* ---------------------------------------------------------------
   Design tokens
--------------------------------------------------------------- */
const C = {
  paper: "#F6F3EC",
  paperDim: "#EFEBE1",
  ink: "#20261F",
  inkSoft: "#5C6459",
  inkFaint: "#8B9186",
  forest: "#2F4B3C",
  forestDeep: "#233A2D",
  forestSoft: "#E3EBE4",
  brick: "#A8462E",
  brickSoft: "#F4E3DC",
  gold: "#BC8A2E",
  goldSoft: "#F5EAD4",
  slate: "#3E5C76",
  slateSoft: "#E3E9EF",
  clay: "#77614C",
  claySoft: "#EEE6DC",
  teal: "#3F6E63",
  tealSoft: "#E2ECE8",
  border: "#E4DFD2",
  borderSoft: "#EDE9DD",
  white: "#FFFFFF",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');`;

/* ---------------------------------------------------------------
   Category metadata
--------------------------------------------------------------- */
const CATEGORIES = [
  { name: "School", icon: GraduationCap, color: C.forest, soft: C.forestSoft },
  { name: "Electronics", icon: Laptop, color: C.slate, soft: C.slateSoft },
  { name: "Dorm", icon: Home, color: C.brick, soft: C.brickSoft },
  { name: "Sports", icon: Dumbbell, color: C.gold, soft: C.goldSoft },
  { name: "Tools", icon: Wrench, color: C.clay, soft: C.claySoft },
  { name: "Other", icon: Package, color: C.teal, soft: C.tealSoft },
];
const catMeta = (name) => CATEGORIES.find((c) => c.name === name) || CATEGORIES[5];

const LOCATIONS = [
  "Olin Library",
  "Danforth University Center",
  "Brookings Hall",
  "Village House",
  "South 40",
  "Mallinckrodt Center",
  "Umrath Hall",
  "Bear's Den",
  "Athletic Complex",
  "Tisch Commons",
];

/* ---------------------------------------------------------------
   Mock seed data
--------------------------------------------------------------- */
const SEED_LISTINGS = [
  { id: "l1", title: "TI-84 Plus Calculator", category: "School", price: 2, location: "Olin Library", rating: 4.9, availability: "today", owner: "Priya S.", ownerYear: "'27", condition: "Like new", description: "Fully charged, works great for calc and stats exams. Just need it back by finals week." },
  { id: "l2", title: "HDMI Cable", category: "Electronics", price: 0, location: "Danforth University Center", rating: 5.0, availability: "today", owner: "Jordan M.", ownerYear: "'26", condition: "Good", description: "6ft HDMI cable, works perfectly for hooking a laptop up to a TV or projector." },
  { id: "l3", title: "Umbrella", category: "Other", price: 1, location: "Brookings Hall", rating: 4.8, availability: "today", owner: "Ava L.", ownerYear: "'25", condition: "Good", description: "Compact black umbrella, survived three St. Louis thunderstorms so far." },
  { id: "l4", title: "Screwdriver Set", category: "Tools", price: 0, location: "Village House", rating: 4.7, availability: "today", owner: "Noah K.", ownerYear: "'26", condition: "Good", description: "12-piece set with Phillips and flathead bits. Great for dorm furniture assembly." },
  { id: "l5", title: "Mini Fridge", category: "Dorm", price: 5, location: "South 40", rating: 4.7, availability: "this week", owner: "Grace T.", ownerYear: "'27", condition: "Good", description: "3.2 cu ft, quiet compressor. Available once I move out of my summer sublet on the 3rd." },
  { id: "l6", title: "Yoga Mat", category: "Sports", price: 2, location: "Mallinckrodt Center", rating: 4.6, availability: "today", owner: "Lena F.", ownerYear: "'28", condition: "Like new", description: "Extra thick, non-slip. Cleaned after every use." },
  { id: "l7", title: "Portable Phone Charger", category: "Electronics", price: 1, location: "Danforth University Center", rating: 4.9, availability: "today", owner: "Marcus D.", ownerYear: "'26", condition: "Like new", description: "10,000mAh, charges an iPhone about twice over. Cable included." },
  { id: "l8", title: "Sewing Kit", category: "Dorm", price: 0, location: "Village House", rating: 5.0, availability: "today", owner: "Sofia R.", ownerYear: "'25", condition: "Good", description: "Everything you need for a quick fix — needles, thread, spare buttons." },
  { id: "l9", title: "Soldering Iron", category: "Tools", price: 3, location: "Umrath Hall", rating: 4.5, availability: "this week", owner: "Ethan W.", ownerYear: "'27", condition: "Fair", description: "40W iron with stand. Great for small electronics projects." },
  { id: "l10", title: "Intro to Microeconomics (Textbook)", category: "School", price: 4, location: "Olin Library", rating: 4.8, availability: "today", owner: "Priya S.", ownerYear: "'27", condition: "Good", description: "Mankiw, 9th edition. Some highlighting in chapters 1-6, otherwise clean." },
  { id: "l11", title: "Basketball", category: "Sports", price: 0, location: "Athletic Complex", rating: 4.9, availability: "today", owner: "Diego H.", ownerYear: "'26", condition: "Good", description: "Indoor/outdoor ball, decent grip left. Perfect for a pickup game at the AC." },
  { id: "l12", title: "Bike Pump", category: "Tools", price: 0, location: "South 40", rating: 4.7, availability: "today", owner: "Grace T.", ownerYear: "'27", condition: "Good", description: "Fits Presta and Schrader valves. Lives in my bike rack locker." },
  { id: "l13", title: "Extension Cord", category: "Electronics", price: 0, location: "Umrath Hall", rating: 5.0, availability: "today", owner: "Noah K.", ownerYear: "'26", condition: "Like new", description: "15ft, 3-outlet. Handy for dorm setups far from the wall." },
  { id: "l14", title: "Desk Lamp", category: "Dorm", price: 2, location: "Village House", rating: 4.6, availability: "this week", owner: "Ava L.", ownerYear: "'25", condition: "Good", description: "Warm and cool light settings, USB port on the base." },
  { id: "l15", title: "Catan Board Game", category: "Other", price: 2, location: "Bear's Den", rating: 4.9, availability: "today", owner: "Marcus D.", ownerYear: "'26", condition: "Like new", description: "Base game, all pieces present. Great for a study-break hangout." },
  { id: "l16", title: "Ring Light", category: "Electronics", price: 3, location: "Tisch Commons", rating: 4.4, availability: "this week", owner: "Lena F.", ownerYear: "'28", condition: "Fair", description: "10-inch, tripod included. Good for presentation recordings or video calls." },
];

const SEED_MY_LISTINGS = [
  { id: "m1", title: "Bluetooth Speaker", category: "Electronics", price: 3, location: "South 40", rating: 4.8, availability: "today", owner: "You", ownerYear: "", condition: "Good", description: "Compact JBL speaker, great battery life. Good for common room hangouts." },
  { id: "m2", title: "Winter Jacket (M)", category: "Dorm", price: 0, location: "South 40", rating: 5.0, availability: "this week", owner: "You", ownerYear: "", condition: "Like new", description: "North Face, men's medium. Only needed it for one snowy week last winter." },
];

const SEED_INCOMING = [
  { id: "in1", listingId: "m1", listingTitle: "Bluetooth Speaker", requester: "Chloe B.", requesterYear: "'27", days: 2, status: "pending" },
];

const SEED_MY_REQUESTS = [
  { id: "r1", listingId: "l5", listingTitle: "Mini Fridge", owner: "Grace T.", days: 4, status: "approved" },
];

let idCounter = 100;
const nextId = (prefix) => `${prefix}${idCounter++}`;

/* ---------------------------------------------------------------
   Small building blocks
--------------------------------------------------------------- */
function Pill({ active, onClick, children, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 14,
        fontWeight: 500,
        padding: "8px 16px",
        borderRadius: 999,
        border: `1px solid ${active ? C.forest : C.border}`,
        background: active ? C.forest : C.white,
        color: active ? C.white : C.inkSoft,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 6,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: C.paperDim, fg: C.inkSoft },
    green: { bg: C.forestSoft, fg: C.forest },
    amber: { bg: C.goldSoft, fg: "#8A6416" },
    red: { bg: C.brickSoft, fg: C.brick },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        background: t.bg,
        color: t.fg,
        fontSize: 12.5,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 999,
        fontFamily: "Inter, sans-serif",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {children}
    </span>
  );
}

function PriceTag({ price }) {
  return price === 0 ? (
    <Badge tone="green">Free</Badge>
  ) : (
    <Badge tone="neutral">${price}/day</Badge>
  );
}

function StatusBadge({ status }) {
  if (status === "approved") return <Badge tone="green"><Check size={12} /> Approved</Badge>;
  if (status === "declined") return <Badge tone="red"><CircleSlash size={12} /> Declined</Badge>;
  return <Badge tone="amber"><Clock size={12} /> Pending</Badge>;
}

/* ---------------------------------------------------------------
   Listing card
--------------------------------------------------------------- */
function ListingCard({ item, onOpen }) {
  const meta = catMeta(item.category);
  const Icon = meta.icon;
  return (
    <button
      onClick={() => onOpen(item)}
      style={{
        textAlign: "left",
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 18,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.15s, transform 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 14, background: meta.soft,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          <Icon size={20} color={meta.color} strokeWidth={2} />
        </div>
        <PriceTag price={item.price} />
      </div>

      <div>
        <h3 style={{ margin: 0, fontFamily: "Space Grotesk, sans-serif", fontSize: 17, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>
          {item.title}
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: -2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.inkSoft, fontSize: 13.5, fontFamily: "Inter, sans-serif" }}>
          <MapPin size={14} color={C.inkFaint} />
          {item.location}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.inkSoft, fontSize: 13.5, fontFamily: "Inter, sans-serif" }}>
            <Star size={14} color={C.gold} fill={C.gold} />
            {item.rating.toFixed(1)}
          </div>
          <span
            style={{
              fontSize: 12.5, fontWeight: 600, fontFamily: "Inter, sans-serif",
              color: item.availability === "today" ? C.forest : C.inkFaint,
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: item.availability === "today" ? C.forest : C.inkFaint,
            }} />
            {item.availability === "today" ? "Available today" : "Available this week"}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------
   Item detail modal
--------------------------------------------------------------- */
function ItemModal({ item, onClose, onRequest }) {
  const [days, setDays] = useState(2);
  const [startDate, setStartDate] = useState("");
  const [step, setStep] = useState("view"); // view | request | sent
  const meta = catMeta(item.category);
  const Icon = meta.icon;

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setStartDate(today.toISOString().slice(0, 10));
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(32,38,31,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white, borderRadius: 24, maxWidth: 460, width: "100%",
          maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(32,38,31,0.25)",
        }}
      >
        <div style={{ padding: "24px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: meta.soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={26} color={meta.color} />
            </div>
            <button onClick={onClose} style={{ background: C.paperDim, border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.inkSoft }}>
              <X size={16} />
            </button>
          </div>

          {step !== "sent" && (
            <>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 24, fontWeight: 700, margin: "16px 0 4px", color: C.ink }}>
                {item.title}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
                <PriceTag price={item.price} />
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13.5, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>
                  <Star size={14} color={C.gold} fill={C.gold} /> {item.rating.toFixed(1)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13.5, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>
                  <MapPin size={14} color={C.inkFaint} /> {item.location}
                </div>
              </div>

              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, lineHeight: 1.6, color: C.inkSoft, margin: "0 0 16px" }}>
                {item.description}
              </p>

              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                <div style={{ flex: 1, background: C.paper, borderRadius: 14, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>CONDITION</div>
                  <div style={{ fontSize: 14, color: C.ink, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{item.condition}</div>
                </div>
                <div style={{ flex: 1, background: C.paper, borderRadius: 14, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LENT BY</div>
                  <div style={{ fontSize: 14, color: C.ink, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{item.owner} {item.ownerYear}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {step === "view" && (
          <div style={{ padding: "0 24px 24px" }}>
            <button
              onClick={() => setStep("request")}
              style={{
                width: "100%", background: C.forest, color: C.white, border: "none",
                borderRadius: 14, padding: "14px 0", fontFamily: "Space Grotesk, sans-serif",
                fontSize: 15.5, fontWeight: 600, cursor: "pointer",
              }}
            >
              Request to borrow
            </button>
          </div>
        )}

        {step === "request" && (
          <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ height: 1, background: C.borderSoft, margin: "0 0 4px" }} />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, fontFamily: "Inter, sans-serif", display: "block", marginBottom: 6 }}>
                Pickup date
              </label>
              <div style={{ position: "relative" }}>
                <Calendar size={16} color={C.inkFaint} style={{ position: "absolute", left: 14, top: 13 }} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px",
                    borderRadius: 12, border: `1px solid ${C.border}`, fontFamily: "Inter, sans-serif",
                    fontSize: 14, color: C.ink, background: C.paper,
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, fontFamily: "Inter, sans-serif", display: "block", marginBottom: 6 }}>
                How many days?
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 16, color: C.ink }}
                >−</button>
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 17, fontWeight: 600, minWidth: 24, textAlign: "center" }}>{days}</span>
                <button
                  onClick={() => setDays((d) => Math.min(14, d + 1))}
                  style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 16, color: C.ink }}
                >+</button>
                {item.price > 0 && (
                  <span style={{ marginLeft: "auto", fontFamily: "Inter, sans-serif", fontSize: 14, color: C.inkSoft }}>
                    Est. total: <strong style={{ color: C.ink }}>${item.price * days}</strong>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => { onRequest(item, days, startDate); setStep("sent"); }}
              style={{
                width: "100%", background: C.forest, color: C.white, border: "none",
                borderRadius: 14, padding: "14px 0", fontFamily: "Space Grotesk, sans-serif",
                fontSize: 15.5, fontWeight: 600, cursor: "pointer", marginTop: 4,
              }}
            >
              Send request
            </button>
          </div>
        )}

        {step === "sent" && (
          <div style={{ padding: "8px 24px 32px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: C.forestSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto 18px" }}>
              <Check size={26} color={C.forest} />
            </div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 19, fontWeight: 700, color: C.ink, margin: "0 0 6px" }}>
              Request sent
            </h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.inkSoft, margin: "0 0 20px", lineHeight: 1.5 }}>
              {item.owner} will get a notification and usually replies within a few hours. You can track this in your dashboard.
            </p>
            <button
              onClick={onClose}
              style={{ background: C.paperDim, border: "none", borderRadius: 12, padding: "10px 20px", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: C.ink, cursor: "pointer" }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   List-an-item modal
--------------------------------------------------------------- */
function ListItemModal({ onClose, onPublish }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("School");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(2);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");

  const canSubmit = title.trim().length > 1 && description.trim().length > 3;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(32,38,31,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 24, maxWidth: 480, width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(32,38,31,0.25)" }}
      >
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 21, fontWeight: 700, color: C.ink, margin: 0 }}>
              List an item
            </h2>
            <button onClick={onClose} style={{ background: C.paperDim, border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.inkSoft }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="What are you lending?">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Electric kettle"
                style={inputStyle}
              />
            </Field>

            <Field label="Category">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIES.map((c) => (
                  <Pill key={c.name} active={category === c.name} onClick={() => setCategory(c.name)}>
                    {c.name}
                  </Pill>
                ))}
              </div>
            </Field>

            <Field label="Where can people pick it up?">
              <div style={{ position: "relative" }}>
                <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={16} color={C.inkFaint} style={{ position: "absolute", right: 14, top: 14, pointerEvents: "none" }} />
              </div>
            </Field>

            <Field label="Condition">
              <div style={{ display: "flex", gap: 8 }}>
                {["Like new", "Good", "Fair"].map((c) => (
                  <Pill key={c} active={condition === c} onClick={() => setCondition(c)}>{c}</Pill>
                ))}
              </div>
            </Field>

            <Field label="Price">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Pill active={isFree} onClick={() => setIsFree(true)}>Free</Pill>
                <Pill active={!isFree} onClick={() => setIsFree(false)}>Paid</Pill>
                {!isFree && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", color: C.inkSoft }}>$</span>
                    <input
                      type="number" min={1} max={20} value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      style={{ ...inputStyle, width: 64, padding: "8px 10px" }}
                    />
                    <span style={{ fontFamily: "Inter, sans-serif", color: C.inkSoft, fontSize: 13.5 }}>/ day</span>
                  </div>
                )}
              </div>
            </Field>

            <Field label="Short description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Anything a borrower should know — condition details, pickup notes, etc."
                rows={3}
                style={{ ...inputStyle, resize: "none", fontFamily: "Inter, sans-serif" }}
              />
            </Field>

            <button
              disabled={!canSubmit}
              onClick={() => onPublish({ title: title.trim(), category, price: isFree ? 0 : price, location, condition, description: description.trim() })}
              style={{
                width: "100%", background: canSubmit ? C.forest : C.paperDim, color: canSubmit ? C.white : C.inkFaint,
                border: "none", borderRadius: 14, padding: "14px 0", fontFamily: "Space Grotesk, sans-serif",
                fontSize: 15.5, fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed", marginTop: 4,
              }}
            >
              Publish listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, fontFamily: "Inter, sans-serif", display: "block", marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12,
  border: `1px solid ${C.border}`, fontFamily: "Inter, sans-serif", fontSize: 14,
  color: C.ink, background: C.paper, outline: "none",
};

/* ---------------------------------------------------------------
   Navbar
--------------------------------------------------------------- */
function Navbar({ view, setView, onList }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(246,243,236,0.9)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={17} color={C.white} />
          </div>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 18, color: C.ink }}>CampusBorrow</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, background: C.paperDim, padding: 4, borderRadius: 999 }}>
          <button
            onClick={() => setView("browse")}
            style={{
              padding: "8px 16px", borderRadius: 999, border: "none", cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14,
              background: view === "browse" ? C.white : "transparent",
              color: view === "browse" ? C.ink : C.inkSoft,
              boxShadow: view === "browse" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            Browse
          </button>
          <button
            onClick={() => setView("dashboard")}
            style={{
              padding: "8px 16px", borderRadius: 999, border: "none", cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14,
              background: view === "dashboard" ? C.white : "transparent",
              color: view === "dashboard" ? C.ink : C.inkSoft,
              boxShadow: view === "dashboard" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            Dashboard
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onList}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: C.forest, color: C.white,
              border: "none", borderRadius: 999, padding: "10px 16px", fontFamily: "Inter, sans-serif",
              fontWeight: 600, fontSize: 13.5, cursor: "pointer",
            }}
          >
            <Plus size={15} /> <span className="hide-mobile">List an item</span>
          </button>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: C.brickSoft, color: C.brick, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 13.5 }}>
            Y
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Hero + Search + Filters
--------------------------------------------------------------- */
function Hero({ query, setQuery, category, setCategory, location, setLocation, availability, setAvailability }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 20px 8px" }}>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 420px" }}>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(32px, 5vw, 46px)", fontWeight: 700, color: C.ink, margin: "0 0 10px", lineHeight: 1.08, letterSpacing: "-0.01em" }}>
            Borrow what you need.<br />Lend what you don't.
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16.5, color: C.inkSoft, margin: "0 0 26px", maxWidth: 480, lineHeight: 1.5 }}>
            Why buy something you'll only use once when another WashU student nearby already has it?
          </p>
        </div>
        <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0, display: "none" }} className="hero-deco">
          <div style={{ position: "absolute", width: 60, height: 60, borderRadius: 18, background: C.forestSoft, top: 0, right: 20, transform: "rotate(-8deg)" }} />
          <div style={{ position: "absolute", width: 44, height: 44, borderRadius: 14, background: C.brickSoft, bottom: 0, right: 0, transform: "rotate(10deg)" }} />
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={19} color={C.inkFaint} style={{ position: "absolute", left: 18, top: 17 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you need?"
          style={{
            width: "100%", boxSizing: "border-box", padding: "16px 18px 16px 48px",
            borderRadius: 18, border: `1px solid ${C.border}`, background: C.white,
            fontFamily: "Inter, sans-serif", fontSize: 15.5, color: C.ink, outline: "none",
            boxShadow: "0 1px 3px rgba(32,38,31,0.04)",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
        <Pill active={category === "All"} onClick={() => setCategory("All")}>All</Pill>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Pill key={c.name} active={category === c.name} onClick={() => setCategory(category === c.name ? "All" : c.name)}>
              <Icon size={14} /> {c.name}
            </Pill>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              appearance: "none", padding: "9px 34px 9px 14px", borderRadius: 12,
              border: `1px solid ${C.border}`, background: C.white, fontFamily: "Inter, sans-serif",
              fontSize: 13.5, color: C.ink, cursor: "pointer",
            }}
          >
            <option value="All">All locations</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <ChevronDown size={14} color={C.inkFaint} style={{ position: "absolute", right: 12, top: 12, pointerEvents: "none" }} />
        </div>

        <div style={{ display: "flex", gap: 6, background: C.paperDim, padding: 4, borderRadius: 12 }}>
          {[
            { key: "all", label: "Any time" },
            { key: "today", label: "Today" },
            { key: "this week", label: "This week" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setAvailability(opt.key)}
              style={{
                padding: "7px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13,
                background: availability === opt.key ? C.white : "transparent",
                color: availability === opt.key ? C.ink : C.inkSoft,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Empty state
--------------------------------------------------------------- */
function EmptyState({ title, subtitle, icon: Icon = Inbox }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: C.inkSoft }}>
      <div style={{ width: 52, height: 52, borderRadius: 999, background: C.paperDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon size={22} color={C.inkFaint} />
      </div>
      <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 17, fontWeight: 700, color: C.ink, margin: "0 0 6px" }}>{title}</h3>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

/* ---------------------------------------------------------------
   Dashboard
--------------------------------------------------------------- */
function Dashboard({ myListings, myRequests, incoming, setIncoming }) {
  const [tab, setTab] = useState("borrowing");

  const respond = (id, status) => {
    setIncoming((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>
      <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 30, fontWeight: 700, color: C.ink, margin: "0 0 4px" }}>
        Your dashboard
      </h1>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: C.inkSoft, margin: "0 0 24px" }}>
        Track what you're borrowing and manage what you're lending out.
      </p>

      <div style={{ display: "flex", gap: 6, background: C.paperDim, padding: 4, borderRadius: 999, width: "fit-content", marginBottom: 28 }}>
        {[{ key: "borrowing", label: "Borrowing" }, { key: "lending", label: "Lending" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "9px 20px", borderRadius: 999, border: "none", cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14,
              background: tab === t.key ? C.white : "transparent",
              color: tab === t.key ? C.ink : C.inkSoft,
              boxShadow: tab === t.key ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "borrowing" && (
        myRequests.length === 0 ? (
          <EmptyState title="No requests yet" subtitle="Browse listings and request something you need — it'll show up here." icon={PackageCheck} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {myRequests.map((r) => (
              <div key={r.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 15.5, color: C.ink }}>{r.listingTitle}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.inkSoft, marginTop: 2 }}>
                    From {r.owner} · {r.days} day{r.days > 1 ? "s" : ""}
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )
      )}

      {tab === "lending" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 16, fontWeight: 700, color: C.ink, margin: "0 0 12px" }}>
              Incoming requests
            </h3>
            {incoming.length === 0 ? (
              <EmptyState title="Nothing incoming" subtitle="When someone requests one of your listings, it'll show up here." icon={Inbox} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {incoming.map((r) => (
                  <div key={r.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 15.5, color: C.ink }}>{r.listingTitle}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.inkSoft, marginTop: 2 }}>
                        {r.requester} {r.requesterYear} wants it for {r.days} day{r.days > 1 ? "s" : ""}
                      </div>
                    </div>
                    {r.status === "pending" ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => respond(r.id, "declined")} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, color: C.inkSoft, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
                          Decline
                        </button>
                        <button onClick={() => respond(r.id, "approved")} style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: C.forest, color: C.white, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
                          Approve
                        </button>
                      </div>
                    ) : (
                      <StatusBadge status={r.status} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 16, fontWeight: 700, color: C.ink, margin: "0 0 12px" }}>
              Your listings
            </h3>
            {myListings.length === 0 ? (
              <EmptyState title="Nothing listed yet" subtitle="Publish your first item so other students can find it." icon={Package} />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {myListings.map((item) => {
                  const meta = catMeta(item.category);
                  const Icon = meta.icon;
                  return (
                    <div key={item.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: meta.soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={17} color={meta.color} />
                        </div>
                        <PriceTag price={item.price} />
                      </div>
                      <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 15, color: C.ink }}>{item.title}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.inkSoft }}>{item.location}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   Toasts
--------------------------------------------------------------- */
function Toasts({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 200, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: C.forestDeep, color: C.white, padding: "13px 18px", borderRadius: 14,
            fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, display: "flex",
            alignItems: "center", gap: 10, boxShadow: "0 10px 30px rgba(32,38,31,0.25)",
            maxWidth: 320, animation: "toast-in 0.25s ease",
          }}
        >
          <div style={{ width: 22, height: 22, borderRadius: 999, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Check size={12} />
          </div>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   App
--------------------------------------------------------------- */
export default function App() {
  const [view, setView] = useState("browse");
  const [listings, setListings] = useState(SEED_LISTINGS);
  const [myListings, setMyListings] = useState(SEED_MY_LISTINGS);
  const [myRequests, setMyRequests] = useState(SEED_MY_REQUESTS);
  const [incoming, setIncoming] = useState(SEED_INCOMING);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [availability, setAvailability] = useState("all");

  const [selected, setSelected] = useState(null);
  const [showListModal, setShowListModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = (message) => {
    const id = nextId("t");
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      if (query && !item.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (category !== "All" && item.category !== category) return false;
      if (location !== "All" && item.location !== location) return false;
      if (availability !== "all" && item.availability !== availability) return false;
      return true;
    });
  }, [listings, query, category, location, availability]);

  const handleRequest = (item, days, startDate) => {
    setMyRequests((prev) => [
      { id: nextId("r"), listingId: item.id, listingTitle: item.title, owner: item.owner, days, status: "pending" },
      ...prev,
    ]);
    pushToast(`Request sent to ${item.owner} for the ${item.title}`);
  };

  const handlePublish = (data) => {
    const newItem = {
      id: nextId("m"),
      title: data.title,
      category: data.category,
      price: data.price,
      location: data.location,
      rating: 5.0,
      availability: "today",
      owner: "You",
      ownerYear: "",
      condition: data.condition,
      description: data.description,
    };
    setMyListings((prev) => [newItem, ...prev]);
    setListings((prev) => [newItem, ...prev]);
    setShowListModal(false);
    pushToast("Listing published! Other students can now find it.");
    setView("dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.paper }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus, select:focus, textarea:focus { border-color: ${C.forest} !important; }
        ::placeholder { color: ${C.inkFaint}; }
        @keyframes toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (min-width: 720px) { .hero-deco { display: block !important; } }
        @media (max-width: 560px) { .hide-mobile { display: none; } }
      `}</style>

      <Navbar view={view} setView={setView} onList={() => setShowListModal(true)} />

      {view === "browse" ? (
        <>
          <Hero
            query={query} setQuery={setQuery}
            category={category} setCategory={setCategory}
            location={location} setLocation={setLocation}
            availability={availability} setAvailability={setAvailability}
          />
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 20px 80px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.inkSoft, fontWeight: 500 }}>
                {filtered.length} item{filtered.length !== 1 ? "s" : ""} nearby
              </span>
            </div>
            {filtered.length === 0 ? (
              <EmptyState title="No items match yet" subtitle="Try a different category, location, or search term." icon={Search} />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {filtered.map((item) => (
                  <ListingCard key={item.id} item={item} onOpen={setSelected} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <Dashboard myListings={myListings} myRequests={myRequests} incoming={incoming} setIncoming={setIncoming} />
      )}

      {selected && (
        <ItemModal item={selected} onClose={() => setSelected(null)} onRequest={handleRequest} />
      )}
      {showListModal && (
        <ListItemModal onClose={() => setShowListModal(false)} onPublish={handlePublish} />
      )}

      <Toasts toasts={toasts} />
    </div>
  );
}
