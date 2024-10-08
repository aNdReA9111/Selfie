import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';

export const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChatWindow = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
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
            
            {isOpen && (() => {
                const chatUsers = [
                    { id: 1, name: 'User 1' },
                    { id: 2, name: 'User 2' },
                    { id: 3, name: 'User 3' },
                ];

                const handleUserClick = (userId: number) => {
                    // Logic to load the chat of the selected user
                    console.log(`Loading chat for user ${userId}`);
                    // Here you can add the logic to change the page or load the chat
                };

                return (
                    <div 
                        style={{
                            position: 'fixed',
                            bottom: '50px',
                            right: '10px',
                            width: '300px',
                            height: '200px',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                            padding: '10px',
                            overflowY: 'auto'
                        }}
                    >
                        <ListGroup>
                            {chatUsers.map(user => (
                                <ListGroup.Item 
                                    key={user.id} 
                                    action 
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    {user.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                );
            })()}
        </div>
    );
 
}


