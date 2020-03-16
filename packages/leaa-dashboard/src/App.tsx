import React, { useState } from 'react';
import { Spin, ConfigProvider } from 'antd';
import { ApolloProvider } from '@apollo/react-hooks';
import { Router, Switch } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { LoadingOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';

import { apolloClient, history } from '@leaa/dashboard/src/libs';
// cannot use deconstruction components dir in here (App.tsx)
import { ErrorBoundary } from '@leaa/dashboard/src/components/ErrorBoundary/ErrorBoundary';
import { RefreshflatPermissions } from '@leaa/dashboard/src/components/RefreshflatPermissions/RefreshflatPermissions';
import { RefreshSetting } from '@leaa/dashboard/src/components/RefreshSetting/RefreshSetting';

import { masterRoute, authRoute, otherRoute, testWithoutLayoutRoute } from '@leaa/dashboard/src/routes';
import { initStore, StoreProvider } from '@leaa/dashboard/src/stores';
import i18n from '@leaa/dashboard/src/i18n';
import { ProvideAuth } from '@leaa/dashboard/src/libs/use-auth';

const store = initStore();

Spin.setDefaultIndicator(<LoadingOutlined spin style={{ fontSize: '180%', marginTop: 30 }} />);

export const App = (): JSX.Element => {
  const getLocale = () => (i18n.language === 'zh-CN' ? zhCN : enUS);
  const [locale, setLocale] = useState(getLocale());

  i18n.on('languageChanged', () => {
    setLocale(getLocale());
  });

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ConfigProvider locale={locale}>
          <ApolloProvider client={apolloClient}>
            <StoreProvider value={store}>
              <I18nextProvider i18n={i18n}>
                <ProvideAuth>
                  {/* TODO: add back  <RefreshSetting> */}
                  <RefreshflatPermissions history={history}>
                    <Router history={history}>
                      <Switch>
                        {authRoute}
                        {masterRoute}
                        {testWithoutLayoutRoute}
                        {otherRoute}
                      </Switch>
                    </Router>
                  </RefreshflatPermissions>
                  {/* </RefreshSetting> */}
                </ProvideAuth>
              </I18nextProvider>
            </StoreProvider>
          </ApolloProvider>
        </ConfigProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};
