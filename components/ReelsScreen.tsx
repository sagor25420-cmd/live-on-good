import React, { useRef, useState } from 'react';
import { ArrowLeft, Heart, Plus, Video, Share2, MessageCircle, Music2, User, Send, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Reel } from '../types';

interface ReelsScreenProps {
  onBack: () => void;
}

const ReelsScreen: React.FC<ReelsScreenProps> = ({ onBack }) => {
  const { reels, addReel } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { userProfile } = useAppContext();

  // State for opening comment modal
  const [activeCommentReelId, setActiveCommentReelId] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      const videoUrl = URL.createObjectURL(file);
      
      addReel({
          id: Date.now().toString(),
          videoUrl: videoUrl,
          caption: `My new video ✨`,
          likes: 0,
          isLiked: false,
          comments: [],
          userName: userProfile.name,
          userAvatar: userProfile.avatar,
          isFollowed: false,
          timestamp: Date.now()
      });
      setUploading(false);
    }
  };

  const openComments = (id: string) => setActiveCommentReelId(id);
  const closeComments = () => setActiveCommentReelId(null);

  return (
    <div className="h-screen bg-black relative">
      {/* Top Header (Transparent) */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full text-white bg-black/20 backdrop-blur-md">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-white drop-shadow-md">Reels</h1>
        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-white bg-black/20 backdrop-blur-md rounded-full">
            <Plus size={24}/>
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
      </div>

      {/* Main Feed - Scroll Snap */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
        {reels.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Video size={64} className="mb-4 opacity-50" />
                <p>No reels yet.</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-white text-black px-6 py-2 rounded-full font-bold">Upload Video</button>
            </div>
        ) : (
            reels.map((reel) => (
                <ReelItem key={reel.id} reel={reel} onOpenComments={() => openComments(reel.id)} />
            ))
        )}
      </div>

      {/* Comment Modal/Drawer */}
      {activeCommentReelId && (
          <CommentModal 
            reelId={activeCommentReelId} 
            onClose={closeComments} 
          />
      )}

      {uploading && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center text-white">
              <div className="animate-pulse font-bold">Uploading...</div>
          </div>
      )}
    </div>
  );
};

// Individual Reel Component
const ReelItem: React.FC<{ reel: Reel, onOpenComments: () => void }> = ({ reel, onOpenComments }) => {
    const { likeReel, toggleFollow } = useAppContext();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const handleVideoPress = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="h-screen w-full snap-start relative flex items-center justify-center bg-gray-900">
            {/* Video */}
            <video 
                ref={videoRef}
                src={reel.videoUrl}
                className="h-full w-full object-cover"
                loop
                autoPlay
                playsInline
                onClick={handleVideoPress}
            />

            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="bg-black/30 p-4 rounded-full">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                     </div>
                </div>
            )}

            {/* Right Sidebar Actions */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
                {/* Avatar & Follow */}
                <div className="relative mb-2">
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-700">
                         {reel.userAvatar ? (
                             <img src={reel.userAvatar} alt="" className="w-full h-full object-cover"/>
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-white"><User size={20}/></div>
                         )}
                    </div>
                    {!reel.isFollowed && (
                        <button 
                            onClick={() => toggleFollow(reel.id)}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            <Plus size={12} strokeWidth={4} />
                        </button>
                    )}
                </div>

                {/* Like */}
                <div className="flex flex-col items-center">
                    <button onClick={() => likeReel(reel.id)}>
                        <Heart size={32} className={`transition-transform active:scale-75 ${reel.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                    <span className="text-white text-xs font-bold mt-1 shadow-black drop-shadow-md">{reel.likes}</span>
                </div>

                {/* Comment */}
                <div className="flex flex-col items-center">
                    <button onClick={onOpenComments}>
                        <MessageCircle size={32} className="text-white" />
                    </button>
                    <span className="text-white text-xs font-bold mt-1 shadow-black drop-shadow-md">{reel.comments.length}</span>
                </div>

                {/* Share */}
                <button className="flex flex-col items-center">
                    <Share2 size={30} className="text-white" />
                    <span className="text-white text-xs font-bold mt-1">Share</span>
                </button>
                
                {/* Vinyl/Music Icon Animation */}
                <div className="w-10 h-10 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center animate-spin-slow mt-2">
                    <img src="https://via.placeholder.com/40" className="rounded-full w-full h-full opacity-50" />
                </div>
            </div>

            {/* Bottom Info Area */}
            <div className="absolute bottom-4 left-4 right-16 z-10 text-white">
                <h3 className="font-bold text-md mb-1 drop-shadow-md">@{reel.userName.replace(/\s+/g, '').toLowerCase()}</h3>
                <p className="text-sm opacity-90 mb-2 drop-shadow-md line-clamp-2">{reel.caption}</p>
                <div className="flex items-center gap-2 text-xs font-medium bg-white/20 px-3 py-1 rounded-full w-max backdrop-blur-sm">
                    <Music2 size={12} />
                    <span>Original Audio - {reel.userName}</span>
                </div>
            </div>
            
            {/* Gradient Overlay for visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>
        </div>
    );
};

const CommentModal: React.FC<{ reelId: string, onClose: () => void }> = ({ reelId, onClose }) => {
    const { reels, addComment } = useAppContext();
    const [text, setText] = useState('');
    
    const reel = reels.find(r => r.id === reelId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            addComment(reelId, text);
            setText('');
        }
    };

    if (!reel) return null;

    return (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-t-3xl h-[60vh] flex flex-col w-full shadow-2xl">
                 
                 {/* Header */}
                 <div className="flex justify-between items-center p-4 border-b border-gray-100">
                     <div className="w-8"></div> {/* Spacer */}
                     <h3 className="font-bold text-gray-800 text-sm">{reel.comments.length} comments</h3>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                         <X size={20} className="text-gray-500" />
                     </button>
                 </div>

                 {/* Comment List */}
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {reel.comments.length === 0 ? (
                         <div className="text-center text-gray-400 mt-10 text-sm">No comments yet. Be the first!</div>
                     ) : (
                         reel.comments.map(comment => (
                             <div key={comment.id} className="flex gap-3 items-start">
                                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                                     {comment.username.charAt(0)}
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-xs font-bold text-gray-600 mb-0.5">{comment.username} <span className="font-normal text-gray-400 ml-1">now</span></p>
                                     <p className="text-sm text-gray-800">{comment.text}</p>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>

                 {/* Input */}
                 <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 flex items-center gap-2 bg-gray-50">
                     <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                     />
                     <button 
                        type="submit" 
                        disabled={!text.trim()}
                        className={`p-2 rounded-full transition ${text.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                     >
                         <Send size={18} />
                     </button>
                 </form>
             </div>
             
             {/* Close on background click */}
             <div className="flex-1" onClick={onClose}></div>
        </div>
    );
};

export default ReelsScreen;