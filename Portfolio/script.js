document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
                anchor.addEventListener('click',function(e){
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior:'smooth'
                    })
                })
            })
            document.addEventListener("DOMContentLoaded", function () {
            const text = `Hello, I am Aiman Zareen. I am currently in the 3rd year of B.Tech.`;
            let index = 0;
            const speed = 100; // Typing speed in milliseconds
            const typedText = document.getElementById("typed-text");

            function typeWriter() {
            if (index < text.length) {
                typedText.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, speed);
            }
    }

    typeWriter();
});

       
