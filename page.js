// wait for page to load
window.addEventListener('load', ()=>{
          // sections
          const secCreate = document.getElementById('create');
          const secList = document.getElementById('list');
          // elements
          /// > menu
          const elMenu = document.getElementById('menu');
          const elMenuExport = elMenu.querySelector('.export');
          const elMenuImport = elMenu.querySelector('.import');
          const elMenuClear = elMenu.querySelector('.clear');
          const elMenuFeedback = elMenu.querySelector('.feedback');
          /// > form
          const elInput = secCreate.querySelector('[type=text]');
          const elInputClear = secCreate.querySelector('svg');
          const elSubmit= secCreate.querySelector('[type=submit]');
          /// > list
          const elList= secList.querySelector('ul');

          // Get cookie tasks
          if(getCookie('json')) {
                    var taskJSON = getCookie('json')?.split(',').reverse();
          } else {
                    var taskJSON = [];
          }

          // Fill with cookie tasks
          if(taskJSON[0]!="") {
                    fillListWithArray(taskJSON);
          }

          // Clear Input Field Button functionality
          elInputClear.onclick = ()=>{
                    elInput.value = '';
                    elInputClear.style.display = 'none';
                    elInput.focus();
          };
          // Add input interaction (toggle clear button)
          elInput.addEventListener('keyup', ()=>{
                    if(elInput.value=='') {
                              elInputClear.style.display = 'none';
                    } else {
                              elInputClear.style.display = 'flex';
                    }
          });

          // Toggle Menu
            function toggleMenu() {
                elMenu.classList.toggle('open');
                if(elMenu.classList.contains('open')) {
                    document.getElementsByTagName('main')[0].style.opacity = '0.6';
                } else {
                    document.getElementsByTagName('main')[0].style.opacity = '1';
                }
            }
          elMenu.onclick = ()=>{
            toggleMenu();
          };
          // Download Button Function
          elMenuExport.onclick = ()=>{
                    var tStart = performance.now();
                    const tasksArray = tasksToArray();
                    const blob = new Blob([JSON.stringify(tasksArray)], {type: 'octetstream'});
                    const href = URL.createObjectURL(blob);
                    const a = Object.assign(document.createElement('a'), {
                              href,
                              style:'display:none',
                              download:'todo.json'
                    });
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(href);
                    a.remove();
                    var tEnd = performance.now();
                    console.log("Download complected in " + (tStart - tEnd) + " milliseconds.");
          }
          // Open Import Screen
          elMenuImport.onclick = ()=>{
                    const i = Object.assign(document.createElement('input'), {
                              id:'fileImport',
                              type:'file',
                              accept: "application/JSON"
                    })
                    document.body.appendChild(i);
                    i.onchange = ()=>{
                              const file = i.files[0];
                              let reader = new FileReader();
                              reader.onload = (e) => {
                                        i.remove();
                                        const file = e.target.result;
                                        const fileJSON = JSON.parse(file);
                                        fillListWithArray(fileJSON);
                              };
                              reader.onerror = (e) => alert(e.target.error.name);
                              reader.readAsText(file);
                    }
          }
          // Clear Menu
          elMenuClear.onclick = ()=>{
                    elList.innerText = '';
          }
          // Add button functionality
          elSubmit.addEventListener('click', ()=>{
                    addToList(elInput.value);
          });
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

          // Set Cookie
          function setCookie(cName, cValue, expDays) {
                    let date = new Date();
                    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
                    const expires = "expires=" + date.toUTCString();
                    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
          }
          // Get Cookie
          function getCookie(cName) {
                    const name = cName + "=";
                    const cDecoded = decodeURIComponent(document.cookie); //to be careful
                    const cArr = cDecoded .split('; ');
                    let res;
                    cArr.forEach(val => {
                        if (val.indexOf(name) === 0) res = val.substring(name.length);
                    })
                    return res;
          }
          // Function that saves live tasks to Array
          function cookieSaveTasks() {
                    setCookie('json', tasksToArray().toString(), 30);
          }
});