import React from 'react';
import {useI18n} from 'remix-i18n';

export default function Text() {
  const {t} = useI18n();
  return <div>{t('nav.source')}</div>;
}
