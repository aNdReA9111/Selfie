import { useState, useEffect } from 'react';
import { ListGroup, FormControl } from 'react-bootstrap';
import $ from 'jquery';

export const Chat = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [messages, setMessages] = useState<string[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);

    useEffect(() => {
        // Funzione per recuperare le chat attive dell'utente loggato
        const fetchActiveChats = () => {
            fetch('http://localhost:4000/api/messages/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Active chats:', data);

                // creo la lista degli utenti con cui l'utente loggato ha una chat attiva
                const uniqueUsers = new Set<string>();
                data.forEach((message: { from: string; to: string }) => {
                    uniqueUsers.add(message.from);
                    uniqueUsers.add(message.to);
                });
                const userList = Array.from(uniqueUsers);
                console.log('Active users:', userList);

                setActiveChats(userList);
            })
            .catch((error) => {
                console.error('Error fetching active chats:', error);
            });
        };

        fetchActiveChats();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = e.target.value;
        setSearchTerm(value);

        if (value.length > 2) { 
            $.ajax({
                url: 'http://localhost:4000/api/users/search',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ substring: value }),
                success: (data: { matchedUsernames: string[] }) => {
                    setSearchResults(data.matchedUsernames);
                    console.log('Search results:', data.matchedUsernames);
                },
                error: (jqXHR: JQuery.jqXHR, textStatus: string, errorThrown: string) => {
                    console.error('Error searching users:', textStatus, errorThrown);
                    console.error('Response text:', jqXHR.responseText);
                }
            });
        } else {
            setSearchResults([]);
        }
    };

    const toggleChatWindow = () => {
        setIsOpen(!isOpen);
    };

    const handleUserClick = (index: number): void => {
        const selectedUser = searchResults[index];
        console.log('User clicked:', selectedUser);
        // Puoi aggiungere la logica per iniziare una chat con l'utente selezionato
    };

    const handleChatClick = (chatId: string): void => {
        setSelectedChat(chatId);
        // Recupera i messaggi per la chat selezionata
        
    };

    return (
        <>
            <button
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    borderRadius: '20px 20px 0 0',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                }}
                onClick={toggleChatWindow}
            >
                Chats
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '50px',
                        right: '10px',
                        width: '300px',
                        height: '300px', // Altezza aumentata per visualizzare le chat e i messaggi
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        padding: '10px',
                        overflowY: 'auto'
                    }}
                >

                    {/* <h5>Search Users</h5>
                    <FormControl
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ marginBottom: '10px' }}
                    /> */}
                    <ListGroup>
                        {searchResults.map((username, index) => (
                            <ListGroup.Item
                                key={index}
                                action
                                onClick={() => handleUserClick(index)}
                            >
                                {username}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <h5>Active Chats</h5>
                    <ListGroup>
                        {activeChats.map((chatId, index) => (
                            <ListGroup.Item
                                key={index}
                                action
                                onClick={() => handleChatClick(chatId)}
                            >
                                {chatId}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    {selectedChat && (
                        <>
                            <h5>Messages</h5>
                            <ListGroup>
                                {messages.map((message, index) => (
                                    <ListGroup.Item key={index}>
                                        {message}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </>
                    )}
                </div>
            )}
        </>
    );
};
