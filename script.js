// NAI GARMAI SCHOOL MANAGEMENT SYSTEM
// Front-end application logic

console.log("NAI GARMAI School Management System loaded.");

const STORAGE_KEYS = {
    students: "ng_students",
    teachers: "ng_teachers",
    classes: "ng_classes",
    subjects: "ng_subjects",
    grades: "ng_grades",
    attendance: "ng_attendance",
    fees: "ng_fees",
    settings: "ng_settings"
};

let students = loadData(STORAGE_KEYS.students, []);
let teachers = loadData(STORAGE_KEYS.teachers, []);
let classes = loadData(STORAGE_KEYS.classes, []);
let subjects = loadData(STORAGE_KEYS.subjects, []);
let grades = loadData(STORAGE_KEYS.grades, []);
let attendance = loadData(STORAGE_KEYS.attendance, []);
let fees = loadData(STORAGE_KEYS.fees, []);

let settings = loadData(STORAGE_KEYS.settings, {
    schoolName: "NAI GARMAI SCHOOL SYSTEM",
    academicYear: "2026/2027",
    schoolPhone: "",
    schoolEmail: "",
    schoolAddress: ""
});


// =====================================================
// STORAGE
// =====================================================

function loadData(key, fallback) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("Storage error:", error);
        return fallback;
    }
}


function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageId, button) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    updateDashboard();

    if (pageId === "students") renderStudents();
    if (pageId === "teachers") renderTeachers();
    if (pageId === "classes") renderClasses();
    if (pageId === "subjects") renderSubjects();
    if (pageId === "grades") renderGrades();
    if (pageId === "attendance") renderAttendance();
    if (pageId === "fees") renderFees();
}


function showPageById(pageId) {

    const button = [...document.querySelectorAll(".nav-btn")]
        .find(btn => btn.getAttribute("onclick")?.includes(`'${pageId}'`));

    showPage(pageId, button);
}


// =====================================================
// SIDEBAR
// =====================================================

function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}


// =====================================================
// MODALS
// =====================================================

function openModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("show");
    }
}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("show");
    }
}


window.addEventListener("click", function(event) {

    if (event.target.classList.contains("modal")) {
        event.target.classList.remove("show");
    }

});


// =====================================================
// STUDENT MODAL
// =====================================================

function openStudentModal() {

    populateStudentClassOptions();

    clearFields([
        "studentId",
        "studentName",
        "studentDob",
        "studentGuardian",
        "studentPhone"
    ]);

    const gender = document.getElementById("studentGender");

    if (gender) {
        gender.value = "";
    }

    const studentClass = document.getElementById("studentClass");

    if (studentClass) {
        studentClass.value = "";
    }

    openModal("studentModal");
}


function saveStudent() {

    const id = getValue("studentId");
    const name = getValue("studentName");
    const gender = getValue("studentGender");
    const dob = getValue("studentDob");
    const studentClass = getValue("studentClass");
    const guardian = getValue("studentGuardian");
    const phone = getValue("studentPhone");

    if (!id || !name || !gender || !studentClass) {
        showToast("Please complete the required student information.");
        return;
    }

    if (students.some(student => student.id === id)) {
        showToast("Student ID already exists.");
        return;
    }

    students.push({
        id,
        name,
        gender,
        dob,
        className: studentClass,
        guardian,
        phone,
        createdAt: new Date().toISOString()
    });

    saveData(STORAGE_KEYS.students, students);

    closeModal("studentModal");

    renderStudents();
    updateDashboard();
    populateStudentOptions();

    showToast("Student added successfully.");
}


// =====================================================
// STUDENT TABLE
// =====================================================

