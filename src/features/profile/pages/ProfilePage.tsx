import { useState } from 'react';
import { QRShowcasePage } from './QRShowcasePage';
import { CardsPage } from './CardsPage';
import { AppHeader } from '@shared/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('present');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader
        showCardsTabs={true}
        currentTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsContent value="present" className="flex-1 m-0 overflow-hidden">
            <div className="h-full">
              <QRShowcasePage />
            </div>
          </TabsContent>
          <TabsContent value="edit" className="flex-1 m-0 overflow-hidden">
            <div className="h-full">
              <CardsPage />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;
