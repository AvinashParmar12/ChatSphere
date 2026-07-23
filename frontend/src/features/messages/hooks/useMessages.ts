import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useGetMessagesQuery, messageApi } from "../api/message.api";
import type { Message } from "../types/message.types";

export const useMessages = () => {
  const dispatch = useAppDispatch();
  const selectedConversationId = useAppSelector(
    (state) => state.conversations.selectedConversationId
  );
  
  const [page, setPage] = useState(1);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Always track page 1 to get real-time socket updates injected into cache
  const { data: page1Data, isLoading, isError, refetch } = useGetMessagesQuery(
    { conversationId: selectedConversationId as string, page: 1 },
    { skip: !selectedConversationId }
  );

  // Reset local state when conversation changes
  useEffect(() => {
    setPage(1);
    setLocalMessages([]);
    setHasMore(false);
  }, [selectedConversationId]);

  // Sync page 1 updates to local state
  useEffect(() => {
    if (page1Data?.data?.messages) {
      const page1Msgs = [...page1Data.data.messages].reverse(); // Render ASC
      
      setLocalMessages(prev => {
        if (page === 1) {
          return page1Msgs;
        }
        
        // Merge updates from page 1 into existing older messages
        const prevMap = new Map(prev.map(m => [m._id, m]));
        page1Msgs.forEach(m => prevMap.set(m._id, m));
        
        const combined = Array.from(prevMap.values());
        combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return combined;
      });
      
      if (page === 1) {
        setHasMore(page1Data.data.pagination.hasNextPage);
      }
    }
  }, [page1Data, page]);

  const fetchMore = async () => {
    if (isFetchingMore || !hasMore || !selectedConversationId) return;
    
    setIsFetchingMore(true);
    const nextPage = page + 1;
    
    try {
      const response = await dispatch(
        messageApi.endpoints.getMessages.initiate({ 
          conversationId: selectedConversationId, 
          page: nextPage 
        })
      ).unwrap();
      
      const olderMessages = [...response.data.messages].reverse();
      
      setLocalMessages(prev => {
        const prevMap = new Map(prev.map(m => [m._id, m]));
        olderMessages.forEach(m => {
            if (!prevMap.has(m._id)) {
                prevMap.set(m._id, m);
            }
        });
        const combined = Array.from(prevMap.values());
        combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return combined;
      });
      
      setPage(nextPage);
      setHasMore(response.data.pagination.hasNextPage);
    } catch (error) {
      console.error("Failed to fetch older messages", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  return {
    messages: localMessages,
    isLoading: isLoading && page === 1,
    isFetchingMore,
    isError,
    refetch,
    fetchMore,
    hasMore,
  };
};
