'use client';
 
import { Link } from '@/components/Link/Link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher/LocaleSwitcher';
import { Page } from '@/components/Page';
 

import React from 'react';
  
 
 
import tonSvg from './_assets/ton.svg';

export default function Home() {
  return (
    <Page back={false}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Добро пожаловать в наше приложение!</h1>
        <Link href="/home">
          <p className="text-blue-500 underline">Перейти на главную страницу</p>
        </Link>
      </div>
    </Page>
  );
}
