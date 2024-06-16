document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('fileInput');
  const fileButton = document.getElementById('fileButton');
  const fileContentTitle = document.getElementById('fileContentTitle');
  const fileContent = document.getElementById('fileContent');
  const result = document.getElementById('result');

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('hover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('hover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    const files = e.dataTransfer.files;
    handleFile(files[0]);
  });

  fileButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFile(files[0]);
  });

  function handleFile(file) {
    if (!file) {
      return;
    }
    if (file.type !== 'text/plain' || !file.name.endsWith('.txt')) {
      result.textContent = 'Lỗi: Chỉ chấp nhận tệp .txt!';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      fileContentTitle.textContent = 'Nội dung file txt là:';
      fileContent.textContent = text;
      analyzeFile(text);
    };
    reader.readAsText(file);
  }

  function analyzeFile(text) {
    try {
      const worker = new Worker('worker.js');
      worker.postMessage(text);
      worker.onmessage = (e) => {
        const data = e.data;
        if (data.error) {
          result.textContent = `Lỗi: ${data.error}`;
        } else {
          let resultHtml = `
            <p>Tổng số từ khác nhau: ${data.totalWords}</p>
            <p>3 từ lặp lại nhiều nhất:</p>
            <ul>
              ${data.topWords
                .map((word) => `<li>${word.word}: ${word.count} lần</li>`)
                .join('')}
            </ul>
          `;
          if (data.specialCharCounts) {
            resultHtml += `
              <p>Tổng số ký tự đặc biệt: ${data.totalSpecialChars}</p>
              <ul>
                <li>Dấu chấm (.): ${data.specialCharCounts['.']} lần</li>
                <li>Dấu phẩy (,): ${data.specialCharCounts[',']} lần</li>
                <li>Khoảng trắng ( ): ${data.specialCharCounts[' ']} lần</li>
              </ul>
            `;
          }
          result.innerHTML = resultHtml;
        }
      };
    } catch (error) {
      result.textContent = `Lỗi: ${error.message}`;
    }
  }
});
