import { useState, useEffect, useContext } from 'react';
import { ListGroup, FormControl, Button, InputGroup } from 'react-bootstrap';
import $ from 'jquery';
import { AuthContext } from '../context/authContext';
import '../css/chat.css';
import { FaArrowLeft } from 'react-icons/fa';

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
    const { user } = useContext(AuthContext);
    const [messageText, setMessageText] = useState<string>('');

    useEffect(() => {
        const fetchActiveChats = () => {
            fetch(`http://localhost:4000/api/messages/get/${user?._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: IMessage[]) => {
                const uniqueUsers = new Set<string>();
                data.forEach((message) => {
                    uniqueUsers.add(message.from);
                    uniqueUsers.add(message.to);
                });
                uniqueUsers.delete(user?.username);
                const userList = Array.from(uniqueUsers);
                setActiveChats(userList);
                setAllMessages(data);
            })
            .catch((error) => {
                console.error('Error fetching active chats:', error);
            });
        };

        fetchActiveChats();
    }, []);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = e.target.value;
        setSearchTerm(value);

        if (value.length > 2) {
            try {
                const response = await fetch('/api/users/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
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

        fetch(`http://localhost:4000/api/messages/send/${user?._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ text: message, to: selectedChat })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data: IMessage) => {
            setMessages([...messages, data]);
            setAllMessages([...allMessages, data]);
            setMessageText('');
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
                                                <div className="chat-avatar">
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
                                        >
                                            {username}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}

                        {view === 'messages' && selectedChat && (
                            <>
                                <Button variant="link" onClick={() => setView('chats')} className="back-button">
                                    <FaArrowLeft />
                                </Button>
                                <h5>{selectedChat}</h5>
                                <div className="message-list">
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
                            </>
                        )}
                    </div>
                    {view === 'messages' && (
                        <InputGroup className="input-group">
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
                        </InputGroup>
                    )}
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
