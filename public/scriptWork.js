document.addEventListener('DOMContentLoaded', () => {
    const consoleElement = document.getElementById('console');
    const typewriterSound = document.getElementById('typewriter-sound');
    const alertSound = document.getElementById('alert-sound');
    const timeElement = document.getElementById('time');
    const fileInput = document.getElementById('fileInput');
    const fileButton = document.getElementById('fileButton');
    const fileListElement = document.getElementById('fileList');
    const glitchElement = document.createElement('div');
    glitchElement.className = 'glitch';
    document.body.appendChild(glitchElement);

    // WebRTC to get local IP
    function getLocalIP(callback) {
        const rtc = new RTCPeerConnection({ iceServers: [] });
        rtc.createDataChannel('');
        rtc.onicecandidate = function (event) {
            if (event.candidate) {
                const ipMatch = event.candidate.candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
                if (ipMatch) {
                    callback(ipMatch[0]);
                    rtc.close();
                }
            }
        };
        rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
    }

    // Adding messages to console
    function addMessage(message, alert = false) {
        const p = document.createElement('p');
        p.textContent = "";
        consoleElement.appendChild(p);
        consoleElement.scrollTop = consoleElement.scrollHeight;

        let i = 0;
        function typeWriter() {
            if (i < message.length) {
                p.textContent += message.charAt(i);
                typewriterSound.currentTime = 0;
                typewriterSound.play();
                i++;
                setTimeout(typeWriter, 50);
            } else if (alert) {
                alertSound.play();
                glitch();
            }
        }

        typeWriter();
    }

    function getRandomHackerMessage(ip, userAgent) {
        const messages = [
            "Access granted.",
            "Initializing sequence...",
            "Decrypting files...",
            "Uploading virus...",
            "Hacking NASA...",
            "Accessing mainframe...",
            "Bypassing firewall...",
            "Connection established.",
            "oh i thought i saw a thacknon in the cloud",
            "System compromised!",
            "Transferring data...",
            "Disabling security protocols...",
            `User IP: ${ip}`,
            `User Agent: ${userAgent}`
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function glitch() {
        glitchElement.style.display = 'block';
        setTimeout(() => glitchElement.style.display = 'none', 500);
    }

    function countdown() {
        let timeLeft = 30;
        const timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                addMessage("Alert! System shutdown imminent!", true);
            } else {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timeElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                timeLeft--;
            }
        }, 1000);
    }

    function handleFiles(event) {
        const files = event.target.files;
        if (files.length === 0) {
            addMessage("Aucun fichier sélectionné.");
            return;
        }
        const fileNames = [];
        for (const file of files) {
            fileNames.push(file.name);
        }
        simulateFileDeletion(fileNames);
    }

    function simulateFileDeletion(files) {
        fileListElement.innerHTML = "";
        let index = 0;
        function deleteNextFile() {
            if (index < files.length) {
                const fileName = files[index];
                const p = document.createElement('p');
                p.textContent = `Deleting ${fileName}...`;
                fileListElement.appendChild(p);
                index++;
                setTimeout(deleteNextFile, 500);
            } else {
                addMessage("Tous les fichiers ont été effacés, U're joking by trhacknon !", true);
            }
        }
        deleteNextFile();
    }

    fileButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFiles);

    getLocalIP(ip => {
        const userAgent = navigator.userAgent;

        countdown();

        setInterval(() => {
            addMessage(getRandomHackerMessage(ip, userAgent));
        }, 3000);

        setTimeout(() => {
            addMessage("ALERT! Unauthorized access detected!", true);
        }, Math.random() * 20000 + 10000); // Random alert between 10-30 seconds
    });
});