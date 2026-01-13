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
      className="text-white text-2xl md:text-6xl lg:text-6xl font-bold leading-tight hover:underline cursor-pointer text-center md:text-right"
    >
      download epk
    </button>
  );
}
