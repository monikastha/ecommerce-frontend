import { useEffect, useRef, useState } from "react";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type NotificationMessage = {
  event: string;
  order_id?: number;
  order_number?: string;
  total?: string;
  delivery_type?: string;
  order_type?: string;
  created_at?: string;
};

const buildWsUrl = () => {
  try {
    const url = new URL(API_ORIGIN);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${url.host}/ws/notifications/assistant/`;
  } catch (e) {
    // fallback
    const host = API_ORIGIN.replace(/^https?:\/\//, "");
    const proto = API_ORIGIN.startsWith("https") ? "wss" : "ws";
    return `${proto}://${host}/ws/notifications/assistant/`;
  }
};

export default function Notifications() {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnect = useRef(true);
  const reconnectDelay = useRef(1000);

  useEffect(() => {
    let mounted = true;

    const connect = () => {
      if (!mounted) return;
      const wsUrl = buildWsUrl();
      console.info("Connecting notifications websocket to", wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.info("Notifications websocket opened");
        reconnectDelay.current = 1000;
        // request browser notification permission if not granted
        if (typeof window !== "undefined" && (Notification as any).permission !== "granted") {
          try { Notification.requestPermission(); } catch (e) { /* ignore */ }
        }
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as NotificationMessage;
          setMessages((prev) => [data, ...prev].slice(0, 10));
          // persist recent notifications for other UI to read
          try {
            const key = "assistant_notifications";
            const existing = JSON.parse(localStorage.getItem(key) || "[]");
            const next = [{ ...data, received_at: new Date().toISOString() }, ...existing].slice(0, 50);
            localStorage.setItem(key, JSON.stringify(next));
            window.dispatchEvent(new CustomEvent("assistant:notification", { detail: next }));
          } catch (err) {
            // ignore storage errors
          }
          if (typeof window !== "undefined" && (Notification as any).permission === "granted") {
            try { new Notification(`New: ${data.event}`, { body: data.order_number || "" }); } catch (err) { /* ignore */ }
          }
        } catch (err) {
          console.warn("Invalid notification payload", err);
        }
      };

      ws.onerror = (err) => {
        console.error("Notifications websocket error", err);
      };

      ws.onclose = () => {
        console.info("Notifications websocket closed");
        wsRef.current = null;
        if (shouldReconnect.current && mounted) {
          const delay = reconnectDelay.current;
          reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000);
          setTimeout(connect, delay);
        }
      };
    };

    connect();

    return () => {
      mounted = false;
      shouldReconnect.current = false;
      try { wsRef.current?.close(); } catch (e) { /* ignore */ }
    };
  }, []);

  return (
    <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 9999 }}>
      {messages.map((m, i) => (
        <div key={i} style={{ background: "#111827", color: "#fff", padding: 12, marginTop: 8, borderRadius: 8, minWidth: 260 }}>
          <div style={{ fontWeight: 800 }}>{m.event}</div>
          {m.order_number && <div style={{ fontSize: 13 }}>Order: {m.order_number}</div>}
          {m.total && <div style={{ fontSize: 13 }}>Total: Rs. {m.total}</div>}
        </div>
      ))}
    </div>
  );
}
