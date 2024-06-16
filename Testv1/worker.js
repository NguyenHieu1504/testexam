self.onmessage = function (event) {
  const text = event.data;
  const words = text.toLowerCase().match(/\b[a-z]+\b/g); // Tìm các từ trong văn bản

  // Đếm các ký tự đặc biệt
  const specialChars = ['.', ',', ' '];
  const specialCharCounts = {
    '.': 0,
    ',': 0,
    ' ': 0,
  };

  for (let char of text) {
    if (specialChars.includes(char)) {
      specialCharCounts[char]++;
    }
  }

  const totalSpecialChars =
    specialCharCounts['.'] + specialCharCounts[','] + specialCharCounts[' '];

  if (!words || words.length === 0) {
    if (totalSpecialChars > 0) {
      self.postMessage({
        totalWords: 0,
        topWords: [],
        totalSpecialChars,
        specialCharCounts,
      });
    } else {
      self.postMessage({ error: 'Nội dung tệp không hợp lệ hoặc trống.' });
    }
    return;
  }

  const wordCount = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  const uniqueWords = Object.keys(wordCount);
  if (uniqueWords.length < 3) {
    self.postMessage({
      error: 'Tệp chứa ít hơn 3 từ khác nhau.',
      specialCharCounts,
      totalSpecialChars,
    });
    return;
  }

  const sortedWords = uniqueWords
    .map((word) => ({
      word,
      count: wordCount[word],
    }))
    .sort((a, b) => b.count - a.count);

  self.postMessage({
    totalWords: uniqueWords.length,
    topWords: sortedWords.slice(0, 3),
    totalSpecialChars,
    specialCharCounts,
  });
};
