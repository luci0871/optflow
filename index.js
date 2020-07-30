window.addEventListener("DOMContentLoaded", svghide)

// function checkidsubscribed() {
//     const url = window.location.href
//     if (localStorage.getItem("access")) {
//         console.log("Yes")
//     } else {
//         console.log("No")
//         ////// need to reverse this, so everyting under here must go to no later on 
//         setTimeout(() => {
//             document.querySelector(`[data-userMessage="accessDenied"]`).classList.remove("hidden")
//             document.querySelector(`.formmodalbackground`).classList.remove("hidden")
//             document.querySelector(`[data-activateform]`).addEventListener("click", e = activateForm)
//         }, 2000);
//     }
// }

const activateForm = function () {
    document.querySelector("#signupform").classList.remove("hidden")
}
const url = "https://dxcformexercise-13a8.restdb.io/rest/submissions";
const api = "	5ea15718919b360ce59b7c0b";
const reveal = function () {
    const what = this.parentElement.querySelector("polyline")
    what.style.stroke = "black"
}

function svghide() {
    const svg = document.querySelectorAll(".invisible")
    svg.forEach(e => {
        e.addEventListener("click", e = reveal)
    })
    count();
    const r = document.querySelectorAll(`[data-navYellow]`)
    r.forEach(e => {
        e.addEventListener("click", revealform)
    })
    document.querySelector(`[data-closeform]`).addEventListener("click", hideform)
    document.querySelector(`[data-openLoginModal]`).addEventListener("click", revealfLogin)

}


function hideform() {
    document.querySelector("#signupform").classList.add("hidden")
}
function revealfLogin() {
    document.querySelector(`[data-userMessage="login"]`).classList.remove("hidden")
}
function revealform() {
    document.querySelector("#signupform").classList.remove("hidden")
}

function count() {
    const p = document.querySelector("[data-counter]")
    let amount = 51687;
    setInterval(() => {
        amount = amount + getRandomInt(3);
        p.innerHTML = amount
    }, 1000);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const form = document.querySelector("#signupform")
form.addEventListener("submit", signup)

function signup(event) {
    event.preventDefault();

    const swiTch = event.target.querySelector("#cbx").checked;
    console.log(swiTch)
    if (swiTch == false) {
        UserMessageToggle("Permission")
        return;
    }
    const fname = event.target.querySelector("#fname").value
    const lname = event.target.querySelector("#lname").value
    const wemail = event.target.querySelector("#Email").value
    const cname = event.target.querySelector("#Company").value
    const country = event.target.querySelector("#Country").value
    const jtitle = event.target.querySelector("#Title").value
    const keywords = [{
        Procurment: event.target.querySelector("#cbx2").checked,
        IT: event.target.querySelector("#cbx3").checked,
        Marketing: event.target.querySelector("#cbx4").checked,
        Service_Industry: event.target.querySelector("#cbx5").checked,
        Retail_Industry: event.target.querySelector("#cbx6").checked,
        E_commerce: event.target.querySelector("#cbx7").checked
    }]
    const data = {
        first_name: fname,
        last_name: lname,
        work_email: wemail,
        company_name: cname,
        country: country,
        job_title: jtitle,
        permission_given_at: new Date(),
        keywords: keywords
    }
    const postData = JSON.stringify(data);
    post(postData)
}
function post(postData) {
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": api,
            "cache-control": "no-cache"
        },
        body: postData
    }).then(res => res.json())
        .then(data => {
            if (data.list) {
                if (data.list[0].message[1] == "UNIQUE") {
                    UserMessageToggle("AlreadySubs")
                    const data = JSON.parse(postData);
                    addPriority(data.work_email, postData);
                    localStorage.setItem("access", "granted")
                    document.querySelector("#signupform").classList.add("hidden")
                    document.querySelector(".formmodalbackground").classList.add("hidden")
                }
            } else if (data._id) {
                UserMessageToggle("Success")
                localStorage.setItem("access", "granted")
                document.querySelector("#signupform").classList.add("hidden")
                document.querySelector(".formmodalbackground").classList.add("hidden")
            }
        })
}

const checkwhat = function () {
    UserMessageToggle(this.dataset.closeusermessage)
}
const userMclose = document.querySelectorAll(`[data-closeUsermessage]`)
userMclose.forEach(e => {
    e.addEventListener("click", e = checkwhat)
})


function UserMessageToggle(whatMessage) {
    const message = document.querySelector(`[data-userMessage="` + whatMessage + `"]`)
    if (message.classList.contains("hidden")) {
        message.classList.remove("hidden")
    } else {
        message.classList.add("hidden")
    }
}


function addPriority(email, postData) {
    fetch(`` + url + `?q={"work_email":"` + email + `" }`, {
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": api,
            "cache-control": "no-cache"
        }
    }).then(e => e.json())
        .then(e => {
            const data = JSON.parse(postData)
            console.log(data)
            data.hot_lead = true;
            const body = JSON.stringify(data);
            fetch(`` + url + `/` + e[0]._id + ``, {
                method: "put",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "x-apikey": api,
                    "cache-control": "no-cache"
                },
                body: body
            }).then(e => e.json())
                .then(e => {
                    console.log(e)
                })
        });

}