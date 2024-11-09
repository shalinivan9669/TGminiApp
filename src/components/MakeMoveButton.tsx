// src/components/MakeMoveButton.tsx
import React, { useState } from 'react';

interface MakeMoveButtonProps {
  gameId: string;
  userId: string;
  move: 'rock' | 'paper' | 'scissors';
}

const MakeMoveButton: React.FC<MakeMoveButtonProps> = ({ gameId, userId, move }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleMakeMove = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/games/makeMove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userId, move }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при выполнении хода');
      }

      console.log('Ход выполнен:', data);
      setSuccess('Ход успешно выполнен');
    } catch (err: any) {
      console.error('Ошибка при выполнении хода:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleMakeMove}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded mr-2"
      >
        {loading ? 'Выполняется...' : move.charAt(0).toUpperCase() + move.slice(1)}
      </button>
      {error && <p className="text-red-500 mt-1">{error}</p>}
      {success && <p className="text-green-500 mt-1">{success}</p>}
    </div>
  );
};

export default MakeMoveButton;
