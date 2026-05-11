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

        /* Card — the rounded mint rectangle from the design */
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
        }

        /* Title */
        .title {
          font-size: 40px;
          font-weight: 900;
          color: #111;
          letter-spacing: -0.5px;
          margin-bottom: 22px;
          line-height: 1.15;
        }

        /* Subtitle */
        .subtitle {
          font-size: 17px;
          font-weight: 600;
          color: #222;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 320px;
        }

        /* Image placeholder area */
        .image-area {
          width: 280px;
          height: 300px;
          margin-bottom: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* SVG checkmark illustration — replacing the 3D character */
        .checkmark-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* IMAGE PLACEHOLDER — replace .img-placeholder div with:
           <img src="/assets/congrats-character.png" alt="success"
                style={{width:'100%',height:'100%',objectFit:'contain'}} />  */
        .img-placeholder {
          width: 100%;
          height: 100%;
          border: 2.5px dashed #2ecc71;
          border-radius: 16px;
          background: rgba(255,255,255,0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #27ae60;
          font-weight: 800;
          font-size: 13px;
          text-align: center;
        }

        .img-placeholder .big-check {
          font-size: 80px;
          line-height: 1;
        }

        .img-placeholder .hint {
          font-size: 12px;
          color: #27ae60;
          opacity: 0.8;
          max-width: 180px;
          line-height: 1.4;
        }

        /* Ok button */
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
        }

        .ok-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(229,57,53,0.42);
        }

        .ok-btn:active {
          transform: translateY(0);
        }

        /* Pop-in animation */
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.88) translateY(20px); }
          70%  { transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .card {
          animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .title    { animation: fadeUp 0.4s 0.15s ease both; }
        .subtitle { animation: fadeUp 0.4s 0.25s ease both; }
        .image-area { animation: fadeUp 0.4s 0.35s ease both; }
        .ok-btn   { animation: fadeUp 0.4s 0.45s ease both; }
      `}</style>

      <div className="page">
        <div className="card">
          <h1 className="title">Congratulation!</h1>

          <p className="subtitle">
            Your email has already been confirmed. You can now login to the application.
          </p>

          {/* IMAGE AREA — replace .img-placeholder with your <img> tag */}
          <div className="image-area">
            <div className="img-placeholder">
              <span className="big-check">✅</span>
              <span className="hint">
                Replace with your<br />
                3D character + checkmark<br />
                image here
              </span>
            </div>
          </div>

          <button className="ok-btn" onClick={handleOk}>
            Ok
          </button>
        </div>
      </div>
    </>
  );
}
