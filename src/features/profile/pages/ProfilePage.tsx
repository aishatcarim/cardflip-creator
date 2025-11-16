import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRShowcasePage } from './QRShowcasePage';
import { CardsPage } from './CardsPage';
import { AppHeader, Dock, MobileTabBar } from '@shared/components';
import { useIsMobile } from '@shared/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { QrCode, Users, Calendar, BarChart3 } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('present');
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [dockVisible, setDockVisible] = useState(true);

  const dockItems = [
    {
      icon: <QrCode size={20} />,
      label: 'Profile',
      path: '/',
      onClick: () => navigate('/'),
      className: 'bg-accent/30'
    },
    {
      icon: <Users size={20} />,
      label: 'Contacts',
      path: '/contacts',
      onClick: () => navigate('/contacts')
    },
    {
      icon: <Calendar size={20} />,
      label: 'Events',
      path: '/events',
      onClick: () => navigate('/events')
    },
    {
      icon: <BarChart3 size={20} />,
      label: 'Analytics',
      path: '/analytics',
      onClick: () => navigate('/analytics')
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader
        showCardsTabs={true}
        currentTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsContent value="present" className="flex-1 m-0 overflow-hidden data-[state=active]:h-full">
            <QRShowcasePage />
          </TabsContent>
          <TabsContent value="edit" className="flex-1 m-0 overflow-hidden data-[state=active]:h-full">
            <CardsPage />
          </TabsContent>
        </Tabs>
      </main>

      {/* Adaptive Navigation */}
      {dockVisible && (
        isMobile ? (
          <MobileTabBar items={dockItems} />
        ) : (
          <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-50">
            <div className="pointer-events-auto">
              <Dock
                items={dockItems}
                activeItem={location.pathname}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />
            </div>
          </div>
        )
      )}

      {/* Dock Visibility Toggle */}
      {!isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setDockVisible(!dockVisible)}
            className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent/20 transition-colors"
          >
            {dockVisible ? '👁️' : '🙈'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
