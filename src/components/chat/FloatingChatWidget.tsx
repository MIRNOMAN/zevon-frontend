"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Paperclip,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  User as UserIcon,
  Bot,
  ExternalLink,
  ChevronDown,
  Check,
  CheckCheck,
  Clock,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
  Ruler,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/features/authSlice";
import { getStoredAuth } from "@/lib/auth-storage";
import {
  useGetChatHistoryQuery,
  useUploadChatAttachmentMutation,
  useMarkChatAsReadMutation,
  ChatMessage,
} from "@/redux/api/chatApi";
import { useTranslation, toBengaliDigits } from "@/lib/i18n";
import { getAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export function FloatingChatWidget() {
  const { t, isBn } = useTranslation();
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [attachmentPreview, setAttachmentPreview] = useState<{ file: File; url: string } | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial chat history from REST API
  const { data: historyRes, refetch: refetchHistory } = useGetChatHistoryQuery(
    { customerId: currentUser?.id || "" },
    { skip: !isAuthenticated || !currentUser?.id }
  );

  const [uploadAttachment, { isLoading: isUploadingFile }] = useUploadChatAttachmentMutation();
  const [markAsRead] = useMarkChatAsReadMutation();

  // Sync REST history into local state
  useEffect(() => {
    if (historyRes?.data?.messages) {
      setLocalMessages(historyRes.data.messages);
    }
  }, [historyRes]);

  // Connect to Socket.IO when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const storedAuth = getStoredAuth();
    const token = storedAuth?.accessToken;
    if (!token) return;

    const backendBase = (
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:5000"
    ).replace(/\/api\/v1\/?$/, "");

    const socket = io(`${backendBase}/chat`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      // Auto-joined to customer room
    });

    socket.on("new_message", (message: ChatMessage) => {
      setLocalMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      if (!isOpen && message.senderId !== currentUser.id) {
        setUnreadCount((c) => c + 1);
      }
    });

    socket.on("user_typing", (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUser.id) {
        setIsAgentTyping(data.isTyping);
      }
    });

    socket.on("messages_read", () => {
      setLocalMessages((prev) =>
        prev.map((m) => (m.senderId === currentUser.id ? { ...m, isRead: true } : m))
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, currentUser?.id, isOpen]);

  // Auto-scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      if (currentUser?.id) {
        markAsRead(currentUser.id).catch(() => {});
        if (socketRef.current) {
          socketRef.current.emit("mark_read", { customerId: currentUser.id });
        }
      }
    }
  }, [isOpen, localMessages.length, currentUser?.id]);

  // Handle typing debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (socketRef.current && currentUser?.id) {
      socketRef.current.emit("typing", {
        roomId: `room_${currentUser.id}`,
        isTyping: true,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("typing", {
          roomId: `room_${currentUser.id}`,
          isTyping: false,
        });
      }, 1500);
    }
  };

  // Handle file select for attachments
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(isBn ? "ফাইলের সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারে।" : "File size must not exceed 10MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAttachmentPreview({ file, url: previewUrl });
    e.target.value = "";
  };

  const removeAttachment = () => {
    if (attachmentPreview?.url) {
      URL.revokeObjectURL(attachmentPreview.url);
    }
    setAttachmentPreview(null);
  };

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent && !attachmentPreview) return;

    if (!isAuthenticated || !currentUser) {
      // Guest interaction
      const guestMsg: ChatMessage = {
        id: `guest_${Date.now()}`,
        roomId: "guest_room",
        senderId: "guest",
        customerId: "guest",
        content: messageContent,
        attachmentUrl: null,
        attachmentType: null,
        isRead: true,
        createdAt: new Date().toISOString(),
      };

      setLocalMessages((prev) => [...prev, guestMsg]);
      setInputText("");

      // Simulated automated Concierge response for guest
      setTimeout(() => {
        const replyContent = isBn
          ? "ধন্যবাদ আপনার বার্তার জন্য। সম্পূর্ণ লাইভ ও ব্যক্তিগত সহায়তার জন্য অনুগ্রহ করে আপনার অ্যাকাউন্টে সাইন ইন করুন।"
          : "Thank you for reaching out! To receive 1-on-1 personalized live support and track your chat history, please sign in to your ZEVON account.";

        const botReply: ChatMessage = {
          id: `bot_${Date.now()}`,
          roomId: "guest_room",
          senderId: "atelier_bot",
          customerId: "guest",
          content: replyContent,
          attachmentUrl: null,
          attachmentType: null,
          isRead: true,
          createdAt: new Date().toISOString(),
          sender: {
            id: "concierge",
            name: "ZEVON Concierge",
            email: "concierge@zevon.com",
            role: "ADMIN",
          },
        };
        setLocalMessages((prev) => [...prev, botReply]);
      }, 800);
      return;
    }

    let uploadedUrl: string | null = null;
    let uploadedType: "IMAGE" | "PDF" | "FILE" | null = null;

    if (attachmentPreview) {
      try {
        const formData = new FormData();
        formData.append("file", attachmentPreview.file);
        const res = await uploadAttachment(formData).unwrap();
        uploadedUrl = res?.data?.url || null;
        uploadedType = res?.data?.attachmentType || "IMAGE";
      } catch (err) {
        console.error("Attachment upload error:", err);
      }
    }

    const payload = {
      content: messageContent || undefined,
      attachmentUrl: uploadedUrl || undefined,
      attachmentType: uploadedType || undefined,
    };

    // Optimistic message update
    const optimisticMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      roomId: `room_${currentUser.id}`,
      senderId: currentUser.id,
      customerId: currentUser.id,
      content: messageContent || null,
      attachmentUrl: uploadedUrl,
      attachmentType: uploadedType,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: "CUSTOMER",
        avatarUrl: currentUser.avatarUrl,
      },
    };

    setLocalMessages((prev) => [...prev, optimisticMsg]);
    setInputText("");
    removeAttachment();

    // Emit to WebSocket
    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", payload, () => {
        refetchHistory();
      });
    } else {
      refetchHistory();
    }
  };

  const quickPrompts = [
    { textEn: "Track my order 📦", textBn: "আমার অর্ডার ট্র্যাক 📦", msgEn: "Hello, I would like to track my recent order status.", msgBn: "হ্যালো, আমি আমার সাম্প্রতিক অর্ডারের স্ট্যাটাস জানতে চাই।" },
    { textEn: "380 GSM Sizing Advice 📏", textBn: "সাইজ ও জিএসএম পরামর্শ 📏", msgEn: "Can you recommend the best size for 380+ GSM heavyweight oversized hoodie?", msgBn: "৩৮০+ জিএসএম ওভারসাইজড হুডির জন্য কোন সাইজটি ভালো হবে?" },
    { textEn: "7-Day Return Policy 🔄", textBn: "৭ দিনের রিটার্ন পলিসি 🔄", msgEn: "How do I initiate a return or exchange for an item?", msgBn: "আমি কিভাবে একটি পণ্যের রিটার্ন বা এক্সচেঞ্জ রিকোয়েস্ট করতে পারি?" },
  ];

  return (
    <>
      {/* ── Floating Chat Button (Bottom-Right) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Live Concierge Chat"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-black/10 dark:ring-white/10 cursor-pointer"
          >
            {/* Ambient Pulse Glow */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-white dark:ring-neutral-950" />
            </span>

            <MessageSquare className="h-6 w-6 group-hover:rotate-6 transition-transform" />

            {/* Unread Message Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[11px] font-black text-white shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── Chat Window / Popover Drawer ── */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[85vh] rounded-3xl bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 ring-1 ring-black/5 dark:ring-white/10">
          {/* ── Header ── */}
          <div className="px-5 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-neutral-950 font-black text-sm uppercase shadow-sm">
                  Z
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-neutral-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black tracking-tight">
                    {isBn ? "জেভন কনসিয়ার্জ" : "ZEVON Atelier Concierge"}
                  </h2>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold uppercase">
                    {isBn ? "সক্রিয়" : "Online"}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {isBn ? "লাইভ স্টাইল ও অর্ডার সহায়তা" : "Live Style & Order Assistance"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Messages Container ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm bg-neutral-50/50 dark:bg-neutral-900/40 scrollbar-thin">
            {/* Concierge Welcome Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-neutral-950 dark:text-white font-bold text-xs">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>{isBn ? "জেভন স্টুডিওতে স্বাগতম" : "Welcome to ZEVON Atelier Concierge"}</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                {isBn
                  ? "আমাদের সাপোর্ট টিম যেকোনো পণ্য, সঠিক সাইজ নির্বাচন এবং অর্ডারের তথ্যে আপনাকে সহায়তা করতে প্রস্তুত।"
                  : "Our team is here to assist with sizing specs, private archive access, and order updates."}
              </p>

              {/* Quick Prompt Chips */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(isBn ? prompt.msgBn : prompt.msgEn)}
                    className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all cursor-pointer border border-neutral-200/60 dark:border-neutral-700/60"
                  >
                    {isBn ? prompt.textBn : prompt.textEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Unauthenticated Note */}
            {!isAuthenticated && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>
                    {isBn
                      ? "১-অন-১ লাইভ চ্যাট হিস্ট্রির জন্য সাইন ইন করুন।"
                      : "Sign in to persist your 1-on-1 concierge history."}
                  </span>
                </div>
                <Link
                  href="/login"
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 font-bold text-[11px] hover:opacity-90"
                >
                  {isBn ? "লগইন" : "Sign In"}
                </Link>
              </div>
            )}

            {/* Message History List */}
            {localMessages.map((msg) => {
              const isMine =
                msg.senderId === currentUser?.id || msg.senderId === "guest";
              const avatarSrc = getAvatarUrl(msg.sender?.avatarUrl);

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-1",
                    isMine ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-end gap-2 max-w-[85%]",
                      isMine ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Avatar for staff/bot */}
                    {!isMine && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-[10px] font-black uppercase overflow-hidden shadow-xs">
                        {avatarSrc ? (
                          <img src={avatarSrc} alt="Staff" className="h-full w-full object-cover" />
                        ) : (
                          <span>Z</span>
                        )}
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-xs leading-relaxed space-y-1.5 break-words shadow-xs",
                        isMine
                          ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-br-xs"
                          : "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-xs border border-neutral-200/70 dark:border-neutral-700/60"
                      )}
                    >
                      {/* Attachment Preview */}
                      {msg.attachmentUrl && (
                        <div className="rounded-xl overflow-hidden mb-1.5 max-h-48">
                          <img
                            src={getAvatarUrl(msg.attachmentUrl) || msg.attachmentUrl}
                            alt="Attachment"
                            className="w-full h-auto object-cover rounded-xl"
                          />
                        </div>
                      )}

                      {msg.content && <p>{msg.content}</p>}

                      <div
                        className={cn(
                          "flex items-center justify-end gap-1 text-[10px] opacity-70",
                          isMine ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-400"
                        )}
                      >
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isMine && (
                          msg.isRead ? (
                            <CheckCheck className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Agent Typing Indicator */}
            {isAgentTyping && (
              <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-[10px] font-bold">
                  Z
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce delay-150" />
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce delay-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Attachment Staging Preview ── */}
          {attachmentPreview && (
            <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={attachmentPreview.url}
                  alt="Staging"
                  className="h-10 w-10 object-cover rounded-lg border border-neutral-300 dark:border-neutral-700"
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-300 truncate max-w-[200px]">
                  {attachmentPreview.file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={removeAttachment}
                className="text-neutral-400 hover:text-rose-500 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Message Input Bar ── */}
          <div className="p-3 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Image Attachment Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFile}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title={isBn ? "ছবি যুক্ত করুন" : "Attach Image"}
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />

              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder={
                  isBn
                    ? "আপনার প্রশ্ন লিখুন..."
                    : "Message ZEVON Concierge..."
                }
                className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 text-xs sm:text-sm text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all"
              />

              <button
                type="submit"
                disabled={(!inputText.trim() && !attachmentPreview) || isUploadingFile}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              >
                {isUploadingFile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
