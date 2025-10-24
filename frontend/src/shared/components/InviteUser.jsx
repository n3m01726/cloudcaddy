// frontend/src/shared/components/InviteUser.jsx
import { useState } from "react";
import { UserPlus, Copy } from "lucide-react";

export default function InviteUser() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const inviteUrl = "https://soundshine.app/signup?ref=friend"; // ton lien de partage

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie :", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center space-x-2"
      >
        <UserPlus className="w-4 h-4" />
        <span>Invite colleagues</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 mt-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
              <h2 className="text-lg font-semibold mb-4">Invite Your Friends & Colleagues</h2>
              <p className="text-sm text-gray-600 mb-3">
                Share this link to invite others to try the app:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                >
                  <Copy size={16} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
