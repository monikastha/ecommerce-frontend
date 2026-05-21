import cartoonImg from "../../assets/tickman.png";

export default function CongratulationPage() {
  const handleOk = () => {
    window.location.href = "/login";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Nunito', sans-serif;
          background: #a8f0e0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page {
          min-height: 100vh;
          width: 100%;
          background: #a8f0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .card {
          background: #b2f5e4;
          border-radius: 28px;
          width: 100%;
          max-width: 480px;
          padding: 48px 40px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 8px 40px rgba(0,0,0,0.10);
          animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        .title {
          font-size: 40px;
          font-weight: 900;
          color: #111;
          letter-spacing: -0.5px;
          margin-bottom: 22px;
          line-height: 1.15;
          animation: fadeUp 0.4s 0.15s ease both;
        }

        .subtitle {
          font-size: 17px;
          font-weight: 600;
          color: #222;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 320px;
          animation: fadeUp 0.4s 0.25s ease both;
        }

        .image-area {
          width: 280px;
          height: 300px;
          margin-bottom: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeUp 0.4s 0.35s ease both;
        }

        .ok-btn {
          width: 200px;
          padding: 14px 0;
          background: #e53935;
          color: white;
          font-size: 20px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 16px rgba(229,57,53,0.35);
          transition: opacity 0.15s, transform 0.12s, box-shadow 0.15s;
          animation: fadeUp 0.4s 0.45s ease both;
        }

        .ok-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.88) translateY(20px); }
          70% { transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="page">
        <div className="card">
          <h1 className="title">Congratulation!</h1>

          <p className="subtitle">
            Your email has already been confirmed. You can now login to the application.
          </p>

          {/* IMAGE AREA */}
          <div className="image-area">
            <img
              src={cartoonImg}
              alt="Success"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <button className="ok-btn" onClick={handleOk}>
            Ok
          </button>
        </div>
      </div>
    </>
  );
}