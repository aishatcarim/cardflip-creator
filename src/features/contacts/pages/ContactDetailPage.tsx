import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { AppHeader } from '@shared/components';
import { Button } from '@shared/ui/button';
import { AICopilotChat } from '../components/AI/AICopilotChat';
import { ContactProfile } from '../components/ContactDetail/ContactProfile';
import { ContactActivity } from '../components/ContactDetail/ContactActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { ArrowLeft, Edit, Download, Linkedin, Mail } from 'lucide-react';

const ContactDetailPage = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { contacts, deleteContact, exportContactVCard } = useNetworkContactsStore();

  const contact = contacts.find(c => c.id === contactId);
  const [activeTab, setActiveTab] = useState('copilot');

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Contact Not Found</h1>
          <p className="text-muted-foreground">This contact doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/contacts')}>Back to Contacts</Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contact.id);
      navigate('/contacts');
    }
  };

  const handleExport = () => {
    exportContactVCard(contact.id);
  };

  const handleEmail = () => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const handleLinkedIn = () => {
    // LinkedIn functionality not available for this contact type
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 container mx-auto px-4 py-6 pb-24 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/contacts')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Contacts
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{contact.contactName}</h1>
              <p className="text-muted-foreground mt-1">
                {contact.company} • {contact.industry}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {contact.email && (
              <Button variant="outline" size="sm" onClick={handleEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(`/contacts/${contact.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Contact Info (30%) */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            <ContactProfile contact={contact} />
            <ContactActivity contact={contact} />
          </div>

          {/* Right: AI Copilot (70%) */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList>
                <TabsTrigger value="copilot">
                  🤖 AI Copilot
                </TabsTrigger>
                <TabsTrigger value="history">
                  📜 History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="copilot" className="h-full mt-4">
                <AICopilotChat contact={contact} />
              </TabsContent>

              <TabsContent value="history" className="h-full mt-4">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      📜
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Interaction History</h3>
                    <p>Coming soon - Track all your interactions with {contact.contactName}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailPage;
