
async function showHome(){

    const statsResponse =
        await fetch("http://localhost:3000/stats");

    const stats =
        await statsResponse.json();

    const materialResponse =
        await fetch("http://localhost:3000/latest-material");

    const latestMaterial =
        await materialResponse.json();

    const activityResponse =
    await fetch("http://localhost:3000/recent-attempts");

    const activities =
    await activityResponse.json();
    
    let activityHTML = "";

activities.forEach(activity => {

    activityHTML += `

    <div class="activity-item">

        <h4>📝 Quiz Attempted</h4>

        <p>
        Quiz ID :
        ${activity.quiz_id}
        </p>

        <p>
        Score :
        ${activity.score}
        </p>

        <hr>

    </div>

    `;

});
    console.log(activityHTML);
    document.getElementById("content").innerHTML = `

    <div class="card">

        <h1>Good Evening, Samanvi</h1>

        <br>

        <p>
        Keep learning. Keep improving.
        Every quiz brings you one step closer to your goal.
        </p>

    </div>

    <div class="stats">

        <div class="stat-card blue">
            <h3>Materials</h3>
            <h1>${stats.materials}</h1>
        </div>

        <div class="stat-card purple">
            <h3>Quizzes</h3>
            <h1>${stats.quizzes}</h1>
        </div>

        <div class="stat-card green">
            <h3>Attempts</h3>
            <h1>${stats.attempts}</h1>
        </div>

        <div class="stat-card orange">
            <h3>Accuracy</h3>
            <h1>${stats.accuracy}%</h1>
        </div>

    </div>

    <br><br>

    <div class="card">

        <h2>📖 Continue Learning</h2>

        <br>

        <h3>${latestMaterial.subject}</h3>

        <br>

        <p><b>Topic:</b> ${latestMaterial.topic}</p>

        <br>

          <p><b>Difficulty:</b></p>

          <span class="badge">
            ${latestMaterial.difficulty}
          </span>

        <br>

        <button onclick="showMaterials()">
            Resume Learning →
        </button>

    </div>
    <br><br>

<div class="card">

    <h2>📊 Recent Activity</h2>

    <br>

    ${activityHTML}

</div>

    `;

}

showHome();

async function showMaterials(){

const response=
await fetch(
"http://localhost:3000/materials"
);

const materials=
await response.json();

let html="<h1>Study Materials</h1><br>";

if(materials.length===0){

html+=`

<div class="card">

No materials uploaded yet.

</div>

`;

}

materials.forEach(material=>{

html+=`

<div class="material-card">

<h2>${material.topic}</h2>

<br>

<p>

<b>Subject:</b>

${material.subject}

</p>

<br>

<p>

<b>Difficulty:</b>

${material.difficulty}

</p>

<br>

<p>

${material.content}

</p>

${
material.pdf_path

?

`

<br>

<a
href="http://localhost:3000/uploads/${material.pdf_path}"
target="_blank">

📄 Download PDF

</a>

`

:

""

}

</div>

`;

});

document.getElementById("content").innerHTML=html;

}

function showQuiz(){

document.getElementById("content").innerHTML=`

<div class="card">

<h1>Weekly Quiz</h1>

<br>

<p>

The quiz page will be integrated here.

</p>

</div>

`;

}

async function showAttempts(){

    const response =
        await fetch("http://localhost:3000/attempts");

    const attempts =
        await response.json();

    let html = `

    <div class="card">

        <h1>📊 My Attempts</h1>

        <br>

        <table class="attempt-table">

        <tr>
            <th>Quiz ID</th>
            <th>Score</th>
            <th>Correct</th>
            <th>Wrong</th>
            <th>Accuracy</th>
            <th>Date</th>
        </tr>

    `;

    attempts.forEach(attempt => {

        html += `

     <tr>

        <td>${attempt.quiz_id}</td>

         <td>${attempt.score}</td>

         <td>${attempt.correct_count}</td>

        <td>${attempt.wrong_count}</td>

        <td>
           ${Math.round(
            (attempt.correct_count /
            (attempt.correct_count + attempt.wrong_count)) * 100
            )}%
        </td>

        <td>${attempt.submitted_at}</td>

      </tr>
        `;

    });

    html += `

        </table>

    </div>

    `;

    document.getElementById("content").innerHTML = html;

}

async function showProfile(){

    const response = await fetch("http://localhost:3000/attempts");

    const attempts = await response.json();

    const myAttempts = attempts.filter(
        a => a.user_email === "samanvimedepalli@gmail.com"
    );

    let totalAttempts = myAttempts.length;
    let totalCorrect = 0;
    let totalWrong = 0;
    let highestScore = 0;

    myAttempts.forEach(a => {

        totalCorrect += a.correct_count;
        totalWrong += a.wrong_count;

        if(a.score > highestScore)
            highestScore = a.score;

    });

    let accuracy = 0;

    if(totalCorrect + totalWrong > 0){

        accuracy =
        (
            totalCorrect /
            (totalCorrect + totalWrong)
        ) * 100;

    }

    document.getElementById("content").innerHTML = `

    <div class="card">

        <h1>👤 Student Profile</h1>

        <hr><br>

        <p><b>Name:</b> Samanvi Medepalli</p>

        <p><b>Role:</b> Student</p>

        <p><b>Email:</b> samanvimedepalli@gmail.com</p>

        <br><hr><br>

        <p><b>Total Attempts:</b> ${totalAttempts}</p>

        <p><b>Total Correct:</b> ${totalCorrect}</p>

        <p><b>Total Wrong:</b> ${totalWrong}</p>

        <p><b>Accuracy:</b> ${accuracy.toFixed(2)}%</p>

        <p><b>Highest Score:</b> ${highestScore}</p>

    </div>

    `;

}

function logout(){

    localStorage.removeItem("user");

    window.location.href = "/login.html";

}