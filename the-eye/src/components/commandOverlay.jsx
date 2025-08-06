import React, { useEffect, useState } from "react";
import "./CommandOverlay.css"; // We'll define styles here

const CommandOverlay = () => {
  const [commands, setCommands] = useState([]);
  const terminalCommands = [
  "nmap -sS -T4 -p- 192.168.1.1",
  "sqlmap -u 'http://target.com?id=1' --dbs",
  "msfconsole -q",
  "theHarvester -d theeye.club -b google",
  "hydra -l admin -P rockyou.txt ssh://10.0.0.1",
  "whois theeye.club",
  "dnsenum theeye.club",
  "sublist3r -d theeye.club",
  "dig theeye.club +short",
  "Access granted. Logging into THE EYE..."
];


  useEffect(() => {
    const generateCommands = () => {
      const num = 30; // Number of floating commands
      const generated = Array.from({ length: num }).map(() => {
        const text = terminalCommands[Math.floor(Math.random() * terminalCommands.length)];
        const top = Math.random() * 90; // top position in %
        const left = Math.random() * 90; // left position in %
        const delay = Math.random() * 5; // animation delay in seconds
        return { text, top, left, delay };
      });
      setCommands(generated);
    };

    generateCommands();
  }, []);

  return (
    <div className="command-overlay">
      {commands.map((cmd, idx) => (
        <div
          key={idx}
          className="command-text"
          style={{
            top: `${cmd.top}%`,
            left: `${cmd.left}%`,
            animationDelay: `${cmd.delay}s`
          }}
        >
          {cmd.text}
        </div>
      ))}
    </div>
  );
};

export default CommandOverlay;
