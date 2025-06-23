'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

export function AgentBubble() {
  const { isAuthenticated, address } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Only show bubble if user is authenticated
  if (!isAuthenticated || !address) {
    return null
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          userAddress: address,
          sessionId: sessionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from agent')
      }

      const data = await response.json()

      if (data.success) {
        const agentMessage: Message = {
          id: `agent_${Date.now()}`,
          role: 'agent',
          content: data.response,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, agentMessage])
        
        // Store session ID for conversation continuity
        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId)
        }
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Agent chat error:', error)
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'agent',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startNewConversation = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'agent',
      content: `Hi! I'm FlowBot, your AI investment advisor for Real World Assets on Flow. I can help you with:\n\n• Portfolio analysis and recommendations\n• Market insights for RWA tokens\n• Educational guidance\n• Risk assessment\n\nWhat would you like to know about your investments?`,
      timestamp: new Date()
    }
    
    setMessages([welcomeMessage])
    setSessionId(null)
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    
    // Start conversation when opening for the first time
    if (!isOpen && messages.length === 0) {
      startNewConversation()
    }
  }

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[9999]">
          <Card className="w-96 h-[500px] shadow-2xl border-metallic-green flex flex-col bg-white overflow-hidden">
            <CardHeader className="bg-green-gradient text-white rounded-t-lg p-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <CardTitle className="text-lg">FlowBot Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-emerald-100">
                AI advisor for RWA investments
              </p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm break-words ${
                          message.role === 'user'
                            ? 'bg-metallic-green text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-emerald-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">FlowBot is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-white shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your portfolio, market trends..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-metallic-green hover:bg-emerald-600 text-white shrink-0"
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Bubble */}
      <Button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg transition-all duration-300 z-[9998] ${
          isOpen 
            ? 'bg-gray-500 hover:bg-gray-600' 
            : 'bg-green-gradient hover:opacity-90 animate-pulse'
        }`}
        size="sm"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </>
  )
}