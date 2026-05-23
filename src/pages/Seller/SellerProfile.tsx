import { useState } from "react";

export default function SajiloMartProfile() {
  const [activeNav, setActiveNav] = useState("");
  const [name, setName] = useState("Binita pariyar");
  const [address, setAddress] = useState("Vyas-3,Tanahun");
  const [contactNo, setContactNo] = useState("00000000");
  const [email, setEmail] = useState("example@gmail.com");

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Product Management",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      label: "Orders Management",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      label: "Customer Engagement",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Logout",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#3a3a3a", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── TOP SYSTEM BAR ── */}
      <div style={{ backgroundColor: "#2c3e50", color: "#ccc", fontSize: "13px", padding: "7px 16px" }}>
        Seller profile 1
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* ══════════════ SIDEBAR ══════════════ */}
        <div
          style={{
            width: "185px",
            minWidth: "185px",
            backgroundColor: "#1e3a5f",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            minHeight: "calc(100vh - 32px)",
          }}
        >
          <div>
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", padding: "22px 12px 18px" }}>
              <div
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              >
                <svg width="54" height="38" viewBox="0 0 54 40" fill="none">
                  <path d="M27 7 Q35 2 44 5"  stroke="#1e3a5f" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                  <path d="M27 7 Q19 2 10 5"  stroke="#1e3a5f" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                  <path d="M27 7 Q36 11 45 8" stroke="#1e3a5f" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
                  <path d="M27 7 Q18 11  9 8" stroke="#1e3a5f" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
                  <path d="M7 14 L12 14 L15 26 L39 26 L42 17 L12 17" stroke="#1e3a5f" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="19" cy="30" r="2.6" fill="#1e3a5f"/>
                  <circle cx="34" cy="30" r="2.6" fill="#1e3a5f"/>
                </svg>
                <div style={{ fontSize: "8px", color: "#1e3a5f", fontWeight: "bold", letterSpacing: "1px", textAlign: "center", marginTop: "2px" }}>
                  SAJILO MART
                </div>
                <div style={{ fontSize: "5.5px", color: "#666", letterSpacing: "0.4px", textAlign: "center" }}>
                  SHOP ANYTIME ANYWHERE
                </div>
              </div>
            </div>

            {/* Nav items */}
            <nav>
              {navItems.map((item) => (
                <div
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    padding: "12px 18px",
                    cursor: "pointer",
                    backgroundColor: activeNav === item.label ? "#e8380d" : "transparent",
                    color: "white",
                    fontWeight: activeNav === item.label ? "600" : "400",
                    fontSize: "13.5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* Profile strip — red */}
          <div
            style={{
              backgroundColor: "#e8380d",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "13px 14px",
            }}
          >
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#bdbdbd", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "white" }}>Profile Name</div>
              <div style={{ fontSize: "10px", color: "#ffd0c0" }}>example@gmail.com</div>
            </div>
          </div>
        </div>

        {/* ══════════════ MAIN CONTENT ══════════════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Navbar — violet border */}
          <div style={{ border: "2.5px solid #7c3aed", backgroundColor: "white" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 20px",
                borderBottom: "1px solid #ebebeb",
              }}
            >
              <div style={{ fontSize: "21px", fontWeight: "700", color: "#111" }}>Good Morning, Binita</div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Search pill */}
                <div
                  style={{
                    display: "flex", alignItems: "center",
                    border: "1px solid #ccc", borderRadius: "20px",
                    padding: "5px 11px", gap: "7px", backgroundColor: "white",
                  }}
                >
                  <div
                    style={{
                      width: "19px", height: "19px", borderRadius: "50%",
                      backgroundColor: "#e8380d",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>Search Product,Order etc.</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>

                {/* Bell */}
                <div style={{ position: "relative", cursor: "pointer" }}>
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <div
                    style={{
                      position: "absolute", top: "-4px", right: "-4px",
                      width: "15px", height: "15px", borderRadius: "50%",
                      backgroundColor: "#e8380d", color: "white",
                      fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold",
                    }}
                  >1</div>
                </div>

                {/* Avatar */}
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#c8a060", flexShrink: 0 }} />
              </div>
            </div>

            {/* Breadcrumb */}
            <div
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "6px 20px", fontSize: "13px", color: "#555",
              }}
            >
              <span>Dashboard</span>
              <span>Home &gt; Dashboard</span>
            </div>
          </div>

          {/* ── WHITE CONTENT AREA ── */}
          <div style={{ flex: 1, padding: "30px", backgroundColor: "white" }}>

            {/* Profile card — grey */}
            <div
              style={{
                backgroundColor: "#c8c8c8",
                borderRadius: "10px",
                padding: "30px 36px 34px",
                maxWidth: "430px",
                margin: "0 auto",
              }}
            >
              {/* Avatar + pencil edit */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "22px" }}>
                <div style={{ position: "relative", marginBottom: "8px" }}>
                  <div style={{ width: "74px", height: "74px", borderRadius: "50%", backgroundColor: "#a0a0a0" }} />
                  <div
                    style={{
                      position: "absolute", bottom: "1px", right: "0",
                      width: "24px", height: "24px", borderRadius: "50%",
                      backgroundColor: "#1e3a5f",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", border: "2px solid #c8c8c8",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: "14px", color: "#111", fontWeight: "500" }}>Binita pariyar</div>
              </div>

              {/* Form rows */}
              {[
                { label: "Name",       value: name,      setter: setName },
                { label: "Address",    value: address,   setter: setAddress },
                { label: "Contact No", value: contactNo, setter: setContactNo },
                { label: "Email",      value: email,     setter: setEmail },
              ].map(({ label, value, setter }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", marginBottom: "14px", gap: "14px" }}>
                  <label style={{ width: "95px", minWidth: "95px", fontSize: "14px", color: "#111" }}>{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    style={{
                      flex: 1, padding: "8px 12px",
                      border: "1px solid #bbb", borderRadius: "4px",
                      fontSize: "13px", backgroundColor: "white", color: "#111", outline: "none",
                    }}
                  />
                </div>
              ))}

              {/* Save */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "22px" }}>
                <button
                  style={{
                    width: "170px", padding: "11px 0",
                    backgroundColor: "#2a6496", color: "white",
                    border: "none", borderRadius: "5px",
                    fontSize: "16px", fontWeight: "500", cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}