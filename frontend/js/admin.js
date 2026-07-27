async function loadDashboard(){

    // Materials
    const materials =
    await fetch("http://localhost:3000/materials");

    const m =
    await materials.json();

    document.getElementById(
        "materials"
    ).innerText = m.length;


    // Quizzes
    const quizzes =
    await fetch("http://localhost:3000/quizzes");

    const q =
    await quizzes.json();

    document.getElementById(
        "quizzes"
    ).innerText = q.length;


    // Questions
    const questions =
    await fetch("http://localhost:3000/allquestions");

    const ques =
    await questions.json();

    document.getElementById(
        "questions"
    ).innerText = ques.length;


    // Students
    const users =
    await fetch("http://localhost:3000/users");

    const u =
    await users.json();

    document.getElementById(
        "students"
    ).innerText =
    u.filter(
        x=>x.role==="student"
    ).length;

}

loadDashboard();