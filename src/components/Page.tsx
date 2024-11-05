'use client';

import { backButton } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   * @default true
   */
  back?: boolean
}>) {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, доступен ли backButton, и отображаем или скрываем его
    if (backButton) {
      if (back) {
        backButton.show();
      } else {
        backButton.hide();
      }
    }
  }, [back]);

  useEffect(() => {
    // Подписываемся на событие onClick и очищаем подписку при размонтировании
    const handleBackButtonClick = () => {
      router.back();
    };

    if (backButton) {
      backButton.onClick(handleBackButtonClick);
    }

    // Возвращаем функцию очистки
    return () => {
      if (backButton) {
        backButton.offClick(handleBackButtonClick);
      }
    };
  }, [router]);

  return <>{children}</>;
}
