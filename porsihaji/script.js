function copy_url(form) {
  var ph_url = window.location.protocol +'//'+ window.location.hostname + window.location.pathname;
  window.location.href = ph_url +'#!/porsi/'+ form.querySelector('.ph-porsi').value;
  document.querySelector('.ph-copy .ph-link').value = window.location.href;
  document.querySelector('.ph-copy').classList.remove('no_items');
}

function update_porsi() {
  document.querySelector('.form-porsi .ph-porsi').value = window.location.hash.replace(/#!\/porsi\//, '');
  // document.querySelector('.form-porsi').submit();
  copy_url(document.querySelector('.form-porsi'));
}

document.querySelector('.form-porsi').addEventListener('submit', function() {
  if (this.classList.contains('selected')) return false;
  this.classList.add('selected');
  // document.querySelector('.post-content').classList.add('loading', 'loge');
  copy_url(this);
});

document.querySelector('.form-porsi .ph-porsi').addEventListener('keyup', function() {
  document.querySelector('.form-porsi').classList.remove('selected');
  document.querySelector('.ph-copy').classList.add('no_items');
});

if (window.location.hash.search(/#!\/porsi\/\d+/) != -1) update_porsi();
window.addEventListener('hashchange', function() {
  if (window.location.hash.search(/#!\/porsi\/\d+/) == -1) return;
  update_porsi();
});

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
