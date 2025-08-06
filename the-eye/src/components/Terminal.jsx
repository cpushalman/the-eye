import React, { useState } from "react";
import "./Terminal.css";
import { useEffect } from "react";

const fileSystem = {
  home: {
    user: {
      "about.txt": "Welcome to THE EYE. We are a cybersecurity club...",
      projects: {
        "nmap-scan.txt": "Scan report: All systems secure.",
        "writeup.md": "CTF Writeup: We rooted the box via SSH login bypass...",
      },
    },
  },
};

function Terminal({ onClose }) {
  const introLines = [
    "[+] Booting up...",
    "[+] Accessing secured directories...",
    "[+] Welcome to THE EYE Terminal",
    "Type `help` to begin",
  ];

  const [introDone, setIntroDone] = useState(false);
  const [path, setPath] = useState(["home", "user"]);
  const [log, setLog] = useState([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    let i = 0;

    const typeIntro = () => {
      if (i < introLines.length) {
        setLog((prev) => [...prev, introLines[i]]);
        i++;
        setTimeout(typeIntro, 1000);
      } else {
        setIntroDone(true);
      }
    };

    typeIntro();
  }, []);
  const getCurrentDir = () => {
    return path.reduce((dir, key) => dir[key], fileSystem);
  };

  const handleCommand = () => {
    const newLog = [...log, `$ ${input}`];
    const args = input.trim().split(" ");
    const cmd = args[0];
    const arg = args[1];

    let response = "";

    switch (cmd) {
      case "ls":
        response = Object.keys(getCurrentDir()).join("  ");
        break;
      case "cd":
        if (arg && getCurrentDir()[arg]) {
          setPath([...path, arg]);
        } else {
          response = `No such directory: ${arg}`;
        }
        break;
      case "cat":
        if (arg && typeof getCurrentDir()[arg] === "string") {
          response = getCurrentDir()[arg];
        } else {
          response = `No such file: ${arg}`;
        }
        break;
      case "clear":
        setLog([]);
        setInput("");
        return;
      case "exit":
        onClose();
        return;
      case "help":
        response = `
Available commands:
- help        : Show this help menu
- ls          : List files and directories
- cd <dir>    : Change directory
- cd ..       : Go back one directory
- cat <file>  : View contents of a file
- clear       : Clear the screen
- exit        : Close the terminal

🔍 Tip: Navigate to 'projects' to explore real scans and writeups.
💡 Example: cd projects → cat writeup.md
  `;
        break;

      default:
        response = `Command not found: ${cmd}`;
    }

    setLog([...newLog, response]);
    setInput("");
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span>THE EYE Terminal</span>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="terminal-body">
        {log.map((line, index) => (
          <div key={index} className="terminal-line">
            {line}
          </div>
        ))}
        <div className="terminal-input">
          <span className="prompt">$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => introDone && e.key === "Enter" && handleCommand()}
            autoFocus
            disabled={!introDone}
          />
        </div>
      </div>
    </div>
  );
}

export default Terminal;
