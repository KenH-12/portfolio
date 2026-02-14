import { useState } from "react";
import { Heart, Reply, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const comments = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "SC",
    role: "Lead Developer",
    content: "The new API rate limiting feature is working great! We've seen a 40% reduction in abuse attempts since deployment.",
    time: "2 hours ago",
    likes: 12,
    replies: [
      {
        id: 11,
        author: "Marcus Johnson",
        avatar: "MJ",
        role: "DevOps Engineer",
        content: "That's excellent news! Should we consider increasing the limits for premium tier users?",
        time: "1 hour ago",
        likes: 5,
      },
    ],
  },
  {
    id: 2,
    author: "Alex Rivera",
    avatar: "AR",
    role: "Product Manager",
    content: "Can we get a dashboard widget showing real-time error rates? It would help the team monitor incidents faster.",
    time: "5 hours ago",
    likes: 8,
    replies: [],
  },
  {
    id: 3,
    author: "Jamie Park",
    avatar: "JP",
    role: "Security Analyst",
    content: "Just finished the security audit on the new endpoints. All clear! ✅ Documentation has been updated.",
    time: "Yesterday",
    likes: 24,
    replies: [
      {
        id: 31,
        author: "Sarah Chen",
        avatar: "SC",
        role: "Lead Developer",
        content: "Thanks Jamie! This clears us for the v2.0 release next week.",
        time: "Yesterday",
        likes: 3,
      },
    ],
  },
];

export function CommentsDemo() {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Comment Input */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 border-2 border-primary/30">
            <AvatarFallback className="bg-primary/20 text-primary font-medium">YO</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full resize-none rounded-xl bg-muted/30 border border-border/50 p-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <CommentCard key={comment.id} comment={comment} index={index} />
        ))}
      </div>
    </div>
  );
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  role: string;
  content: string;
  time: string;
  likes: number;
  replies?: Comment[];
}

function CommentCard({ comment, index, isReply = false }: { comment: Comment; index: number; isReply?: boolean }) {
  const [liked, setLiked] = useState(false);

  return (
    <div 
      className={cn(
        "glass-card rounded-2xl p-6",
        isReply && "ml-14 border-l-2 border-primary/20"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex gap-4">
        <Avatar className={cn("border-2 border-border/50", isReply ? "h-8 w-8" : "h-10 w-10")}>
          <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
            {comment.avatar}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">{comment.author}</span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
              {comment.role}
            </span>
            <span className="text-xs text-muted-foreground">• {comment.time}</span>
          </div>
          
          <p className="mt-2 text-foreground/90 leading-relaxed">{comment.content}</p>
          
          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={() => setLiked(!liked)}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                liked ? "text-destructive" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
              <span>{liked ? comment.likes + 1 : comment.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
            <button className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply, replyIndex) => (
            <CommentCard key={reply.id} comment={reply} index={replyIndex} isReply />
          ))}
        </div>
      )}
    </div>
  );
}
