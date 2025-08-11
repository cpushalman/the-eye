import React, { useState, useEffect, useRef } from "react";
import "./Terminal.css";

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
  const [path, setPath] = useState(["home", "user"]); // current working path segments (empty array = root)
  const [log, setLog] = useState([]); // output lines
  const [input, setInput] = useState(""); // current command line input
  const [history, setHistory] = useState([]); // past commands (raw input strings)
  const [historyIndex, setHistoryIndex] = useState(null); // for arrow key navigation
  const inputRef = useRef(null);
  const bodyRef = useRef(null); // scrollable terminal body
  const introRanRef = useRef(false); // prevent double-run in StrictMode

  const commandsList = [
    // primary showcase commands
    "about",
    "mission",
    "events",
    "projects",
    "join",
    "contact",
    "socials",
    "team",
    "resources",
    "faq",
    "report",
    "tip",
    "banner",
    // utility / navigation (hidden from basic help)
    "help",
    "ls",
    "cd",
    "cat",
    "open",
    "clear",
    "exit",
    "pwd",
    "tree",
    // "whoami",
    "echo",
    "date",
    "history",
  ];

  // Club informational content (can be updated with real data)
  const CLUB_NAME = "THE EYE";
  const clubContent = {
    about: `${CLUB_NAME} is a cybersecurity & ethical hacking club focused on hands-on learning, capture-the-flag (CTF) challenges, defensive/blue-team practice, and responsible disclosure culture. Dive in, learn, build, defend.`,
    mission: `We empower students to explore cybersecurity in a guided, ethical way: \n- Learn core security concepts together\n- Practice offensive & defensive skills in safe labs\n- Compete in CTFs and share writeups\n- Foster a culture of curiosity, rigor, and responsibility` ,
    events: `To be announced.`,
    projects: `Highlighted Projects: \n- CTF  Platform (custom challenges & scoring)\n- Security Research Papers & Whitepapers.` ,//nExplore: use 'cd projects' then 'ls' and 'cat <file>'
    join: `TBA`, // `Join Steps: \n1. Attend an intro meeting (see 'events').\n2. Join our Discord: <discord-placeholder>.\n3. Fill membership form (link in Discord pinned).\n4. Pick a learning track (web / rev / pwn / blue-team).` ,
    contact: `Contact: \nEmail: theeye146@gmail.com \nReport Issues: use 'report' command.\nExec Team: see 'team'.` ,
    socials: `Socials: \nGitHub: https://github.com/theeye-network/ \nLinkedIn: https://www.linkedin.com/company/theeye-csea/ \n` ,
    team: `Leadership Team:\n- Founder: Aaditya\n- Technical Secretary: Lohith\n- Admin Secretary: Mehul Dinesh\n` ,
    resources: `Learning Resources: \n- TryHackMe (Beginner to Intermediate)\n- Hack The Box (Advanced practice)\n- OWASP Top 10 (Web fundamentals)\n- Nmap & Wireshark cheat sheets\n- MITRE ATT&CK Navigator\nTip: Set a weekly skill goal.` ,
    faq: `FAQ: \nQ: Do I need prior experience?\nA: No. We start from fundamentals.\nQ: Is hacking legal here?\nA: Only in sanctioned labs / CTF targets.\nQ: How do I contribute?\nA: Join a project or write a guide.\nQ: Are sessions recorded?\nA: Select workshops—ask a lead.`,
    report: `Report Guidance: \nIncident (something happened): Use Incident form (scroll to bottom of page).\nVulnerability (you found a weakness): Use Vulnerability form.\nProvide: steps, impact, scope.\nWe encourage responsible disclosure.`,
  };

