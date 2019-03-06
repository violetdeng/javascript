let page = document.getElementById('settingsDiv');
chrome.storage.sync.get('settings', function (data) {
  if (!data.settings || !data.settings.length) {
    bindEvents(addTemplate())
    return
  }
  for (let item of data.settings) {
    let container = addTemplate()
    let inputs = container.getElementsByTagName('input')
    for (let input of inputs) {
      if (item[input.getAttribute('name')]) input.value = item[input.getAttribute('name')]
    }
    bindEvents(container)
  }
});

document.getElementById('addButton').addEventListener('click', function () {
  bindEvents(addTemplate())
})

function addTemplate () {
  let wrapper = document.createElement('div');
  wrapper.innerHTML = '<div class="fields">' + document.getElementById('addTemplate').innerHTML + '</div>';
  return page.appendChild(wrapper.firstChild)
}

function bindEvents (container) {
  container.querySelectorAll('.delete-button')[0].addEventListener('click', function () {
    container.remove()
  });
}

document.getElementById('saveButton').addEventListener('click', function () {
  let settings = [];
  for (let line of page.children) {
    let option = {};
    for (let inputWrapper of line.children) {
      if (inputWrapper.className !== 'field') continue;
      let input = inputWrapper.children[0];
      option[input.getAttribute('name')] = input.value
    }

    let inserted = true;
    for (let item in option) {
      if (!option[item] && item !== 'prev') inserted = false;
    }

    if (inserted) settings.push(option)
  }

  chrome.storage.sync.set({
    settings: settings
  })
})
