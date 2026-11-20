import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ការកំណត់ការតភ្ជាប់ Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCh0zr1ZsuUYtYnoto2ml-fLm7SWyRUCpM",
  authDomain: "documents-y7-2.firebaseapp.com",
  databaseURL: "https://documents-y7-2.firebaseio.com",
  projectId: "documents-y7-2",
  storageBucket: "documents-y7-2.appspot.com",
  messagingSenderId: "7486379749",
  appId: "1:7486379749:web:77e78317f89df90ce4260c",
  measurementId: "G-WWLX6Y48QC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// បង្ហាញការជូនដំណឹង
window.showNotification = function(message, type = 'danger') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = "mx-8 p-3 rounded-xl text-xs font-medium transition-all duration-200 ";
    
    if (type === 'danger') {
        alertBox.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
    } else if (type === 'success') {
        alertBox.classList.add('bg-emerald-50', 'text-emerald-700', 'border', 'border-emerald-200');
    } else {
        alertBox.classList.add('bg-blue-50', 'text-blue-700', 'border', 'border-blue-200');
    }

    alertBox.classList.remove('hidden');
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 3500);
}

// ប្តូររវាងផ្ទាំង Login និង Signup
window.switchTab = function(mode) {
    const loginBtn = document.getElementById('tabLoginBtn');
    const signupBtn = document.getElementById('tabSignupBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');

    if (mode === 'login') {
        if (loginBtn) loginBtn.className = "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-slate-800 shadow-sm";
        if (signupBtn) signupBtn.className = "flex-1 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 rounded-lg transition-all duration-200";
        if (loginForm) loginForm.classList.remove('hidden');
        if (signupForm) signupForm.classList.add('hidden');
        if (formTitle) formTitle.textContent = "ស្វាគមន៍មកកាន់ប្រព័ន្ធ";
        if (formSubtitle) formSubtitle.textContent = "សូមបញ្ចូលអត្តលេខបុគ្គលិកដើម្បីចូលប្រើប្រាស់";
    } else {
        if (signupBtn) signupBtn.className = "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-white text-slate-800 shadow-sm";
        if (loginBtn) loginBtn.className = "flex-1 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 rounded-lg transition-all duration-200";
        if (signupForm) signupForm.classList.remove('hidden');
        if (loginForm) loginForm.classList.add('hidden');
        if (formTitle) formTitle.textContent = "បង្កើតគណនីថ្មី";
        if (formSubtitle) formSubtitle.textContent = "សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីចុះឈ្មោះ";
    }
}

// មុខងារបើកទំព័រ home.html ពេល Login ជោគជ័យ
function openHomePage(userData) {
    showNotification(`ចូលប្រព័ន្ធជោគជ័យ! ស្វាគមន៍ ${userData.name}`, 'success');
    
    // រក្សាទុកទិន្នន័យ Session
    sessionStorage.setItem('currentUser', JSON.stringify(userData));

    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}

// ស្គ្រីបផ្ទៀងផ្ទាត់ការ Login ជាមួយ Firebase Realtime Database
window.handleLogin = async function(e) {
    e.preventDefault();
    const empIdInput = document.getElementById('loginEmpId').value.trim();
    const passwordInput = document.getElementById('loginPassword').value.trim();
    
    try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, 'employees'));
        
        if (snapshot.exists()) {
            const employees = snapshot.val();
            let foundUser = null;

            for (let key in employees) {
                if (employees[key].emp_id && employees[key].emp_id.toLowerCase() === empIdInput.toLowerCase()) {
                    foundUser = employees[key];
                    break;
                }
            }

            if (foundUser) {
                if (foundUser.password === passwordInput) {
                    openHomePage(foundUser);
                } else {
                    showNotification('ពាក្យសម្ងាត់មិនត្រឹមត្រូវ!', 'danger');
                }
            } else {
                showNotification('រកមិនឃើញអត្តលេខបុគ្គលិកនេះទេ!', 'danger');
            }
        } else {
            showNotification('មិនមានទិន្នន័យបុគ្គលិកនៅក្នុងប្រព័ន្ធ Database ទេ។', 'danger');
        }
    } catch (error) {
        console.error(error);
        showNotification('មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ Firebase: ' + error.message, 'danger');
    }
}

// ស្គ្រីបចុះឈ្មោះបុគ្គលិកថ្មី និងបញ្ជូនចូល Firebase Realtime Database
window.handleSignup = async function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const empId = document.getElementById('signupEmpId').value.trim();
    const dept = document.getElementById('signupDept').value;
    const pass = document.getElementById('signupPassword').value;
    const confirmPass = document.getElementById('signupConfirmPassword').value;

    if (pass !== confirmPass) {
        showNotification('ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ!', 'danger');
        return;
    }

    try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, 'employees'));
        
        let exists = false;
        let count = 0;

        if (snapshot.exists()) {
            const employees = snapshot.val();
            count = Object.keys(employees).length;
            for (let key in employees) {
                if (employees[key].emp_id && employees[key].emp_id.toLowerCase() === empId.toLowerCase()) {
                    exists = true;
                    break;
                }
            }
        }

        if (exists) {
            showNotification('អត្តលេខបុគ្គលិកនេះមានរួចហើយ!', 'danger');
            return;
        }

        const newKey = 'emp_' + String(count + 1).padStart(2, '0');

        await set(ref(db, 'employees/' + newKey), {
            emp_id: empId,
            password: pass,
            name: name,
            department: dept,
            timestamp: new Date().toISOString()
        });

        showNotification('បង្កើតគណនីបុគ្គលិកបានជោគជ័យ!', 'success');
        setTimeout(() => {
            e.target.reset();
            switchTab('login');
        }, 1200);

    } catch (error) {
        console.error(error);
        showNotification('មានបញ្ហាក្នុងការចុះឈ្មោះ: ' + error.message, 'danger');
    }
}
function showWorkspace(userData) {
    const overlay = document.getElementById('loginOverlay');
    const workspace = document.getElementById('workspaceContent');

    if (userData?.name) {
        const subEl = document.getElementById('sidebarUserSub');
        if (subEl) {
            subEl.textContent = `${userData.name} • ${userData.department || 'W.H Operation'}`;
        }
    }

    if (workspace) {
        workspace.classList.remove('hidden');
    }

    if (overlay) {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
}

function showLoginOverlay() {
    const overlay = document.getElementById('loginOverlay');
    const workspace = document.getElementById('workspaceContent');

    if (workspace) {
        workspace.classList.add('hidden');
    }

    if (overlay) {
        overlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    }
}

// ហៅ showWorkspace(foundUser) នៅពេល Login ត្រឹមត្រូវ
// និងរក្សាទុក sessionStorage.setItem('currentUser', JSON.stringify(foundUser))
