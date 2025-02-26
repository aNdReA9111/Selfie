import { useContext, useEffect, useRef, useState } from 'react';
import { Button, FormControl, ListGroup } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../context/authContext';
import '../css/chat.css';
import { generateColorFromString } from '../utils/colorUtils';

interface MessageGroup {
    date: string;
    messages: IMessage[];
}

export const Chat = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [allMessages, setAllMessages] = useState<IMessage[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [view, setView] = useState<'chats' | 'search' | 'messages'>('chats');
    const [messageText, setMessageText] = useState<string>('');
    const messageListRef = useRef<HTMLDivElement>(null);
    
    const { user } = useContext(AuthContext);
    
    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (user?._id && isOpen) {
            const fetchMessages = () => {
                fetch(`/api/messages/get/${user?._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        credentials: "include",
                    }
                })
                    .then((response) => response.json())
                    .then((data: IMessage[]) => {
                        const sortedMessages = [...data].sort((a, b) =>
                            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
                        );

                        const uniqueUsers = new Set<string>();
                        const orderedChats: string[] = [];

                        sortedMessages.forEach((message) => {
                            const otherUser = message.from === user?.username ? message.to : message.from;
                            if (!uniqueUsers.has(otherUser) && otherUser !== user?.username) {
                                uniqueUsers.add(otherUser);
                                orderedChats.push(otherUser);
                            }
                        });

                        setActiveChats(orderedChats);
                        setAllMessages(data);

                        if (selectedChat) {
                            const filteredMessages = data.filter(
                                (message) =>
                                    (message.from === user?.username && message.to === selectedChat) ||
                                    (message.from === selectedChat && message.to === user?.username)
                            );
                            setMessages(filteredMessages);
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching messages:', error);
                    });
            };

            fetchMessages();
            interval = setInterval(fetchMessages, 3000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [user?._id, isOpen, selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, view]);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = e.target.value;
        setSearchTerm(value);

        if (value.length > 2) {
            try {
                const response = await fetch('/api/users/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        credentials: "include", // Include i cookie in una richiesta cross-origin
                    },
                    body: JSON.stringify({ substring: value })
                });

                if (!response.ok) {
                    throw new Error('Search failed');
                }

                const data = await response.json();
                setSearchResults(data.matchedUsernames);
            } catch (error) {
                console.error('Error searching users:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const toggleChatWindow = () => {
        setIsOpen(!isOpen);
        setView('chats');
    };

    const handleUserClick = (username: string): void => {
        setSelectedChat(username);
        setView('messages');
        loadMessages(username);
    };

    const handleChatClick = (chatId: string): void => {
        setSelectedChat(chatId);
        setView('messages');
        loadMessages(chatId);
    };

    const loadMessages = (chatId: string) => {
        const filteredMessages = allMessages.filter(
            (message) =>
                (message.from === user?.username && message.to === chatId) ||
                (message.from === chatId && message.to === user?.username)
        );
        setMessages(filteredMessages);
    };

    const sendMessage = (message: string) => {
        if (!user?.username || !selectedChat || !message.trim()) return;

        fetch(`/api/messages/send/${user?._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                credentials: "include",
            },
            body: JSON.stringify({ text: message, to: selectedChat })
        })
            .then((response) => response.json())
            .then((data: IMessage) => {
                setMessages(prev => [...prev, data]);
                setAllMessages(prev => [...prev, data]);
                setMessageText('');
                scrollToBottom();
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    };

    const formatTime = (datetime: string) => {
        const date = new Date(datetime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const groupMessagesByDate = (messages: IMessage[]): MessageGroup[] => {
        const groups: { [key: string]: IMessage[] } = {};

        messages.forEach(message => {
            const date = new Date(message.datetime);
            const dateStr = date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(message);
        });

        return Object.entries(groups).map(([date, messages]) => ({
            date,
            messages
        }));
    };

    return (
        <>
            <button className="chat-button" onClick={toggleChatWindow}>
                💬
            </button>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        {view === 'chats' && (
                            <>
                                <FormControl
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setView('search')}
                                    style={{ marginBottom: '10px' }}
                                />
                                <div className="active-chats-container">
                                    <h5 className="active-chats-title">Active Chats</h5>
                                    <ListGroup>
                                        {activeChats.map((chatId, index) => (
                                            <ListGroup.Item
                                                key={index}
                                                action
                                                onClick={() => handleChatClick(chatId)}
                                                className="chat-list-item"
                                            >
                                                <div
                                                    className="chat-avatar"
                                                    style={{ backgroundColor: generateColorFromString(chatId) }}
                                                >
                                                    {chatId.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="chat-info">
                                                    <div className="chat-username">{chatId}</div>
                                                    <div className="chat-preview">
                                                        {allMessages
                                                            .filter(msg =>
                                                                (msg.from === chatId && msg.to === user?.username) ||
                                                                (msg.to === chatId && msg.from === user?.username)
                                                            )
                                                            .slice(-1)[0]?.text || 'No messages yet'}
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            </>
                        )}

                        {view === 'search' && (
                            <>
                                <FormControl
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            if (searchTerm.length === 0) {
                                                setView('chats');
                                            }
                                        }, 200);
                                    }}
                                    style={{ marginBottom: '10px' }}
                                />
                                <ListGroup>
                                    {searchResults.map((username, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            action
                                            onClick={() => handleUserClick(username)}
                                            className="chat-list-item"
                                        >
                                            <div
                                                className="chat-avatar"
                                                style={{ backgroundColor: generateColorFromString(username) }}
                                            >
                                                {username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="chat-info">
                                                <div className="chat-username">{username}</div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}

                        {view === 'messages' && selectedChat && (
                            <div className="messages-container">
                                <div className="messages-header">
                                    <Button variant="link" onClick={() => setView('chats')} className="back-button">
                                        <FaArrowLeft />
                                    </Button>
                                    <div className="selected-user-info">
                                        <div
                                            className="chat-avatar"
                                            style={{ backgroundColor: generateColorFromString(selectedChat) }}
                                        >
                                            {selectedChat.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="selected-username">{selectedChat}</span>
                                    </div>
                                </div>

                                <div className="messages-content">
                                    <div className="message-list" ref={messageListRef}>
                                        <ListGroup>
                                            {groupMessagesByDate(messages).map((group, groupIndex) => (
                                                <div key={groupIndex}>
                                                    <div className="date-separator">
                                                        <span>{group.date}</span>
                                                    </div>
                                                    {group.messages.map((message, messageIndex) => (
                                                        <ListGroup.Item
                                                            key={messageIndex}
                                                            className={`message-item ${message.from === user?.username ? 'right' : 'left'}`}
                                                        >
                                                            <div className="message-text">{message.text}</div>
                                                            <div className="message-time">{formatTime(message.datetime)}</div>
                                                        </ListGroup.Item>
                                                    ))}
                                                </div>
                                            ))}
                                        </ListGroup>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <FormControl
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && messageText.trim()) {
                                                sendMessage(messageText);
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={() => sendMessage(messageText)}
                                        disabled={!messageText.trim()}
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

interface IMessage {
    from: string;
    to: string;
    text: string;
    datetime: string;
}
