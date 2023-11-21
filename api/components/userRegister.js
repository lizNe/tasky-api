import React, { useState, useEffect } from 'react';

const UserRegistration = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const controller = new AbortController();
  const { signal } = controller;

  const registerUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/users?action=register', {
        method: 'POST',
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: 'frankx' }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    controller.abort();
  };

  useEffect(() => {
    registerUser();

    // Cleanup: Abort the request if the component unmounts
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      {isLoading && <p>Sending Request... <button onClick={handleCancel}>Cancel</button></p>}
      {response && <p>Response: {JSON.stringify(response)}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default UserRegistration;
