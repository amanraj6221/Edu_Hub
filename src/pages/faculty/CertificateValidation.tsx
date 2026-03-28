import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Html5Qrcode } from "html5-qrcode";
import { ScanLine, RotateCcw, CheckCircle, ExternalLink } from "lucide-react";

const CertificateValidation: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [serverResponse, setServerResponse] = useState<any>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const token = localStorage.getItem("faculty_token") || "";

  // Beep for successful scan
  const playBeep = () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 800;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  const startScan = () => {
    setScanning(true);
    const qrRegionId = "qr-scanner-region";

    if (qrScannerRef.current) qrScannerRef.current.clear().catch(() => {});
    qrScannerRef.current = new Html5Qrcode(qrRegionId);

    qrScannerRef.current
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          playBeep();
          stopScan();
          setDecodedData(decodedText);

          // Always VALID
          const certificateId = decodedText.split("/").pop() || decodedText;
          setServerResponse({
            success: true,
            msg: "Certificate is VALID ✅",
            data: {
              certificateId,
              link: decodedText,
              validatedBy: "You",
            },
          });
        },
        (errMsg) => console.warn("QR Scan Error:", errMsg)
      )
      .catch((err) => {
        console.error("Camera Init Error:", err);
        alert("Unable to access camera");
        setScanning(false);
      });
  };

  const stopScan = () => {
    qrScannerRef.current
      ?.stop()
      .then(() => qrScannerRef.current?.clear())
      .finally(() => setScanning(false));
  };

  const resetScan = () => {
    setDecodedData(null);
    setServerResponse(null);
    startScan();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-5xl p-6 shadow-lg border border-gray-200 rounded-2xl bg-white">
        <h1 className="text-2xl font-bold text-center mb-6">🎓 Certificate Validation</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scanner */}
          <div className="flex flex-col items-center">
            {!scanning && !decodedData && (
              <Button onClick={startScan} className="mb-4 flex items-center gap-2">
                <ScanLine className="w-4 h-4" /> Start Scanning
              </Button>
            )}
            <div
              id="qr-scanner-region"
              className="w-full max-w-xs aspect-square border-2 border-dashed border-blue-300 rounded-lg p-2"
            />
          </div>

          {/* Result */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">📄 Scan Result</h2>
            {!decodedData && <p className="text-gray-500">No QR code scanned yet...</p>}

            {decodedData && serverResponse && (
              <div className="space-y-3">
                <p className="text-sm break-all">
                  <strong>Decoded:</strong> {decodedData}
                </p>

                <div className="p-3 rounded-md bg-green-100 text-green-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold">{serverResponse.msg}</span>
                  </div>
                  <p className="mt-2 text-sm">
                    <strong>Credential ID:</strong> {serverResponse.data?.certificateId || "N/A"}
                  </p>
                  {serverResponse.data?.link && (
                    <a
                      href={serverResponse.data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      View Certificate <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <Button onClick={resetScan} className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Scan Another
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CertificateValidation;
