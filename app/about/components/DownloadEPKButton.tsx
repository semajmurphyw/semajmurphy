"use client";

interface DownloadEPKButtonProps {
  epkUrl: string;
}

export default function DownloadEPKButton({ epkUrl }: DownloadEPKButtonProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(epkUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "EPK.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading EPK:", error);
      // Fallback: open in new tab
      window.open(epkUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full bg-white text-black px-6 py-3 font-medium uppercase transition-all hover:bg-gray-200 rounded"
    >
      Download EPK
    </button>
  );
}

