 // មុខងារត្រួតពិនិត្យការចូលប្រព័ន្ធ (Login)
    function handleLogin(event) {
        event.preventDefault();
        const inputId = document.getElementById('empIdInput').value.trim().toUpperCase();
        const errorEl = document.getElementById('loginError');

        if (allowedEmployeeIDs.includes(inputId)) {
            // អនុញ្ញាតឱ្យចូលប្រើប្រាស់
            errorEl.style.display = 'none';
            sessionStorage.setItem('current_user_id', inputId);
            showMainForm(inputId);
        } else {
            // បដិសេធ ប្រសិនបើគ្មានអត្តលេខក្នុងបញ្ជី
            errorEl.style.display = 'block';
        }
    }

    function showMainForm(empId) {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('appToolbar').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'block';
        document.getElementById('userBadge').innerText = '👤 គណនី៖ ' + empId;
    }

    function logout() {
        if(confirm("តើអ្នកពិតជាចង់ចាកចេញមែនទេ?")) {
            sessionStorage.removeItem('current_user_id');
            location.reload();
        }
    }

    // ត្រួតពិនិត្យពេលបើកទំព័រ
    function checkAuthOnLoad() {
        const savedUser = sessionStorage.getItem('current_user_id');
        if (savedUser && allowedEmployeeIDs.includes(savedUser)) {
            showMainForm(savedUser);
        } else {
            document.getElementById('loginOverlay').style.display = 'flex';
            document.getElementById('appToolbar').style.display = 'none';
            document.getElementById('appContainer').style.display = 'none';
        }
    }


/*=============== SHOW SIDEBAR ===============*/
const showSidebar = (toggleId, sidebarId, headerId, mainId) =>{
   const toggle = document.getElementById(toggleId),
         sidebar = document.getElementById(sidebarId),
         header = document.getElementById(headerId),
         main = document.getElementById(mainId)

   if(toggle && sidebar && header && main){
       toggle.addEventListener('click', ()=>{
           /* Show sidebar */
           sidebar.classList.toggle('show-sidebar')
           /* Add padding header */
           header.classList.toggle('left-pd')
           /* Add padding main */
           main.classList.toggle('left-pd')
       })
   }
}
showSidebar('header-toggle','sidebar', 'header', 'main')

/*=============== LINK ACTIVE ===============*/
const sidebarLink = document.querySelectorAll('.sidebar__list a')

function linkColor(){
    sidebarLink.forEach(l => l.classList.remove('active-link'))
    this.classList.add('active-link')
}

sidebarLink.forEach(l => l.addEventListener('click', linkColor))

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-fill'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-clear-fill' : 'ri-sun-fill'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-clear-fill' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})
/*=============== SIDEBAR DROPDOWN ===============*/
const reportsDropdown = document.getElementById('reports-dropdown');
if (reportsDropdown) {
   reportsDropdown.addEventListener('click', (e) => {
      e.preventDefault();
      const parentDropdown = reportsDropdown.parentElement;
      parentDropdown.classList.toggle('show-dropdown');
   });
}
