
import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Heart, Plus, Video, Share2, MessageCircle, Music2, User, Send, X, Play } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Reel } from '../types';

interface ReelsScreenProps {
  onBack: () => void;
}

const ReelsScreen: React.FC<ReelsScreenProps> = ({ onBack }) => {
  const { reels, addReel, userProfile } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [activeCommentReelId, setActiveCommentReelId] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      const videoUrl = URL.createObjectURL(file);
      
      addReel({
          id: Date.now().toString(),
          videoUrl: videoUrl,
          caption: `নতুন ভিডিও আপলোড করলাম ✨ #Reels #Trending`,
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
    <div className="h-screen w-full bg-black relative overflow-hidden">
      {/* Top Header Layer */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between pointer-events-none">
        <button 
          onClick={onBack} 
          className="p-2 rounded-full text-white bg-black/30 backdrop-blur-md pointer-events-auto active:scale-90 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-4">
            <span className="text-white font-bold text-lg border-b-2 border-white pb-1 pointer-events-auto">For You</span>
            <span className="text-white/60 font-bold text-lg pb-1 pointer-events-auto">Following</span>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="p-2 text-white bg-black/30 backdrop-blur-md rounded-full pointer-events-auto active:scale-90 transition-transform"
        >
            <Plus size={24}/>
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
      </div>

      {/* Vertical Snap Feed */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
        {reels.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                <div className="bg-gray-800 p-6 rounded-full mb-6">
                    <Video size={64} className="opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">কোনো ভিডিও নেই</h3>
                <p className="text-sm mb-6">প্রথম ভিডিওটি আপলোড করে আপনার যাত্রা শুরু করুন!</p>
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="bg-yellow-500 text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                >
                    ভিডিও আপলোড করুন
                </button>
            </div>
        ) : (
            reels.map((reel) => (
                <ReelItem key={reel.id} reel={reel} onOpenComments={() => openComments(reel.id)} />
            ))
        )}
      </div>

      {/* Comment Drawer */}
      {activeCommentReelId && (
          <CommentModal 
            reelId={activeCommentReelId} 
            onClose={closeComments} 
          />
      )}

      {uploading && (
          <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-bold text-lg animate-pulse">ভিডিও আপলোড হচ্ছে...</div>
          </div>
      )}
    </div>
  );
};

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

    // Auto-play/pause logic using Intersection Observer could be added here for production
    useEffect(() => {
        const currentVideo = videoRef.current;
        return () => {
            if (currentVideo) currentVideo.pause();
        };
    }, []);

    return (
        <div className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
            {/* Full Screen Video Container */}
            <div className="h-full w-full relative flex items-center justify-center" onClick={handleVideoPress}>
                <video 
                    ref={videoRef}
                    src={reel.videoUrl}
                    className="h-full w-full object-cover"
                    loop
                    autoPlay
                    muted={false}
                    playsInline
                />
                
                {/* Play Icon Overlay (visible when paused) */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="bg-black/30 p-6 rounded-full backdrop-blur-sm">
                            <Play size={48} className="text-white fill-white ml-1" />
                         </div>
                    </div>
                )}
            </div>

            {/* Interaction Sidebar (Right) */}
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-6 z-20">
                {/* Profile & Follow */}
                <div className="relative mb-2">
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-700 shadow-lg">
                         {reel.userAvatar ? (
                             <img src={reel.userAvatar} alt="" className="w-full h-full object-cover"/>
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-white"><User size={24}/></div>
                         )}
                    </div>
                    {!reel.isFollowed && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleFollow(reel.id); }}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm active:scale-125 transition-transform"
                        >
                            <Plus size={14} strokeWidth={4} />
                        </button>
                    )}
                </div>

                {/* Like Action */}
                <div className="flex flex-col items-center">
                    <button 
                        onClick={(e) => { e.stopPropagation(); likeReel(reel.id); }}
                        className="group"
                    >
                        <Heart 
                            size={36} 
                            className={`drop-shadow-lg transition-all duration-200 group-active:scale-150 ${reel.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                        />
                    </button>
                    <span className="text-white text-xs font-bold mt-1 drop-shadow-lg">{reel.likes}</span>
                </div>

                {/* Comment Action */}
                <div className="flex flex-col items-center">
                    <button onClick={(e) => { e.stopPropagation(); onOpenComments(); }}>
                        <MessageCircle size={36} className="text-white drop-shadow-lg active:scale-110 transition-transform" />
                    </button>
                    <span className="text-white text-xs font-bold mt-1 drop-shadow-lg">{reel.comments.length}</span>
                </div>

                {/* Share Action */}
                <button className="flex flex-col items-center active:scale-110 transition-transform">
                    <Share2 size={34} className="text-white drop-shadow-lg" />
                    <span className="text-white text-xs font-bold mt-1 drop-shadow-lg">শেয়ার</span>
                </button>
                
                {/* Music Spinning Icon */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 border-2 border-white/30 flex items-center justify-center animate-spin-slow shadow-lg">
                    <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                        <Music2 size={12} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Content Info (Bottom Left) */}
            <div className="absolute bottom-6 left-4 right-16 z-20 text-white pointer-events-none">
                <h3 className="font-bold text-lg mb-1 drop-shadow-lg pointer-events-auto">
                    @{reel.userName.replace(/\s+/g, '').toLowerCase()}
                </h3>
                <p className="text-sm opacity-90 mb-3 drop-shadow-lg line-clamp-2 max-w-[85%] leading-snug pointer-events-auto">
                    {reel.caption}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium bg-black/40 px-3 py-1.5 rounded-full w-max backdrop-blur-md border border-white/10 pointer-events-auto">
                    <Music2 size={14} className="animate-pulse" />
                    <div className="overflow-hidden whitespace-nowrap">
                        <div className="animate-marquee inline-block">
                            Original Audio - {reel.userName} • Original Audio - {reel.userName}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Visual Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 8s linear infinite;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

const CommentModal: React.FC<{ reelId: string, onClose: () => void }> = ({ reelId, onClose }) => {
    const { reels, addComment, userProfile } = useAppContext();
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
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
             <div className="bg-white rounded-t-[24px] h-[70vh] flex flex-col w-full shadow-2xl relative animate-slide-up">
                 
                 {/* Drag Handle & Header */}
                 <div className="flex flex-col items-center">
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full mt-3 mb-1"></div>
                 </div>
                 
                 <div className="flex justify-between items-center p-4 border-b border-gray-50">
                     <h3 className="font-bold text-gray-800 text-sm flex-1 text-center">{reel.comments.length} টি কমেন্ট</h3>
                     <button onClick={onClose} className="absolute right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                         <X size={20} className="text-gray-500" />
                     </button>
                 </div>

                 {/* Comment List */}
                 <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
                     {reel.comments.length === 0 ? (
                         <div className="flex flex-col items-center justify-center h-full text-gray-400">
                             <MessageCircle size={48} className="mb-2 opacity-20" />
                             <p className="text-sm">এখনো কোনো কমেন্ট নেই। প্রথমটি আপনিই করুন!</p>
                         </div>
                     ) : (
                         reel.comments.map(comment => (
                             <div key={comment.id} className="flex gap-3 items-start animate-fade-in">
                                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-100 shrink-0">
                                     {comment.username.charAt(0)}
                                 </div>
                                 <div className="flex-1">
                                     <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-xs font-bold text-gray-800">{comment.username}</p>
                                        <span className="text-[10px] text-gray-400">১ মিনিট আগে</span>
                                     </div>
                                     <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                                     <div className="flex items-center gap-4 mt-2">
                                         <button className="text-[10px] font-bold text-gray-400">উত্তর দিন</button>
                                         <div className="flex items-center gap-1">
                                             <Heart size={12} className="text-gray-300" />
                                             <span className="text-[10px] text-gray-400">০</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>

                 {/* Sticky Input Footer */}
                 <div className="p-4 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold border border-gray-700 shrink-0">
                             {userProfile.name.charAt(0)}
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-1.5 border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all">
                            <input 
                                type="text" 
                                placeholder="একটি কমেন্ট লিখুন..." 
                                className="flex-1 bg-transparent border-none py-1 text-sm focus:outline-none text-gray-800"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <div className="flex gap-3 text-gray-400">
                                <span className="text-lg cursor-pointer hover:scale-110 transition">@</span>
                                <span className="text-lg cursor-pointer hover:scale-110 transition">☺</span>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={!text.trim()}
                            className={`p-2.5 rounded-full transition-all duration-300 ${text.trim() ? 'bg-red-500 text-white shadow-lg active:scale-90' : 'bg-gray-200 text-gray-400'}`}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                 </div>
             </div>
             
             <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
             `}} />
        </div>
    );
};

export default ReelsScreen;
