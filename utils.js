/**
 * Конвертер размера файла из байт в другие единицы
 * @param {number} bytes
 */
export function bytesToSize(bytes, defaultValue = '0 Bytes') {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return defaultValue;
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i === 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

/**
 * Метод создания элемента DOM
 * @param {string} tag - Название тега
 * @param {string[]} classes - Список классов
 * @param {string} content - Содержимое тега 
 */
export function element(tag, classes = [], content) {
  const node = document.createElement(tag);

  if (classes.length) {
    node.classList.add(...classes);
  }

  if (content) {
    node.textContent = content;
  }

  return node;
}

export function noop(files) {}