document.addEventListener('DOMContentLoaded', () => {
    const consoleElement = document.getElementById('console');
    const typewriterSound = document.getElementById('typewriter-sound');
    const alertSound = document.getElementById('alert-sound');
    const timeElement = document.getElementById('time');
    const fileInput = document.getElementById('fileInput');
    const fileButton = document.getElementById('fileButton');
    const webcamButton = document.getElementById('webcamButton');
    const webcamVideo = document.getElementById('webcamVideo');
    const webcamCanvas = document.getElementById('webcamCanvas');
    const webcamPhoto = document.getElementById('webcamPhoto');
    const photoText = document.getElementById('photoText');
    const fileListElement = document.getElementById('fileList');
    const glitchElement = document.createElement('div');
    glitchElement.className = 'glitch';
    document.body.appendChild(glitchElement);

    // Fonction pour permettre l'auto-play des sons
    function enableSoundAutoplay() {
        // Lecture rapide d'un son silencieux pour permettre l'auto-play
        typewriterSound.play().catch(() => {
            // Si l'auto-play échoue, demander la permission via une interaction utilisateur
            document.body.addEventListener('click', () => {
                typewriterSound.play();
            }, { once: true });
        });
    }

    // Appeler enableSoundAutoplay dès que le DOM est chargé
    enableSoundAutoplay();

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
            "oh i thought i saw a thacknon in the cloud",
            "Decrypting files...",
            "Uploading virus...",
            "Hacking NASA...",
            "Accessing mainframe...",
            "Bypassing firewall...",
            "Connection established.",
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
                setTimeout(() => {
                    window.location.href = 'ransom.html'; // Redirect to ransom page
                }, 3000);
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
                addMessage("Tous les fichiers ont été effacés !", true);
            }
        }
        deleteNextFile();
    }

    function startWebcam() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                webcamVideo.style.display = 'block';
                webcamVideo.srcObject = stream;
                setTimeout(capturePhoto, 5000); // Capture photo after 5 seconds
            })
            .catch(error => {
                addMessage("Accès à la webcam refusé.");
            });
    }

    function capturePhoto() {
        const context = webcamCanvas.getContext('2d');
        webcamCanvas.width = webcamVideo.videoWidth;
        webcamCanvas.height = webcamVideo.videoHeight;
        context.drawImage(webcamVideo, 0, 0, webcamCanvas.width, webcamCanvas.height);
        const dataURL = webcamCanvas.toDataURL('image/png');
        webcamPhoto.src = dataURL;
        webcamPhoto.style.display = 'block';
        photoText.style.display = 'block';
        webcamVideo.srcObject.getTracks().forEach(track => track.stop());
        webcamVideo.style.display = 'none';
    }

    fileButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFiles);
    webcamButton.addEventListener('click', startWebcam);

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