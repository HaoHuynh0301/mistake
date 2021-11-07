import { printLine } from './modules/print';
import { isToday, isPast } from './../../helper';

printLine('Content Script loaded');

const timeValue = setInterval(function () {
  var nodeList = document.querySelectorAll('[data-cy="submit-wrong-result"]');
  if (nodeList.length > 0) {
    var button = document.createElement('button');
    button.innerHTML = 'Re-do in 3 days';
    button.id = 'redoButton';
    button.type = 'button';
    nodeList[0].appendChild(button);
    clearInterval(timeValue);

    var theButton = document.getElementById('redoButton');

    let reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 3); // TODO: add a dropdown after redo button, to set the reminder date
    const redo = {
      uri: window.location.href.toString(),
      record: new Date().toLocaleString(),
      reminderDate: reminderDate.toLocaleString(),
    };

    theButton.addEventListener('click', function () {
      chrome.storage.sync.get('data', function (items) {
        printLine('items');
        console.log(items);
        let redos;
        if (Object.keys(items).length === 0) {
          printLine('items is empty');
          redos = [];
        } else {
          redos = items.data;
          for (let i = 0; i < redos.length; i++) {
            console.log(redos[i].uri === redo.uri);
            if (redos[i].uri === redo.uri) {
              alert('You already marked this question');
              return;
            }
          }
        }
        redo.id = redos.length + 1;
        redos.push(redo);
        redos.sort(function (a, b) {
          return new Date(a.reminderDate) - new Date(b.reminderDate);
        });
        chrome.storage.sync.set({ data: redos });
        theButton.style.display = 'none';
      });
    });
  }
}, 3000);
