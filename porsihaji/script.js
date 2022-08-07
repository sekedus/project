function gen_url(data) {
  var ph_url = window.location.protocol +'//'+ window.location.hostname + window.location.pathname;
  return ph_url +'#!/porsi/'+ data;
}

function copy_url(form) {
  window.location.href = gen_url(form.querySelector('.ph-porsi').value);
  document.querySelector('.ph-copy .ph-link').value = window.location.href;
  document.querySelector('.ph-copy').classList.remove('no_items');
}

function update_porsi() {
  document.querySelector('.form-porsi .ph-porsi').value = window.location.hash.replace(/#!\/porsi\//, '');
  // document.querySelector('.form-porsi').submit();
  copy_url(document.querySelector('.form-porsi'));
}

function local_history(operation, data) {
  var local_data = [];
  var local_get = localStorage.getItem('porsi_history');
  if (local_get) local_data = JSON.parse(local_get);
  if (operation == 'get') return local_data;
  if (operation == 'set' && local_data.indexOf(data) == -1) local_data.push(data);
  if (operation == 'remove') {
    var ph_index = local_data.indexOf(data);
    if (ph_index != -1) local_data.splice(ph_index, 1);
  }
  localStorage.setItem('porsi_history', JSON.stringify(local_data));
}

document.querySelector('.form-porsi').addEventListener('submit', function() {
  if (this.classList.contains('selected')) return false;
  this.classList.add('selected');
  this.querySelector('.ph-submit').classList.remove('pulse');
  // document.querySelector('.post-content').classList.add('loading', 'loge');
  local_history('set', this.querySelector('.ph-porsi').value);
  copy_url(this);
});

document.querySelector('.form-porsi .ph-porsi').addEventListener('keyup', function() {
  document.querySelector('.form-porsi').classList.remove('selected');
  document.querySelector('.ph-copy').classList.add('no_items');
});

if (window.location.hash.search(/#!\/porsi\/\d+/) != -1) update_porsi();
window.addEventListener('hashchange', function() {
  if (window.location.hash.search(/#!\/porsi\/\d+/) == -1) return;
  document.querySelector('.form-porsi').classList.remove('selected');
  update_porsi();
});

var porsi_lists = local_history('get');
if (porsi_lists.length > 0) {
  var porsi_str = '';
  porsi_str += '';
  for (var i = 0; i < porsi_lists.length; i++) {
    porsi_str += '<div class="ph-list btn bgrey">';
    porsi_str += '<span class="ph-text">'+ porsi_lists[i] +'</span>';
    porsi_str += '<span class="ph-close" title="Hapus">x</span>';
    porsi_str += '</div>';
  }
  porsi_str += '';
  document.querySelector('.form-porsi .ph-history').innerHTML = porsi_str;
  document.querySelector('.form-porsi .ph-history').classList.remove('no_items');
  
  document.querySelectorAll('.ph-history .ph-list').forEach(function(item) {
    item.querySelector('.ph-text').addEventListener('click', function() {
      window.location.href = gen_url(this.textContent);
      document.querySelector('.form-porsi .ph-submit').classList.add('pulse');
    });
    item.querySelector('.ph-close').addEventListener('click', function() {
      item.parentElement.removeChild(item);
      local_history('remove', item.querySelector('.ph-text').textContent);
      if (local_history('get').length == 0) document.querySelector('.form-porsi .ph-history').classList.add('no_items');
    });
  });
}

var clipboard = new ClipboardJS('.btn-clipboard', {
  target: function(trigger) {
    return trigger.previousElementSibling;
  }
});

clipboard.on('success', function(e) {
  e.trigger.classList.add('green');
  setTimeout(function() { e.trigger.classList.remove('green'); }, 1000);
  e.clearSelection();
});

clipboard.on('error', function(e) {
  e.trigger.classList.add('red');
});
