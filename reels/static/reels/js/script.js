// <!-- Auto Play Script -->
const videos = document.querySelectorAll("video");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.play();
        }else{
            entry.target.pause();
        }
    });
},{ threshold: 0.7 });

videos.forEach(video => observer.observe(video));




function likeReel(reelId, button){
    fetch(`/like/${reelId}/`)
    .then(response => response.json())
    .then(data => {

        const countElement = button.nextElementSibling;
        countElement.innerText = data.total_likes;

        if(data.liked){
            button.innerText = "💖";
        } else {
            button.innerText = "💖";  // stays filled if already liked
            alert("You already liked this reel!");
        }
    });
}



// <!-- ✅ ADD PROGRESS BAR SCRIPT HERE -->
// {% comment %} <script>
// const allVideos = document.querySelectorAll("video");

// allVideos.forEach(video => {
//     const progressBar = video.parentElement.querySelector(".progress-bar");

//     video.addEventListener("timeupdate", () => {
//         const progress = (video.currentTime / video.duration) * 100;
//         progressBar.style.width = progress + "%";
//     });

//     video.addEventListener("ended", () => {
//         progressBar.style.width = "0%";
//     });

    
// });
// </script> {% endcomment %}


const reels = document.querySelectorAll(".reel");

reels.forEach(reel => {

    const video = reel.querySelector("video");
    const playBtn = reel.querySelector(".play-btn");
    const progressContainer = reel.querySelector(".progress-container");
    const progressBar = reel.querySelector(".progress-bar");
    const muteBtn = reel.querySelector(".mute-btn");
    const reelId = reel.dataset.id;
    const viewElement = reel.querySelector(".view-count");
    const muteIcon = muteBtn.querySelector("i");

    let counted = false;

    // Count view after 3 seconds of continuous play
    video.addEventListener("timeupdate", () => {

        if (video.currentTime >= 3 && !counted) {

            fetch(`/view/${reelId}/`)
                .then(response => response.json())
                

            counted = true;   // prevent repeat instantly
        }

    });

    // Reset when video restarts
    video.addEventListener("seeked", () => {
        if (video.currentTime < 3) {
            counted = false;
        }
    });

     /* Toggle play pause when video clicked */
    reel.addEventListener("click", (e) => {

        if(e.target.classList.contains("like-btn")) return;

        if(video.paused){
            video.play();
        }else{
            video.pause();
        }
    });

    /* Show play icon when paused */
    video.addEventListener("pause", () => {
        playBtn.classList.remove("hidden");
    });

    /* Hide play icon when playing */
    video.addEventListener("play", () => {
        playBtn.classList.add("hidden");
    });


    // Update progress while video plays
    video.addEventListener("timeupdate", () => {
        const percentage = (video.currentTime / video.duration) * 100;
        progressBar.style.width = percentage + "%";
    });

    // Click to seek
    progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = video.duration;

        video.currentTime = (clickX / width) * duration;
    });

    // Drag to seek
    let isDragging = false;

    progressContainer.addEventListener("mousedown", () => {
        isDragging = true;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const rect = progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;

        if (offsetX >= 0 && offsetX <= rect.width) {
            video.currentTime = (offsetX / rect.width) * video.duration;
        }
    });

    /* AUTO REPLAY WHEN VIDEO ENDS */
    video.addEventListener("ended", () => {
        video.currentTime = 0;
        video.play();
    });

    /* Mute / Unmute Feature */
    muteBtn.addEventListener("click", (e) => {
        e.stopPropagation();  // prevent triggering play/pause

        video.muted = !video.muted;

        if(video.muted){
            muteIcon.classList.remove("fa-volume-high");
            muteIcon.classList.add("fa-volume-xmark");
        } else {
            muteIcon.classList.remove("fa-volume-xmark");
            muteIcon.classList.add("fa-volume-high");
        }
    });

});