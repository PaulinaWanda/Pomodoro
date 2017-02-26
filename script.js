/*elements*/
const minus = document.getElementsByClassName("minus");
const plus = document.getElementsByClassName("plus");
const pomodoroWork = document.getElementById("work");
const pomodoroBreak = document.getElementById("break");
const countdown = document.getElementById("countdown");
const workLine = document.getElementById("work-line");
const breakLine = document.getElementById("break-line");

/*constants & variables for interval*/
const msInSecond = 1000;
let startInterval = false;
let switchedOn = pomodoroWork;

/*a joke...*/
function lazyUserAlert() {
    alert(`Don't be lazy,
let's not make the break longer than the session!`);
}

/*set default length of time flow indicators*/
const defaultWorkLineLength = 100;
let workLineLength = defaultWorkLineLength;
function setBreakLineLength(breakId = pomodoroBreak, workId = pomodoroWork) {
    return parseInt(breakId.textContent, 10) / parseInt(workId.textContent, 10) * defaultWorkLineLength;
}
let breakLineLength = setBreakLineLength();

/*set default worktime*/
let mins = parseInt(pomodoroWork.textContent, 10);
countdown.textContent = mins;
let secs = 0;

/*onclick minus*/
for (let i = 0; i < minus.length; i++) {
    minus[i].addEventListener("click", function () {
        if (!startInterval) {
            /*minus for worktime*/
            if (minus[i].nextElementSibling === pomodoroWork && pomodoroWork.textContent !== "0") {
                if (parseInt(pomodoroBreak.textContent, 10) < parseInt(pomodoroWork.textContent, 10)) {
                    mins = parseInt(pomodoroWork.textContent, 10);
                    mins -= 1;
                    secs = 0;
                    pomodoroWork.textContent = mins;
                    countdown.textContent = mins;
                    /*reset time flow indicator for worktime*/
                    workLineLength = defaultWorkLineLength;
                    workLine.style.width = `${workLineLength}%`;
                } else {
                    lazyUserAlert();
                }
                /*minus for breaktime*/
            } else if (minus[i].nextElementSibling === pomodoroBreak && pomodoroBreak.textContent !== "0") {
                pomodoroBreak.textContent = parseInt(pomodoroBreak.textContent, 10) - 1;
            }
            /*set accurate time flow indicator for break*/
            breakLineLength = setBreakLineLength();
            breakLine.style.width = `${breakLineLength}%`;
        }
    });
}

/*onclick plus*/
for (let i = 0; i < plus.length; i++) {
    plus[i].addEventListener("click", function () {
        if (!startInterval) {
            /*plus worktime*/
            if (plus[i].previousElementSibling === pomodoroWork) {
                mins = parseInt(pomodoroWork.textContent, 10);
                mins += 1;
                secs = 0;
                pomodoroWork.textContent = mins;
                countdown.textContent = mins;
                /*reset time flow indicator for worktime*/
                workLineLength = defaultWorkLineLength;
                workLine.style.width = `${workLineLength}%`;
                /*plus breaktime*/
            } else if (plus[i].previousElementSibling === pomodoroBreak) {
                if (parseInt(pomodoroBreak.textContent, 10) < parseInt(pomodoroWork.textContent, 10)) {
                    pomodoroBreak.textContent = parseInt(pomodoroBreak.textContent, 10) + 1;
                } else {
                    lazyUserAlert();
                }
            }
            /*set accurate time flow indicator for break*/
            breakLineLength = setBreakLineLength();
            breakLine.style.width = `${breakLineLength}%`;
        }
    });
}

/*onclick countdown*/
countdown.onclick = function () {
    if (!startInterval) {
        /*when interval is working*/
        startInterval = window.setInterval(function () {
            if (mins === 0 && secs === 0) {
                /*switching from worktime to breaktime and the other way round*/
                switch (switchedOn) {
                    case pomodoroWork:
                        switchedOn = pomodoroBreak;
                        workLineLength = defaultWorkLineLength;
                        workLine.style.width = `${workLineLength}%`;
                        break;
                    case pomodoroBreak:
                        switchedOn = pomodoroWork;
                        breakLineLength = setBreakLineLength();
                        breakLine.style.width = `${breakLineLength}%`;
                        break;
                }
                mins = parseInt(switchedOn.textContent, 10);
                /*countdown in mins and secs*/
            } else if (mins !== 0 && secs === 0) {
                mins -= 1;
                secs = 59
            } else if (secs !== 0) {
                secs -= 1;
            }
            countdown.textContent = (secs.toString().length === 2) ? `${mins}:${secs}` : `${mins}:0${secs}`;
            /*change length of time flow indicator*/
            switch (switchedOn) {
                case pomodoroWork:
                    workLineLength -= (defaultWorkLineLength / (parseInt(pomodoroWork.textContent, 10) * 60));
                    workLine.style.width = `${workLineLength}%`;
                    break;
                case pomodoroBreak:
                    breakLineLength -= (setBreakLineLength() / (parseInt(pomodoroBreak.textContent, 10) * 60));
                    breakLine.style.width = `${breakLineLength}%`;
                    break;
            }
        }, msInSecond);
        /*when interval is paused*/
    } else {
        clearInterval(startInterval);
        startInterval = false;
    }
};