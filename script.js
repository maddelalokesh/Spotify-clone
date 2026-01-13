console.log("Spotify Clone Loaded");

let currentsong = new Audio();
let songs = [];
let currfolder = "";

// ================= UTILS =================
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ================= FETCH SONGS =================
async function getsongs(folder) {
    currfolder = folder;
    let response = await fetch(`/songs/${folder}/songs.json`);
    return await response.json();
}

// ================= PLAY MUSIC =================
function playmusic(track) {
    currentsong.src = `/songs/${currfolder}/` + track;
    currentsong.play();

    document.getElementById("play").src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = track.replace(".mp3", "");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    document.querySelectorAll(".songslist li").forEach(li => {
        li.classList.remove("active");
        if (li.dataset.song === track) li.classList.add("active");
    });
}

// ================= LOAD LIBRARY =================
function loadLibrary(songList) {
    let songul = document.querySelector(".songslist ul");
    songul.innerHTML = "";

    for (const song of songList) {
        songul.innerHTML += `
        <li data-song="${song}">
            <img class="invert" src="music.svg">
            <div class="info">
                <div>${song.replace(".mp3", "")}</div>
            </div>
            <span>PlayNow</span>
            <img class="invert" src="play.svg">
        </li>`;
    }

    document.querySelectorAll(".songslist li").forEach(li => {
        li.addEventListener("click", () => {
            playmusic(li.dataset.song);
        });
    });
}

// ================= MAIN =================
async function main() {

    // Album click
    Array.from(document.querySelectorAll(".card")).forEach(card => {
        card.addEventListener("click", async () => {
            const folder = card.dataset.folder;
            songs = await getsongs(folder);
            loadLibrary(songs);
        });
    });

    // Play / Pause
    const playBtn = document.getElementById("play");
    playBtn.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            playBtn.src = "pause.svg";
        } else {
            currentsong.pause();
            playBtn.src = "play.svg";
        }
    });

    // ================= SEEK BAR =================
    const seekbar = document.querySelector(".seekbar");
    const progress = document.querySelector(".progress");
    const circle = document.querySelector(".circle");

    currentsong.addEventListener("timeupdate", () => {
        if (!currentsong.duration) return;
        const percent = (currentsong.currentTime / currentsong.duration) * 100;
        progress.style.width = percent + "%";
        circle.style.left = percent + "%";

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    });

    seekbar.addEventListener("click", (e) => {
        const rect = seekbar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        currentsong.currentTime = percent * currentsong.duration;
    });

    // ================= VOLUME =================
    const volumeSlider = document.getElementById("volume");
    volumeSlider.value = 1;
    currentsong.volume = 1;
    updateVolumeUI();

    volumeSlider.addEventListener("input", () => {
        currentsong.volume = volumeSlider.value;
        updateVolumeUI();
    });

    function updateVolumeUI() {
        const val = volumeSlider.value * 100;
        volumeSlider.style.background =
            `linear-gradient(to right, #1db954 ${val}%, #555 ${val}%)`;
    }

    // ================= SEARCH TOGGLE =================
    const searchBtn = document.getElementById("searchBtn");
    const searchBox = document.getElementById("searchBox");
    const searchInput = document.getElementById("searchInput");

    searchBtn.addEventListener("click", () => {
        searchBox.style.display = searchBox.style.display === "block" ? "none" : "block";
        searchInput.focus();
    });

    // ================= LIVE SEARCH =================
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const allSongs = document.querySelectorAll(".songslist li");

        allSongs.forEach(song => {
            const songName = song.querySelector(".info div").innerText.toLowerCase();
            if (songName.includes(query)) {
                song.style.display = "grid";
            } else {
                song.style.display = "none";
            }
        });
    });
}

main();

// ================= LOGIN =================
const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

// Always start on login page
window.onload = () => {
    loginPage.style.display = "flex";
    app.style.display = "none";
};

loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Demo credentials
    if (username === "admin" && password === "loki_14.06") {
        loginPage.style.display = "none";
        app.style.display = "block";
    } else {
        loginError.textContent = "Invalid username or password";
    }
});
