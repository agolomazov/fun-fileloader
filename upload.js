import { element, bytesToSize, noop } from './utils';

export function upload(selector, options = {}) {
  let files = [];
  const onUpload = options.onUpload ?? noop;

  // Получение инпута с файлом
  const input = document.querySelector(selector);
  input.classList.add('hidden');

  const preview = element('div', ['preview']);
  const openButton = element('button', ['btn'], 'Открыть');
  const uploadButton = element('button', ['btn', 'primary'], 'Загрузить');

  uploadButton.style.display = 'none';


  // Если необходимо загружать несколько файлов
  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  // Указывает разрешенные типы файлов
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','));
  }

  // Обработчик клика по кнопке "Открыть"
  const triggerInput = () => input.click();

  // Обработчик выбора файла для загрузки файлов
  const changeHandler = (event) => {
    if (!event.target.files.length) {
      return;
    }

    uploadButton.style.display = 'inline';
    files = Array.from(event.target.files);

    preview.innerHTML = '';
    files.forEach(file => {
      if (!(file.type.match(/image/ig))) {
        return;
      }

      const reader = new FileReader();

      reader.onload = ev => {
        const previewFile = createPreviewImage(ev.target.result, file);
        preview.appendChild(previewFile);
      }

      reader.readAsDataURL(file);
    });
  };

  const clearPreview = el => {
    el.style.bottom = '4px';
    el.innerHTML = `<div class="preview-info-progress"></div>`
  };

  // Обработчик загрузки файлов
  const uploadHandler = () => {
    preview.querySelectorAll('.preview-remove').forEach(el => el.remove());
    const previewInfo = preview.querySelectorAll('.preview-info');

    previewInfo.forEach(clearPreview);
    onUpload(files);
  }

  preview.addEventListener('click', (event) => {
    // Если мы кликнули не по конпке удаления
    if (!event.target.classList.contains('preview-remove')) {
      return;
    }

    const name = event.target.dataset.name;
    files = files.filter((file) => file.name !== name);

    // Если файлов для загрузки не осталось
    if (!files.length) {
      uploadButton.style.display = 'none';
    }

    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image');
    block.classList.add('removing');
    setTimeout(() => {
      block.remove();
    }, 300);
  });


  openButton.addEventListener('click', triggerInput);
  uploadButton.addEventListener('click', uploadHandler);
  input.addEventListener('change', changeHandler);

  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', uploadButton);
  input.insertAdjacentElement('afterend', openButton);
}

/**
 * Создание карточки превью файла
 * @param {*} reader 
 * @param {*} file 
 */
function createPreviewImage(reader, file) {
  // Создание основной обертки карточки картинки
  const previewImage = element('div', ['preview-image']);

  // Создание блока для удаления картинки
  const previewRemove = element('div', ['preview-remove']);
  previewRemove.innerHTML = '&times;';
  previewRemove.dataset.name = file.name;

  const previewInfo = element('div', ['preview-info']);
  previewInfo.innerHTML = `<span>${file.name}</span> ${bytesToSize(file.size)}`;

  // Создание картинки
  const img = element('img');
  img.alt = "";
  img.src = reader;

  previewImage.append(img, previewRemove, previewInfo);
  return previewImage;
}