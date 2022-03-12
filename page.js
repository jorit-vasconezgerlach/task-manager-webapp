//# Pageload
window.addEventListener('load', ()=>{

    //# Classes
    // CreateForm
    class CreateForm {
        constructor() {}
        reset() {
            elInput.value = '';
            elInputClear.style.display = 'none';
            elInput.focus();
        }
    }

    //# Sections
    const secCreate = document.getElementById('create');
    const secList = document.getElementById('list');
    //# Elements
    ///> menu
    const elMenu = document.getElementById('menu');
    // export
    const elMenuExport = elMenu.querySelector('.export');
    // import
    const elMenuImport = elMenu.querySelector('.import');
    // clear
    const elMenuClear = elMenu.querySelector('.clear');
    // feedback
    const elMenuFeedback = elMenu.querySelector('.feedback');
    ///> createForm
    const clCreateForm = new CreateForm();
    // input
    const elInput = secCreate.querySelector('[type=text]');
    const elInputClear = secCreate.querySelector('svg');
    // submit
    const elSubmit= secCreate.querySelector('[type=submit]');
    ///> list
    const elList= secList.querySelector('ul');
    //# Variables
    const cookieNameTasks = 'tasks';

    //# Load Tasks
    // get tasks from cookies and load to ui
    if(getCookie(cookieNameTasks)) {
        var taskJSON = getCookie(cookieNameTasks)?.split(',').reverse();
        fillListWithArray(taskJSON);
    } else {
        var taskJSON = [];
    }

    //# Add Task
    // add task and clear input on submit
    secCreate.onsubmit = ()=>{
        addToList(elInput.value);
        clCreateForm.reset();
    };
    // clear input icon functionality
    elInputClear.onclick = ()=>clCreateForm.reset();
    // automated clear icon appearance
    elInput.addEventListener('keyup', ()=>{
        if(elInput.value=='') {
            elInputClear.style.display = 'none';
        } else {
            elInputClear.style.display = 'flex';
        }
    });

    //# Menu
    // toggle the menu
    function toggleMenu() {
        elMenu.classList.toggle('menu');
        if(elMenu.classList.contains('menu')) {
            document.getElementsByTagName('main')[0].style.opacity = '0.6';
        } else {
            document.getElementsByTagName('main')[0].style.opacity = '1';
        }
    }
    // close close menu
    function toggleMenuCloser(closeFunction) {
        elMenu.classList.toggle('close');
        if(elMenu.classList.contains('close')) {
            setTimeout(()=>{
                elMenu.onclick = ()=>{
                    closeFunction();
                    setStandardMenu();
                };
            }, 1);
        } else {
            setStandardMenu();
        }
    }
    function setStandardMenu() {
        elMenu.classList.value = '';
        elMenu.onclick = ()=>{
            toggleMenu();
        };
    }
    setStandardMenu();
    // Download Button Function
    elMenuExport.onclick = ()=>{
        var tStart = parseInt(performance.now());
        const tasksArray = tasksToArray();
        const blob = new Blob([JSON.stringify(tasksArray)], {type: 'octetstream'});
        const href = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), {
            href,
            style:'display:none',
            download:'Todo\'s ('+getToday()+').json'
        });
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(href);
        a.remove();
        var tEnd = parseInt(performance.now());
        tTime = tEnd - tStart;
        console.log("Download complected in " + tTime + " milliseconds.");
    }
    // Open Import Screen
    elMenuImport.onclick = ()=>{
        toggleTaskImport();
    }
    // Clear Menu
    elMenuClear.onclick = ()=>{
        elList.innerText = '';
        cookieSaveTasks();
    }

    //# Task Import
    // toggleTaskImport
    function toggleTaskImport() {
        // get actual fileImport
        var fileImport = document.getElementById('fileImport');
        // if fileImport exists in document
        if(fileImport) {
            // close task import
            closeTaskImport();
        } else {
            // open task import
            openTaskImport();
        }
    }
    // openTaskImport : creates the element
    function openTaskImport() {
        // toggle input close
        toggleMenuCloser(()=>{closeTaskImport()});
        // create newInput
        const newInput = Object.assign(document.createElement('input'), {
            id:'fileImport',
            type:'file',
            accept: "application/JSON"
        });
        // append new input
        document.body.appendChild(newInput);
        // add ondrag animation
        addOnDragAnimation(newInput);
        // on input
        newInput.onchange = ()=>{
            // get file
            const file = newInput.files[0];
            // get file reader
            let reader = new FileReader();
            // read file
            reader.readAsText(file);
            // read file function
            reader.onload = (e) => {
                newInput.remove();
                const file = e.target.result;
                const fileJSON = JSON.parse(file);
                fillListWithArray(fileJSON);
            };
            // read file error
            reader.onerror = (e) => alert(e.target.error.name);
            // close item
            toggleMenuCloser();
        }
    }
    // closeTaskImport
    function closeTaskImport() {
        // get actual fileImport
        var fileImport = document.getElementById('fileImport');
        // if fileImport exists in document
        if(fileImport) {
            // remove it
            document.body.removeChild(fileImport);
        }
    }

    //# Page Functions
    // Add task to live tasks from a String
    function addToList(taskText) {
        if(taskText=="") {
            return;
        }
        // create element
        var newVal = taskText;
        var newEl = document.createElement('li');
        newEl.textContent = newVal;
        elList.insertBefore(newEl, elList.firstChild);
        // create animation
        newEl.style.transition = '0.2s ease-in-out';
        newEl.style.opacity = 0;
        newEl.style.setProperty('--thisTransX', '10px');
        setTimeout(()=>{
            newEl.style.setProperty('--thisTransX', '0px');
            newEl.style.opacity = 1;
        }, 100);
        // focus create input again
        elInput.focus();
        // set delete element function
        newEl.addEventListener('click', ()=>{
            // delete animation
            newEl.style.transition = '0.2s ease-in-out';
            newEl.style.setProperty('--thisRotate', '5deg');
            setTimeout(()=>{
                newEl.style.setProperty('--thisRotate', '-5deg');
                setTimeout(()=>{
                    newEl.style.setProperty('--thisRotate', '0deg');
                    // delete element
                    elList.removeChild(newEl);
                    cookieSaveTasks();
                }, 100);
            }, 100);
        })
        cookieSaveTasks();
    }
    // Fill live tasks with array
    function fillListWithArray(json) {
        json.forEach(elText => {
                    if(isInList(elText)) {
                            console.warn("%cAn item was already in list", "font-weight:bold;", elText);
                    } else {
                            addToList(elText);
                    }
        });
    }
    // Convert live tasks to array and return
    function tasksToArray() {
            var tasksArray = [];
            const tasks = Array.from(elList.getElementsByTagName('li'));
            tasks.forEach(task => {
                        tasksArray.push(task.innerText);
            });
            return tasksArray;
    }
    // Test if task is in list (Return Bool)
    function isInList(text) {
            const tasks = Array.from(elList.getElementsByTagName('li'));
            for (let i = 0; i < tasks.length; i++) {
                        if(tasks[i].innerText == text) {
                                return true;
                        }
            }
            return false;
    }
    // cookieSaveTasks : easy function to directly save current tasks to cookies
    function cookieSaveTasks() {
        setCookie(cookieNameTasks, tasksToArray().toString(), 30);
    }

    //# General Function
    // addOnDragAnimation : adds beautiful self made on drag animation on input element. especially for input fields
    function addOnDragAnimation(element) {
        element.ondragenter = (e)=>{
            element.style.setProperty('--beforeTop', e.offsetY+'px');
            element.style.setProperty('--beforeLeft', e.offsetX+'px');
            element.style.setProperty('--beforeHeight', '0%');
            element.style.setProperty('--beforeOpacity', 1);
            setTimeout(()=>{
                element.style.setProperty('--beforeTransition', '0.8s ease-in-out');
                element.style.setProperty('--beforeOpacity', '1');
                element.style.setProperty('--beforeHeight', '300%');
            },1);
        }
        element.ondragleave = ()=>{
            setTimeout(()=>{
                element.style.setProperty('--beforeTransition', '0.4s ease-in-out');
                element.style.setProperty('--beforeOpacity', 0);
                setTimeout(()=>{
                    element.style.setProperty('--beforeTransition', 'none');
                },400);
            },1);
        }
    }
    // getToday : returns String of todays date (format: 2022.04.06)
    function getToday() {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        if(month<10) {month = '0'+month};
        var date = today.getDate();
        if(date<10) {date = '0'+date};
        return year+'.'+month+'.'+date;
    }
    // setCookie : set a cookie
    function setCookie(cookieName, cookieValue, expirationDay) {
        let date = new Date();
        date.setTime(date.getTime() + (expirationDay * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires + "; path=/";
    }
    // getCookie : get cookie value
    function getCookie(cookieName) {
            const name = cookieName + "=";
            const cDecoded = decodeURIComponent(document.cookie); //to be careful
            const cArr = cDecoded .split('; ');
            let res;
            cArr.forEach(val => {
                if (val.indexOf(name) === 0) res = val.substring(name.length);
            })
            return res;
    }
});