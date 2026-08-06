import { motion, AnimatePresence } from "framer-motion"
import { Download, Link as LinkIcon, Share2, X } from "lucide-react"
import React from "react"

export type ShareModalProps = {
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
  onShareIgStory: () => void
  onCopyLink: () => void
  onNativeShare: () => void
}

export function ShareModal({
  isOpen,
  onClose,
  onDownload,
  onShareIgStory,
  onCopyLink,
  onNativeShare
}: ShareModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl bg-ink/95 border-t border-white/10 p-6 pb-12 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-black uppercase text-cream tracking-widest">
                Share Wrap
              </h3>
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <ShareAction 
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6 text-pink"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                }
                label="IG Story"
                onClick={onShareIgStory}
              />
              <ShareAction 
                icon={<Download className="size-6 text-green" />}
                label="Download"
                onClick={onDownload}
              />
              <ShareAction 
                icon={<LinkIcon className="size-6 text-blue-400" />}
                label="Copy Link"
                onClick={onCopyLink}
              />
              <ShareAction 
                icon={<Share2 className="size-6 text-cream" />}
                label="More"
                onClick={onNativeShare}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ShareAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-3"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-cream/5 border border-white/10 shadow-lg hover:bg-cream/10 transition-colors">
        {icon}
      </div>
      <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-cream/70 text-center">
        {label}
      </span>
    </motion.button>
  )
}
