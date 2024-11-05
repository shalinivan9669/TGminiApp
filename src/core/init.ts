import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  try {
    // Установка режима отладки
    console.log('Setting debug mode:', debug);
    $debug.set(debug);

    // Инициализация SDK
    console.log('Initializing SDK...');
    initSDK();
    console.log('SDK initialized.');

    // Монтирование backButton, если поддерживается
    if (backButton.isSupported()) {
      console.log('Mounting backButton...');
      backButton.mount();
      console.log('backButton mounted.');
    } else {
      console.log('backButton not supported.');
    }

    // Монтирование miniApp
    console.log('Mounting miniApp...');
    miniApp.mount();
    console.log('miniApp mounted.');

    // Монтирование themeParams
    console.log('Mounting themeParams...');
    themeParams.mount();
    console.log('themeParams mounted.');

    // Восстановление данных
    console.log('Restoring initData...');
    initData.restore();
    console.log('initData restored.');

    // Монтирование viewport с проверкой
    if (!viewport.isMounted) {
      console.log('Mounting viewport...');
      void viewport.mount().catch(e => {
        console.error('Something went wrong mounting the viewport', e);
      });
    } else {
      console.log('Viewport is already mounted.');
    }

    // Привязка CSS-переменных
    console.log('Binding CSS variables...');
    viewport.bindCssVars();
    miniApp.bindCssVars();
    themeParams.bindCssVars();
    console.log('CSS variables bound.');

    // Инициализация Eruda для отладки, если требуется
    if (debug) {
      console.log('Initializing Eruda for debugging...');
      import('eruda')
        .then((lib) => lib.default.init())
        .catch(console.error);
    }
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}
