// 📂 src/pages/faculty/DocumentVerification.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VerificationResult {
  success: boolean;
  msg: string;
  data?: {
    cards?: { certificateId: string }[];
    parsedQr?: { raw: string[] } | null;
    ocrText?: string;
    validatedBy?: string;
  };
}

const DocumentVerification = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Cleanup preview URL
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Upload & Verify
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({ title: "No file selected", description: "Please select a document", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem("faculty_token");
    if (!token) {
      toast({ title: "Authentication Error", description: "Please login again", variant: "destructive" });
      navigate("/faculty/login");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await fetch("http://localhost:5000/api/faculty/verify-document", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) {
        toast({ title: "Session Expired", description: "Login again", variant: "destructive" });
        localStorage.removeItem("faculty_user");
        navigate("/faculty/login");
        return;
      }

      const result: VerificationResult = await response.json();
      setVerificationResult(result);

      toast({
        title: result.success ? "Verification Successful" : "Verification Failed",
        description: result.msg,
        variant: result.success ? "default" : "destructive",
      });
    } catch (err) {
      console.error("Verification error:", err);
      toast({ title: "Error", description: "Failed to verify document", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload */}
          <div>
            <Label htmlFor="document">Upload Document</Label>
            <Input
              id="document"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="border rounded-md p-2 max-w-sm">
              {selectedFile?.type.includes("image") ? (
                <img src={previewUrl} alt="Preview" className="max-h-40 rounded-md object-contain" />
              ) : (
                <p className="text-sm text-gray-500">📄 PDF Document Selected</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleFileUpload} disabled={!selectedFile || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Verify Document
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate("/faculty/dashboard/home")}>Back to Dashboard</Button>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {verificationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {verificationResult.success ? <CheckCircle className="h-5 w-5 text-green-500" /> :
              <XCircle className="h-5 w-5 text-red-500" />}
              Verification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={verificationResult.success ? "text-green-600" : "text-red-600"}>{verificationResult.msg}</p>
            {verificationResult.data?.validatedBy && (
              <p className="text-sm text-gray-600">✅ Verified by: <span className="font-semibold">{verificationResult.data.validatedBy}</span></p>
            )}

            {/* Certificate IDs */}
            {verificationResult.data?.cards && verificationResult.data.cards.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">🆔 Certificate ID(s)</h3>
                <div className="flex flex-wrap gap-2">
                  {verificationResult.data.cards.map((c, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                      {c.certificateId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* QR Data as Cards */}
            {verificationResult.data?.parsedQr?.raw && verificationResult.data.parsedQr.raw.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">📌 Certificate Links</h3>
                <div className="space-y-2">
                  {verificationResult.data.parsedQr.raw.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 text-blue-600"
                    >
                      {link}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* OCR Text */}
            {verificationResult.data?.ocrText && (
              <div>
                <h3 className="font-semibold mb-2">🔍 OCR Text</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{verificationResult.data.ocrText}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentVerification;
