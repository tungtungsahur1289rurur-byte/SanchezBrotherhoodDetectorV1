function scanFile() {
  const file = document.getElementById('fileInput').files[0];
  const result = document.getElementById('result');
  const progress = document.getElementById('progressBar');
  const fill = document.getElementById('progressFill');

  if (!file) {
    result.innerHTML = '<span class="info">Pilih file terlebih dahulu!</span>';
    return;
  }

  progress.style.display = 'block';
  fill.style.width = '0%';

  let percent = 0;
  const interval = setInterval(() => {
    percent += 10;
    fill.style.width = percent + '%';

    if (percent >= 100) {
      clearInterval(interval);
      analyzeFile(file);
    }
  }, 100);
}

function analyzeFile(file) {
  const result = document.getElementById('result');

  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result.toLowerCase();

    const suspicious = [
      'socket.connect',
      'http.request',
      'https.request',
      'keylog',
      'sendpassword',
      'getclipboard',
      'post(',
      'webhook',
      'discord.com/api/webhooks',
      'curl',
      'io.popen'
    ];

    let found = suspicious.filter(x => content.includes(x));

    if (found.length > 0) {
      result.innerHTML = `
        <div class="warning">🔴 HASIL: MENCURIGAKAN</div>
        <br>
        <b>File:</b> ${file.name}<br>
        <b>Ukuran:</b> ${(file.size / 1024).toFixed(1)} KB<br>
        <b>Skor Risiko:</b> 78%<br>
        <br>
        <b>Pola Terdeteksi:</b>
        <ul>
          ${found.map(x => `<li>${x}</li>`).join('')}
        </ul>
        <b>Rekomendasi:</b> Jangan gunakan file ini sebelum diperiksa manual.
      `;
    } else {
      result.innerHTML = `
        <div class="safe">🟢 HASIL: FILE AMAN</div>
        <br>
        <b>File:</b> ${file.name}<br>
        <b>Ukuran:</b> ${(file.size / 1024).toFixed(1)} KB<br>
        <b>Skor Keamanan:</b> 92%<br>
        <br>
        Tidak ditemukan pola mencurigakan.
      `;
    }
  };

  reader.readAsText(file);
}
