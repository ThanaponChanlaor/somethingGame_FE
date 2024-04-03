import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:3001");

interface allPlayerData {
  id: string;
  score: number;
  question: string;
  isIncorrect: boolean;
}

function NewApp() {
  const [data, setData] = useState<allPlayerData[]>([]);
  const [newScore, setNewScore] = useState<number>(0);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newIsIncorrect, setNewIsIncorrect] = useState<boolean>(false);

  useEffect(() => {
    // Listen for updates from the server
    socket.on("initial-data", (initialData: allPlayerData[]) => {
      setData(initialData);
    });

    socket.on("updated-data", (updatedData: allPlayerData[]) => {
      setData(updatedData);
    });

    // Clean up the socket listeners on component unmount
    return () => {
      socket.off("initial-data");
      socket.off("updated-data");
    };
  }, []);

  const handleUpdate = (id: string) => {
    // Send an update request to the server
    socket.emit("update-data", id, newScore, newQuestion, newIsIncorrect);
    setNewScore(0);
    setNewQuestion("");
    setNewIsIncorrect(false);
  };

  return (
    <div>
      <h1>Player Data</h1>
      <ul>
        {data.map((player) => (
          <li key={player.id}>
            ID: {player.id}, Score: {player.score}, Question: {player.question},
            Incorrect: {player.isIncorrect ? "Yes" : "No"}
            <input
              type="number"
              placeholder="New Score"
              value={newScore}
              onChange={(e) => setNewScore(parseInt(e.target.value, 10))}
            />
            <input
              type="text"
              placeholder="New Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <input
              type="checkbox"
              checked={newIsIncorrect}
              onChange={(e) => setNewIsIncorrect(e.target.checked)}
            />
            <button onClick={() => handleUpdate(player.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewApp;
