// wait for page to load
window.addEventListener('load', ()=>{
          // sections
          const secCreate = document.getElementById('create');
          const secList = document.getElementById('list');
          // elements
          const elInput = secCreate.querySelector('[type=text]');
          const elSubmit= secCreate.querySelector('[type=submit]');
          const elList= secList.querySelector('ul');
          // add button click
          elSubmit.addEventListener('click', ()=>{
                    var newVal = elInput.value;
                    var newEl = document.createElement('li');
                    newEl.textContent = newVal;
                    elList.insertBefore(newEl, elList.firstChild);
                    newEl.addEventListener('click', ()=>{
                              elList.removeChild(newEl);
                    })
          });
});