const tips = [
    "Rotate through CTF categories—breadth builds intuition.",
    "Document every solved challenge; writeups reinforce memory.",
    "Recon patiently: enumeration finds 80% of wins.",
    "Practice least privilege in your own test setups.",
    "Automate repetitive recon tasks—invest early.",
    "Read official docs before random blog fixes.",
    "Pair with someone stronger in one area; teach back another.",
    "Track commands used; turn them into scripts.",
    "Defensive mindset: always ask how you'd detect your own attack.",
    "Always try default creds before complex exploits.",
    "Check robots.txt for overlooked clues.",
    "Fuzz parameters slowly to avoid detection.",
    "Search GitHub for leaked API keys.",
    "Base64 isn’t encryption—decode everything suspicious.",
    "Try steganography on odd image files.",
    "Watch packet sizes; metadata can reveal secrets.",
    "Review HTML comments for hidden info.",
    "Test common wordlists before custom ones.",
    "Keep Burp Suite history—mistakes hold clues.",
    "Try both HTTP and HTTPS—servers may differ.",
    "Scan UDP too; some services hide there.",
    "Always run strings on binaries.",
    "Test for path traversal using ../ variations.",
    "Check subdomains—forgotten apps can be gold.",
    "Dump DNS records; zone transfers still happen.",
    "Use whois to profile infrastructure.",
    "Look at file timestamps for hints.",
    "Hex editors reveal what GUIs hide.",
    "Replay requests with slight changes.",
    "Keep screenshots—patterns emerge over time.",
    "Compare behavior on different browsers.",
    "Use curl to bypass JavaScript restrictions.",
    "Automate dirbusting at night, review in morning.",
    "Analyze error messages—they leak structure.",
    "Test case sensitivity in URLs and params.",
    "Modify cookies manually; they may be insecure.",
    "Brute force hidden parameters in APIs.",
    "Check for old backups: .zip, .tar.gz, .bak.",
    "Monitor server response times for blind bugs.",
    "Intercept mobile app traffic—often less protected.",
    "Decompile APKs; secrets hide in code.",
    "Never trust client-side validation.",
    "Try uploading unexpected file types.",
    "Check SVGs—they can run scripts.",
    "Try Unicode obfuscation to bypass filters.",
    "Send overly long inputs—buffer overflows lurk.",
    "Review source maps for front-end leaks.",
    "Modify Host header for cache poisoning.",
    "Replay auth tokens on different endpoints.",
    "Force content negotiation with Accept headers.",
    "Enumerate API version numbers.",
    "Check HTTP verbs beyond GET/POST.",
    "Probe for CORS misconfigurations.",
    "Look for open .git directories.",
    "Abuse forgotten debug endpoints.",
    "Scan for exposed .env files.",
    "Run hashcat on leaked hashes immediately.",
    "Try default JWT secrets.",
    "Replay signed URLs past expiry.",
    "Test time-based SQLi on slow queries.",
    "Look for orphaned DNS records for takeover.",
    "Craft SSRF payloads to internal services.",
    "Chain low-severity bugs for bigger impact.",
    "Set up local vulnerable labs for practice.",
    "Use Docker to isolate risky tools.",
    "Learn regex—it speeds fuzzing.",
    "Use tmux/screen for persistent sessions.",
    "Log all commands in your shell history.",
    "Bookmark cheat sheets for quick syntax.",
    "Practice binary exploitation on CTF archives.",
    "Read writeups of challenges you couldn’t solve.",
    "Try alternative encodings in payloads.",
    "Break problems into smallest reproducible steps.",
    "Look at challenge titles for hints.",
    "Never assume input field limits are enforced.",
    "Search challenge files for suspicious strings.",
    "Test both IPv4 and IPv6 targets.",
    "Manipulate referrer headers.",
    "Change user-agent to mimic bots or old browsers.",
    "Inspect all JavaScript files for clues.",
    "Try HTTP request smuggling.",
    "Audit access logs if available.",
    "Practice manual exploitation before automation.",
    "Recreate challenge locally to test safely.",
    "Keep a bug bounty mindset for CTFs.",
    "Profile challenge creators’ previous puzzles.",
    "Keep tools updated—bugs can hide in old versions.",
    "Test payloads in multiple encodings.",
    "Rotate proxies to avoid IP bans.",
    "Replay old traffic after challenge updates.",
    "Test challenges at odd hours—changes may appear.",
    "Treat every challenge as a lesson, not just a score.",
    "Work on time management in long CTFs.",
    "Leave easy flags for later if stuck—momentum matters.",
    "Focus on understanding over guessing.",
    "Revisit unsolved challenges after a break.",
    "Share partial progress with teammates.",
    "Write post-CTF retrospectives for yourself.",
    "Keep exploring beyond the flag—learn the ‘why’.",
    "Enjoy the process; skills outlast the scoreboard."
];


  const bannerArt = [
    
`|_   _| | || || __| | __|\\ \\ / /| __| `,
'  | |   | __ || _|  | _|  \\ V / | _|  ',
'  |_|   |_||_||___| |___|  |_|  |___| ',
'                                      ',
    `        THE EYE CYBERSEC CLUB`  ];
  useEffect(() => {
    if (introRanRef.current) return; 
    introRanRef.current = true;
    let i = 0;
    const typeIntro = () => {
      if (i < introLines.length) {
        setLog((prev) => [...prev, introLines[i]]);
        i++;
        setTimeout(typeIntro, 900);
      } else {
        setIntroDone(true);
      }
    };
    typeIntro();
  }, []);
  const getCurrentDir = () => {
    try {
      return path.reduce((dir, key) => (dir && dir[key] ? dir[key] : {}), fileSystem);
    } catch {
      return {};
    }
  };

  const formatPath = () => {
    if (!path.length) return "/"; // root
    return "/" + path.join("/");
  };

  const isDir = (node) => typeof node === "object" && node !== null;

  const listEntries = (dirObj) => {
    return Object.keys(dirObj).map((key) => (isDir(dirObj[key]) ? key + "/" : key));
  };

  const buildTree = (dirObj, prefix = "", depth = 0, maxDepth = 5) => {
    if (depth > maxDepth) return [prefix + "..."];
    const entries = Object.keys(dirObj);
    const lines = [];
    entries.forEach((key, idx) => {
      const last = idx === entries.length - 1;
      const connector = last ? "└── " : "├── ";
      const nextPrefix = prefix + (last ? "    " : "│   ");
      if (isDir(dirObj[key])) {
        lines.push(prefix + connector + key + "/");
        lines.push(...buildTree(dirObj[key], nextPrefix, depth + 1, maxDepth));
      } else {
        lines.push(prefix + connector + key);
      }
    });
    return lines;
  };

  const formatPathFromArray = (arr) => (arr.length ? "/" + arr.join("/") : "/");

  const changeDirectory = (target) => {
    if (!target || target === "~") {
      setPath(["home", "user"]);
      return `Moved to ${formatPathFromArray(["home", "user"])}.`;
    }
    if (target === "/") {
      setPath([]);
      return "Moved to /";
    }
    if (target === ".") return "";
    if (target === "..") {
      if (path.length) {
        const newPath = path.slice(0, -1);
        setPath(newPath);
        return `Moved to ${formatPathFromArray(newPath)}.`;
      }
      return "Already at root.";
    }
    const current = getCurrentDir();
    if (current[target] && isDir(current[target])) {
      const newPath = [...path, target];
      setPath(newPath);
      return `Moved to ${formatPathFromArray(newPath)}.`;
    }
    return `No such directory: ${target}`;
  };


  const handleTabComplete = () => {
    const raw = input;
    const parts = raw.split(/\s+/);
    const cursorOnNewArg = /\s$/.test(raw);
    if (parts.length === 1 && !cursorOnNewArg) {
      const partial = parts[0];
      const matches = commandsList.filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
        setLog((prev) => [...prev, matches.join("  ")]);
      }
      return;
    }
    const cmd = parts[0];
    const argPartial = cursorOnNewArg ? "" : parts[parts.length - 1];
    const dirObj = getCurrentDir();
    const entries = Object.keys(dirObj);
    const candidates = entries.filter((e) => e.startsWith(argPartial));
    if (candidates.length === 1) {
      const suffix = isDir(dirObj[candidates[0]]) ? candidates[0] + "/" : candidates[0];
      const newParts = cursorOnNewArg ? [...parts, suffix] : [...parts.slice(0, -1), suffix];
      setInput(newParts.join(" ") + (isDir(dirObj[candidates[0]]) ? "" : ""));
    } else if (candidates.length > 1) {
      setLog((prev) => [...prev, candidates.join("  ")]);
    }
  };

  const handleCommand = () => {
    const raw = input;
    if (!raw.trim()) {
      setInput("");
      return; // ignore empty command
    }
    const newLog = [...log, `$ ${raw}`];
    const args = raw.trim().split(/\s+/);
    const cmd = args[0];
    const rest = args.slice(1);
    let response = "";

    const currentDirObj = getCurrentDir();

    switch (cmd) {
      case "about": {
        response = clubContent.about;
        break;
      }
      case "mission": {
        response = clubContent.mission;
        break;
      }
      case "events": {
        response = clubContent.events;
        break;
      }
      case "projects": {
        response = clubContent.projects;
        break;
      }
      case "join": {
        response = clubContent.join;
        break;
      }
      case "contact": {
        response = clubContent.contact;
        break;
      }
      case "socials": {
        response = clubContent.socials;
        break;
      }
      case "team": {
        response = clubContent.team;
        break;
      }
      case "resources": {
        response = clubContent.resources;
        break;
      }
      case "faq": {
        response = clubContent.faq;
        break;
      }
      case "report": {
        response = clubContent.report;
        break;
      }
      case "tip": {
        response = `💡 ${tips[Math.floor(Math.random() * tips.length)]}`;
        break;
      }
      case "banner": {
        response = bannerArt.join("\n");
        break;
      }
      case "ls": {
        const entries = listEntries(currentDirObj);
        response = entries.join("  ") || "(empty)";
        break;
      }
      case "pwd": {
        response = formatPath();
        break;
      }
      // case "cd": {
      //   const target = rest[0];
      //   response = changeDirectory(target);
      //   break;
      // }
      case "cat":
      case "open": {
        const target = rest[0];
        if (target && typeof currentDirObj[target] === "string") {
          response = currentDirObj[target];
        } else if (target && currentDirObj[target] && isDir(currentDirObj[target])) {
          response = `${target} is a directory`;
        } else {
          response = `No such file: ${target}`;
        }
        break;
      }
      case "tree": {
        const lines = buildTree(currentDirObj);
        response = (formatPath() === "/" ? "/" : formatPath().split("/").slice(-1)[0] + "/") + "\n" + lines.join("\n");
        break;
      }
      // case "whoami": {
      //   response = "user";
      //   break;
      // }
      case "echo": {
        response = rest.join(" ");
        break;
      }
      case "date": {
        const d = new Date();
        const pad = (n) => (n < 10 ? "0" + n : n);
        response = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        break;
      }
      case "history": {
        response = history.map((h, i) => `${i + 1}  ${h}`).join("\n");
        break;
      }
      case "clear": {
        setLog([]);
        setInput("");
        return;
      }
      case "exit": {
        onClose();
        return;
      }
      case "help": {
        const showAll = rest.includes("-a");
        const primary = [
          "about       : About the club",
          "mission     : Club mission",
          "events      : Upcoming / recurring",
          "projects    : Highlighted initiatives",
          "team        : Leadership summary",
          "banner      : Show club banner",
          "help [-a]   : This help (add -a for more)",
        ];
        const advanced = [
          "ls          : List directory entries",
          // "cd <dir>    : Change directory",
          // "cd ..|/|~   : Navigate up / root / home",
          "pwd         : Show current path",
          "tree        : Recursive directory view",
          "cat <file>  : View file contents",
          "open <file> : Alias for cat",
          "echo <text> : Print text",
          "whoami      : Current user",
          "date        : Current date/time",
          "history     : Command history",
          "join        : How to become a member",
          "contact     : Contact channels",
          "socials     : Public platforms",
          "resources   : Learning links",
          "faq         : Common questions",
          "report      : Incident / vulnerability guidance",
          "tip         : Random cybersecurity tip",
          "clear       : Clear screen",
          "exit        : Close terminal",
        ];
        response = `=== ${CLUB_NAME} Terminal Help ===\nPrimary:\n${primary.join("\n")}\n${showAll ? "\nAdvanced:\n" + advanced.join("\n") : "\n(Use 'help -a' to see advanced exploration commands)"}`;
        break;
      }
      default: {
        response = `Command not found: ${cmd}`;
      }
    }

  const updated = response !== "" && response !== undefined ? [...newLog, response] : newLog;
  setLog(updated.filter((l) => typeof l === "string"));
    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(null);
    setInput("");
  };
 // Auto-scroll to bottom on new log entries
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span>THE EYE Terminal</span>
        <button onClick={onClose}>✕</button>
        
      </div>
      
      <div className="terminal-body"
        ref={bodyRef}
        onWheel={(e) => {
            e.stopPropagation();
        }}>
        {log.map((line, index) => {
          const safeLine = typeof line === "string" ? line : String(line ?? "");
          return (
            <div key={index} className="terminal-line">
              {safeLine.split("\n").map((ln, i) => (
                <div key={i}>{ln}</div>
              ))}
            </div>
          );
        })}
        <div className="terminal-input">
          <span className="prompt">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setHistoryIndex(null);
            }}
            onKeyDown={(e) => {
              if (!introDone) return;
              if (e.key === "Enter") {
                handleCommand();
              } else if (e.key === "Tab") {
                e.preventDefault();
                handleTabComplete();
              } else if (e.key === "ArrowUp") {
                if (!history.length) return;
                e.preventDefault();
                setHistoryIndex((idx) => {
                  const newIdx = idx === null ? history.length - 1 : Math.max(0, idx - 1);
                  setInput(history[newIdx]);
                  return newIdx;
                });
              } else if (e.key === "ArrowDown") {
                if(historyIndex === null) return;
                e.preventDefault();
                setHistoryIndex((idx) => {
                  if (idx === null) return null;
                  const newIdx = idx + 1;
                  if (newIdx >= history.length) {
                    setInput("");
                    return null;
                  }
                  setInput(history[newIdx]);
                  return newIdx;
                });
              }
            }}
            autoFocus
            disabled={!introDone}
          />
        </div>
      </div>
    </div>
  );
}

export default Terminal;