function renderStudents() {

    const table = document.getElementById("studentTable");

    if (!table) return;

    const searchInput = document.getElementById("studentSearch");

    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filtered = students.filter(student => {

        return (
            String(student.id).toLowerCase().includes(search) ||
            String(student.name).toLowerCase().includes(search) ||
            String(student.className).toLowerCase().includes(search)
        );

    });

    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = filtered.map(student => {

        return `
            <tr>
                <td>${escapeHTML(student.id)}</td>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.gender)}</td>
                <td>${escapeHTML(student.dob || "-")}</td>
                <td>${escapeHTML(student.className)}</td>
                <td>${escapeHTML(student.guardian || "-")}</td>
                <td>${escapeHTML(student.phone || "-")}</td>
                <td>
                    <button class="btn danger"
                        onclick="deleteStudent('${escapeJS(student.id)}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    }).join("");

}


function deleteStudent(id) {

    const student = students.find(item => item.id === id);

    if (!student) return;

    if (!confirm(`Delete ${student.name}?`)) {
        return;
    }

    students = students.filter(item => item.id !== id);

    saveData(STORAGE_KEYS.students, students);

    renderStudents();
    updateDashboard();
    populateStudentOptions();

    showToast("Student deleted.");
}


// =====================================================
// TEACHERS
// =====================================================

function openTeacherModal() {

    clearFields([
        "teacherId",
        "teacherName",
        "teacherSubject",
        "teacherPhone"
    ]);

    const gender = document.getElementById("teacherGender");

    if (gender) {
        gender.value = "";
    }

    openModal("teacherModal");
}


function saveTeacher() {

    const id = getValue("teacherId");
    const name = getValue("teacherName");
    const gender = getValue("teacherGender");
    const subject = getValue("teacherSubject");
    const phone = getValue("teacherPhone");

    if (!id || !name || !gender) {
        showToast("Please complete the required teacher information.");
        return;
    }

    if (teachers.some(teacher => teacher.id === id)) {
        showToast("Teacher ID already exists.");
        return;
    }

    teachers.push({
        id,
        name,
        gender,
        subject,
        phone,
        createdAt: new Date().toISOString()
    });

    saveData(STORAGE_KEYS.teachers, teachers);

    closeModal("teacherModal");

    renderTeachers();
    updateDashboard();

    showToast("Teacher added successfully.");
}


function renderTeachers() {

    const table = document.getElementById("teacherTable");

    if (!table) return;

    const searchInput = document.getElementById("teacherSearch");

    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filtered = teachers.filter(teacher => {

        return (
            String(teacher.id).toLowerCase().includes(search) ||
            String(teacher.name).toLowerCase().includes(search) ||
            String(teacher.subject).toLowerCase().includes(search)
        );

    });

    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No teachers found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = filtered.map(teacher => {

        return `
            <tr>
                <td>${escapeHTML(teacher.id)}</td>
                <td>${escapeHTML(teacher.name)}</td>
                <td>${escapeHTML(teacher.gender)}</td>
                <td>${escapeHTML(teacher.subject || "-")}</td>
                <td>${escapeHTML(teacher.phone || "-")}</td>
                <td>
                    <button class="btn danger"
                        onclick="deleteTeacher('${escapeJS(teacher.id)}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    }).join("");

}


function deleteTeacher(id) {

    const teacher = teachers.find(item => item.id === id);

    if (!teacher) return;

    if (!confirm(`Delete ${teacher.name}?`)) {
        return;
    }

    teachers = teachers.filter(item => item.id !== id);

    saveData(STORAGE_KEYS.teachers, teachers);

    renderTeachers();
    updateDashboard();

    showToast("Teacher deleted.");
}


// =====================================================
// CLASSES
// =====================================================

function openClassModal() {

    clearFields([
        "classId",
        "className",
        "classTeacher",
        "classRoom"
    ]);

    openModal("classModal");
}


function saveClass() {

    const id = getValue("classId");
    const name = getValue("className");
    const teacher = getValue("classTeacher");
    const room = getValue("classRoom");

    if (!id || !name) {
        showToast("Please enter the class ID and class name.");
        return;
    }

    if (classes.some(item => item.id === id)) {
        showToast("Class ID already exists.");
        return;
    }

    classes.push({
        id,
        name,
        teacher,
        room
    });

    saveData(STORAGE_KEYS.classes, classes);

    closeModal("classModal");

    renderClasses();
    populateStudentClassOptions();
    updateDashboard();

    showToast("Class added successfully.");
}


function renderClasses() {

    const table = document.getElementById("classTable");

    if (!table) return;

    if (classes.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No classes found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = classes.map(item => {

        const studentCount = students.filter(
            student => student.className === item.name
        ).length;

        return `
            <tr>
                <td>${escapeHTML(item.id)}</td>
                <td>${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.teacher || "-")}</td>
                <td>${escapeHTML(item.room || "-")}</td>
                <td>${studentCount}</td>
                <td>
                    <button class="btn danger"
                        onclick="deleteClass('${escapeJS(item.id)}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    }).join("");

}


function deleteClass(id) {

    if (!confirm("Delete this class?")) {
        return;
    }

    classes = classes.filter(item => item.id !== id);

    saveData(STORAGE_KEYS.classes, classes);

    renderClasses();
    populateStudentClassOptions();

    showToast("Class deleted.");
}


// =====================================================
// SUBJECTS
// =====================================================

function openSubjectModal() {

    clearFields([
        "subjectId",
        "subjectName",
        "subjectTeacher",
        "subjectClass"
    ]);

    openModal("subjectModal");
}


function saveSubject() {

    const id = getValue("subjectId");
    const name = getValue("subjectName");
    const teacher = getValue("subjectTeacher");
    const className = getValue("subjectClass");

    if (!id || !name) {
        showToast("Please enter the subject ID and subject name.");
        return;
    }

    if (subjects.some(item => item.id === id)) {
        showToast("Subject ID already exists.");
        return;
    }

    subjects.push({
        id,
        name,
        teacher,
        className
    });

    saveData(STORAGE_KEYS.subjects, subjects);

    closeModal("subjectModal");

    renderSubjects();

    showToast("Subject added successfully.");
}


function renderSubjects() {

    const table = document.getElementById("subjectTable");

    if (!table) return;

    if (subjects.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No subjects found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = subjects.map(item => {

        return `
            <tr>
                <td>${escapeHTML(item.id)}</td>
                <td>${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.teacher || "-")}</td>
                <td>${escapeHTML(item.className || "-")}</td>
                <td>
                    <button class="btn danger"
                        onclick="deleteSubject('${escapeJS(item.id)}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    }).join("");

}


function deleteSubject(id) {

    if (!confirm("Delete this subject?")) {
        return;
    }

    subjects = subjects.filter(item => item.id !== id);

    saveData(STORAGE_KEYS.subjects, subjects);

    renderSubjects();

    showToast("Subject deleted.");
}


// =====================================================
// GRADES
// =====================================================

function openGradeModal() {

    populateStudentOptions();

    clearFields([
        "gradeSubject",
        "gradeScore"
    ]);

    const student = document.getElementById("gradeStudent");

    if (student) {
        student.value = "";
    }

    openModal("gradeModal");
}


function saveGrade() {

    const studentId = getValue("gradeStudent");
    const subject = getValue("gradeSubject");
    const score = Number(getValue("gradeScore"));

    if (!studentId || !subject || Number.isNaN(score)) {
        showToast("Please complete all grade fields.");
        return;
    }

    if (score < 0 || score > 100) {
        showToast("Score must be between 0 and 100.");
        return;
    }

    const student = students.find(item => item.id === studentId);

    if (!student) {
        showToast("Student not found.");
        return;
    }

    grades.push({
        id: Date.now().toString(),
        studentId,
        studentName: student.name,
        subject,
        score,
        grade: calculateGrade(score),
        remark: calculateRemark(score),
        status: "Pending",
        createdAt: new Date().toISOString()
    });

    saveData(STORAGE_KEYS.grades, grades);

    closeModal("gradeModal");

    renderGrades();

    showToast("Grade submitted.");
}


function renderGrades() {

    const table = document.getElementById("gradeTable");

    if (!table) return;

    if (grades.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No grades submitted.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = grades.map(item => {

        return `
            <tr>
                <td>${escapeHTML(item.studentName)}</td>
                <td>${escapeHTML(item.subject)}</td>
                <td>${item.score}</td>
                <td>${escapeHTML(item.grade)}</td>
                <td>${escapeHTML(item.remark)}</td>
                <td>${escapeHTML(item.status)}</td>
            </tr>
        `;

    }).join("");

}


function calculateGrade(score) {

    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    if (score >= 50) return "E";

    return "F";
}


function calculateRemark(score) {

    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Satisfactory";
    if (score >= 50) return "Pass";

    return "Fail";
}


// =====================================================
// ATTENDANCE
// =====================================================

function openAttendanceModal() {

    populateStudentOptions();

    const date = document.getElementById("attendanceDate");

    if (date) {
        date.value = new Date().toISOString().split("T")[0];
    }

    const student = document.getElementById("attendanceStudent");

    if (student) {
        student.value = "";
    }

    openModal("attendanceModal");
}


function saveAttendance() {

    const date = getValue("attendanceDate");
    const studentId = getValue("attendanceStudent");
    const status = getValue("attendanceStatus");

    if (!date || !studentId || !status) {
        showToast("Please complete the attendance form.");
        return;
    }

    const student = students.find(item => item.id === studentId);

    if (!student) {
        showToast("Student not found.");
        return;
    }

    attendance.push({
        id: Date.now().toString(),
        date,
        studentId,
        studentName: student.name,
        status,
        approval: "Pending"
    });

    saveData(STORAGE_KEYS.attendance, attendance);

    closeModal("attendanceModal");

    renderAttendance();

    showToast("Attendance submitted.");
}


function renderAttendance() {

    const table = document.getElementById("attendanceTable");

    if (!table) return;

    if (attendance.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No attendance records.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = attendance.map(item => {

        return `
            <tr>
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.studentName)}</td>
                <td>${escapeHTML(item.status)}</td>
                <td>${escapeHTML(item.approval)}</td>
            </tr>
        `;

    }).join("");

}


// =====================================================
// FEES
// =====================================================

function openFeeModal() {

    populateStudentOptions();

    const date = document.getElementById("feeDate");

    if (date) {
        date.value = new Date().toISOString().split("T")[0];
    }

    clearFields([
        "feeAmount"
    ]);

    const student = document.getElementById("feeStudent");

    if (student) {
        student.value = "";
    }

    openModal("feeModal");
}


function saveFee() {

    const date = getValue("feeDate");
    const studentId = getValue("feeStudent");
    const amount = Number(getValue("feeAmount"));
    const method = getValue("feeMethod");

    if (!date || !studentId || !amount || !method) {
        showToast("Please complete the payment form.");
        return;
    }

    if (amount <= 0) {
        showToast("Amount must be greater than zero.");
        return;
    }

    const student = students.find(item => item.id === studentId);

    if (!student) {
        showToast("Student not found.");
        return;
    }

    fees.push({
        id: Date.now().toString(),
        date,
        studentId,
        studentName: student.name,
        amount,
        method,
        status: "Recorded"
    });

    saveData(STORAGE_KEYS.fees, fees);

    closeModal("feeModal");

    renderFees();
    updateDashboard();

    showToast("Payment recorded successfully.");
}


function renderFees() {

    const table = document.getElementById("feeTable");

    if (!table) return;

    if (fees.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No payments recorded.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = fees.map(item => {

        return `
            <tr>
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.studentName)}</td>
                <td>$${Number(item.amount).toFixed(2)}</td>
                <td>${escapeHTML(item.method)}</td>
                <td>${escapeHTML(item.status)}</td>
            </tr>
        `;

    }).join("");

}


// =====================================================
// SETTINGS
// =====================================================

function saveSettings() {

    settings.schoolName = getValue("schoolName");
    settings.academicYear = getValue("academicYear");
    settings.schoolPhone = getValue("schoolPhone");
    settings.schoolEmail = getValue("schoolEmail");
    settings.schoolAddress = getValue("schoolAddress");

    saveData(STORAGE_KEYS.settings, settings);

    updateSchoolName();

    showToast("School settings saved.");
}


function loadSettings() {

    setValue("schoolName", settings.schoolName);
    setValue("academicYear", settings.academicYear);
    setValue("schoolPhone", settings.schoolPhone);
    setValue("schoolEmail", settings.schoolEmail);
    setValue("schoolAddress", settings.schoolAddress);

    updateSchoolName();
}


function updateSchoolName() {

    document.querySelectorAll(".logo h2").forEach(element => {
        element.textContent = settings.schoolName || "NAI GARMAI";
    });

    const title = document.querySelector(".topbar h1");

    if (title) {
        title.textContent =
            settings.schoolName || "NAI GARMAI SCHOOL SYSTEM";
    }
}


// =====================================================
// DROPDOWN OPTIONS
// =====================================================

function populateStudentOptions() {

    const dropdowns = [
        "gradeStudent",
        "attendanceStudent",
        "feeStudent"
    ];

    dropdowns.forEach(id => {

        const select = document.getElementById(id);

        if (!select) return;

        select.innerHTML = `
            <option value="">Select Student</option>
        `;

        students.forEach(student => {

            const option = document.createElement("option");

            option.value = student.id;
            option.textContent =
                `${student.id} - ${student.name}`;

            select.appendChild(option);

        });

    });
}


function populateStudentClassOptions() {

    const select = document.getElementById("studentClass");

    if (!select) return;

    select.innerHTML = `
        <option value="">Select Class</option>
    `;

    classes.forEach(item => {

        const option = document.createElement("option");

        option.value = item.name;
        option.textContent = item.name;

        select.appendChild(option);

    });
}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    setText("studentCount", students.length);
    setText("teacherCount", teachers.length);
    setText("classCount", classes.length);

    const totalFees = fees.reduce(
        (total, fee) => total + Number(fee.amount || 0),
        0
    );

    setText(
        "feeCount",
        `$${totalFees.toFixed(2)}`
    );

    renderRecentStudents();
}


function renderRecentStudents() {

    const table = document.getElementById("recentStudents");

    if (!table) return;

    const recent = [...students]
        .slice(-5)
        .reverse();

    if (recent.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No students yet.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = recent.map(student => {

        return `
            <tr>
                <td>${escapeHTML(student.id)}</td>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.gender)}</td>
                <td>${escapeHTML(student.className)}</td>
            </tr>
        `;

    }).join("");
}


// =====================================================
// DATE
// =====================================================

function updateDate() {

    const element = document.getElementById("today");

    if (!element) return;

    const now = new Date();

    element.textContent = now.toLocaleDateString(
        undefined,
        {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


// =====================================================
// TOAST
// =====================================================

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// =====================================================
// HELPERS
// =====================================================

function getValue(id) {

    const element = document.getElementById(id);

    return element
        ? element.value.trim()
        : "";
}


function setValue(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.value = value || "";
    }
}


function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function clearFields(ids) {

    ids.forEach(id => {
        setValue(id, "");
    });
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeJS(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


// =====================================================
// INITIALIZE APP
// =====================================================

document.addEventListener("DOMContentLoaded", function() {

    updateDate();

    loadSettings();

    populateStudentClassOptions();

    populateStudentOptions();

    renderStudents();
    renderTeachers();
    renderClasses();
    renderSubjects();
    renderGrades();
    renderAttendance();
    renderFees();

    updateDashboard();

    console.log("NAI GARMAI application initialized successfully.");

});


// =====================================================
// MAKE FUNCTIONS AVAILABLE TO HTML ONCLICK
// =====================================================

window.showPage = showPage;
window.showPageById = showPageById;
window.toggleSidebar = toggleSidebar;

window.openStudentModal = openStudentModal;
window.saveStudent = saveStudent;

window.openTeacherModal = openTeacherModal;
window.saveTeacher = saveTeacher;

window.openClassModal = openClassModal;
window.saveClass = saveClass;

window.openSubjectModal = openSubjectModal;
window.saveSubject = saveSubject;

window.openGradeModal = openGradeModal;
window.saveGrade = saveGrade;

window.openAttendanceModal = openAttendanceModal;
window.saveAttendance = saveAttendance;

window.openFeeModal = openFeeModal;
window.saveFee = saveFee;

window.saveSettings = saveSettings;

window.closeModal = closeModal;

window.deleteStudent = deleteStudent;
window.deleteTeacher = deleteTeacher;
window.deleteClass = deleteClass;
window.deleteSubject = deleteSubject;