(function(){
  var host = window.location.hostname;
  if(host !== 'prompt.crayonai.eu.org' && !host.endsWith('.vercel.app')) return;
  window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
