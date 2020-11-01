import images from './data/gallery-items.js';

const refs = {
  galleryList: document.querySelector('.js-gallery'),
  lightboxContainer: document.querySelector('div.lightbox'),
  lightboxImageEl: document.querySelector('img.lightbox__image'),
  closeLightboxBtn: document.querySelector(
    'button[data-action="close-lightbox"]',
  ),
  lightboxOverlay: document.querySelector('div.lightbox__overlay'),
};

const imagesMarkup = createGalleryItemsMarkup(images);

refs.galleryList.insertAdjacentHTML('beforeend', imagesMarkup);

refs.galleryList.addEventListener('click', onGalleryListClick);

refs.closeLightboxBtn.addEventListener('click', onCloseLightboxBtnClick);

refs.lightboxOverlay.addEventListener('click', onOverlayClick);

function createGalleryItemsMarkup(images) {
  return images
    .map(({ preview, original, description }) => {
      return `
    <li class="gallery__item">
      <a
        class="gallery__link"
        href="${original}"
      >
        <img
          class="gallery__image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li>
    `;
    })
    .join('');
}

function onGalleryListClick(e) {
  e.preventDefault();

  const isGalleryImageEl = e.target.classList.contains('gallery__image');

  if (!isGalleryImageEl) {
    return;
  }

  openLightbox(e.target.dataset.source);
}

function openLightbox(originalUrlImage) {
  window.addEventListener('keydown', onKeyboardPress);

  refs.lightboxContainer.classList.add('is-open');

  refs.lightboxImageEl.src = originalUrlImage;
}

function onCloseLightboxBtnClick() {
  closeLightbox();
}

function closeLightbox() {
  window.removeEventListener('keydown', onKeyboardPress);

  refs.lightboxContainer.classList.remove('is-open');

  refs.lightboxImageEl.src = '';
}

function onOverlayClick(e) {
  if (e.currentTarget === e.target) {
    closeLightbox();
  }
}

function onKeyboardPress(e) {
  const ESC_KEY_CODE = 'Escape';
  const ARROW_LEFT_KEY_CODE = 'ArrowLeft';
  const ARROW_RIGHT_KEY_CODE = 'ArrowRight';
  const isEscKey = e.code === ESC_KEY_CODE;
  const isArrowLeftKey = e.code === ARROW_LEFT_KEY_CODE;
  const isArrowRightKey = e.code === ARROW_RIGHT_KEY_CODE;

  if (isEscKey) {
    closeLightbox();
  }

  if (isArrowLeftKey) {
    scrollsPreviousImage();
  }

  if (isArrowRightKey) {
    scrollsNextImage();
  }
}

function scrollsNextImage() {
  const urlsOfOriginalImages = images.map(image => image.original);
  const indexOfCurrentUrl = urlsOfOriginalImages.indexOf(
    refs.lightboxImageEl.src,
  );
  const indexOfLastUrl = urlsOfOriginalImages.length - 1;
  const isLastImageInGallery = indexOfCurrentUrl === indexOfLastUrl;

  isLastImageInGallery
    ? (refs.lightboxImageEl.src = urlsOfOriginalImages[0])
    : (refs.lightboxImageEl.src = urlsOfOriginalImages[indexOfCurrentUrl + 1]);
}

function scrollsPreviousImage() {
  const urlsOfOriginalImages = images.map(image => image.original);
  const indexOfCurrentUrl = urlsOfOriginalImages.indexOf(
    refs.lightboxImageEl.src,
  );
  const indexOfLastUrl = urlsOfOriginalImages.length - 1;
  const isFirstImageInGallery = indexOfCurrentUrl === 0;

  isFirstImageInGallery
    ? (refs.lightboxImageEl.src = urlsOfOriginalImages[indexOfLastUrl])
    : (refs.lightboxImageEl.src = urlsOfOriginalImages[indexOfCurrentUrl - 1]);
}
