// wait for page to load
window.addEventListener('load', ()=>{
          // sections
          const secCreate = document.getElementById('create');
          const secList = document.getElementById('list');
          // elements
          /// menu
          const elMenu = document.getElementById('menu');
          const elMenuExport = elMenu.querySelector('.export');
          const elMenuImport = elMenu.querySelector('.import');
          const elMenuFeedback = elMenu.querySelector('.feedback');
          /// form
          const elInput = secCreate.querySelector('[type=text]');
          const elInputClear = secCreate.querySelector('svg');
          const elSubmit= secCreate.querySelector('[type=submit]');
          /// list
          const elList= secList.querySelector('ul');
          // clear input field function
          elInputClear.onclick = ()=>{
                    elInput.value = '';
                    elInputClear.style.display = 'none';
                    elInput.focus();
          };
          // menu toggler
          elMenu.onclick = ()=>{
                    elMenu.classList.toggle('open');
                    if(elMenu.classList.contains('open')) {
                              document.getElementsByTagName('main')[0].style.filter = 'blur(2px)';
                    } else {
                              document.getElementsByTagName('main')[0].style.filter = 'blur(0px)';
                    }
          };
          // menu download
          elMenuExport.onclick = ()=>{
                    var tStart = performance.now();
                    const tasks = Array.from(elList.getElementsByTagName('li'));
                    const tasksArray = [];
                    tasks.forEach(task => {
                              tasksArray.push(task.innerText);
                    });
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
                                        fileJSON.forEach(elText => {
                                                  if(isInList(elText)) {
                                                            console.warn("%cAn item was already in list", "font-weight:bold;", elText);
                                                  } else {
                                                            addToList(elText);
                                                  }
                                        });
                              };
                              reader.onerror = (e) => alert(e.target.error.name);
                              reader.readAsText(file);
                    }
          }
          // add input interaction
          elInput.addEventListener('keyup', ()=>{
                    if(elInput.value=='') {
                              elInputClear.style.display = 'none';
                    } else {
                              elInputClear.style.display = 'flex';
                    }
          })
          // add button click
          elSubmit.addEventListener('click', ()=>{
                    addToList(elInput.value);
          });

          function addToList(taskText) {
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
                                        }, 100);
                              }, 100);
                    })
          }

          function isInList(text) {
                    const tasks = Array.from(elList.getElementsByTagName('li'));
                    for (let i = 0; i < tasks.length; i++) {
                              if(tasks[i].innerText == text) {
                                        return true;
                              }
                    }
                    return false;
          }
});
